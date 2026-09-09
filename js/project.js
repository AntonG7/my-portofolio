// MonPortfolio — project.js

async function loadProject() {
    const container = document.getElementById('project-container');
    const slug = new URLSearchParams(window.location.search).get('slug');

    if (!slug) {
        container.innerHTML = '<p>Aucun projet spécifié.</p>';
        return;
    }

    try {
        const res = await fetch('data/projects.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const projects = await res.json();
        const project = projects.find(p => p.slug === slug);

        if (!project) {
            container.innerHTML = '<p>Projet non trouvé.</p>';
            return;
        }

        document.title = project.title + ' — Anthony Guignard';
        document.getElementById('og-title').setAttribute('content', project.title);
        document.getElementById('og-description').setAttribute('content', project.description);
        document.getElementById('twitter-title').setAttribute('content', project.title);
        document.getElementById('twitter-description').setAttribute('content', project.description);

        container.innerHTML = `
            <article class="article">
                <img src="${project.imageUrl || 'assets/images/photo_profil.png'}" alt="Image du projet ${project.title}" class="article__photo">
                <a href="index.html#projects" class="article__back">← Retour aux projets</a>
                <h1 class="article__title">${project.title}</h1>
                <p class="article__description">${project.description}</p>
                <ul class="article__tags">
                    ${project.tags.map(tag => `<li class="article__tag">${tag}</li>`).join('')}
                </ul>
                ${project.datasetUrl ? `<a href="${project.datasetUrl}" target="_blank" rel="noopener" class="article__dataset-link">Accéder aux données 📊</a>` : ''}
                <div class="article__content">
                    ${project.content}
                </div>
            </article>
        `;
    } catch (err) {
        console.error('loadProject:', err);
        container.innerHTML = '<p>Impossible de charger le projet.</p>';
    }
}

loadProject();

// Toggle dark/light mode
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
    );
}

applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});
