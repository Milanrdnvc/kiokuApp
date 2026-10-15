# Kioku - Bachelor Thesis Project
University of Belgrade, Faculty of Electrical Engineering
Department of Computer Engineering and Information Theory

Welcome to the repository for Kioku — a specialized web application for Japanese vocabulary and Kanji learning built around a Spaced Repetition System (SRS).

---

## Project Overview

Kioku (Japanese: 記憶 — memory, recollection) is a full-stack web application developed for my Bachelor Thesis project at the Faculty of Electrical Engineering, University of Belgrade.

The project addresses the challenges of mastering Japanese vocabulary, Kanji and gramamar by leveraging Spaced Repetition System (SRS) algorithms to schedule reviews at optimal intervals, ensuring long-term retention.

---

## Key Features

- Spaced Repetition System (SRS): SM-2 and FSRS algorithms determining card review intervals based on user recall quality.
- Deck Management: Create, edit, and structure personalized decks as well as use premade decks as part of a curriculum.
- Interactive Study Sessions: Dynamic flashcard review system implementing the core SRS scheduling logic for efficient learning.
- Streak & Activity Tracker: Representation of daily study habits, progress analytics, and streak preservation.
- User Authentication: Secure account creation with progress saved per individual profile.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular |
| Backend | Node.js + Express |
| Database | MongoDB |
| ORM / ODM | Mongoose |
| Authentication | JWT (JSON Web Token) |

---

## Installation & Setup

Clone the repository to your local environment:

git clone https://github.com/your-username/kioku.git
cd kioku

### Backend Setup

cd backend
npm install
npm run dev

### Frontend Setup

cd frontend
npm install
ng serve

Once both servers are running, open your browser at http://localhost:4200.

---

## License

This project is licensed under the MIT License - see https://choosealicense.com/licenses/mit/ for details.
