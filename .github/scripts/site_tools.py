#!/usr/bin/env python3
"""AnLAB — công cụ tự động chạy trên GitHub Actions (chỉ dùng thư viện chuẩn).

  python3 -I .github/scripts/site_tools.py sync            sắp xếp bài trong các trang mục: MỚI trên – CŨ dưới
  python3 -I .github/scripts/site_tools.py clean [--dry-run] [--force] [--grace-days N] [--max-delete N]
                                                            xóa file không còn trang nào dùng

Nguồn dữ liệu duy nhất là content.js (danh sách bài/ứng dụng + ngày đăng).
"""
import argparse, fnmatch, html, json, os, re, subprocess, sys, time

ROOT = os.getcwd()
MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


# ----------------------------------------------------------------- dữ liệu
def load_data():
    s = open(os.path.join(ROOT, 'content.js'), encoding='utf-8').read()
    m = re.search(r'window\.ANLAB_DATA\s*=\s*(\{.*\})\s*;?\s*$', s, re.S)
    if not m:
        sys.exit('LỖI: không đọc được content.js')
    return json.loads(m.group(1))


def newest_first(items):
    # sort ổn định: cùng ngày thì giữ thứ tự trong content.js
    return sorted(items, key=lambda i: str(i.get('date', '')), reverse=True)


# ------------------------------------------------------------------- sync
def esc(t):
    return html.escape(t, quote=False).replace('"', '&quot;')


def card(it):
    y, mo, d = it['date'].split('-')
    meta = (esc(it['meta']) + ' · ') if it.get('meta') else ''
    en_date = '%s %d, %s' % (MONTHS[int(mo) - 1], int(d), y)
    h = esc(it['href'])
    return (
        '<article class="sf-card"><a class="sf-img" href="%s" tabindex="-1" aria-hidden="true">'
        '<img src="%s" data-en-src="%s" alt="" loading="lazy" decoding="async"/></a>'
        '<div class="sf-body"><h3><a href="%s" data-en="%s">%s</a></h3>'
        '<p data-en="%s">%s</p><p class="sf-meta">%s<span data-en="%s">%s/%s/%s</span></p></div></article>'
    ) % (h, esc(it['img']), esc(it.get('imgEn', it['img'])), h, esc(it['en']), esc(it['vi']),
         esc(it['sumEn']), esc(it['sumVi']), meta, en_date, d, mo, y)


LIST_RE = re.compile(r'<div class="sf-list">(?:<article class="sf-card">.*?</article>)*</div>', re.S)
H2_END = re.compile(r'<h2[^>]*>([^<]*)</h2>\s*$')


BLOCK_RE = re.compile(r'(<h2[^>]*>([^<]*)</h2>)(<div class="sf-list">(?:<article class="sf-card">.*?</article>)*</div>)', re.S)


def render_page(page_html, folder, all_items):
    """1) Dựng lại từng khối sf-list: bài mới nhất lên trên. Khối nằm ngay sau <h2> trùng tên mục con
          thì chỉ chứa bài của mục con đó.
       2) Các nhóm (<h2> + danh sách) liền nhau thì nhóm có bài mới nhất được đưa lên trên."""
    subs = {s['vi']: s['id'] for s in folder.get('subs', [])}
    mine = [i for i in all_items if i['folder'] == folder['id']]

    def sub_id(h2_text):
        return subs.get(html.unescape(h2_text or '').strip())

    def repl(m):
        h2 = H2_END.search(page_html[:m.start()])
        sub = sub_id(h2.group(1)) if h2 else None
        lst = newest_first([i for i in mine if not sub or i.get('sub') == sub])
        return '<div class="sf-list">' + ''.join(card(i) for i in lst) + '</div>'

    s = LIST_RE.sub(repl, page_html)

    def latest(m):
        sub = sub_id(m.group(2))
        return max([str(i.get('date', '')) for i in mine if i.get('sub') == sub] or [''])

    runs = []
    for m in BLOCK_RE.finditer(s):
        if runs and runs[-1][-1].end() == m.start():
            runs[-1].append(m)
        else:
            runs.append([m])
    for run in reversed(runs):
        if len(run) > 1:
            ordered = sorted(run, key=latest, reverse=True)
            s = s[:run[0].start()] + ''.join(m.group(0) for m in ordered) + s[run[-1].end():]
    return s


def cmd_sync(_):
    D = load_data()
    changed = []
    for f in D['folders']:
        p = os.path.join(ROOT, f['id'] + '.html')
        if not os.path.isfile(p):
            continue
        old = open(p, encoding='utf-8').read()
        new = render_page(old, f, D['items'])
        if new != old:
            open(p, 'w', encoding='utf-8', newline='').write(new)
            changed.append(f['id'] + '.html')
    print('sync: đã sắp xếp lại ->', ', '.join(changed) if changed else '(không có gì thay đổi)')


