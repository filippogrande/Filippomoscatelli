/**
 * print-cv.js — renderizza il CV in formato stampa A4.
 *
 * Non duplica i contenuti: riusa le stesse fonti del sito.
 *  - testi e titoli: `translations` da js/language.v2.js
 *  - competenze: il blocco .skills-grid di index.html
 *  - esperienze e progetti: data/work*.json, data/projects*.json
 *
 * Al termine imposta window.PRINT_READY = true (usato da scripts/generate-pdfs.mjs).
 */

(function () {
  'use strict';

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

  function section(titleKey, fallbackTitle) {
    var s = el('section', 'cv-section');
    s.appendChild(el('h2', 'cv-section__title', tr(titleKey, fallbackTitle)));
    return s;
  }

  function monthLabel(ym) {
    if (!ym) return '';
    var parts = String(ym).split('-');
    var y = parts[0];
    var m = parseInt(parts[1] || '1', 10);
    var it = ['', 'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    var en = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var names = lang === 'en' ? en : it;
    return names[m] + ' ' + y;
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

    var left = el('div', 'cv-header__left');
    left.appendChild(el('div', 'cv-header__name', 'Filippo Moscatelli'));
    left.appendChild(el('div', 'cv-header__role', tr('job-title', '')));

    var contacts = el('div', 'cv-header__contacts');
    var email = el('div');
    email.textContent = 'contact@mail.filippomoscatelli.com';
    var place = el('div', null, tr('location', ''));
    var links = el('div');
    links.textContent = 'linkedin.com/in/filippo-moscatelli-52b566202';
    var gh = el('div', null, 'github.com/filippogrande');
    contacts.appendChild(email);
    contacts.appendChild(place);
    contacts.appendChild(links);
    contacts.appendChild(gh);

    header.appendChild(left);
    header.appendChild(contacts);
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
        var place = el('span', 'cv-entry__place', ' · ' + w.location + (w.modality ? ' (' + w.modality + ')' : ''));
        org.appendChild(place);
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

  function buildSkills(grid) {
    var s = section('skills-title', 'Competenze');
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

      var row = el('div', 'cv-skill-row');
      row.appendChild(el('div', 'cv-skill-row__cat', catName));
      row.appendChild(el('div', 'cv-skill-row__items', items.join(', ')));
      s.appendChild(row);
    });

    return s;
  }

  function buildProjects(projects) {
    var s = section('projects-title', 'Progetti');
    projects.forEach(function (p) {
      var item = el('div', 'cv-project');
      var title = el('div', 'cv-project__title', p.title || '');
      if (p.startDate) title.appendChild(el('span', 'cv-project__period', '  (' + period(p.startDate, p.endDate) + ')'));
      item.appendChild(title);
      if (p.tech && p.tech.length) item.appendChild(el('div', 'cv-project__tech', p.tech.join(' · ')));
      if (p.description) item.appendChild(el('div', 'cv-project__desc', p.description));
      s.appendChild(item);
    });
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
    var wrap = el('div', 'cv-langs');

    function langItem(nameKey, levelKey, fallbackName) {
      var item = el('div', 'cv-lang');
      item.appendChild(el('span', 'cv-lang__name', tr(nameKey, fallbackName) + ': '));
      item.appendChild(el('span', 'cv-lang__level', tr(levelKey, '')));
      return item;
    }

    wrap.appendChild(langItem('italian-title', 'native-level', 'Italiano'));
    wrap.appendChild(langItem('english-title', 'b2-level', 'Inglese'));
    s.appendChild(wrap);
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

        root.appendChild(buildHeader());
        root.appendChild(buildAbout());
        root.appendChild(buildWork(work));
        root.appendChild(buildSkills(skillsGrid));
        root.appendChild(buildProjects(projects));
        root.appendChild(buildEducation());
        root.appendChild(buildVolunteer());
        root.appendChild(buildLanguages());

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
