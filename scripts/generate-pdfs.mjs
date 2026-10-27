#!/usr/bin/env node

import puppeteer from 'puppeteer-core';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const readJSON = (rel) => JSON.parse(readFileSync(resolve(ROOT, rel), 'utf-8'));
const workIt = readJSON('data/work.json');
const workEn = readJSON('data/work.en.json');
const projectsIt = readJSON('data/projects.json');
const projectsEn = readJSON('data/projects.en.json');

const C = {
  it: {
    about: "Ciao, sono Filippo: QA engineer IoT e studente in Informatica per la Comunicazione Digitale. Tutti i giorni lavoro sui sistemi IoT di Haier Europe, in particolare sull'app hOn.",
    skills: [
      { t: 'Frontend', i: ['HTML5/CSS3', 'JavaScript', 'React', 'React Native', 'Bootstrap'] },
      { t: 'Backend', i: ['Node.js', 'Python', 'PHP', 'Java', 'Kotlin', 'C', 'Go'] },
      { t: 'Database', i: ['PostgreSQL'] },
      { t: 'Strumenti', i: ['Git/GitHub', 'Docker', 'VS Code', 'Linux', 'WordPress', 'Self-hosting', 'Cloudflare', 'Jira', 'Excel', 'PowerPoint', 'Word'] },
      { t: 'Competenze QA', i: ['Test funzionale', 'Mobile testing', 'Validazione requisiti', 'Test case design', 'Regression testing', 'Bug triage'] },
      { t: 'Competenze trasversali', i: ['Teamwork', 'Problem solving', 'Agile', 'Scrum'] },
    ],
    edu: [
      { t: 'Laurea in Informatica per la Comunicazione Digitale', s: 'Universita degli Studi di Milano', p: 'Set 2021 - in corso', d: 'Laurea triennale in Scienze e Tecnologie Informatiche con focus sulla comunicazione digitale.' },
      { t: 'Diploma di Liceo Scientifico - Scienze Applicate', s: 'Ettore Conti, Milano', p: '2016 - 2021', d: 'Diploma con specializzazione in scienze applicate e informatica.' },
    ],
    vol: [
      { t: 'Educatore Gruppo Adolescenti', o: 'Oratorio Santa Maria di Lourdes, Milano', p: 'Set 2026 - Presente', d: null },
      { t: 'Educatore Gruppo Medie', o: 'Oratorio Santa Maria di Lourdes, Milano', p: 'Set 2020 - Ago 2026', d: 'Educatore del percorso Medie: accompagnamento di un gruppo di ragazzi in un cammino di crescita.' },
    ],
    lang: [{ n: 'Italiano', l: 'Madrelingua' }, { n: 'Inglese', l: 'B2 (non certificato)' }],
    sec: { about: 'Chi Sono', work: 'Esperienza Professionale', skills: 'Competenze', projects: 'Progetti', edu: 'Istruzione', vol: 'Esperienza di Volontariato', lang: 'Lingue' },
    ms: 'mesi', ya: 'anno', ys: 'anni', pr: 'Presente', tc: 'Tech',
  },
  en: {
    about: "Hi, I'm Filippo: an IoT Quality Engineer and Computer Science for Digital Communication student. Every day I work on Haier Europe's IoT systems.",
    skills: [
      { t: 'Frontend', i: ['HTML5/CSS3', 'JavaScript', 'React', 'React Native', 'Bootstrap'] },
      { t: 'Backend', i: ['Node.js', 'Python', 'PHP', 'Java', 'Kotlin', 'C', 'Go'] },
      { t: 'Database', i: ['PostgreSQL'] },
      { t: 'Tools', i: ['Git/GitHub', 'Docker', 'VS Code', 'Linux', 'WordPress', 'Self-hosting', 'Cloudflare', 'Jira', 'Excel', 'PowerPoint', 'Word'] },
      { t: 'QA Skills', i: ['Functional testing', 'Mobile testing', 'Requirement validation', 'Test case design', 'Regression testing', 'Bug triage'] },
      { t: 'Soft skills', i: ['Teamwork', 'Problem solving', 'Agile', 'Scrum'] },
    ],
    edu: [
      { t: "Bachelor's Degree in Computer Science for Digital Communication", s: 'University of Milan', p: 'Sep 2021 - ongoing', d: "Bachelor's degree in Computer Science with focus on digital communication." },
      { t: 'High School Diploma - Applied Sciences', s: 'Ettore Conti, Milan', p: '2016 - 2021', d: 'Diploma with specialization in applied sciences.' },
    ],
    vol: [
      { t: 'High School Group Educator', o: 'Oratorio Santa Maria di Lourdes, Miln', p: 'Sep 2026 - Present', d: null },
      { t: 'Middlle School GroupEdcator', o: 'Oratorio Santa]n', p: 'Sep 2026 - Present', d: null },\n      { t: 'Middlle School GroupEdcator', o: 'Oratorio Santa] '
          + 'at the beginning, replace the rest with the actual content...'
      }
    ]
  }
}]