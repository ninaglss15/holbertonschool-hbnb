// ============================================
// BREAKING BAD BnB - SCRIPTS COMPLET
// Task 1: Login | Task 2: Places | Task 3: Details | Task 4: Reviews
// ============================================

// URL de base de l'API (à changer selon ton environnement)
const API_BASE_URL = '';  // Vide car même serveur Flask

document.addEventListener('DOMContentLoaded', () => {
    // ========== GESTION GLOBALE LOGIN/LOGOUT ==========
    updateAuthUI();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // ========== TASK 1: LOGIN FORM ==========
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                await loginUser(email, password);
            } catch (error) {
                displayMessage(error.message || 'An unexpected error occurred.', 'error');
            }
        });
    }

    // ========== TASK 2: CHECK AUTH & LOAD PLACES ==========
    if (document.getElementById('places-list')) {
        checkAuthentication();
    }

    // ========== TASK 2: PRICE FILTER ==========
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', (e) => {
            filterPlacesByPrice(e.target.value);
        });
    }

    // ========== TASK 3: PLACE DETAILS PAGE ==========
    if (document.getElementById('place-details')) {
        const placeId = getPlaceIdFromURL();
        const token = getCookie('access_token');
        if (placeId) {
            checkAuthenticationForPlace(token);
            fetchPlaceDetails(token, placeId);
        } else {
            displayMessage('No place ID provided.', 'error');
        }

        const reviewForm = document.getElementById('review-form');
        if (reviewForm && token) {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const reviewText = document.getElementById('review-text').value;
                const rating = document.getElementById('review-rating').value;
                if (!reviewText.trim() || !rating) {
                    displayMessage('Please fill all fields.', 'warning');
                    return;
                }
                try {
                    await submitReview(token, placeId, reviewText, rating);
                    reviewForm.reset();
                    setTimeout(() => fetchPlaceDetails(token, placeId), 1000);
                } catch (error) {
                    displayMessage(error.message, 'error');
                }
            });
        }
    }

    // ========== TASK 4: ADD REVIEW PAGE ==========
    const reviewFormPage = document.getElementById('add-review');
    if (reviewFormPage) {
        const token = checkAuthenticationOrRedirect();
        const placeId = getPlaceIdFromURL();
        if (!placeId) {
            displayMessage('No place ID provided.', 'error');
            setTimeout(() => { window.location.href = '/'; }, 2000);
            return;
        }
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const reviewText = document.getElementById('review').value;
                const rating = document.getElementById('rating').value;
                if (!reviewText.trim() || !rating) {
                    displayMessage('Please fill all fields.', 'warning');
                    return;
                }
                try {
                    await submitReview(token, placeId, reviewText, rating);
                    reviewForm.reset();
                    displayMessage('Review submitted! Redirecting...', 'success');
                    setTimeout(() => { window.location.href = `/place?id=${placeId}`; }, 2000);
                } catch (error) {
                    displayMessage(error.message, 'error');
                }
            });
        }
    }
});

// ============================================
// GESTION LOGIN/LOGOUT GLOBALE
// ============================================

/**
 * Met à jour l'affichage Login/Logout sur toutes les pages
 */
function updateAuthUI() {
    const token = getCookie('access_token');
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');

    if (loginLink) {
        loginLink.style.display = token ? 'none' : 'inline-block';
    }
    
    if (logoutButton) {
        logoutButton.style.display = token ? 'inline-block' : 'none';
    }

    console.log(token ? '✓ User authenticated' : '✗ User not authenticated');
}

/**
 * Déconnexion utilisateur
 */
function logoutUser() {
    // Supprimer le cookie
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
    
    console.log('✓ User logged out');
    displayMessage('Logged out successfully! 👋', 'success');
    
    // Redirection après 1 seconde
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

// ============================================
// TASK 1: LOGIN FUNCTIONS
// ============================================

async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const msg = response.status === 401 ? 'Wrong credentials.' : 'Connection failed.';
        throw new Error(msg);
    }

    const data = await response.json();
    if (!data.access_token) throw new Error('No token received.');

    document.cookie = buildAuthCookie(data.access_token);
    console.log('✓ Login successful');
    displayMessage('Welcome to the lab! 🧪', 'success');
    setTimeout(() => { window.location.href = '/'; }, 1000);
}

function buildAuthCookie(token, maxAge = 3600) {
    const encoded = encodeURIComponent(token);
    const expiry = new Date(Date.now() + maxAge * 1000).toUTCString();
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    let cookie = `access_token=${encoded}; path=/; expires=${expiry}; SameSite=Lax`;
    if (!isLocal) cookie += '; Secure';
    return cookie;
}

// ============================================
// TASK 2: AUTHENTICATION & PLACES
// ============================================

function checkAuthentication() {
    const token = getCookie('access_token');
    fetchPlaces(token);
}

