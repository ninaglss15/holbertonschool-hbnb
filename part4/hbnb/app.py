"""
Flask application to serve the BreakingBadBnB front-end + API
"""
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# ============================================
# DONNÉES DES PLACES (Breaking Bad Theme)
# ============================================

PLACES = [
    {
        "id": "1",
        "name": "Walter White's House",
        "description": "The iconic family home where it all began. Located in a quiet Albuquerque neighborhood. Pizza on the roof not included.",
        "price_per_night": 150,
        "image_url": "/static/images/walter.png",
        "owner": {
            "first_name": "Skyler",
            "last_name": "White"
        },
        "amenities": [
            {"name": "Pool"},
            {"name": "Garage (car wash money storage)"},
            {"name": "Backyard"},
            {"name": "Full Kitchen"}
        ],
        "reviews": [
            {
                "user": {"first_name": "Jesse", "last_name": "Pinkman"},
                "rating": 5,
                "text": "Yo, Mr. White's crib is tight!"
            },
            {
                "user": {"first_name": "Hank", "last_name": "Schrader"},
                "rating": 4,
                "text": "Great place for family BBQs. The garage is... interesting."
            }
        ]
    },
    {
        "id": "2",
        "name": "Jesse's House",
        "description": "Party-ready pad in a chill neighborhood. Perfect for... chemistry enthusiasts. Recently renovated after some incidents.",
        "price_per_night": 80,
        "image_url": "/static/images/jesse-house.png",
        "owner": {
            "first_name": "Jesse",
            "last_name": "Pinkman"
        },
        "amenities": [
            {"name": "Sound System"},
            {"name": "Basement"},
            {"name": "Modern Kitchen"},
            {"name": "Gaming Setup"}
        ],
        "reviews": [
            {
                "user": {"first_name": "Badger", "last_name": ""},
                "rating": 5,
                "text": "Best parties ever, yo!"
            }
        ]
    },
    {
        "id": "3",
        "name": "Hank's House",
        "description": "DEA-approved safe haven. Great for mineral collectors. Strong security features.",
        "price_per_night": 120,
        "image_url": "/static/images/hank-house.png",
        "owner": {
            "first_name": "Hank",
            "last_name": "Schrader"
        },
        "amenities": [
            {"name": "Home Brewing Kit"},
            {"name": "Mineral Collection Room"},
            {"name": "Security System"},
            {"name": "Garage Gym"}
        ],
        "reviews": [
            {
                "user": {"first_name": "Marie", "last_name": "Schrader"},
                "rating": 5,
                "text": "Everything is purple and perfect!"
            }
        ]
    },
    {
        "id": "4",
        "name": "Gustavo Fring's House",
        "description": "Immaculate suburban home. Perfect for those who appreciate order and... chicken. Very clean.",
        "price_per_night": 200,
        "image_url": "/static/images/Gustavo-Fring-House.png",
        "owner": {
            "first_name": "Gustavo",
            "last_name": "Fring"
        },
        "amenities": [
            {"name": "Gourmet Kitchen"},
            {"name": "Wine Cellar"},
            {"name": "Pristine Garden"},
            {"name": "Home Office"}
        ],
        "reviews": [
            {
                "user": {"first_name": "Mike", "last_name": "Ehrmantraut"},
                "rating": 5,
                "text": "Professional. Clean. No half measures."
            }
        ]
    },
    {
        "id": "5",
        "name": "Jane's Apartment",
        "description": "Artistic duplex with vintage vibes. Perfect for creative souls. Great natural lighting for art projects.",
        "price_per_night": 75,
        "image_url": "/static/images/jane-house.png",
        "owner": {
            "first_name": "Jane",
            "last_name": "Margolis"
        },
        "amenities": [
            {"name": "Art Studio"},
            {"name": "Vintage Decor"},
            {"name": "Record Player"},
            {"name": "Balcony"}
        ],
        "reviews": [
            {
                "user": {"first_name": "Jesse", "last_name": "Pinkman"},
                "rating": 5,
                "text": "This place... it means everything to me."
            }
        ]
    },
    {
        "id": "6",
        "name": "Saul Goodman's Office",
        "description": "It's all good, man! Unique office space with inflatable Statue of Liberty. Perfect for entrepreneurs.",
        "price_per_night": 100,
        "image_url": "/static/images/saul-office.png",
        "owner": {
            "first_name": "Saul",
            "last_name": "Goodman"
        },
        "amenities": [
            {"name": "Conference Room"},
            {"name": "Waiting Area"},
            {"name": "Constitution Wallpaper"},
            {"name": "Secret Exit"}
        ],
        "reviews": [
            {
                "user": {"first_name": "Walter", "last_name": "White"},
                "rating": 4,
                "text": "Useful for... legal consultations."
            }
        ]
    }
]

