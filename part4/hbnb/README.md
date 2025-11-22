# 🧪 BreakingBadBnB - HBnB Project Part 4

A Breaking Bad themed accommodation booking platform built with Flask, JavaScript, HTML5, and CSS3.

## 📋 Project Description

This project is the front-end implementation of the HBnB application (Part 4), featuring:
- User authentication with JWT tokens
- Dynamic place listings with client-side filtering
- Detailed place information pages
- Review submission system
- Responsive Breaking Bad themed design

## 🚀 Technologies Used

- **Backend:** Flask (Python)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **API:** RESTful API with JWT authentication
- **Styling:** Custom CSS with Breaking Bad color scheme (green/yellow)
- **Storage:** Cookie-based JWT token management

## 📁 Project Structure
```
holbertonschool-hbnb/part4/hbnb/
├── app.py                  # Flask application and API routes
├── templates/              # HTML templates (Jinja2)
│   ├── index.html         # List of places
│   ├── login.html         # Login form
│   ├── place.html         # Place details
│   └── add_review.html    # Add review form
├── static/                 # Static files
│   ├── styles.css         # Main stylesheet
│   ├── scripts.js         # JavaScript functionality
│   └── images/            # Images (logo, places, etc.)
└── README.md              # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- Flask installed (`pip install flask`)

### Steps

1. **Clone the repository:**
```bash
   git clone https://github.com/YOUR_USERNAME/holbertonschool-hbnb.git
   cd holbertonschool-hbnb/part4/hbnb
```

2. **Install dependencies:**
```bash
   pip install flask
```

3. **Run the Flask application:**
```bash
   python app.py
```

4. **Open your browser:**
```
   http://localhost:3000
```

## 🧪 How to Test

### 1. Testing Login Functionality

**Objective:** Verify user authentication works correctly.

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter any email and password (all credentials are accepted in development mode)
3. Click "Login"
4. **Expected Result:**
   - ✅ Success message: "Welcome to the lab! 🧪"
   - ✅ JWT token stored in browser cookie
   - ✅ Automatic redirection to homepage
   - ✅ "Login" button replaced by "Logout" button

**Error Testing:**
- Leave fields empty → Form validation prevents submission
- Server error simulation → Error message displayed

---

### 2. Testing Index Page (List of Places)

**Objective:** Verify places are fetched and displayed correctly.

**Steps:**
1. Navigate to `http://localhost:3000/`
2. **Expected Result:**
   - ✅ 6 Breaking Bad themed places displayed in a grid
   - ✅ Each card shows: image, name, price, description, "View Details" button
   - ✅ "Login" button visible (if not logged in)
   - ✅ "Logout" button visible (if logged in)

**Filter Testing:**
1. Select "10 credits" from the price filter
2. **Expected Result:** Only places ≤ 10 credits shown
3. Select "All" → All places reappear

**Authentication UI Testing:**
- Not logged in → "Login" button visible
- Logged in → "Logout" button visible

---

### 3. Testing Place Details Page

**Objective:** Verify detailed information is displayed correctly.

**Steps:**
1. From the homepage, click "View Details" on any place
2. **Expected Result:**
   - ✅ Place name, host, price, description displayed
   - ✅ Amenities list shown
   - ✅ Reviews displayed with user names and ratings
   - ✅ If logged in: "📝 Add a Review" button visible
   - ✅ If not logged in: Button hidden

**Error Testing:**
- Navigate to `http://localhost:3000/place?id=999` (invalid ID)
- **Expected Result:** Error message "Place not found."

---

### 4. Testing Add Review Form

**Objective:** Verify authenticated users can submit reviews.

**Steps (logged in):**
1. Navigate to a place details page
2. Click "📝 Add a Review" button
3. You'll be redirected to `http://localhost:3000/add_review?id=1`
4. **Expected Result:**
   - ✅ Place name displayed: "Review for: [Place Name]"
   - ✅ Form with textarea and rating dropdown visible
5. Fill the review text and select a rating
6. Click "Submit Review"
7. **Expected Result:**
   - ✅ Success message: "Review submitted! 🧪"
   - ✅ Automatic redirection to place details page
   - ✅ New review appears in the reviews list

**Error Testing:**
- Submit empty form → Warning message: "Please fill all fields."
- Try to access `http://localhost:3000/add_review?id=1` without logging in
  - **Expected Result:** Warning + automatic redirection to homepage

**Steps (not logged in):**
1. Navigate to a place details page
2. **Expected Result:** No "Add a Review" button visible

---

### 5. Testing Logout Functionality

**Objective:** Verify logout works correctly.

**Steps:**
1. While logged in, click the "Logout" button
2. **Expected Result:**
   - ✅ Success message: "Logged out successfully! 👋"
   - ✅ JWT cookie deleted
   - ✅ Automatic redirection to homepage
   - ✅ "Logout" button replaced by "Login" button

---

### Screenshots of the website

home/list of place :

![alt text](<static/images/Capture d'écran 2025-11-21 112318.png>)

login page :

![alt text](<static/images/Capture d'écran 2025-11-22 121027.png>)

place details :

![alt text](<static/images/Capture d'écran 2025-11-22 121040.png>)

add review :

![alt text](<static/images/Capture d'écran 2025-11-22 121108.png>)

---

## 📊 API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Authenticate user and return JWT token |
| GET | `/api/v1/places/` | Fetch list of all places |
| GET | `/api/v1/places/{id}` | Fetch details of a specific place |
| POST | `/api/v1/reviews/` | Submit a new review |

## 🎨 Design Features

- **Theme:** Breaking Bad inspired (green/yellow chemistry aesthetic)
- **Animations:** Smooth transitions and fade-in effects


## 👨‍💻 Author

**Your Name**
- GitHub: [@ninaglss15](https://github.com/ninaglss15)
- Project: HolbertonSchool HBnB Part 4

## 📜 License

This project is part of the Holberton School curriculum.

## 🙏 Acknowledgments

- Breaking Bad theme inspiration
- Holberton School for project guidelines
- Flask documentation
- W3C validators

---

**Nina Galasso**