async function fetchPlaces(token) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/api/v1/places/`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) throw new Error('Failed to load places.');

        const data = await response.json();
        console.log('✓ Places received:', data);

        if (Array.isArray(data)) {
            displayPlaces(data);
        } else if (data.places && Array.isArray(data.places)) {
            displayPlaces(data.places);
        } else {
            throw new Error('Invalid data format.');
        }
    } catch (error) {
        console.error('Error:', error);
        displayMessage('Failed to load places. ' + error.message, 'error');
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = '';

    if (!places.length) {
        placesList.innerHTML = '<p style="color:#66BB6A;text-align:center;margin:40px;">No places available.</p>';
        return;
    }

    places.forEach(place => {
        const card = document.createElement('div');
        card.classList.add('place-card');
        card.setAttribute('data-price', place.price || place.price_per_night || 0);

        const img = document.createElement('img');
        img.src = place.image_url || '/static/images/default.png';
        img.alt = place.name || 'Place';
        img.classList.add('place-image');
        card.appendChild(img);

        const title = document.createElement('h3');
        title.textContent = place.name || 'Unnamed place';
        card.appendChild(title);

        const price = document.createElement('p');
        price.innerHTML = `<strong>Price:</strong> ${place.price || place.price_per_night || 'N/A'} credits/night`;
        price.style.color = '#FFD54F';
        card.appendChild(price);

        const desc = document.createElement('p');
        desc.textContent = place.description || 'No description.';
        desc.style.color = '#e8e8d0';
        card.appendChild(desc);

        const btn = document.createElement('button');
        btn.textContent = 'View Details';
        btn.classList.add('details-button');
        btn.addEventListener('click', () => {
            window.location.href = `/place?id=${place.id}`;
        });
        card.appendChild(btn);

        placesList.appendChild(card);
    });

    console.log(`✓ Displayed ${places.length} places`);
}

function filterPlacesByPrice(maxPrice) {
    const cards = document.querySelectorAll('.place-card');
    cards.forEach(card => {
        const price = parseFloat(card.getAttribute('data-price')) || 0;
        card.style.display = (maxPrice === 'all' || price <= parseFloat(maxPrice)) ? 'flex' : 'none';
    });
}

// ============================================
// TASK 3: PLACE DETAILS
// ============================================

function getPlaceIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
}

function checkAuthenticationForPlace(token) {
    const addReviewSection = document.getElementById('add-review');
    if (addReviewSection) {
        addReviewSection.style.display = token ? 'block' : 'none';
    }
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/api/v1/places/${placeId}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const msg = response.status === 404 ? 'Place not found.' : 'Failed to load.';
            throw new Error(msg);
        }

        const place = await response.json();
        console.log('✓ Place details:', place);
        displayPlaceDetails(place);
    } catch (error) {
        console.error('Error:', error);
        displayMessage(error.message, 'error');
    }
}

function displayPlaceDetails(place) {
    const el = (id) => document.getElementById(id);

    if (el('place-title')) el('place-title').textContent = place.name || 'Unnamed';
    if (el('host-name') && place.owner) {
        el('host-name').textContent = `${place.owner.first_name || ''} ${place.owner.last_name || ''}`.trim();
    }
    if (el('place-price')) el('place-price').textContent = place.price || place.price_per_night || 'N/A';
    if (el('place-description')) el('place-description').textContent = place.description || 'No description.';

    const amenitiesList = el('amenities-list');
    if (amenitiesList) {
        amenitiesList.innerHTML = '';
        if (place.amenities?.length) {
            place.amenities.forEach(a => {
                const li = document.createElement('li');
                li.textContent = a.name || 'Unknown';
                li.style.color = '#e8e8d0';
                amenitiesList.appendChild(li);
            });
        } else {
            amenitiesList.innerHTML = '<li style="color:#999;">No amenities</li>';
        }
    }

    const reviewsContainer = el('reviews-container');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = '';
        if (place.reviews?.length) {
            place.reviews.forEach(r => {
                const card = document.createElement('div');
                card.classList.add('review-card');
                card.innerHTML = `
                    <p><strong style="color:#FFD54F;">${r.user?.first_name || 'Anonymous'} ${r.user?.last_name || ''}</strong></p>
                    <p style="color:#4CAF50;"><strong>Rating:</strong> ${r.rating}/5</p>
                    <p style="color:#e8e8d0;">${r.text || 'No comment.'}</p>
                `;
                reviewsContainer.appendChild(card);
            });
        } else {
            reviewsContainer.innerHTML = '<p style="color:#66BB6A;text-align:center;">No reviews yet. Be the first! 🧪</p>';
        }
    }
}

// ============================================
// TASK 4: ADD REVIEW
// ============================================

function checkAuthenticationOrRedirect() {
    const token = getCookie('access_token');
    if (!token) {
        displayMessage('You must be logged in.', 'warning');
        setTimeout(() => { window.location.href = '/'; }, 2000);
        return null;
    }
    return token;
}

async function submitReview(token, placeId, reviewText, rating) {
    const response = await fetch(`${API_BASE_URL}/api/v1/reviews/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ place_id: placeId, text: reviewText, rating: parseInt(rating) })
    });

    if (!response.ok) {
        const msg = response.status === 401 ? 'Please login again.' : 'Failed to submit.';
        throw new Error(msg);
    }

    console.log('✓ Review submitted');
    displayMessage('Review submitted! 🧪', 'success');
}

// ============================================
// UTILITIES
// ============================================

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let c of cookies) {
        const [k, v] = c.split('=');
        if (k === name) return decodeURIComponent(v);
    }
    return null;
}

function displayMessage(text, type = 'error') {
    const msg = document.getElementById('message');
    if (!msg) return;

    const styles = {
        success: { color: '#0f3d0f', bg: 'rgba(76,175,80,0.2)', border: '#4CAF50' },
        warning: { color: '#856404', bg: 'rgba(255,193,7,0.2)', border: '#FFC107' },
        error: { color: '#8B0000', bg: 'rgba(220,53,69,0.2)', border: '#DC3545' }
    };
    const s = styles[type] || styles.error;

    Object.assign(msg.style, {
        color: s.color, backgroundColor: s.bg, border: `2px solid ${s.border}`,
        padding: '15px', borderRadius: '8px', marginTop: '20px',
        fontWeight: 'bold', textAlign: 'center', display: 'block'
    });
    msg.textContent = text;

    setTimeout(() => { msg.style.display = 'none'; msg.textContent = ''; }, 5000);
}