# Stockage des reviews en mémoire
REVIEWS = []

# ============================================
# ROUTES FOR PAGES (Templates)
# ============================================

@app.route('/')
def index():
    """Main page - List of places"""
    return render_template('index.html')


@app.route('/login')
def login():
    """Login page"""
    return render_template('login.html')


@app.route('/place')
def place():
    """Place details page"""
    return render_template('place.html')


@app.route('/add_review')
def add_review():
    """Add review page"""
    return render_template('add_review.html')


# ============================================
# API ROUTES
# ============================================

@app.route('/api/v1/places/', methods=['GET'])
def get_places():
    """Retourne la liste de tous les logements"""
    # Retourner une version simplifiée pour la liste
    places_list = []
    for p in PLACES:
        places_list.append({
            "id": p["id"],
            "name": p["name"],
            "description": p["description"],
            "price_per_night": p["price_per_night"],
            "image_url": p["image_url"]
        })
    return jsonify(places_list)


@app.route('/api/v1/places/<place_id>', methods=['GET'])
def get_place(place_id):
    """Retourne les détails d'un logement spécifique"""
    for p in PLACES:
        if p["id"] == place_id:
            # Ajouter les reviews dynamiques
            place_data = p.copy()
            # Ajouter les nouvelles reviews
            additional_reviews = [r for r in REVIEWS if r["place_id"] == place_id]
            place_data["reviews"] = p["reviews"] + additional_reviews
            return jsonify(place_data)
    
    return jsonify({"error": "Place not found"}), 404


@app.route('/api/v1/auth/login', methods=['POST'])
def api_login():
    """Simule une connexion et retourne un token"""
    data = request.get_json()
    
    email = data.get('email', '')
    password = data.get('password', '')
    
    # Simulation simple : accepter n'importe quel login
    # En production, vérifier dans une base de données
    if email and password:
        # Token factice pour le test
        fake_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiaGVpc2VuYmVyZyJ9.fake_token_for_testing"
        return jsonify({
            "access_token": fake_token,
            "message": "Login successful"
        })
    
    return jsonify({"error": "Invalid credentials"}), 401


@app.route('/api/v1/reviews/', methods=['POST'])
def add_review_api():
    """Ajoute un nouvel avis"""
    # Vérifier le token (simplifié)
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.get_json()
    
    place_id = data.get('place_id')
    text = data.get('text')
    rating = data.get('rating')
    
    if not all([place_id, text, rating]):
        return jsonify({"error": "Missing fields"}), 400
    
    # Créer la review
    new_review = {
        "place_id": place_id,
        "text": text,
        "rating": rating,
        "user": {"first_name": "Guest", "last_name": "User"}
    }
    
    REVIEWS.append(new_review)
    
    return jsonify({"message": "Review added successfully", "review": new_review}), 201


# ============================================
# RUN APPLICATION
# ============================================

if __name__ == '__main__':
    app.run(
        debug=True,
        host='0.0.0.0',
        port=3000
    )