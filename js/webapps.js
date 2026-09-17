// MonPortfolio — webapps.js (carte du patrimoine immobilier de l'État)

const MIN_RADIUS = 3;
const MAX_RADIUS = 26;
const RADIUS_SCALE = 0.28;
const SURFACE_CAP = 50000; // au-delà, le curseur affiche "et plus" sans limite haute (quelques valeurs aberrantes du dataset dépassent le milliard de m²)
const SURFACE_STEP = 50;

// Palette catégorielle ColorBrewer "Set1" — classique, bien segmentée, lisible sur fond sombre
const CATEGORY_PALETTE = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#f781bf', '#a65628', '#999999'];
let ministereColors = new Map();

function ministereColor(ministere) {
    return ministereColors.get(ministere) || '#999999';
}

const FILTERS = [
    { field: 'region', selectId: 'filter-region' },
    { field: 'dept', selectId: 'filter-dept' },
    { field: 'ministere', selectId: 'filter-ministere' },
    { field: 'type', selectId: 'filter-type' },
    { field: 'etat', selectId: 'filter-etat' },
];

let allBiens = [];
let map;
let markersLayer;

// Rayon proportionnel à l'aire (racine carrée de la surface), borné pour absorber les valeurs aberrantes du dataset
function radiusFor(surface) {
    const r = RADIUS_SCALE * Math.sqrt(Math.max(surface, 0));
    return Math.min(Math.max(r, MIN_RADIUS), MAX_RADIUS);
}

function buildMinistereColors() {
    const ministeres = [...new Set(allBiens.map(b => b.ministere).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, 'fr'));
    ministereColors = new Map(ministeres.map((m, i) => [m, CATEGORY_PALETTE[i % CATEGORY_PALETTE.length]]));
}

function renderLegend() {
    const legend = document.getElementById('webapps-legend');
    legend.innerHTML = [...ministereColors.entries()].map(([ministere, color]) => `
        <li class="webapps-legend__item">
            <span class="webapps-legend__swatch" style="background-color: ${color}"></span>
            ${ministere}
        </li>
    `).join('');
}

function populateFilterOptions() {
    FILTERS.forEach(({ field, selectId }) => {
        const select = document.getElementById(selectId);
        const values = [...new Set(allBiens.map(b => b[field]).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    });
}

function getSurfaceRange() {
    const minInput = document.getElementById('filter-surface-min');
    const maxInput = document.getElementById('filter-surface-max');
    const min = Math.min(Number(minInput.value), Number(maxInput.value));
    const max = Math.max(Number(minInput.value), Number(maxInput.value));
    return { min, max };
}

function updateSurfaceLabel() {
    const { min, max } = getSurfaceRange();
    const maxText = max >= SURFACE_CAP ? `${SURFACE_CAP.toLocaleString('fr-FR')} m² et plus` : `${max.toLocaleString('fr-FR')} m²`;
    document.getElementById('filter-surface-label').textContent = `Surface : ${min.toLocaleString('fr-FR')} m² – ${maxText}`;
}

function updateSurfaceFill() {
    const { min, max } = getSurfaceRange();
    const fill = document.getElementById('filter-surface-fill');
    fill.style.left = `${(min / SURFACE_CAP) * 100}%`;
    fill.style.width = `${((max - min) / SURFACE_CAP) * 100}%`;
}

// Empêche les deux poignées de se croiser : le minimum reste toujours strictement inférieur au maximum
function clampSurfaceInputs(changed) {
    const minInput = document.getElementById('filter-surface-min');
    const maxInput = document.getElementById('filter-surface-max');
    const min = Number(minInput.value);
    const max = Number(maxInput.value);

    if (min >= max) {
        if (changed === 'min') {
            minInput.value = Math.max(0, max - SURFACE_STEP);
        } else {
            maxInput.value = Math.min(SURFACE_CAP, min + SURFACE_STEP);
        }
    }
}

function getFilteredBiens() {
    const activeFilters = FILTERS
        .map(({ field, selectId }) => ({ field, value: document.getElementById(selectId).value }))
        .filter(f => f.value);

    const { min, max } = getSurfaceRange();

    return allBiens.filter(bien => {
        if (!activeFilters.every(f => bien[f.field] === f.value)) return false;
        if (bien.surface < min) return false;
        if (max < SURFACE_CAP && bien.surface > max) return false;
        return true;
    });
}

function bienIcon(bien) {
    const color = ministereColor(bien.ministere);
    const diameter = radiusFor(bien.surface) * 2;
    return L.divIcon({
        className: 'bien-marker',
        html: `<span style="width:${diameter}px;height:${diameter}px;background-color:${color};border-color:${color}"></span>`,
        iconSize: [diameter, diameter],
    });
}

function clusterIcon(cluster) {
    const count = cluster.getChildCount();
    const size = count < 10 ? 32 : count < 100 ? 40 : 50;
    return L.divIcon({
        className: 'bien-cluster',
        html: `<span style="width:${size}px;height:${size}px">${count}</span>`,
        iconSize: [size, size],
    });
}

function renderMarkers(biens) {
    markersLayer.clearLayers();
    biens.forEach(bien => {
        const marker = L.marker([bien.lat, bien.lon], { icon: bienIcon(bien) })
            .bindPopup(`
                <strong>${bien.ville || 'Ville inconnue'}</strong> (${bien.dept || '?'})<br>
                ${bien.type}<br>
                ${bien.ministere}<br>
                ${bien.surface ? Math.round(bien.surface).toLocaleString('fr-FR') + ' m²' : 'Surface non renseignée'}<br>
                ${bien.etat || 'État de santé non renseigné'}
            `);
        markersLayer.addLayer(marker);
    });

    document.getElementById('webapps-count').textContent =
        `${biens.length.toLocaleString('fr-FR')} biens affichés sur ${allBiens.length.toLocaleString('fr-FR')}`;
}

function applyFilters() {
    renderMarkers(getFilteredBiens());
}

async function initWebapps() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    try {
        const res = await fetch('data/biens-etat.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        allBiens = await res.json();

        map = L.map('map', { preferCanvas: true }).setView([46.6, 2.5], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
        }).addTo(map);
        markersLayer = L.markerClusterGroup({ iconCreateFunction: clusterIcon }).addTo(map);

        buildMinistereColors();
        renderLegend();
        populateFilterOptions();
        updateSurfaceLabel();
        updateSurfaceFill();
        renderMarkers(allBiens);

        FILTERS.forEach(({ selectId }) => {
            document.getElementById(selectId).addEventListener('change', applyFilters);
        });

        [['filter-surface-min', 'min'], ['filter-surface-max', 'max']].forEach(([id, which]) => {
            const input = document.getElementById(id);
            input.addEventListener('pointerdown', () => {
                input.style.zIndex = 2;
                document.getElementById(which === 'min' ? 'filter-surface-max' : 'filter-surface-min').style.zIndex = 1;
            });
            input.addEventListener('input', () => {
                clampSurfaceInputs(which);
                updateSurfaceLabel();
                updateSurfaceFill();
                applyFilters();
            });
        });

        document.getElementById('filters-reset').addEventListener('click', () => {
            FILTERS.forEach(({ selectId }) => {
                document.getElementById(selectId).value = '';
            });
            document.getElementById('filter-surface-min').value = 0;
            document.getElementById('filter-surface-max').value = SURFACE_CAP;
            updateSurfaceLabel();
            updateSurfaceFill();
            applyFilters();
        });
    } catch (err) {
        console.error('initWebapps:', err);
        mapEl.innerHTML = '<p class="webapps__error">Impossible de charger la carte.</p>';
    }
}

initWebapps();

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
