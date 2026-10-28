/**
 * print-cv.js — renderizza il CV in formato stampa A4.
 *
 * Non duplica i contenuti: riusa le stesse fonti del sito.
 *  - testi e titoli: `translations` da js/language.v2.js
 *  - competenze: il blocco .skills-grid di index.html
 *  - esperienze e progetti: data/work*.json, data/projects*.json
 *
 * Ordine: header → Chi Sono → Competenze (3 colonne) → flusso a due colonne,
 * con priorita' per sezione in FLOW.
 *
 * Al termine imposta window.PRINT_READY = true (usato da scripts/generate-pdfs.mjs).
 */

(function () {
  'use strict';

  var AVATAR = 'https://avatars.githubusercontent.com/u/35425860?s=400&u=67f3f62f5d202537c1fed54db800531662db392a&v=4';
  var SITE = 'https://filippomoscatelli.com';
  var LINKEDIN = 'https://www.linkedin.com/in/filippomoscatelli/';
  var GITHUB = 'https://github.com/filippogrande';
  var EMAIL = 'contact@mail.filippomoscatelli.com';

  // Nel PDF stanno solo i progetti piu' recenti: il taglio e' qui, non nel JSON
  // (il sito continua a mostrarli tutti).
  var PROJECT_LIMIT = 3;

  // Priorita' delle sezioni nel flusso a due colonne (piu' alto = piu' in alto).
  var FLOW = [
    { id: 'work', p: 10 },
    { id: 'projects', p: 9 },
    { id: 'volunteer', p: 8 },
    { id: 'education', p: 7 },
    { id: 'languages', p: 6 },
  ];

  // Icone in linea (nessuna CDN: il PDF si genera anche offline).
  var ICONS = {
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
    github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  };

  var params = new URLSearchParams(window.location.search);
  var lang = params.get('lang') === 'en' ? 'en' : 'it';
  var t = (typeof translations !== 'undefined' && translations[lang]) || {};

  function tr(key, fallback) {
    var v = t[key];
    return typeof v === 'string' && v.length > 0 ? v : (fallback || '');
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function link(text, href) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    return a;
  }

  function icon(name) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'cv-icon');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', ICONS[name]);
    path.setAttribute('fill', 'currentColor');
    svg.appendChild(path);
    return svg;
  }

  // I link nei JSON sono relativi al sito (es. /FoodDelivery/index.html):
  // nel PDF devono essere assoluti, altrimenti puntano a localhost.
  function absUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.indexOf('mailto:') === 0) return url;
    if (url.charAt(0) === '/') return SITE + url;
    return url;
  }

  function section(titleKey, fallbackTitle) {
    var s = el('section', 'cv-section');
    s.appendChild(el('h2', 'cv-section__title', tr(titleKey, fallbackTitle)));
    return s;
  }

  function monthLabel(ym) {
    if (!ym) return '';
    var parts = String(ym).split('-');
    var m = parseInt(parts[1] || '1', 10);
    var it = ['', 'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    var en = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var names = lang === 'en' ? en : it;
    return names[m] + ' ' + parts[0];
  }

  function period(start, end) {
    var out = monthLabel(start);
    if (end) return out + ' - ' + monthLabel(end);
    return out + ' - ' + (lang === 'en' ? 'Present' : 'Presente');
  }

  function monthsBetween(start, end) {
    if (!start) return 0;
    var sp = String(start).split('-');
    var sy = parseInt(sp[0], 10);
    var sm = parseInt(sp[1] || '1', 10);
    var ey, em;
    if (end) {
      var ep = String(end).split('-');
      ey = parseInt(ep[0], 10);
      em = parseInt(ep[1] || '1', 10);
    } else {
      var now = new Date();
      ey = now.getFullYear();
      em = now.getMonth() + 1;
    }
    return (ey - sy) * 12 + (em - sm) + 1;
  }

  function durationLabel(start, end) {
    var m = monthsBetween(start, end);
    if (!m) return '';
    if (m < 12) return m + ' ' + (lang === 'en' ? 'months' : 'mesi');
    var y = Math.floor(m / 12);
    var r = m % 12;
    var yLabel = lang === 'en' ? (y === 1 ? 'year' : 'years') : (y === 1 ? 'anno' : 'anni');
    if (r === 0) return y + ' ' + yLabel;
    return y + ' ' + yLabel + (lang === 'en' ? ' and ' : ' e ') + r + ' ' + (lang === 'en' ? 'months' : 'mesi');
  }

  function entryHead(title, periodText) {
    var head = el('div', 'cv-entry__head');
    head.appendChild(el('div', 'cv-entry__title', title));
    head.appendChild(el('div', 'cv-entry__period', periodText));
    return head;
  }

  function fetchJSON(path) {
    return fetch(path, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' su ' + path);
      return r.json();
    });
  }

  function fetchSkillsMarkup() {
    return fetch('index.html', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' su index.html');
      return r.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var grid = doc.querySelector('.skills-grid');
      if (!grid) throw new Error('Blocco .skills-grid non trovato in index.html');
      return grid;
    });
  }

  function contactItem(text, href, iconName) {
    var span = el('span', 'cv-header__contact');
    if (iconName) span.appendChild(icon(iconName));
    var label = el('span', 'cv-header__label');
    if (href) label.appendChild(link(text, href));
    else label.textContent = text;
    span.appendChild(label);
    return span;
  }

  function buildHeader() {
    var header = el('header', 'cv-header');

    var photo = el('div', 'cv-header__photo');
    var img = document.createElement('img');
    img.src = AVATAR;
    img.alt = 'Filippo Moscatelli';
    photo.appendChild(img);

    var info = el('div', 'cv-header__info');
    info.appendChild(el('div', 'cv-header__name', 'Filippo Moscatelli'));
    info.appendChild(el('div', 'cv-header__role', tr('job-title', '')));

    var contacts = el('div', 'cv-header__contacts');
    contacts.appendChild(contactItem(EMAIL, 'mailto:' + EMAIL));

    var place = tr('location', '');
    if (place) contacts.appendChild(contactItem(place, null, null));

    contacts.appendChild(contactItem('filippomoscatelli', LINKEDIN, 'linkedin'));
    contacts.appendChild(contactItem('filippogrande', GITHUB, 'github'));

    info.appendChild(contacts);
    header.appendChild(photo);
    header.appendChild(info);
    return header;
  }

  function buildAbout() {
    var s = section('about-title', 'Chi Sono');
    var p = el('p', 'cv-text');
    var html = tr('about-description', '').replace(/<br\s*\/?>/gi, ' ');
    p.textContent = html.replace(/\s+/g, ' ').trim();
    s.appendChild(p);
    return s;
  }

  function buildWork(work) {
    var s = section('work-title', 'Esperienza Professionale');
    work.forEach(function (w) {
      var e = el('div', 'cv-entry');
      e.appendChild(entryHead(w.role || '', period(w.startDate, w.endDate)));

      var org = el('div', 'cv-entry__org', w.company || '');
      if (w.location) {
        org.appendChild(el('span', 'cv-entry__place', ' · ' + w.location + (w.modality ? ' (' + w.modality + ')' : '')));
      }
      e.appendChild(org);

      var dur = durationLabel(w.startDate, w.endDate);
      if (dur) e.appendChild(el('div', 'cv-entry__place', dur));

      if (w.description) {
        var desc = String(w.description).replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
        e.appendChild(el('p', 'cv-entry__desc', desc));
      }

      if (w.tech && w.tech.length) {
        e.appendChild(el('div', 'cv-entry__tech', w.tech.join(', ')));
      }

      s.appendChild(e);
    });
    return s;
  }

  function shortUrl(url) {
    return String(absUrl(url))
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .replace(/\/index\.html$/, '');
  }

  function projectLinks(p) {
    var raw = [];
    if (Array.isArray(p.links) && p.links.length) {
      raw = p.links.map(function (l) {
        return { label: l.label || shortUrl(l.url), url: absUrl(l.url) };
      });
    } else if (p.link && p.link !== '#') {
      raw = [{ label: shortUrl(p.link), url: absUrl(p.link) }];
    }
    return raw.filter(function (l) { return l.url && l.url !== '#'; });
  }

  function buildProjects(projects) {
    var s = section('projects-title', 'Progetti');
    var list = el('div', 'cv-projects');

    projects.slice(0, PROJECT_LIMIT).forEach(function (p) {
      var card = el('div', 'cv-project');

      var title = el('div', 'cv-project__title', p.title || '');
      if (p.startDate) {
        title.appendChild(el('span', 'cv-project__period', '  ' + period(p.startDate, p.endDate)));
      }
      card.appendChild(title);

      if (p.tech && p.tech.length) {
        var chips = el('div', 'cv-project__chips');
        p.tech.forEach(function (tech) {
          chips.appendChild(el('span', 'cv-project__chip', tech));
        });
        card.appendChild(chips);
      }

      if (p.description) card.appendChild(el('div', 'cv-project__desc', p.description));

      var links = projectLinks(p);
      if (links.length) {
        var box = el('div', 'cv-project__links');
        links.forEach(function (l, i) {
          if (i > 0) box.appendChild(el('span', 'cv-project__sep', ' · '));
          box.appendChild(link(l.label, l.url));
        });
        card.appendChild(box);
      }

      list.appendChild(card);
    });

    s.appendChild(list);
    return s;
  }

  function buildSkills(grid) {
    var s = section('skills-title', 'Competenze');
    var wrap = el('div', 'cv-skills');
    var cats = grid.querySelectorAll('.skill-category');

    Array.prototype.forEach.call(cats, function (cat) {
      var h3 = cat.querySelector('h3');
      var list = cat.querySelectorAll('.skill-tag');
      if (!list.length) return;

      var catName = h3 ? (h3.getAttribute('data-key') ? tr(h3.getAttribute('data-key'), h3.textContent.trim()) : h3.textContent.trim()) : '';
      var items = [];
      Array.prototype.forEach.call(list, function (tag) {
        var key = tag.getAttribute('data-key');
        items.push(key ? tr(key, tag.textContent.trim()) : tag.textContent.trim());
      });

      var group = el('div', 'cv-skill');
      group.appendChild(el('div', 'cv-skill__cat', catName));
      group.appendChild(el('div', 'cv-skill__items', items.join(', ')));
      wrap.appendChild(group);
    });

    s.appendChild(wrap);
    return s;
  }

  function buildEducation() {
    var s = section('education-title', 'Istruzione');
    [1, 2].forEach(function (n) {
      var title = tr('education' + n + '-title', '');
      if (!title) return;
      var e = el('div', 'cv-entry');
      e.appendChild(entryHead(title, tr('education' + n + '-period', '')));
      e.appendChild(el('div', 'cv-entry__org', tr('education' + n + '-school', '')));
      var desc = tr('education' + n + '-description', '');
      if (desc) e.appendChild(el('p', 'cv-entry__desc', desc));
      s.appendChild(e);
    });
    return s;
  }

  function buildVolunteer() {
    var s = section('experience-title', 'Esperienza di Volontariato');
    [2, 1].forEach(function (n) {
      var title = tr('volunteer' + n + '-title', '');
      if (!title) return;
      var e = el('div', 'cv-entry');
      e.appendChild(entryHead(title, tr('volunteer' + n + '-period', '')));
      e.appendChild(el('div', 'cv-entry__org', tr('volunteer' + n + '-organization', '')));
      var desc = tr('volunteer' + n + '-description', '');
      if (desc) e.appendChild(el('p', 'cv-entry__desc', desc));
      s.appendChild(e);
    });
    return s;
  }

  function buildLanguages() {
    var s = section('languages-title', 'Lingue');

    function langItem(nameKey, levelKey, fallbackName) {
      var item = el('div', 'cv-lang');
      item.appendChild(el('span', 'cv-lang__name', tr(nameKey, fallbackName) + ': '));
      item.appendChild(el('span', 'cv-lang__level', tr(levelKey, '')));
      return item;
    }

    s.appendChild(langItem('italian-title', 'native-level', 'Italiano'));
    s.appendChild(langItem('english-title', 'b2-level', 'Inglese'));
    return s;
  }

  function fail(message) {
    document.documentElement.setAttribute('data-print-error', message);
    var box = el('p', 'cv-text', 'Errore nella generazione del CV: ' + message);
    document.getElementById('cv').appendChild(box);
    window.PRINT_READY = false;
    window.PRINT_ERROR = message;
  }

  function run() {
    document.documentElement.lang = lang;
    document.title = 'Filippo Moscatelli - CV (' + lang.toUpperCase() + ')';

    var root = document.getElementById('cv');
    var workFile = lang === 'en' ? 'data/work.en.json' : 'data/work.json';
    var projFile = lang === 'en' ? 'data/projects.en.json' : 'data/projects.json';

    Promise.all([fetchJSON(workFile), fetchJSON(projFile), fetchSkillsMarkup()])
      .then(function (res) {
        var work = res[0];
        var projects = res[1];
        var skillsGrid = res[2];

        var builders = {
          work: function () { return buildWork(work); },
          projects: function () { return buildProjects(projects); },
          volunteer: function () { return buildVolunteer(); },
          education: function () { return buildEducation(); },
          languages: function () { return buildLanguages(); },
        };

        root.appendChild(buildHeader());
        root.appendChild(buildAbout());
        root.appendChild(buildSkills(skillsGrid));

        var flow = el('div', 'cv-flow');
        FLOW.slice()
          .sort(function (a, b) { return b.p - a.p; })
          .forEach(function (item) {
            var node = builders[item.id]();
            node.setAttribute('data-section', item.id);
            flow.appendChild(node);
          });
        root.appendChild(flow);

        window.PRINT_READY = true;
      })
      .catch(function (err) {
        fail(err && err.message ? err.message : String(err));
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
