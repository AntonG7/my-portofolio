// MonPortfolio — main.js

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Ferme le menu quand on clique sur un lien
navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// Fade-in au scroll via Intersection Observer
const sections = document.querySelectorAll('section');

sections.forEach(section => section.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Attendre une frame pour que le navigateur peigne opacity:0 avant d'observer
requestAnimationFrame(() => {
    sections.forEach(section => fadeObserver.observe(section));
});

// Chargement des projets
async function loadProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    try {
        const res = await fetch('data/projects.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const projects = await res.json();
        grid.innerHTML = projects.map(project => `
            <article class="project-card">
                <div class="project-card__banner"></div>
                <div class="project-card__body">
                    <h3 class="project-card__title">${project.title}</h3>
                    <p class="project-card__desc">${project.description}</p>
                    <ul class="project-card__tags">
                        ${project.tags.map(t => `<li class="project-card__tag">${t}</li>`).join('')}
                    </ul>
                    <a href="${project.link}" class="project-card__link" aria-label="${project.ariaLabel}">Voir le projet</a>
                </div>
            </article>
        `).join('');
    } catch (err) {
        console.error('loadProjects:', err);
        grid.innerHTML = '<p class="projects__error">Impossible de charger les projets.</p>';
    }
}

loadProjects();

// Chargement des articles du blog
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function loadBlog() {
    const grid = document.getElementById('blog-grid');
    try {
        const res = await fetch('data/blog.json');
        const posts = await res.json();
        grid.innerHTML = posts.map(post => `
            <article class="blog-card">
                <div class="blog-card__banner"></div>
                <div class="blog-card__body">
                    <time class="blog-card__date" datetime="${post.date}">${formatDate(post.date)}</time>
                    <h3 class="blog-card__title">${post.title}</h3>
                    <p class="blog-card__summary">${post.summary}</p>
                    <ul class="blog-card__tags">
                        ${post.tags.map(t => `<li class="blog-card__tag">${t}</li>`).join('')}
                    </ul>
                    <a href="blog.html?slug=${post.slug}" class="blog-card__link">Lire l'article</a>
                </div>
            </article>
        `).join('');
    } catch {
        grid.innerHTML = '<p class="blog__error">Les articles ne sont pas disponibles.</p>';
    }
}

loadBlog();

// Validation du formulaire de contact
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(`${inputId}-error`);
        input.setAttribute('aria-invalid', 'true');
        errorSpan.textContent = message;
        errorSpan.hidden = false;
    }

    function clearError(inputId) {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(`${inputId}-error`);
        input.removeAttribute('aria-invalid');
        errorSpan.hidden = true;
    }

    contactForm.addEventListener('submit', (e) => {
        let valid = true;

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name) {
            showError('name', 'Veuillez saisir votre nom.');
            valid = false;
        } else {
            clearError('name');
        }

        if (!email) {
            showError('email', 'Veuillez saisir votre adresse email.');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Veuillez saisir une adresse email valide.');
            valid = false;
        } else {
            clearError('email');
        }

        if (!message) {
            showError('message', 'Veuillez saisir votre message.');
            valid = false;
        } else {
            clearError('message');
        }

        if (!valid) {
            e.preventDefault();
        }
    });

    // Effacer l'erreur dès que l'utilisateur corrige le champ
    ['name', 'email', 'message'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => clearError(id));
    });
}

// Toggle dark/light mode
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
    );
}

// Synchronise l'aria-label avec le thème posé par le script inline dans <head>
applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
});
