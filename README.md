# Kioku (きおく) - Bachelor Thesis Project
University of Belgrade, Faculty of Electrical Engineering
Department of Computer Engineering and Informatics

Welcome to the repository for Kioku (きおく) — an intelligent web application designed for Japanese language learning and spaced repetition, featuring sentence decomposition and progress tracking.

---

## Project Overview

Kioku (Japanese: 記憶 — memory, recollection) is a full-stack web application developed as my Bachelor Thesis project at the Faculty of Electrical Engineering, University of Belgrade.

The platform optimizes Japanese language acquisition by combining a Spaced Repetition System (SRS) with automated sentence analysis. Users can efficiently manage flashcard decks, generate furigana and word breakdowns, and track daily learning streaks to build consistent study habits.

---

## Key Features

- Spaced Repetition System (SRS): Optimized review scheduling based on memory retention intervals for vocabulary and grammar.
- Interactive Decks: Create, organize, and categorize custom decks for various JLPT levels (N5–N1) and personal vocabulary lists.
- Sentence Analysis & Breakdown: Automatic Japanese text parsing that provides word-by-word breakdowns, dictionary definitions, and furigana readings.
- Streak & Analytics Dashboard: Visual stats for tracking daily study habits, mastered cards, and active learning streaks.
- User Authentication & Profiles: Secure authentication with progress synchronized across user profiles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular |
| Backend | Node.js + Express |
| Database | MongoDB |
| ORM / ODM | Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Text Analysis | Japanese Morphological Analyzer |

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
