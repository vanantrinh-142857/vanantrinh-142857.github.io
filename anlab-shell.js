/* AnLAB — KHUNG DÙNG CHUNG: dựng cây thư mục (cột trái) và nội dung trang chủ (cột giữa) từ content.js.
   - Trang có <aside data-tree> → có cây thư mục (mọi trang bài viết).
   - Trang có <div id="nx-main"> (index.html) → hiện nội dung theo đường dẫn #/… :
       (trống) trang chủ · #/blog · #/blog/suy-ngam · #/cong-cu · #/apps · #/q/từ-khoá
   Chỉ dùng textContent / setAttribute (không innerHTML) nên dữ liệu không thể chèn mã. */
(function () {
  'use strict';
  var D = window.ANLAB_DATA;
  if (!D) return;
  var root = document.documentElement;
  var page = location.pathname.split('/').pop() || 'index.html';
  var main = document.getElementById('nx-main');
  var treeBox = document.querySelector('[data-tree]');
  if (!main && !treeBox) return;
  var HOME = 'index.html';
  var OK = /^[\w.\-\/]+$/;
  var opened = {};
  var KEY = 'anlab_tree_collapsed', collapsed = false;
  try { collapsed = localStorage.getItem(KEY) === '1'; } catch (e) {}

  var T = {
    all: ['Tất cả bài viết', 'All posts'], allChip: ['Tất cả', 'All'], folders: ['THƯ MỤC', 'FOLDERS'], soon: ['Sắp có…', 'Coming soon…'],
    search: ['Tìm bài, ứng dụng…', 'Search posts, apps…'], home: ['Trang chủ', 'Home'], allApps: ['Tất cả ứng dụng', 'All apps'],
    latestK: ['Kiến thức mới', 'Latest knowledge'], appsT: ['Ứng dụng & công cụ', 'Apps & tools'], more: ['Xem tất cả →', 'View all →'],
    empty: ['Chưa có bài trong mục này.', 'No posts in this folder yet.'], emptyApps: ['Chưa có ứng dụng trong mục này — sắp có.', 'No apps here yet — coming soon.'],
    results: ['Kết quả cho', 'Results for'], none: ['Không tìm thấy kết quả.', 'No results found.'],
    about: ['Giới thiệu', 'About'], contact: ['Liên hệ', 'Contact'], privacy: ['Chính sách bảo mật', 'Privacy policy'],
    fold: ['Thu nhỏ khung thư mục', 'Collapse folder panel'], unfold: ['Ghim mở cây thư mục', 'Pin folder panel open'],
    kdesc: ['Hướng dẫn, kinh nghiệm QC – hàn – kết cấu thép', 'Guides and know-how: QC, welding, structural steel']
  };
  function en() { return root.lang === 'en'; }
  function t(k) { return T[k][en() ? 1 : 0]; }
  function tx(o) { return (en() && o.en) ? o.en : o.vi; }
  function sm(o) { return (en() && o.sumEn) ? o.sumEn : (o.sumVi || ''); }
  function img(o) { var s = (en() && o.imgEn) ? o.imgEn : o.img; return OK.test(s || '') ? s : ''; }
  function href(o) { return OK.test(o.href || '') ? o.href : '#'; }
  function fmt(iso) {
    var p = String(iso || '').split('-'); if (p.length < 3) return '';
    if (!en()) return p[2] + '/' + p[1] + '/' + p[0];
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
  function folder(id) { return D.folders.filter(function (f) { return f.id === id; })[0]; }
  function sub(f, id) { return (f.subs || []).filter(function (s) { return s.id === id; })[0]; }
  function items(fid, sid) {
    return D.items.filter(function (i) { return i.folder === fid && (!sid || i.sub === sid); })
      .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  }
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/').map(function (x) { try { return decodeURIComponent(x); } catch (e) { return x; } });
    return p[0] === '' ? [] : p;
  }
  function link(path) { return HOME + '#/' + path; }

  /* ---------- cây thư mục ---------- */
  function currentItem() { return D.items.filter(function (i) { return i.href === page; })[0]; }
  function renderTree() {
    if (!treeBox) return;
    var r = route(), cur = currentItem();
    var actF = main ? (r[0] && folder(r[0]) ? r[0] : (!r[0] ? 'blog' : '')) : (cur ? cur.folder : '');
    var actS = main ? r[1] : (cur ? cur.sub : '');
    var lay = treeBox.closest('.blog-layout');
    if (lay) lay.classList.toggle('nx-collapsed', collapsed);
    function toggle() {
      collapsed = !collapsed;
      try { localStorage.setItem(KEY, collapsed ? '1' : '0'); } catch (e) {}
      renderTree();
    }
    /* cây đầy đủ; btn = nút ở đầu cây (thu nhỏ khi đang mở, ghim mở khi đang là hộp nổi) */
    function full(foldChar, foldKey) {
      var box = h('div', { 'class': 'nx-tree' });
      var fb = h('button', { type: 'button', 'class': 'nx-fold', title: t(foldKey), 'aria-label': t(foldKey) }, [foldChar]);
      fb.addEventListener('click', toggle);
      box.appendChild(h('div', { 'class': 'nx-head' }, [h('span', null, [t('folders')]), fb]));
      var inp = h('input', { type: 'search', placeholder: t('search'), 'aria-label': t('search') });
      var form = h('form', { 'class': 'nx-search', role: 'search' }, [inp, h('button', { type: 'submit', 'aria-label': t('search') }, ['↗'])]);
      form.addEventListener('submit', function (e) {
        e.preventDefault(); var v = inp.value.trim(); if (!v) return;
        if (main) location.hash = '#/q/' + encodeURIComponent(v); else location.href = link('q/' + encodeURIComponent(v));
      });
      box.appendChild(form);
      D.folders.forEach(function (f) {
        var list = items(f.id), d = h('details'), isAct = f.id === actF;
        if (opened[f.id] === undefined ? isAct : opened[f.id]) d.setAttribute('open', '');
        d.addEventListener('toggle', function () { opened[f.id] = d.open; });
        d.appendChild(h('summary', null, [f.icon + ' ' + tx(f), h('em', null, ['▶'])]));
        var sb = h('div', { 'class': 'nx-sub' });
        if (f.kind === 'posts') {
          sb.appendChild(h('a', { href: link(f.id), 'class': (isAct && !actS && main) ? 'on' : '' }, [t('all'), h('i', null, [String(list.length)])]));
          (f.subs || []).forEach(function (x) {
            sb.appendChild(h('a', { href: link(f.id + '/' + x.id), 'class': (isAct && actS === x.id) ? 'on' : '' }, [tx(x), h('i', null, [String(items(f.id, x.id).length)])]));
          });
        } else if (!list.length) {
          sb.appendChild(h('div', { 'class': 'nx-soon' }, [t('soon')]));
        } else {
          if (list.length > 1) sb.appendChild(h('a', { href: link(f.id), 'class': (main && isAct && !actS && r[0] === f.id) ? 'on' : '' }, [t('all'), h('i', null, [String(list.length)])]));
          list.forEach(function (it) { sb.appendChild(h('a', { href: href(it), 'class': it.href === page ? 'on' : '' }, [tx(it)])); });
        }
        d.appendChild(sb); box.appendChild(d);
      });
      box.appendChild(h('hr'));
      [['gioi-thieu.html', 'about'], ['lien-he.html', 'contact'], ['chinh-sach-bao-mat.html', 'privacy']].forEach(function (x) {
        box.appendChild(h('a', { 'class': 'nx-lk', href: x[0] }, [t(x[1])]));
      });
      return box;
    }
    treeBox.textContent = '';
    if (!collapsed) { treeBox.appendChild(full('‹', 'fold')); return; }
    /* thu nhỏ: thanh biểu tượng; rê chuột (hoặc Tab vào) thì cây đầy đủ bung ra đè lên nội dung */
    var rail = h('div', { 'class': 'nx-rail' });
    D.folders.forEach(function (f) { rail.appendChild(h('a', { href: link(f.id), title: tx(f), 'class': f.id === actF ? 'on' : '' }, [f.icon])); });
    var fly = h('div', { 'class': 'nx-fly' }); fly.appendChild(full('📌', 'unfold'));
    treeBox.appendChild(rail); treeBox.appendChild(fly);
  }
  /* rê chuột vào khung cây (đang thu nhỏ) → bung ra; rời đi → thu lại */
  (function () {
    if (!treeBox) return;
    var lay = treeBox.closest('.blog-layout'), tm = 0;
    if (!lay) return;
    function on() { clearTimeout(tm); lay.classList.add('nx-hover'); }
    function off() { clearTimeout(tm); tm = setTimeout(function () { lay.classList.remove('nx-hover'); }, 180); }
    treeBox.addEventListener('mouseenter', on); treeBox.addEventListener('mouseleave', off);
    treeBox.addEventListener('focusin', on); treeBox.addEventListener('focusout', off);
  })();

  /* ---------- thẻ nội dung ---------- */
  function tagOf(it) { var f = folder(it.folder), s = f && sub(f, it.sub); return s ? tx(s) : (f ? tx(f) : ''); }
  function postCard(it) {
    var im = img(it);
    return h('a', { 'class': 'nx-box nx-post', href: href(it) }, [
      h('img', { src: im, alt: '', loading: 'lazy' }),
      h('div', { 'class': 'b' }, [h('span', { 'class': 'nx-tg' }, [tagOf(it)]), h('h3', null, [tx(it)]), h('p', null, [sm(it)]), h('span', { 'class': 'nx-dt' }, [fmt(it.date)])])
    ]);
  }
  function appCard(it) {
    return h('a', { 'class': 'nx-box nx-app', href: href(it) }, [
      h('img', { src: img(it), alt: '', loading: 'lazy' }),
      h('div', null, [h('b', null, [tx(it)]), h('span', null, [(folder(it.folder) ? tx(folder(it.folder)) : '') + (it.meta ? ' · ' + it.meta : '')])])
    ]);
  }
  function listOf(arr, emptyKey) {
    var w = h('div');
    if (!arr.length) { w.appendChild(h('div', { 'class': 'nx-box nx-empty' }, [t(emptyKey)])); return w; }
    arr.forEach(function (it) { w.appendChild(it.type === 'app' ? appCard(it) : postCard(it)); });
    return w;
  }
  function appsGrid(arr) {
    if (!arr.length) return h('div', { 'class': 'nx-box nx-empty' }, [t('emptyApps')]);
    var g = h('div', { 'class': 'nx-apps' }); arr.forEach(function (it) { g.appendChild(appCard(it)); }); return g;
  }
  function sec(title, more, node) {
    var head = h('div', { 'class': 'nx-sec' }, [h('h3', null, [title])]);
    if (more) head.appendChild(h('a', { href: more }, [t('more')]));
    var w = h('div'); w.appendChild(head); w.appendChild(node); return w;
  }
  function crumb(parts) {
    var c = h('div', { 'class': 'nx-crumb' }, [h('a', { href: HOME }, [t('home')])]);
    parts.forEach(function (p) { c.appendChild(document.createTextNode(' / ')); c.appendChild(p.href ? h('a', { href: p.href }, [p.text]) : document.createTextNode(p.text)); });
    return c;
  }
  function chips(f, actS) {
    var c = h('div', { 'class': 'nx-chips' });
    c.appendChild(h('a', { href: link(f.id), 'class': actS ? '' : 'on' }, [t('allChip')]));
    (f.subs || []).forEach(function (s) { c.appendChild(h('a', { href: link(f.id + '/' + s.id), 'class': actS === s.id ? 'on' : '' }, [tx(s)])); });
    return c;
  }

  /* ---------- nội dung giữa (index.html) ---------- */
  function renderMain() {
    if (!main) return;
    var r = route(), out = document.createDocumentFragment(), f = r[0] && folder(r[0]);
    if (r[0] === 'q') {
      var q = norm(r.slice(1).join('/')), res = D.items.filter(function (i) { return norm(tx(i) + ' ' + sm(i) + ' ' + i.vi + ' ' + (i.sumVi || '')).indexOf(q) > -1; });
      out.appendChild(crumb([{ text: t('results') + ' “' + r.slice(1).join('/') + '”' }]));
      out.appendChild(h('h2', { 'class': 'nx-title' }, [t('results') + ' “' + r.slice(1).join('/') + '”']));
      out.appendChild(listOf(res, 'none'));
    } else if (r[0] === 'apps') {
      out.appendChild(crumb([{ text: t('appsT') }])); out.appendChild(h('h2', { 'class': 'nx-title' }, ['🧩 ' + t('appsT')]));
      out.appendChild(h('div', { style: 'margin-top:12px' }, [appsGrid(D.items.filter(function (i) { return i.type === 'app'; }))]));
    } else if (f) {
      var sb = r[1] && sub(f, r[1]);
      var parts = [{ text: tx(f), href: sb ? link(f.id) : null }]; if (sb) parts.push({ text: tx(sb) });
      out.appendChild(crumb(parts));
      out.appendChild(h('h2', { 'class': 'nx-title' }, [f.icon + ' ' + (sb ? tx(sb) : tx(f))]));
      if (f.kind === 'posts') { if ((f.subs || []).length) out.appendChild(chips(f, sb ? sb.id : '')); out.appendChild(h('div', { style: 'margin-top:12px' }, [listOf(items(f.id, sb && sb.id), 'empty')])); }
      else out.appendChild(h('div', { style: 'margin-top:12px' }, [appsGrid(items(f.id))]));
    } else {
      /* trang chủ: Blog hiện đầu tiên và mặc định */
      var blog = folder('blog');
      out.appendChild(h('h2', { 'class': 'nx-title' }, [blog.icon + ' ' + tx(blog)]));
      out.appendChild(chips(blog, ''));
      out.appendChild(listOf(items('blog'), 'empty'));
      var k = folder('kien-thuc');
      if (k) {
        var kl = items('kien-thuc').slice(0, 3), node;
        if (kl.length) { node = h('div'); kl.forEach(function (it) { node.appendChild(postCard(it)); }); }
        else {
          node = h('div', { 'class': 'nx-topics' });
          (k.subs || []).slice(0, 3).forEach(function (s) {
            node.appendChild(h('a', { 'class': 'nx-box nx-topic', href: link('kien-thuc/' + s.id) }, [h('div', { 'class': 'ic' }, ['📘']), h('b', null, [tx(s)]), h('span', null, [t('soon')])]));
          });
        }
        out.appendChild(sec(k.icon + ' ' + t('latestK'), link('kien-thuc'), node));
      }
      var apps = D.items.filter(function (i) { return i.type === 'app'; });
      if (apps.length) out.appendChild(sec('🧩 ' + t('appsT'), link('apps'), appsGrid(apps)));
    }
    main.textContent = ''; main.appendChild(out);
  }

  function renderAll() { renderTree(); renderMain(); }
  var first = true;
  window.addEventListener('hashchange', function () {
    renderAll();
    if (main) { var top = (document.querySelector('.blog-layout') || main).getBoundingClientRect().top + window.pageYOffset - 90; window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' }); }
  });
  new MutationObserver(renderAll).observe(root, { attributes: true, attributeFilter: ['lang'] });
  renderAll();
})();
