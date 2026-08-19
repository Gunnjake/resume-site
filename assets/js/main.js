/**
 * Portfolio site — shared JS
 * - Scroll reveal (IntersectionObserver)
 * - Skill tiles stagger on homepage
 * - Respects prefers-reduced-motion
 */

(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!revealEls.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initSkillTiles() {
    if (prefersReducedMotion) return;
    var container = document.querySelector('.skills-tiles');
    if (!container) return;

    var tiles = container.querySelectorAll('.skill-tile');
    if (!tiles.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tiles.forEach(function (tile, i) {
            setTimeout(function () {
              tile.classList.add('is-visible');
            }, 60 * i);
          });
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );

    observer.observe(container);
  }

  function initTechStackHighlight() {
    var grid = document.querySelector('.tech-stack-grid');
    if (!grid) return;

    var panel = grid.closest('.tech-stack-panel');
    var nameEl = panel ? panel.querySelector('.tech-stack-active-name') : null;
    var tiles = Array.prototype.slice.call(grid.querySelectorAll('.tech-stack-tile')).filter(function (t) {
      return !t.classList.contains('tech-stack-tile-empty');
    });
    if (!tiles.length) return;

    var activeIndex = -1;
    var intervalId = null;
    var pausedByHover = false;
    var gridInView = false;
    var defaultName = (nameEl && nameEl.getAttribute('data-default')) ? nameEl.getAttribute('data-default') : 'Hover a tool';

    function setReadout(name, active) {
      if (nameEl) nameEl.textContent = name || defaultName;
      if (!nameEl) return;
      if (active) nameEl.classList.add('is-active'); else nameEl.classList.remove('is-active');
    }

    function updateReadoutFromSpotlight() {
      if (activeIndex >= 0 && tiles[activeIndex]) {
        var t = tiles[activeIndex];
        setReadout(t.getAttribute('data-name'), true);
      } else {
        setReadout(defaultName, false);
      }
    }

    /* Narrow viewports hide the later tiles, so only spotlight what is on
       screen — otherwise the readout names a tool nobody can see. */
    function visibleIndexes() {
      var out = [];
      for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].offsetParent !== null) out.push(i);
      }
      return out.length ? out : tiles.map(function (_, i) { return i; });
    }

    function setActiveRandom() {
      if (!tiles.length) return;
      var pool = visibleIndexes();
      var nextIndex = pool[Math.floor(Math.random() * pool.length)];
      if (pool.length > 1 && nextIndex === activeIndex) {
        nextIndex = pool[(pool.indexOf(nextIndex) + 1) % pool.length];
      }
      if (activeIndex >= 0 && tiles[activeIndex]) {
        tiles[activeIndex].classList.remove('is-spotlight');
      }
      activeIndex = nextIndex;
      tiles[activeIndex].classList.add('is-spotlight');
      updateReadoutFromSpotlight();
    }

    function startInterval() {
      if (intervalId || prefersReducedMotion) return;
      setActiveRandom();
      intervalId = window.setInterval(setActiveRandom, 6500);
    }

    function stopInterval() {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target !== grid) return;
        gridInView = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!intervalId && !pausedByHover) startInterval();
        } else {
          stopInterval();
          if (activeIndex >= 0 && tiles[activeIndex]) {
            tiles[activeIndex].classList.remove('is-spotlight');
          }
          activeIndex = -1;
          setReadout(defaultName, false);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(grid);

    grid.querySelectorAll('.tech-stack-tile').forEach(function (tile) {
      tile.addEventListener('mouseenter', function () {
        var name = tile.getAttribute('data-name');
        setReadout(name || null, !!name);
        if (intervalId) {
          stopInterval();
          pausedByHover = true;
        }
      });
      tile.addEventListener('mouseleave', function () {
        pausedByHover = false;
        updateReadoutFromSpotlight();
        if (gridInView) startInterval();
      });
      tile.addEventListener('focus', function () {
        var name = tile.getAttribute('data-name');
        setReadout(name || null, !!name);
        if (intervalId) {
          stopInterval();
          pausedByHover = true;
        }
      });
      tile.addEventListener('blur', function () {
        pausedByHover = false;
        updateReadoutFromSpotlight();
        if (gridInView) startInterval();
      });
    });
  }

  /**
   * Below 900px the nav collapses to a hamburger dropdown. Closes on link
   * activation, Escape, an outside tap, or once the viewport is wide enough
   * for the full row again.
   */
  function initNavMenu() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var toggle = nav.querySelector('.nav-toggle');
    var menu = nav.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!nav.classList.contains('is-open'));
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    var wide = window.matchMedia('(min-width: 900px)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onChange);
    else if (wide.addListener) wide.addListener(onChange);
  }

  function init() {
    initNavMenu();
    initReveal();
    initSkillTiles();
    initTechStackHighlight();
  }

  window.initNavMenu = initNavMenu;
  window.initReveal = initReveal;
  window.initSkillTiles = initSkillTiles;
  window.initTechStackHighlight = initTechStackHighlight;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
