/**
 * Rangga Portfolio / TKJ.OS — Main Application Script
 */

import { initToolsTeaser } from './tools-teaser.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  loadPortfolioData();
  loadSkillsData();
  initToolsTeaser();
  initContactActions();
});

/**
 * Mobile Navigation Drawer
 */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('is-open');
    menuBtn.innerHTML = !isExpanded ? '&times;' : '&#9776;';
  });

  // Close when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '&#9776;';
    });
  });
}

/**
 * Load and render projects from data/portfolio.json
 */
async function loadPortfolioData() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    const response = await fetch('data/portfolio.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (!data.projects || data.projects.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
          <p style="color: var(--text-muted); font-family: var(--font-mono);">[ Tidak ada proyek aktif yang dimuat ]</p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.projects.map((proj) => `
      <article class="project-card" id="project-${proj.id}">
        <div class="project-card-header">
          <div>
            <span class="mono-tag" style="color: var(--accent-cyan); display: block; margin-bottom: 4px;">${escapeHtml(proj.category)}</span>
            <h3 class="project-title">${escapeHtml(proj.title)}</h3>
            <p class="project-tagline">${escapeHtml(proj.tagline)}</p>
          </div>
          <span class="project-badge-pill">${escapeHtml(proj.badge || 'Project')}</span>
        </div>

        <p class="project-summary">${escapeHtml(proj.summary)}</p>

        <div class="project-highlights-box">
          <div class="highlights-title">Karakteristik Kunci:</div>
          <ul class="highlights-list">
            ${(proj.highlights || []).map(h => `<li>${escapeHtml(h)}</li>`).join('')}
          </ul>
        </div>

        <div class="tech-stack-row" aria-label="Teknologi yang digunakan">
          ${(proj.stack || []).map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
        </div>

        <div class="project-card-actions">
          ${proj.links?.demo ? `
            <a href="${escapeHtml(proj.links.demo)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" aria-label="Buka web langsung ${escapeHtml(proj.title)}">
              <span>Buka Web / Live Demo</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          ` : ''}
          ${proj.links?.github ? `
            <a href="${escapeHtml(proj.links.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" aria-label="Lihat kode sumber ${escapeHtml(proj.title)} di GitHub">
              <span>Source Code</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          ` : ''}
        </div>
      </article>
    `).join('');

  } catch (err) {
    console.error('Gagal memuat data proyek:', err);
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 20px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: var(--radius-md); color: #fca5a5;">
        Gagal memuat daftar proyek. Pastikan file data/portfolio.json tersedia.
      </div>
    `;
  }
}

/**
 * Load and render skills domains from data/skills.json
 */
async function loadSkillsData() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  try {
    const response = await fetch('data/skills.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (!data.domains || data.domains.length === 0) return;

    const iconMap = {
      network: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
      server: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
      cable: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      code: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
    };

    container.innerHTML = data.domains.map((dom) => `
      <div class="skill-domain-card">
        <div class="domain-card-head">
          <div class="domain-icon-circle" aria-hidden="true">
            ${iconMap[dom.icon] || iconMap.code}
          </div>
          <div class="domain-title-group">
            <h3>${escapeHtml(dom.name)}</h3>
            <span class="domain-badge">${dom.status === 'curriculum_focus' ? 'Fokus Kurikulum TJKT' : 'Praktik & Pembuatan Proyek'}</span>
          </div>
        </div>

        <p class="domain-desc">${escapeHtml(dom.description)}</p>

        <div class="domain-items-wrap">
          ${(dom.items || []).map(item => `
            <div class="skill-item-chip">
              <span class="chip-dot" aria-hidden="true"></span>
              <span>${escapeHtml(item)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Gagal memuat data keahlian:', err);
  }
}

/**
 * Copy email action
 */
function initContactActions() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = 'ranggaazkalia62@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      const originalText = copyBtn.innerText;
      copyBtn.innerText = '✓ Email Tersalin!';
      setTimeout(() => {
        copyBtn.innerText = originalText;
      }, 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
