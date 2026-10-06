// 程式設計進階・自主學習地圖 共用互動
// 跟basic.js的差異：這個系列只有Blockly單一平台（嘉義市版→BlocklyYdws、校外師生版→
// blockly-lab各自獨立輸出），練習連結的網址在產生網站時就直接寫死，不需要像basic.js
// 那樣在瀏覽器裡依使用者選的平台即時組網址，所以這裡沒有platform-switch相關邏輯。
// 1. 複製課程代碼。
// 2. 列印時自動展開所有收合區塊；「全部展開／全部收合」按鈕。
(function () {
  var toastTimer = null;

  function toast(msg) {
    var el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1600);
  }

  // 積木截圖點一下放大看（有些圖在表格裡縮得很小看不清楚）。
  function closeLightbox() {
    var ov = document.querySelector('.img-lightbox');
    if (ov) ov.remove();
    document.removeEventListener('keydown', onLightboxKey);
  }
  function onLightboxKey(ev) {
    if (ev.key === 'Escape') closeLightbox();
  }
  function openLightbox(src, alt) {
    closeLightbox();
    var ov = document.createElement('div');
    ov.className = 'img-lightbox';
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    ov.appendChild(img);
    ov.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', onLightboxKey);
    document.body.appendChild(ov);
  }

  document.addEventListener('click', function (ev) {
    var blockImg = ev.target.closest('img.block-img');
    if (blockImg) {
      openLightbox(blockImg.src, blockImg.alt);
      return;
    }
    var fold = ev.target.closest('button[data-fold]');
    if (fold) {
      var open = fold.dataset.fold === 'open';
      document.querySelectorAll('details.fold, details.step').forEach(function (d) { d.open = open; });
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
})();
