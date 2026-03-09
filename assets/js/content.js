/**
 * Data-driven content renderer — loads JSON and populates pages.
 * Works with static HTML templates; keeps URLs and design system.
 */
(function () {
  'use strict';

  var dataPath = '';
  var basePath = '';

  function getPaths() {
    var pathname = window.location.pathname.replace(/\/$/, '') || '/';
    var segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) {
      basePath = '';
      dataPath = 'data/';
    } else {
      basePath = '../'.repeat(segments.length);
      dataPath = basePath + 'data/';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function fetchJSON(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('Fetch failed: ' + url);
      return res.json();
    });
  }

  function renderTags(techs, base) {
    if (!techs || !techs.length) return '';
    return techs.map(function (t) {
      return '<span class="tag">' + escapeHtml(t) + '</span>';
    }).join('');
  }

  function getPageType() {
    var path = (window.location.pathname || '/').replace(/\/$/, '') || '/';
    var segments = path.split('/').filter(Boolean);
    var last = segments[segments.length - 1] || '';
    var slug = last && last !== 'index.html' ? last.replace(/\.html$/, '') : null;

    if (path === '' || path === '/' || path === '/index.html' || (segments.length <= 1 && (last === '' || last === 'index.html'))) return { type: 'home' };
    if (segments[segments.length - 2] === 'projects' && (last === 'index.html' || last === '')) return { type: 'projects-list' };
    if (segments.indexOf('projects') !== -1 && slug && last.endsWith('.html')) return { type: 'project-detail', slug: slug };
    if (segments[segments.length - 2] === 'experience' && (last === 'index.html' || last === '')) return { type: 'experience-list' };
    if (segments.indexOf('experience') !== -1 && slug && last.endsWith('.html')) return { type: 'experience-detail', slug: slug };
    if (last === 'skills.html' || path.endsWith('/skills.html')) return { type: 'skills' };
    if (last === 'education.html' || path.endsWith('/education.html')) return { type: 'education' };
    if (segments[segments.length - 2] === 'service' && (last === 'index.html' || last === '')) return { type: 'service-list' };
    if (segments.indexOf('service') !== -1 && slug && last.endsWith('.html')) return { type: 'service-detail', slug: slug };
    if (last === 'contact.html' || path.endsWith('/contact.html')) return { type: 'contact' };
    return { type: 'unknown' };
  }

  function applyGlobal(site) {
    var resumeBtn = document.querySelector('.nav-resume-btn');
    if (resumeBtn && site.resumePath) resumeBtn.setAttribute('href', basePath + site.resumePath);
    var footer = document.querySelector('.footer');
    if (footer && site.name) {
      var currentYear = new Date().getFullYear();
      var email = site.email || '';
      var linkedIn = site.linkedIn || '';
      var linkedInLabel = site.linkedInLabel || '';
      var github = site.github || '';
      var githubLabel = site.githubLabel || '';
      var titleLine = site.title || '';
      var resumeHref = site.resumePath ? (basePath + site.resumePath) : '';
      footer.innerHTML =
        '<div class="footer-inner">' +
          '<div class="footer-main">' +
            '<div class="footer-col footer-left">' +
              '<div class="footer-brand">' +
                '<span class="footer-name">' + escapeHtml(site.name) + '</span>' +
                (titleLine ? '<span class="footer-role">' + escapeHtml(titleLine) + '</span>' : '') +
              '</div>' +
            '</div>' +
            '<div class="footer-col footer-center">' +
              '<nav class="footer-nav" aria-label="Footer navigation">' +
                '<a href="' + basePath + 'index.html">Home</a>' +
                '<a href="' + basePath + 'experience/index.html">Experiences</a>' +
                '<a href="' + basePath + 'projects/index.html">Projects</a>' +
                '<a href="' + basePath + 'skills.html">Skills</a>' +
                '<a href="' + basePath + 'education.html">Education</a>' +
                '<a href="' + basePath + 'service/index.html">Service</a>' +
                '<a href="' + basePath + 'contact.html">Contact</a>' +
              '</nav>' +
            '</div>' +
            '<div class="footer-col footer-right">' +
              (email ? '<a href="mailto:' + escapeHtml(email) + '">Email</a>' : '') +
              (linkedIn ? '<a href="' + escapeHtml(linkedIn) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(linkedInLabel || "LinkedIn") + '</a>' : '') +
              (github ? '<a href="' + escapeHtml(github) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(githubLabel || "GitHub") + '</a>' : '') +
              (resumeHref ? '<a href="' + resumeHref + '" target="_blank" rel="noopener noreferrer">Résumé (PDF)</a>' : '') +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<span class="footer-copy">&copy; ' + currentYear + ' ' + escapeHtml(site.name) + '</span>' +
          '</div>' +
        '</div>';
    }
    var titleSuffix = ' – ' + site.name;
    var titleEl = document.querySelector('title');
    if (titleEl && titleEl.textContent.indexOf(titleSuffix) === -1 && titleEl.textContent.indexOf(site.name) === -1)
      titleEl.textContent = titleEl.textContent.trim() + titleSuffix;
  }

  function renderHeroInner(site) {
    var imgSrc = basePath + (site.profileImage || 'assets/img/Headshot.jpg');
    return '<div class="hero-bg"></div><div class="hero-bg-grid" aria-hidden="true"></div>' +
      '<section class="hero">' +
      '<div class="hero-left">' +
      '<h1>' + escapeHtml(site.name) + '</h1>' +
      (site.badge ? '<p class="hero-badge"><span class="badge">' + escapeHtml(site.badge) + '</span></p>' : '') +
      '<p class="hero-title">' + escapeHtml(site.title) + '</p>' +
      '<p class="hero-description">' + escapeHtml(site.intro) + '</p>' +
      '<div class="hero-buttons">' +
      '<a href="' + basePath + 'projects/index.html" class="primary-btn">View Projects</a> ' +
      '<a href="' + basePath + site.resumePath + '" class="details-btn" target="_blank" rel="noopener">Download Resume</a>' +
      '</div></div>' +
      '<div class="hero-right"><img src="' + imgSrc + '" alt="' + escapeHtml(site.name) + '" class="hero-image"></div>' +
      '</section>';
  }

  function renderHero(site) {
    return '<section class="hero-wrap reveal">' + renderHeroInner(site) + '</section>';
  }

  function renderTechStackMatrix(stack) {
    var raw = (stack && stack.items) ? stack.items : [];
    var items = raw.filter(function (item) {
      var name = item && item.name ? String(item.name).trim() : '';
      var file = item && item.file ? String(item.file).trim() : '';
      return name && file;
    });
    shuffleArray(items);
    var totalCells = 20;
    var padded = items.slice(0, totalCells);
    while (padded.length < totalCells) { padded.push(null); }
    var html = '<div class="tech-stack-grid tech-stack-matrix reveal-stagger">';
    padded.forEach(function (item) {
      if (!item) {
        html += '<div class="tech-stack-tile tech-stack-tile-empty" aria-hidden="true">' +
          '<div class="tech-stack-tile-surface"><div class="tech-stack-icon"></div></div></div>';
        return;
      }
      var file = String(item.file).trim();
      var name = String(item.name).trim();
      var displayName = item.displayName ? String(item.displayName).trim() : name;
      var description = item && item.description ? String(item.description) : '';
      var iconPath = file.indexOf('/') === -1 ? ('assets/img/techstack/' + file) : file;
      var ariaLabel = description ? (displayName + ' — ' + description) : displayName;
      var removeTile = "var t=this.closest('.tech-stack-tile');if(t)t.remove();";

      html += '<div class="tech-stack-tile" role="img" aria-label="' + escapeHtml(ariaLabel) + '" tabindex="0" data-name="' + escapeHtml(displayName) + '">' +
        '<div class="tech-stack-tile-surface">' +
        '<div class="tech-stack-icon">' +
        '<img src="' + basePath + iconPath + '" alt="" role="presentation" onerror="' + removeTile + '">' +
        '</div></div></div>';
    });
    html += '</div>' +
      '<div class="tech-stack-side">' +
      '<p class="tech-stack-active-name" data-default="Hover a tool icon" aria-live="polite">Hover a tool icon</p>' +
      '</div>';
    return html;
  }

  function renderHeroWithTechStack(site, stack) {
    var heading = (site && site.techStackHeading) ? site.techStackHeading : 'Tech Stack';
    return '<section class="hero-and-tech reveal">' +
      '<div class="hero-panel">' +
      '<div class="hero-wrap">' + renderHeroInner(site) + '</div>' +
      '</div>' +
      '<div class="tech-stack-panel">' +
      '<h2 class="section-title tech-stack-title">' + escapeHtml(heading) + '</h2>' +
      renderTechStackMatrix(stack) +
      '</div>' +
      '</section>';
  }

  function shuffleArray(arr) {
    var i = arr.length, j, t;
    while (i) {
      j = Math.floor(Math.random() * i--);
      t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function renderTechStackSection(site, stack) {
    var items = (stack && stack.items) ? stack.items.slice() : [];
    shuffleArray(items);
    var heading = (site && site.techStackHeading) ? site.techStackHeading : 'Tech Stack';
    var subheading = (site && site.techStackSubheading) ? site.techStackSubheading : 'Languages, frameworks, and tools I use to build production systems.';
    var html = '<section class="section tech-stack-section section-alt reveal">' +
      '<div class="section-inner">' +
      '<h2 class="section-title tech-stack-title">' + escapeHtml(heading) + '</h2>' +
      '<p class="tech-stack-subheading">' + escapeHtml(subheading) + '</p>' +
      '<div class="tech-stack-grid reveal-stagger">';
    items.forEach(function (item) {
      var file = item && item.file ? String(item.file).trim() : '';
      if (!file) return;
      var name = item && item.name ? String(item.name) : '';
      var displayName = item && item.displayName ? String(item.displayName) : name;
      var description = item && item.description ? String(item.description) : '';
      var iconPath = file.indexOf('/') === -1 ? ('assets/img/techstack/' + file) : file;
      var ariaLabel = description ? (displayName + ' — ' + description) : displayName;
      var removeTile = "var t=this.closest('.tech-stack-tile');if(t)t.remove();";

      html += '<div class="tech-stack-tile" role="img" aria-label="' + escapeHtml(ariaLabel) + '" tabindex="0">' +
        '<div class="tech-stack-tile-surface">' +
        '<div class="tech-stack-icon">' +
        '<img src="' + basePath + iconPath + '" alt="' + escapeHtml(displayName) + '" onerror="' + removeTile + '">' +
        '</div></div>' +
        '<span class="tech-stack-hover-label">' + escapeHtml(displayName) + '</span>' +
        '</div>';
    });
    html += '</div>' +
      '<p class="tech-stack-cta">' +
      '<a href="' + basePath + 'skills.html" class="details-btn">View full skills &amp; certifications</a></p>' +
      '</div></section>';
    return html;
  }

  function renderHighlightCard(item, type, base) {
    var title = type === 'experience' ? (item.role + ' — ' + item.organization) : item.title;
    var meta = type === 'experience' ? (item.organization + ' · ' + item.dateRange) : (item.subtitle || item.year || '');
    var desc = type === 'experience' ? item.summary : item.shortDescription;
    var tags = renderTags(item.technologies, base);
    var slug = item.slug ? String(item.slug).trim() : '';
    var href = slug ? (type === 'experience' ? base + 'experience/' + slug + '.html' : base + 'projects/' + slug + '.html') : '';
    var inner = '<h2>' + escapeHtml(title) + '</h2>' +
      '<p class="meta">' + escapeHtml(meta) + '</p>' +
      '<p>' + escapeHtml(desc) + '</p>' +
      (tags ? '<div class="tags-wrap">' + tags + '</div>' : '');
    if (href) {
      return '<a href="' + escapeHtml(href) + '" class="card card-link highlight-card">' + inner + '</a>';
    }
    return '<div class="card highlight-card">' + inner + '</div>';
  }

  function renderHighlights(site, experiences, projects) {
    var expId = (site.featuredExperienceIds || [])[0];
    var exp = (experiences.experiences || []).find(function (e) { return e.slug === expId; });
    var projIds = site.featuredProjectIds || [];
    var projList = (projects.projects || []).filter(function (p) { return projIds.indexOf(p.slug) !== -1; }).slice(0, 2);
    var html = '<section class="section highlights-section reveal"><h2 class="section-title">Featured Experience</h2><div class="grid highlights-grid reveal-stagger">';
    if (exp) html += renderHighlightCard(exp, 'experience', basePath);
    projList.forEach(function (p) { html += renderHighlightCard(p, 'project', basePath); });
    return html + '</div></section>';
  }

  function renderProjectCards(projects) {
    var list = projects.projects || [];
    var html = '<div class="projects-grid reveal-stagger">';
    list.forEach(function (p) {
      var img = p.heroImage ? '<div class="project-card-media"><img src="' + basePath + p.heroImage + '" alt="' + escapeHtml(p.title) + '"></div>' : '';
      html += '<a href="' + basePath + 'projects/' + p.slug + '.html" class="project-card">' +
        img +
        '<div class="project-card-body">' +
        '<h2>' + escapeHtml(p.title) + '</h2>' +
        '<p class="meta">' + escapeHtml(p.subtitle) + '</p>' +
        '<p>' + escapeHtml(p.shortDescription) + '</p>' +
        '<div class="tags">' + renderTags(p.technologies, basePath) + '</div>' +
        '<span class="details-btn">View Details</span>' +
        '</div></a>';
    });
    return html + '</div>';
  }

  function renderProjectDetail(project) {
    var html = '<header class="detail-page-header project-header reveal">' +
      '<h1>' + escapeHtml(project.title) + '</h1>' +
      '<p class="meta">' + escapeHtml(project.year || '') + '</p>' +
      '<div class="tags-wrap">' + renderTags(project.technologies, basePath) + '</div></header>';
    if (project.heroImage) {
      html += '<section class="project-hero reveal">' +
        '<img src="' + basePath + project.heroImage + '" alt="' + escapeHtml(project.title) + '">' +
        (project.heroCaption ? '<p class="media-caption">' + escapeHtml(project.heroCaption) + '</p>' : '') +
        '</section>';
    }
    (project.sections || []).forEach(function (sec) {
      html += '<section class="project-section reveal"><h2>' + escapeHtml(sec.title) + '</h2>';
      if (sec.paragraphs) sec.paragraphs.forEach(function (para) { html += '<p>' + escapeHtml(para) + '</p>'; });
      if (sec.list) {
        html += '<ul>';
        sec.list.forEach(function (li) { html += '<li>' + escapeHtml(li) + '</li>'; });
        html += '</ul>';
      }
      if (sec.images && sec.images.length) {
        html += '<div class="feature-grid">';
        sec.images.forEach(function (img) {
          html += '<figure><img src="' + basePath + img.src + '" alt="' + escapeHtml(img.alt) + '">' +
            (img.caption ? '<figcaption>' + escapeHtml(img.caption) + '</figcaption>' : '') + '</figure>';
        });
        html += '</div>';
      }
      html += '</section>';
    });
    return html;
  }

  function renderExperienceCards(experiences) {
    var list = experiences.experiences || [];
    var html = '<div class="timeline reveal-stagger">';
    list.forEach(function (e) {
      var title = e.role + ' – ' + e.organization;
      var meta = e.dateRange + (e.location ? ' · ' + e.location : '');
      html += '<div class="experience-card">' +
        '<h2>' + escapeHtml(title) + '</h2>' +
        '<p class="meta">' + escapeHtml(meta) + '</p>' +
        (e.technologies && e.technologies.length ? '<div class="tags-wrap">' + renderTags(e.technologies, basePath) + '</div>' : '') +
        '<a class="details-btn" href="' + basePath + 'experience/' + e.slug + '.html">View role details</a></div>';
    });
    html += '</div>';
    if (experiences.earlierWork && experiences.earlierWork.length) {
      html += '<section class="earlier-experience reveal"><h2>Earlier Work Experience</h2><ul>';
      experiences.earlierWork.forEach(function (w) {
        html += '<li><strong>' + escapeHtml(w.organization) + '</strong> — ' + escapeHtml(w.role) + ' (' + escapeHtml(w.dateRange) + ')</li>';
      });
      html += '</ul></section>';
    }
    return html;
  }

  function renderExperienceDetail(exp) {
    var html = '<header class="detail-page-header reveal">';
    if (exp.logoPath) html += '<img src="' + basePath + exp.logoPath + '" class="detail-logo" alt="' + escapeHtml(exp.logoAlt || exp.organization) + '">';
    html += '<h1>' + escapeHtml(exp.role + ' – ' + exp.organization) + '</h1>' +
      '<p class="meta">' + escapeHtml(exp.dateRange + (exp.location ? ' · ' + exp.location : '')) + '</p>' +
      '<div class="tags-wrap">' + renderTags(exp.technologies, basePath) + '</div></header>';
    (exp.sections || []).forEach(function (sec) {
      html += '<section class="project-section reveal"><h2>' + escapeHtml(sec.title) + '</h2>';
      if (sec.overviewLink && sec.paragraphs && sec.paragraphs[0]) {
        html += '<p><a href="' + escapeHtml(sec.overviewLink.url) + '" class="inline-link" target="_blank" rel="noopener noreferrer">' + escapeHtml(sec.overviewLink.text) + '</a> ' + escapeHtml(sec.paragraphs[0]) + '</p>';
        sec.paragraphs.slice(1).forEach(function (p) { html += '<p>' + escapeHtml(p) + '</p>'; });
      } else if (sec.paragraphs) {
        sec.paragraphs.forEach(function (p) { html += '<p>' + escapeHtml(p) + '</p>'; });
      }
      if (sec.list) {
        html += '<ul>';
        sec.list.forEach(function (li) { html += '<li>' + escapeHtml(li) + '</li>'; });
        html += '</ul>';
      }
      html += '</section>';
    });
    return html;
  }

  function formatSkillItem(item) {
    if (typeof item !== 'string') return escapeHtml(String(item));
    return escapeHtml(item).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function renderSkillsPage(skills) {
    var html = '<div class="skills-grid reveal-stagger">';
    (skills.categories || []).forEach(function (cat) {
      html += '<div class="skills-category card">' +
        '<h2>' + escapeHtml(cat.name) + '</h2>' +
        (cat.meta ? '<p class="meta">' + escapeHtml(cat.meta) + '</p>' : '') +
        (cat.description ? '<p>' + escapeHtml(cat.description) + '</p>' : '') +
        (cat.items && cat.items.length ? '<ul>' + cat.items.map(function (i) { return '<li>' + formatSkillItem(i) + '</li>'; }).join('') + '</ul>' : '') +
        '</div>';
    });
    if (skills.certifications && skills.certifications.length) {
      html += '<section class="certifications-section reveal"><h2 class="section-title">Certifications</h2>';
      skills.certifications.forEach(function (c) {
        html += '<div class="skills-category card"><h2>' + escapeHtml(c.name) + '</h2>' +
          (c.meta ? '<p class="meta">' + escapeHtml(c.meta) + '</p>' : '') +
          (c.description ? '<p>' + escapeHtml(c.description) + '</p>' : '');
        if (c.link && c.link.href) {
          var certHref = basePath + String(c.link.href).trim();
          var certText = c.link.text ? String(c.link.text).trim() : 'View Certificate';
          html += '<p><a class="details-btn" href="' + escapeHtml(certHref) + '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(certText) + '</a></p>';
        }
        html += '</div>';
      });
      html += '</section>';
    }
    return html + '</div>';
  }

  function renderEducation(education) {
    var html = '<div class="grid reveal-stagger">';
    (education.entries || []).forEach(function (ent) {
      html += '<div class="card">' +
        '<h2>' + escapeHtml(ent.title) + '</h2>' +
        (ent.meta ? '<p class="meta">' + escapeHtml(ent.meta) + '</p>' : '') +
        (ent.description ? '<p>' + escapeHtml(ent.description) + '</p>' : '') +
        (ent.list ? '<ul>' + ent.list.map(function (i) { return '<li>' + formatSkillItem(i) + '</li>'; }).join('') + '</ul>' : '');
      if (ent.subsections) {
        ent.subsections.forEach(function (sub) {
          html += '<h3>' + escapeHtml(sub.title) + '</h3>' +
            (sub.list ? '<ul>' + sub.list.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>' : '');
        });
      }
      html += '</div>';
    });
    return html + '</div>';
  }

  function renderServiceList(service) {
    var html = '<div class="timeline reveal-stagger">';
    (service.entries || []).forEach(function (ent) {
      html += '<div class="experience-card">' +
        '<h2>' + escapeHtml(ent.title) + '</h2>' +
        '<p class="meta">' + escapeHtml(ent.meta) + '</p>' +
        (ent.summary ? '<p>' + escapeHtml(ent.summary) + '</p>' : '') +
        (ent.slug ? '<a class="details-btn" href="' + basePath + 'service/' + ent.slug + '.html">View Details</a>' : '') +
        '</div>';
    });
    return html + '</div>';
  }

  function renderServiceDetail(entry) {
    var d = entry.detail || {};
    var html = '<header class="page-header reveal"><h1>' + escapeHtml(d.title || entry.title) + '</h1>' +
      (d.subtitle ? '<p class="subtitle">' + escapeHtml(d.subtitle) + '</p>' : '') + '</header>' +
      '<div class="timeline reveal-stagger">';
    (d.sections || []).forEach(function (sec) {
      html += '<div class="experience-card">' +
        '<h2>' + escapeHtml(sec.title) + '</h2>' +
        (sec.meta ? '<p class="meta">' + escapeHtml(sec.meta) + '</p>' : '') +
        (sec.paragraphs ? sec.paragraphs.map(function (p) { return '<p>' + escapeHtml(p) + '</p>'; }).join('') : '') +
        (sec.list ? '<ul>' + sec.list.map(function (li) { return '<li>' + escapeHtml(li) + '</li>'; }).join('') + '</ul>' : '') +
        '</div>';
    });
    return html + '</div>';
  }

  function renderContact(contact, site) {
    var resumeHref = basePath + (site.resumePath || '');
    var html = '<section class="contact-section"><div class="contact-grid reveal-stagger">';
    (contact.methods || []).forEach(function (m) {
      html += '<div class="card contact-card">';
      html += '<h2>' + escapeHtml(m.title) + '</h2>';
      if (m.meta) html += '<p class="contact-card-meta">' + escapeHtml(m.meta) + '</p>';
      if (m.link) {
        var target = m.link.href.indexOf('mailto:') === 0 ? '' : ' target="_blank" rel="noopener noreferrer"';
        html += '<a class="contact-link" href="' + escapeHtml(m.link.href) + '"' + target + '>' + escapeHtml(m.link.text) + '</a>';
      }
      if (m.content && !m.link) html += '<p class="contact-card-body">' + escapeHtml(m.content) + '</p>';
      if (m.cta) html += '<a class="primary-btn contact-cta" href="' + escapeHtml(resumeHref) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(m.cta.text) + '</a>';
      html += '</div>';
    });
    return html + '</div></section>';
  }

  function renderPageHeader(title, subtitle) {
    return '<header class="page-header reveal">' +
      '<h1>' + escapeHtml(title) + '</h1>' +
      (subtitle ? '<p class="subtitle">' + escapeHtml(subtitle) + '</p>' : '') + '</header>';
  }

  function run() {
    getPaths();
    var page = getPageType();
    var root = document.getElementById('content-root');
    if (!root) return;

    fetchJSON(dataPath + 'site.json').then(function (site) {
      applyGlobal(site);

      if (page.type === 'home') {
        Promise.all([
          fetchJSON(dataPath + 'techstack.json'),
          fetchJSON(dataPath + 'projects.json'),
          fetchJSON(dataPath + 'experience.json')
        ]).then(function (arr) {
          var techstack = arr[0], projects = arr[1], experience = arr[2];
          root.innerHTML = '<div class="landing-section">' + renderHeroWithTechStack(site, techstack) + '<hr class="landing-sep">' + renderHighlights(site, experience, projects) + '</div>';
          if (typeof window.initReveal === 'function') window.initReveal();
          if (typeof window.initSkillTiles === 'function') window.initSkillTiles();
          if (typeof window.initTechStackHighlight === 'function') window.initTechStackHighlight();
        }).catch(function (err) { console.error(err); });
        return;
      }

      if (page.type === 'projects-list') {
        fetchJSON(dataPath + 'projects.json').then(function (data) {
          root.innerHTML = renderPageHeader('Projects', site.pageSubtitles && site.pageSubtitles.projects) +
            renderProjectCards(data);
          if (window.initReveal) window.initReveal();
        }).catch(function (err) { console.error(err); });
        return;
      }

      if (page.type === 'project-detail' && page.slug) {
        fetchJSON(dataPath + 'projects.json').then(function (data) {
          var project = (data.projects || []).find(function (p) { return p.slug === page.slug; });
          if (project) {
            root.innerHTML = renderProjectDetail(project);
            document.querySelector('title').textContent = project.title + ' – ' + site.name;
          }
          if (window.initReveal) window.initReveal();
        }).catch(function (err) { console.error(err); });
        return;
      }

      if (page.type === 'experience-list') {
        fetchJSON(dataPath + 'experience.json').then(function (data) {
          root.innerHTML = renderPageHeader('Experiences', site.pageSubtitles && site.pageSubtitles.experience) +
            renderExperienceCards(data);
          if (window.initReveal) window.initReveal();
        }).catch(function (err) { console.error(err); });
        return;
      }

      if (page.type === 'experience-detail' && page.slug) {
        fetchJSON(dataPath + 'experience.json').then(function (data) {
          var exp = (data.experiences || []).find(function (e) { return e.slug === page.slug; });
          if (exp) {
            root.innerHTML = renderExperienceDetail(exp);
            document.querySelector('title').textContent = exp.role + ' – ' + exp.organization + ' – ' + site.name;
          }
          if (window.initReveal) window.initReveal();
        }).catch(function (err) { console.error(err); });
        return;
      }

      if (page.type === 'skills') {
        fetchJSON(dataPath + 'skills.json').then(function (data) {
          root.innerHTML = renderPageHeader('Skills', site.pageSubtitles && site.pageSubtitles.skills) +
            renderSkillsPage(data);
          if (window.initReveal) window.initReveal();
        }).catch(function (err) { console.error(err); });
        return;
      }

      if (page.type === 'education') {
        fetchJSON(dataPath + 'education.json').then(function (data) {
          root.innerHTML = renderPageHeader('Education', site.pageSubtitles && site.pageSubtitles.education) +
            renderEducation(data);
          if (window.initReveal) window.initReveal();
        }).catch(function (err) { console.error(err); });
        return;
      }

      if (page.type === 'service-list') {
        fetchJSON(dataPath + 'service.json').then(function (data) {
          root.innerHTML = renderPageHeader('Service & Leadership', site.pageSubtitles && site.pageSubtitles.service) +
            renderServiceList(data);
          if (window.initReveal) window.initReveal();
        }).catch(function (err) { console.error(err); });
        return;
      }

      if (page.type === 'service-detail' && page.slug) {
        fetchJSON(dataPath + 'service.json').then(function (data) {
          var entry = (data.entries || []).find(function (e) { return e.slug === page.slug; });
          if (entry) {
            root.innerHTML = renderServiceDetail(entry);
            document.querySelector('title').textContent = (entry.detail && entry.detail.title) || entry.title + ' – ' + site.name;
          }
          if (window.initReveal) window.initReveal();
        }).catch(function (err) { console.error(err); });
        return;
      }

      if (page.type === 'contact') {
        fetchJSON(dataPath + 'contact.json').then(function (contactData) {
          root.innerHTML = '<div class="contact-page">' +
            renderPageHeader('Contact', site.pageSubtitles && site.pageSubtitles.contact) +
            renderContact(contactData, site) + '</div>';
          if (window.initReveal) window.initReveal();
        }).catch(function (err) { console.error(err); });
        return;
      }
    }).catch(function (err) { console.error(err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
