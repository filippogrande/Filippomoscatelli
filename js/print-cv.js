/**
 * print-cv.js — renderizza il CV in formato stampa A4.
 *
 * Non duplica i contenuti: riusa le stesse fonti del sito.
 *  - testi e titoli: `translations` da js/language.v2.js
 *  - competenze: il blocco .skills-grid di index.html
 *  - esperienze e progetti: data/work*.json, data/projects*.json
 *
 * Ordine: header → Chi Sono → Competenze (3 colonne) → flusso a due colonne.
 * Nel flusso ogni sezione ha una PRIORITA': il browser legge in quell'ordine
 * (riempie la prima colonna, poi la seconda) e bilancia solo le altezze.
 * Cambiare un numero in FLOW cambia l'ordine senza toccare il layout.
 *
 * Al termine imposta window.PRINT_READY = true (usato da scripts/generate-pdfs.mjs).
 */

(function () {
  'use strict';

  var AVATAR = 'https://avatars.githubusercontent.com/u/35425860?s=400&u=67f3f62f5d202537c1fed54db800531662db392a&v=4';
  var LINKEDIN = 'https://www.linkedin.com/in/filippo-moscatelli-52b566202/';
  var GITHUB = 'https://github.com/filippogrande';
  var EMAIL = 'contact@mail.filippomoscatelli.com';

  // Priorita' delle sezioni nel flusso a due colonne (piu' alto = piu' in alto).
  var FLOW = [
    { id: 'work', p: 10 },
    { id: 'projects', p: 9 },
    { id: 'volunteer', p: 8 },
    { id: 'education', p: 7 },
    { id: 'languages', p: 6 },
  ];

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

    var mail = el('span', 'cv-header__contact');
    mail.appendChild(link(EMAIL, 'mailto:' + EMAIL));
    contacts.appendChild(mail);

    var place = tr('location', '');
    if (place) contacts.appendChild(el('span', 'cv-header__contact', place));

    var li = el('span', 'cv-header__contact');
    li.appendChild(link('@filippo-moscatelli-52b566202', LINKEDIN));
    contacts.appendChild(li);

    var gh = el('span', 'cv-header__contact');
    gh.appendChild(link('@filippogrande', GITHUB));
    contacts.appendChild(gh);

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

  function projectLinks(p) {
    var raw = [];
    if (Array.isArray(p.links) && p.links.length) {
      raw = p.links.map(function (l) {
        return { label: l.label || shortUrl(l.url), url: l.url };
      });
    } else if (p.link && p.link !== '#') {
      raw = [{ label: shortUrl(p.link), url: p.link }];
    }
    return raw.filter(function (l) { return l.url && l.url !== '#'; });
  }

  function shortUrl(url) {
    return String(url)
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .replace(/\/index\.html$/, '');
  }

  function buildProjects(projects) {
    var s = section('projects-title', 'Progetti');
    var list = el('div', 'cv-projects');

    projects.forEach(function (p) {
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

        // Flusso unico a due colonne: ordine = priorita' decrescente, altezze
        // bilanciate dal motore di stampa (column-fill: balance).
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
