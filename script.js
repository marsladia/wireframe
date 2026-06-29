/* AlwayStart prototype — interactions */
document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // FAQ accordion
  document.querySelectorAll('.qa button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var qa = btn.closest('.qa');
      var ans = qa.querySelector('.ans');
      var open = qa.classList.toggle('open');
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : null;
    });
  });

  // Demo "buy" / form buttons — prototype only
  document.querySelectorAll('[data-demo]').forEach(function (el) {
    el.addEventListener('click', function (ev) {
      ev.preventDefault();
      alert('Prototype: ' + (el.getAttribute('data-demo') || 'This is a demo action.'));
    });
  });

  // Newsletter forms (prototype) — homepage section + footer mini form
  document.querySelectorAll('form[data-news]').forEach(function (nf) {
    nf.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = nf.parentElement.querySelector('.news-ok');
      if (ok) ok.style.display = 'block';
      nf.reset();
    });
  });

  // Hero slider — auto-looping with controls
  (function () {
    var slider = document.getElementById('heroSlider');
    if (!slider) return;
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var dotsWrap = document.getElementById('slideDots');
    var progress = document.getElementById('slideProgress');
    var i = 0, timer = null, tick = null, elapsed = 0;
    var DURATION = 5000, STEP = 50;

    // build dots
    slides.forEach(function (_, idx) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
      b.addEventListener('click', function () { go(idx); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function go(n) {
      slides[i].classList.remove('active');
      dots[i].classList.remove('active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('active');
      dots[i].classList.add('active');
    }
    function next() { go(i + 1); }
    function prev() { go(i - 1); }

    function restart() {
      clearInterval(timer); clearInterval(tick);
      elapsed = 0; if (progress) progress.style.width = '0%';
      timer = setInterval(next, DURATION);
      tick = setInterval(function () {
        elapsed += STEP;
        if (progress) progress.style.width = Math.min(100, (elapsed / DURATION) * 100) + '%';
        if (elapsed >= DURATION) elapsed = 0;
      }, STEP);
    }
    function stop() { clearInterval(timer); clearInterval(tick); }

    go(0); restart();
    document.getElementById('slideNext').addEventListener('click', function () { next(); restart(); });
    document.getElementById('slidePrev').addEventListener('click', function () { prev(); restart(); });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', restart);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : restart(); });
  })();

  // Contact form (prototype)
  var form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      form.querySelector('.form-ok').style.display = 'block';
      form.reset();
    });
  }
});
