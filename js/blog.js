// blog.js — page de lecture d'un article

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

// Chargement et affichage de l'article
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function updateMetaTags(post) {
    const baseUrl = 'https://anthonyguignard.github.io';
    const articleUrl = `${baseUrl}/blog.html?slug=${post.slug}`;

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.summary);

    // Canonical URL
    const canonical = document.getElementById('canonical-url');
    if (canonical) canonical.setAttribute('href', articleUrl);

    // Open Graph
    const ogUrl = document.getElementById('og-url');
    if (ogUrl) ogUrl.setAttribute('content', articleUrl);

    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.setAttribute('content', post.title);

    const ogDesc = document.getElementById('og-description');
    if (ogDesc) ogDesc.setAttribute('content', post.summary);

    // Si l'article contient une image, l'utiliser comme og:image
    const contentImages = post.content.match(/<img[^>]+src="([^">]+)"/);
    if (contentImages && contentImages[1]) {
        const ogImage = document.getElementById('og-image');
        if (ogImage) ogImage.setAttribute('content', `${baseUrl}/${contentImages[1]}`);

        const twitterImage = document.getElementById('twitter-image');
        if (twitterImage) twitterImage.setAttribute('content', `${baseUrl}/${contentImages[1]}`);
    }

    // Twitter Card
    const twitterTitle = document.getElementById('twitter-title');
    if (twitterTitle) twitterTitle.setAttribute('content', post.title);

    const twitterDesc = document.getElementById('twitter-description');
    if (twitterDesc) twitterDesc.setAttribute('content', post.summary);
}

function addLazyLoadingToImages(container) {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

async function loadArticle() {
    const container = document.getElementById('article-container');
    const slug = new URLSearchParams(window.location.search).get('slug');

    if (!slug) {
        container.innerHTML = '<p class="article__error">Aucun article spécifié.</p>';
        return;
    }

    try {
        const res = await fetch('data/blog.json');
        const posts = await res.json();
        const post = posts.find(p => p.slug === slug);

        if (!post) {
            container.innerHTML = '<p class="article__error">Article introuvable.</p>';
            return;
        }

        document.title = `${post.title} — Anthony Guignard`;
        updateMetaTags(post);

        container.innerHTML = `
            <article class="article">
                <a href="index.html#blog" class="article__back">← Retour aux articles</a>
                <header class="article__header">
                    <time class="article__date" datetime="${post.date}">${formatDate(post.date)}</time>
                    <h1 class="article__title">${post.title}</h1>
                    <ul class="article__tags">
                        ${post.tags.map(t => `<li class="blog-card__tag">${t}</li>`).join('')}
                    </ul>
                </header>
                <div class="article__content">
                    ${post.content}
                </div>
            </article>
        `;

        // Ajouter loading="lazy" aux images après injection
        addLazyLoadingToImages(container);
    } catch {
        container.innerHTML = '<p class="article__error">L\'article n\'est pas disponible.</p>';
    }
}

loadArticle();
