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
      '<img src="images/ung-ho-qr.jpg" alt="Mã VietQR ủng hộ AnLAB — Techcombank, TRINH VAN AN" data-en-alt="VietQR code to support AnLAB — Techcombank, TRINH VAN AN" width="460" height="540"/>' +
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
