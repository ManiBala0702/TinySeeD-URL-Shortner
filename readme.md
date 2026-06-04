# URL Shortener with Analytics

## Project Overview

This project is a full-stack URL Shortener application that allows authenticated users to create shortened URLs, manage them through a dashboard, and view analytics for each URL.

The application was developed using React, Node.js, Express, and MongoDB.

---

## Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes
* User-specific URL Management

### URL Shortening

* Create short URLs from long URLs
* Unique short code generation
* URL validation before creation
* Server-side redirection

### Dashboard

* View all created URLs
* View original URL
* View shortened URL
* View creation date
* View total clicks
* Copy short URL
* Delete URL

### Analytics

* Total click count
* Last visited timestamp
* Recent visit history
* Browser analytics
* Device analytics
* Daily click trend tracking

### Bonus Features Implemented

* Custom Alias Support
* Link Expiry Support
* Browser Analytics
* Device Analytics
* Daily Click Trend Tracking

---

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT
* bcrypt

---

## Architecture

Frontend (React)
|
v
REST API (Express.js)
|
v
MongoDB Database

Modules:

1. Authentication Module
2. URL Management Module
3. Redirect Module
4. Analytics Module
5. Dashboard Module

---

## Database Design

### User Collection

Fields:

* _id
* name
* email
* password
* createdAt

### URL Collection

Fields:

* _id
* user
* originalUrl
* shortCode
* clicks
* category
* expiresAt
* createdAt

### Click Collection

Fields:

* _id
* urlId
* timestamp
* browser
* device
* referrer

---

## AI Planning Document

### Planning Phase

The application was divided into the following modules:

1. Authentication
2. URL Creation
3. URL Redirection
4. Dashboard
5. Analytics Tracking
6. Frontend UI

### Development Flow

Step 1:
Designed MongoDB collections.

Step 2:
Implemented user authentication using JWT and bcrypt.

Step 3:
Created URL shortening functionality with unique short codes.

Step 4:
Implemented redirect handling using Express routes.

Step 5:
Tracked click events and stored analytics data.

Step 6:
Built dashboard and analytics pages using React.

Step 7:
Added custom alias and link expiry features.

---

## Assumptions Made

* Each shortened URL belongs to exactly one user.
* Analytics are only visible to the owner of the URL.
* Expired links cannot be accessed.
* Short codes must remain unique.
* Users must be authenticated to manage URLs.

---

## Setup Instructions

### Backend

Install dependencies:

npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
BASE_URL=http://localhost:5000

Start backend:

npm run server

---

### Frontend

Install dependencies:

npm install

Create .env:

VITE_API_URL=http://localhost:5000

Start frontend:

npm run dev

---

## Sample Output

### URL Creation

Input:
https://leetcode.com

Output:
http://localhost:5000/leetcode

### Analytics

Total Clicks: 25

Last Visit:
2026-06-03 10:45 PM

Browser Breakdown:
Chrome: 18
Firefox: 4
Edge: 3

Device Breakdown:
Desktop: 20
Mobile: 5

---

## Loom Video Link
video link :

[https://www.loom.com/share/30646573ef334562b204e5728745c432]

---

## GitHub Repository

Add your repository link here:

[GITHUB_REPOSITORY_LINK]

---

This project is a part of a hackathon run by https://katomaran.com
