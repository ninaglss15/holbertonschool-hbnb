document.addEventListener('DOMContentLoaded', () => {
    /* DO SOMETHING */
});

const API_BASE = "http://127.0.0.1:5000/api/v1";

// LOGIN
if (window.location.pathname.endsWith("login.html")) {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.access_token);
            window.location.href = "index.html";
        } else {
            document.getElementById("message").textContent = data.error || "Login failed";
        }
    });
}

// LOGOUT BUTTON
function setupAuthButtons() {
    const loginLink = document.getElementById("login-link");
    const logoutButton = document.getElementById("logout-button");
    const token = localStorage.getItem("token");

    if (token) {
        loginLink.style.display = "none";
        if (logoutButton) logoutButton.style.display = "block";
        if (logoutButton) logoutButton.onclick = () => { localStorage.removeItem("token"); location.reload(); };
    }
}
setupAuthButtons();

// INDEX — LOAD PLACES
if (window.location.pathname.endsWith("index.html")) {
    async function loadPlaces() {
        const response = await fetch(`${API_BASE}/places`);
        const places = await response.json();
        displayPlaces(places);
    }

    function displayPlaces(places) {
        const container = document.getElementById("places-list");
        container.innerHTML = "";

        places.forEach(place => {
            const card = document.createElement("div");
            card.className = "place-card";
            card.innerHTML = `
                <h3>${place.name}</h3>
                <p>Price: ${place.price_by_night}$</p>
                <button onclick="openPlace('${place.id}')">View Details</button>
            `;
            container.appendChild(card);
        });
    }

    window.openPlace = (id) => {
        window.location.href = `place.html?id=${id}`;
    };

    document.getElementById("price-filter").addEventListener("change", async (e) => {
        const max = e.target.value;
        const response = await fetch(`${API_BASE}/places`);
        let places = await response.json();
        if (max !== "all") places = places.filter(p => p.price_by_night <= max);
        displayPlaces(places);
    });

    loadPlaces();
}

// PLACE PAGE — LOAD DETAILS + REVIEWS
if (window.location.pathname.endsWith("place.html")) {
    async function loadPlace() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        const placeReq = await fetch(`${API_BASE}/places/${id}`);
        const place = await placeReq.json();
        displayPlace(place);

        const reviewsReq = await fetch(`${API_BASE}/places/${id}/reviews`);
        const reviews = await reviewsReq.json();
        displayReviews(reviews);
    }

    function displayPlace(place) {
        document.querySelector(".place-title").textContent = place.name;
        const info = document.querySelector(".place-info");
        info.innerHTML = `
            <p><strong>Hôte :</strong> ${place.host.first_name}</p>
            <p><strong>Prix :</strong> ${place.price_by_night}€ / nuit</p>
            <p><strong>Description :</strong> ${place.description}</p>
        `;
    }

    function displayReviews(list) {
        const section = document.getElementById("reviews");
        section.innerHTML = "<h2>Avis des utilisateurs</h2>";

        list.forEach(r => {
            const div = document.createElement("div");
            div.className = "review-card";
            div.innerHTML = `
                <p><strong>Commentaire :</strong> ${r.text}</p>
                <p><strong>Utilisateur :</strong> ${r.user.first_name}</p>
                <p><strong>Note :</strong> ${r.rating}/5</p>
            `;
            section.appendChild(div);
        });
    }

    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
        reviewForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            const token = localStorage.getItem("token");

            if (!token) return alert("You must be logged in.");

            const text = document.getElementById("review-text").value;

            const res = await fetch(`${API_BASE}/places/${id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });

            if (res.ok) location.reload();
            else alert("Error sending review");
        });
    }

    loadPlace();
}

// ADD REVIEW PAGE
if (window.location.pathname.endsWith("add_review.html")) {
    const form = document.getElementById("review-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const token = localStorage.getItem("token");

        const review = document.getElementById("review").value;
        const rating = document.getElementById("rating").value;

        const res = await fetch(`${API_BASE}/places/${id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ text: review, rating })
        });

        if (res.ok) window.location.href = `place.html?id=${id}`;
        else alert("Error adding review");
    });
}