# ------------------------------------------------------------------ clean
DELETABLE = {'.html', '.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.txt'}
TEXT = {'.html', '.css', '.js', '.xml', '.txt', '.json'}
ALWAYS_KEEP = {'CNAME', 'ads.txt', 'robots.txt', 'sitemap.xml', 'index.html', '404.html'}
TOKEN = re.compile(r'[A-Za-z0-9_\-./]+\.(?:html|webp|jpe?g|png|gif|svg|js|css|json|pdf|apk|aab|zip|ico|txt|xml|woff2?|mp3|mp4)\b', re.I)
OWN_DOMAIN = re.compile(r'https?://(?:www\.)?anlabstudio\.org/', re.I)


def list_files():
    out = []
    for d, dirs, fs in os.walk(ROOT):
        dirs[:] = [x for x in dirs if not x.startswith('.')]
        for f in fs:
            out.append(os.path.relpath(os.path.join(d, f), ROOT).replace('\\', '/'))
    return out


def keep_patterns():
    p = os.path.join(ROOT, '.github', 'cleanup-keep.txt')
    if not os.path.isfile(p):
        return []
    return [l.strip() for l in open(p, encoding='utf-8') if l.strip() and not l.lstrip().startswith('#')]


def is_protected(path, pats):
    name = os.path.basename(path)
    ext = os.path.splitext(path)[1].lower()
    if name in ALWAYS_KEEP or name.startswith('.') or ext in ('.js', '.css', '.md'):
        return True   # .js/.css có thể được app khác dùng chung nên không bao giờ tự xóa
    return any(fnmatch.fnmatch(path, p) for p in pats)


def reachable(files, roots):
    fset = set(files)
    seen, stack = set(), [r for r in roots if r in fset]
    while stack:
        f = stack.pop()
        if f in seen:
            continue
        seen.add(f)
        if os.path.splitext(f)[1].lower() not in TEXT:
            continue
        s = OWN_DOMAIN.sub('', open(os.path.join(ROOT, f), encoding='utf-8', errors='ignore').read())
        base = os.path.dirname(f)
        for m in TOKEN.finditer(s):
            t = m.group(0).lstrip('./')
            for c in (t, os.path.normpath(os.path.join(base, t)).replace('\\', '/')):
                if c in fset and c not in seen:
                    stack.append(c)
    return seen


def last_commit_age_days(path):
    try:
        r = subprocess.run(['git', 'log', '-1', '--format=%ct', '--', path], capture_output=True, text=True, cwd=ROOT)
        ts = r.stdout.strip()
        return (time.time() - int(ts)) / 86400 if ts else 0   # chưa có trong git = coi như mới
    except Exception:
        return 0


def cmd_clean(a):
    D = load_data()
    files = list_files()
    pats = keep_patterns()
    protected = {f for f in files if is_protected(f, pats)}
    roots = protected | {x['id'] + '.html' for x in D['folders']}
    seen = reachable(files, roots)
    cand = sorted(f for f in files
                  if f not in seen and f not in protected and os.path.splitext(f)[1].lower() in DELETABLE)
    young = [f for f in cand if last_commit_age_days(f) < a.grace_days]
    cand = [f for f in cand if f not in young]
    size = sum(os.path.getsize(os.path.join(ROOT, f)) for f in cand)
    print('clean: %d file, %d file không dùng (%.1f MB), %d file mới upload nên chưa xóa'
          % (len(files), len(cand), size / 1e6, len(young)))
    for f in cand:
        print('  XÓA  ' + f)
    for f in young:
        print('  giữ  ' + f + '  (mới trong %g ngày gần đây)' % a.grace_days)
    if len(cand) > a.max_delete and not a.force:
        sys.exit('DỪNG: định xóa %d file, vượt giới hạn an toàn %d. Kiểm tra content.js rồi chạy lại với force.'
                 % (len(cand), a.max_delete))
    if a.dry_run:
        print('(chạy thử — chưa xóa gì)')
        return
    for f in cand:
        os.remove(os.path.join(ROOT, f))
    for d, dirs, fs in os.walk(ROOT, topdown=False):   # dọn thư mục rỗng
        if not dirs and not fs and d != ROOT and '/.' not in d.replace('\\', '/'):
            os.rmdir(d)
    sm = os.environ.get('GITHUB_STEP_SUMMARY')
    if sm and cand:
        with open(sm, 'a', encoding='utf-8') as fh:
            fh.write('### Đã xóa %d file không dùng\n' % len(cand) + ''.join('- `%s`\n' % f for f in cand))


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    sp = ap.add_subparsers(dest='cmd', required=True)
    sp.add_parser('sync').set_defaults(fn=cmd_sync)
    c = sp.add_parser('clean')
    c.add_argument('--dry-run', action='store_true')
    c.add_argument('--force', action='store_true')
    c.add_argument('--grace-days', type=float, default=3)
    c.add_argument('--max-delete', type=int, default=80)
    c.set_defaults(fn=cmd_clean)
    args = ap.parse_args()
    args.fn(args)
