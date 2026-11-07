(function(){
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* active nav link */
  var page = document.body.getAttribute('data-page');
  document.querySelectorAll('[data-nav]').forEach(function(a){
    if (a.getAttribute('data-nav') === page) a.classList.add('active');
  });

  /* screenshot tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  var cap = document.getElementById('shotCap');
  var current = 0;
  function updateCaption(){
    if (!cap || !shots.length) return;
    var s = shots[current];
    cap.innerHTML = (root.lang === 'ar') ? s.getAttribute('data-cap-ar') : s.getAttribute('data-cap-en');
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){
      current = i;
      tabs.forEach(function(x, k){ x.classList.toggle('on', k === i); });
      shots.forEach(function(s, k){ s.classList.toggle('on', k === i); });
      updateCaption();
    });
  });

  /* language */
  var i18n = document.querySelectorAll('[data-ar]');
  i18n.forEach(function(el){ el.dataset.en = el.innerHTML; });
  var langBtn = document.getElementById('langBtn');
  var enTitle = document.title;
  var arTitle = document.body.getAttribute('data-title-ar') || enTitle;
  function setLang(l){
    root.lang = l; root.dir = (l === 'ar') ? 'rtl' : 'ltr';
    i18n.forEach(function(el){ el.innerHTML = (l === 'ar') ? el.dataset.ar : el.dataset.en; });
    if (langBtn) langBtn.textContent = (l === 'ar') ? 'EN' : 'ع';
    document.title = (l === 'ar') ? arTitle : enTitle;
    try { localStorage.setItem('lang', l); } catch(e){}
    updateCaption();
  }
  var saved = null; try { saved = localStorage.getItem('lang'); } catch(e){}
  setLang(saved === 'ar' ? 'ar' : 'en');
  if (langBtn) langBtn.addEventListener('click', function(){ setLang(root.lang === 'ar' ? 'en' : 'ar'); });

  /* mobile menu */
  var sheet = document.getElementById('sheet');
  var burger = document.getElementById('burger');
  var close = document.getElementById('sheetClose');
  if (sheet && burger) burger.addEventListener('click', function(){ sheet.classList.add('open'); });
  if (sheet && close) close.addEventListener('click', function(){ sheet.classList.remove('open'); });

  /* open a case card when linked by #hash */
  if (location.hash) {
    var target = document.querySelector(location.hash);
    if (target) { var d = target.querySelector('details'); if (d) d.open = true; }
  }

  /* reveal */
  var items = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) { items.forEach(function(el){ el.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.06});
    items.forEach(function(el){ io.observe(el); });
  }
})();
