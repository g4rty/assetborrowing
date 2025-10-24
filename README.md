# Asset Borrowing App

Flutter client with a small Node/Express backend for handling login, registration, and role-based portals.

## Prerequisites

- Flutter SDK
- Node.js (v16+ recommended)
- MySQL running locally with an `asset_borrowing` database

## Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd assetborrowing
   ```
2. **Install Flutter dependencies**
   ```bash
   flutter pub get
   ```
3. **Install Node dependencies**
   ```bash
   npm install
   ```
4. **Configure the database**
   - Ensure MySQL is running.
   - Update `backend/db.js` if your credentials differ.
   - Seed the `users` table with the roles you expect (`1 = staff`, `2 = lecturer`, `3 = student`).

5. **Run the backend**
   ```bash
   npm run dev
   ```
   This uses `nodemon backend/shared.js` for hot reload.

6. **Run the Flutter app**
   ```bash
   flutter run
   ```

## Notes

- The Flutter app targets `http://localhost:3000` for API calls. Change this to the machine IP when testing on a physical device/emulator that cannot reach `localhost`.
- `awesome_dialog` is used for login feedback. Run `flutter pub get` after cloning so the package is available.
