/* ==========================================================================
   PORTFOLIO BTS SIO SLAM — NEME
   Moteur JavaScript :
   - Thème Clair / Sombre (LocalStorage)
   - Navigation & Menu Mobile
   - Onglets Parcours & BTS SIO
   - Filtre par catégorie de projets
   - Formulaire de Contact interactif
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initAboutTabs();
  initProjectFilters();
  initContactForm();
});

/* ==========================================================================
   1. GESTION DU THÈME (CLAIR / SOMBRE)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('miku_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem('miku_theme', currentTheme);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggleBtn) {
      toggleBtn.title = theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre';
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    }
  }
}

/* ==========================================================================
   2. NAVIGATION & MENU MOBILE
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navlinks = document.getElementById('navlinks');
  const links = document.querySelectorAll('.navlinks a');

  if (mobileToggle && navlinks) {
    mobileToggle.addEventListener('click', () => {
      navlinks.classList.toggle('open');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navlinks.classList.remove('open');
      });
    });
  }

  // Multi-page active URL matching
  const currentPath = window.location.pathname.toLowerCase();
  let currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  if (!currentFile || currentFile === '') {
    currentFile = 'index.html';
  }

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.toLowerCase().split('#')[0].split('?')[0];
    if (cleanHref === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. ONGLETS SECTION À PROPOS & PARCOURS
   ========================================================================== */
function initAboutTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. FILTRES DE PROJETS
   ========================================================================== */
function initProjectFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  const projects = document.querySelectorAll('.project-item');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      projects.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.split(' ').includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. FORMULAIRE DE CONTACT (FORMSPREE)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('c-name');
    const name = nameInput ? nameInput.value.trim() : '';
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';

    feedback.className = 'form-feedback';
    feedback.textContent = '';
    feedback.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
        feedback.innerHTML = `✅ <strong>Votre message a bien été envoyé !</strong><br>Merci ${name ? name : ''}, je vous répondrai dans les plus brefs délais.`;
        form.reset();
      } else {
        const result = await response.json().catch(() => null);
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
        if (result && result.errors && result.errors.length > 0) {
          feedback.textContent = result.errors.map(err => err.message).join(', ');
        } else {
          feedback.textContent = "Une erreur est survenue lors de l'envoi. Veuillez vérifier vos informations et réessayer.";
        }
      }
    } catch (err) {
      feedback.className = 'form-feedback error';
      feedback.style.display = 'block';
      feedback.textContent = "Impossible de joindre le serveur d'envoi. Vérifiez votre connexion internet.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
