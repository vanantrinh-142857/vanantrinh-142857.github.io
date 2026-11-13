/* AnLAB — phần bổ sung dùng chung cho mọi trang.
   1) Dịch những thứ script chuyển ngôn ngữ có sẵn không với tới: tiêu đề thẻ app, tiêu đề trang, ẢNH (banner/icon có chữ).
      Cách dùng: gắn thuộc tính vào chính phần tử —
        data-en="Text"            → đổi nội dung chữ khi chọn English
        data-en-alt / -aria / -title / -content / -src / -srcset / -href / -bg   → đổi thuộc tính tương ứng
        .anlab-app-data[data-cover-en][data-icon-en]                        → ảnh bìa / icon thẻ app bản tiếng Anh
   2) Hộp QR ủng hộ (nút ♥ trên menu). */
(function () {
  'use strict';
  var root = document.documentElement;
  function isEN() { return root.lang === 'en'; }

  /* ---------- 1. Chuyển ngôn ngữ cho phần tử có data-en* ---------- */
  var ATTRS = [['alt', 'data-en-alt'], ['aria-label', 'data-en-aria'], ['title', 'data-en-title'],
    ['content', 'data-en-content'], ['src', 'data-en-src'], ['srcset', 'data-en-srcset'], ['href', 'data-en-href']];
  var TAGS = { 'Học tập': 'Learning', 'Công cụ': 'Tools', 'Trò chơi': 'Games', 'Mô phỏng': 'Simulation', 'Blog': 'Blog' };

  function memo(el) { return el.__vi || (el.__vi = {}); }

  function applyLang() {
    var en = isEN();
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var m = memo(el);
      if (m.text === undefined) m.text = el.textContent;
      el.textContent = en ? el.getAttribute('data-en') : m.text;
    });
    document.querySelectorAll('[data-en-html]').forEach(function (el) {
      var m = memo(el);
      if (m.html === undefined) m.html = el.innerHTML;
      el.innerHTML = en ? el.getAttribute('data-en-html') : m.html;
    });
    ATTRS.forEach(function (p) {
      document.querySelectorAll('[' + p[1] + ']').forEach(function (el) {
        var m = memo(el);
        if (m[p[0]] === undefined) m[p[0]] = el.getAttribute(p[0]);
        var v = en ? el.getAttribute(p[1]) : m[p[0]];
        if (v === null) el.removeAttribute(p[0]); else el.setAttribute(p[0], v);
      });
    });
    /* ảnh nền (poster) */
    document.querySelectorAll('[data-en-bg]').forEach(function (el) {
      var m = memo(el);
      if (m.bg === undefined) m.bg = el.style.backgroundImage;
      el.style.backgroundImage = en ? "url('" + el.getAttribute('data-en-bg') + "')" : m.bg;
    });
    /* ảnh bìa + icon của thẻ app (do script cũ gắn từ data-cover / data-icon) */
    document.querySelectorAll('.anlab-app-data').forEach(function (info) {
      var cEn = info.getAttribute('data-cover-en'), iEn = info.getAttribute('data-icon-en');
      var scope = info.closest('.app-card') || info.closest('.article-shell') || info.closest('.article-card');
      if (!scope) return;
      if (cEn) {
        var cv = scope.querySelector('.card-cover');
        if (cv) {
          var m = memo(cv);
          if (m.cover === undefined) m.cover = cv.style.backgroundImage;
          if (m.cover) cv.style.backgroundImage = en ? m.cover.replace(/url\((['"]?)[^)'"]+\1\)/, "url('" + cEn + "')") : m.cover;
        }
      }
      if (iEn) {
        var im = scope.querySelector('.dl-icon img, .card-icon img');
        if (im) {
          var mi = memo(im);
          if (mi.src === undefined) mi.src = im.getAttribute('src');
          im.setAttribute('src', en ? iEn : mi.src);
        }
      }
    });
    /* nhãn #thẻ */
    document.querySelectorAll('.article-tags a').forEach(function (a) {
      var m = memo(a);
      if (m.text === undefined) m.text = a.textContent;
      var k = m.text.replace(/^#/, '');
      a.textContent = en && TAGS[k] ? '#' + TAGS[k] : m.text;
    });
    var cp = document.getElementById('dn-copy');
    if (cp) cp.textContent = en ? 'Copy account number' : 'Sao chép số tài khoản';
  }

  /* chạy khi tải xong, khi đổi ngôn ngữ (lang của <html> đổi), và sau 'load' (script cũ gắn ảnh bìa muộn) */
  new MutationObserver(applyLang).observe(root, { attributes: true, attributeFilter: ['lang'] });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyLang); else applyLang();
  window.addEventListener('load', function () { applyLang(); setTimeout(applyLang, 200); });

  /* ---------- 2. Hộp QR ủng hộ ---------- */
  var ACC = '1903 7910 7860 18';
  function buildModal() {
    if (document.getElementById('dn-ov')) return;
    var ov = document.createElement('div');
    ov.className = 'dn-ov'; ov.id = 'dn-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-labelledby', 'dn-title');
    ov.innerHTML =
      '<div class="dn-card">' +
      '<button type="button" class="dn-x" aria-label="Đóng" data-en-aria="Close">×</button>' +
      '<h2 id="dn-title"><span data-en="Support">Ủng hộ</span> An<span>LAB</span></h2>' +
      '<p data-en="If AnLAB’s free apps help you, you can chip in to keep the site running and growing. Entirely voluntary — thank you!">Nếu các phần mềm miễn phí của AnLAB hữu ích với bạn, bạn có thể ủng hộ để trang web được duy trì và phát triển thêm. Hoàn toàn tự nguyện — cảm ơn bạn!</p>' +
      '<img src="images/ung-ho-qr.webp" alt="Mã VietQR ủng hộ AnLAB — Techcombank, TRINH VAN AN" data-en-alt="VietQR code to support AnLAB — Techcombank, TRINH VAN AN" width="460" height="540"/>' +
      '<div class="dn-acc"><span data-en="Account holder">Chủ tài khoản</span>: <b>TRINH VAN AN</b><br/>Techcombank · <b>' + ACC + '</b></div>' +
      '<button type="button" class="dn-copy" id="dn-copy">Sao chép số tài khoản</button>' +
      '<p class="dn-note" data-en="Scan with any banking app that supports VietQR.">Quét bằng ứng dụng ngân hàng bất kỳ có hỗ trợ VietQR.</p>' +
      '</div>';
    document.body.appendChild(ov);
    function close() { ov.classList.remove('open'); document.body.style.overflow = ''; }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('.dn-x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    ov.querySelector('#dn-copy').addEventListener('click', function () {
      var btn = this, digits = ACC.replace(/\s/g, '');
      function done() {
        btn.textContent = isEN() ? 'Copied ✓' : 'Đã sao chép ✓';
        setTimeout(function () { btn.textContent = isEN() ? 'Copy account number' : 'Sao chép số tài khoản'; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(digits).then(done, done); else done();
    });
    applyLang();
  }
  function openModal(e) {
    if (e) e.preventDefault();
    buildModal();
    var ov = document.getElementById('dn-ov');
    ov.classList.add('open'); document.body.style.overflow = 'hidden';
    var header = document.querySelector('.topbar'); if (header) header.classList.remove('nav-open');
    ov.querySelector('.dn-x').focus();
  }
  function wire() {
    document.querySelectorAll('[data-donate]').forEach(function (b) { b.addEventListener('click', openModal); });
    if (location.hash === '#ung-ho' || location.hash === '#donate') openModal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();


/* ---------- 4. Quảng cáo thật (Google AdSense) ----------
   CÁCH GẮN: tạo "Đơn vị quảng cáo" trong AdSense (Quảng cáo → Theo đơn vị quảng cáo → Quảng cáo hiển thị),
   lấy dãy số trong data-ad-slot="..." rồi dán vào đúng vị trí bên dưới. Để trống '' = vẫn hiện ô giữ chỗ.
   Mã client (ca-pub-...) đã được nạp sẵn trong <head> của mọi trang. */
(function () {
  'use strict';
  var CFG = window.ANLAB_ADS || {
    client: 'ca-pub-7331246969751790',
    slots: {
      'sidebar':     '',   /* cột phải — ô 1 (blog, ứng dụng)   300×250 / 300×600 */
      'sidebar-2':   '',   /* cột phải — ô 2 (trang Blog)       300×250 / 300×600 */
      'post-top':    '',   /* đầu bài viết                      728×90 / 336×280  */
      'post-bottom': '',   /* cuối bài viết                     728×90 / 336×280  */
      'infeed':      ''    /* xen giữa các thẻ ứng dụng         responsive        */
    }
  };
  function run() {
    document.querySelectorAll('.adzone[data-ad-target]').forEach(function (z) {
      if (z.__adDone) return;
      var key = (z.getAttribute('data-ad-target') || '').replace(/^anlab-slot-/, ''), id = CFG.slots[key];
      if (!/^\d{6,}$/.test(id || '')) return;
      z.__adDone = 1;
      var e = z.querySelector('.ad-empty'); if (e) e.remove();
      var pr = z.querySelector('.dlpromo'); if (pr) pr.remove();
      z.classList.remove('adzone-promo', 'adzone-spare');
      var ins = document.createElement('ins'); ins.className = 'adsbygoogle'; ins.style.display = 'block';
      ins.setAttribute('data-ad-client', CFG.client); ins.setAttribute('data-ad-slot', id);
      ins.setAttribute('data-ad-format', 'auto'); ins.setAttribute('data-full-width-responsive', 'true');
      z.appendChild(ins);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (err) {}
    });
  }
  window.addEventListener('load', function () { setTimeout(run, 300); });
})();


/* ---------- 5. Ô quảng cáo còn trống ở cột phải → thẻ tải EasyPDF ----------
   Khi ô 300×250 chưa có quảng cáo thật, hiện thẻ tải EasyPDF (Android + Windows) cho đỡ trống.
   Ô đầu tiên hiện thẻ, các ô trống còn lại ẩn. Khi dán mã đơn vị quảng cáo ở mục 4, quảng cáo thật tự thay thẻ này. */
(function () {
  'use strict';
  var PLAY = 'https://play.google.com/store/apps/details?id=com.PDF.easypdf';
  var WIN = 'https://drive.google.com/uc?export=download&id=17luR7AphG3OmTRMkQB3Bk9q2Bu0xy9mV';
  if (/easypdf\.html$/.test(location.pathname)) return;           /* trang EasyPDF đã có khung tải riêng */
  function el(tag, cls, text, en) {
    var e = document.createElement(tag); if (cls) e.className = cls;
    if (text) e.textContent = text; if (en) e.setAttribute('data-en', en); return e;
  }
  function link(cls, href, text, en) {
    var a = el('a', cls, text, en); a.href = href;
    if (/^https:/.test(href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a;
  }
  function promo() {
    var c = el('div', 'dlpromo');
    c.appendChild(el('div', 'dlp-kick', 'TẢI PHẦN MỀM', 'FREE DOWNLOAD'));
    var h = el('div', 'dlp-head'), img = document.createElement('img');
    img.src = 'images/easypdf-logo.webp'; img.alt = 'EasyPDF'; img.width = 52; img.height = 52; img.loading = 'lazy';
    var t = el('div'), nm = el('div', 'dlp-name', 'Easy'); nm.appendChild(el('span', 'pdf-red', 'PDF'));
    t.appendChild(nm); t.appendChild(el('div', 'dlp-sub', 'Đọc & chỉnh sửa PDF', 'Read & edit PDF'));
    h.appendChild(img); h.appendChild(t); c.appendChild(h);
    c.appendChild(el('p', 'dlp-desc', 'Xem, chú thích, tách, ghép, OCR và mở Word / Excel / PowerPoint. Miễn phí.',
      'View, annotate, split, merge, OCR and open Word / Excel / PowerPoint. Free.'));
    c.appendChild(link('dl-btn', PLAY, '📱  Tải cho Android', '📱  Download for Android'));
    c.appendChild(link('dl-btn dl-win', WIN, '💻  Tải cho máy tính (Windows)', '💻  Download for computer (Windows)'));
    c.appendChild(link('dlp-more', 'easypdf.html', 'Xem chi tiết →', 'Details →'));
    return c;
  }
  function mount() {
    var zs = [].slice.call(document.querySelectorAll('.adzone-rect')).filter(function (z) {
      return !z.closest('#ad-staging') && z.querySelector('.ad-empty');
    });
    zs.forEach(function (z, i) {
      if (i > 0) { z.classList.add('adzone-spare'); return; }
      z.classList.add('adzone-promo');
      var lab = z.querySelector('.adlabel'); if (lab) lab.remove();
      z.querySelector('.ad-empty').replaceWith(promo());
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
