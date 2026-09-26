// 程式設計基礎・自主學習地圖 共用互動
// 1. 平台切換（Blockly／Scratch）：只記住這台瀏覽器的偏好，不記錄學習進度。
// 2. 「前往練習」連結依平台產生一鍵直達網址（?course=課程代碼&task=題號）。
// 3. 複製課程代碼。
// 4. 列印時自動展開所有收合區塊。
(function () {
  var PLATFORMS = window.BASIC_PLATFORMS || {};
  var KEY = 'ydwsBasicPlatform';
  var toastTimer = null;

  function loadPlatform() {
    try { return localStorage.getItem(KEY) || 'blockly'; } catch (e) { return 'blockly'; }
  }
  function savePlatform(p) {
    try { localStorage.setItem(KEY, p); } catch (e) { /* 無法儲存就只影響這次瀏覽 */ }
  }
  function toast(msg) {
    var el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1600);
  }

  function applyPlatform(p) {
    var cfg = PLATFORMS[p] || PLATFORMS.blockly;
    if (!cfg) return;
    document.querySelectorAll('.platform-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.platform === p));
    });
    document.querySelectorAll('a[data-course]').forEach(function (a) {
      var url = cfg.url + '?course=' + encodeURIComponent(a.dataset.course);
      if (a.dataset.task) url += '&task=' + encodeURIComponent(a.dataset.task);
      a.href = url;
    });
    document.querySelectorAll('[data-platform-name]').forEach(function (el) {
      el.textContent = cfg.label;
    });
  }

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('.platform-switch button');
    if (btn) {
      savePlatform(btn.dataset.platform);
      applyPlatform(btn.dataset.platform);
      toast('已切換到 ' + (PLATFORMS[btn.dataset.platform] || {}).label + ' 平台');
      return;
    }
    var copy = ev.target.closest('button[data-copy]');
    if (copy) {
      var text = copy.dataset.copy;
      var done = function () {
        copy.classList.add('done');
        copy.textContent = '已複製';
        toast('已複製課程代碼：' + text);
        setTimeout(function () { copy.classList.remove('done'); copy.textContent = '複製'; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { toast('請手動選取代碼：' + text); });
      } else {
        toast('請手動選取代碼：' + text);
      }
    }
  });

  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details').forEach(function (d) { d.setAttribute('open', ''); });
  });

  applyPlatform(loadPlatform());
})();
