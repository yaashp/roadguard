# 🚦 RoadGuard — Smart Road Safety & Pothole Detection Platform

RoadGuard is a full-stack demo platform for reporting potholes and road
hazards, tracking complaints, exploring road history, and getting
hazard-aware alternative routes. It runs completely out of the box —
no MongoDB or Google Maps API key required — and upgrades automatically
once you add them.

---

## 1. Project structure

```text
roadguard/
├── client/          React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/   UI building blocks (map, layout, forms…)
│   │   ├── pages/        Route-level pages
│   │   ├── layouts/      Public and dashboard shells
│   │   ├── hooks/        useGeolocation, useRoadIssues
│   │   ├── services/     API client, Google Maps loader
│   │   ├── context/      Auth, Theme, Notifications, Toasts
│   │   └── utils/        Formatting, geo/projection helpers
│   └── .env             VITE_GOOGLE_MAPS_API_KEY, VITE_API_BASE_URL
│
├── server/           Express + Mongoose backend
│   ├── controllers/  Route handlers
│   ├── models/        Mongoose schemas (User, Complaint, RoadIssue, RoadHistory)
│   ├── routes/        Express routers
│   ├── middleware/    JWT auth, upload, error handling
│   ├── data/          In-memory mock data layer + seeded demo data
│   ├── uploads/        Uploaded complaint photos
│   └── .env            PORT, JWT_SECRET, MONGODB_URI, GOOGLE_MAPS_API_KEY
│
└── package.json      Root scripts to run both at once
```

---

## 2. Quick start

```bash
# from the roadguard/ folder
npm run install:all   # installs server + client dependencies
npm run dev            # runs the API (port 5000) and the client (port 5173) together
```

Then open **http://localhost:5173**.

Demo login: **demo@roadguard.app** / **password123**
Admin login: **admin@roadguard.app** / **admin123** (visit `/admin` after logging in)

If you'd rather run them separately:

```bash
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:5173 (proxies /api to the server)
```

---

## 3. Running without any setup (Demo Mode)

By default:

- **No MongoDB required.** The server falls back to an in-memory mock data
  layer (`server/data/store.js`) seeded with realistic potholes, accidents,
  construction zones, hazards, complaints, and road history around
  **Mumbai, Navi Mumbai, and Thane**. Mongoose schemas are still defined in
  `server/models/` — see "Connecting a real database" below to swap them in.
- **No Google Maps API key required.** The client renders a fully
  interactive **Demo Map** (`client/src/components/map/DemoMap.jsx`) that
  projects real lat/lng coordinates onto a stylized satellite-style canvas —
  markers, route lines, click-to-pick-location, and your live GPS dot all
  work exactly as they would on the real map.

This means you can run the whole product — auth, reporting, complaint
tracking, road history charts, and hazard-aware routing — with zero paid
services.

---

## 4. Adding a real Google Maps key

1. In [Google Cloud Console](https://console.cloud.google.com/), enable:
   - **Maps JavaScript API**
   - **Directions API**
   - **Places API**
   - **Geocoding API**
2. Create an API key and restrict it to your domain/localhost.
3. Add it to **`client/.env`**:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```
4. Restart the client (`npm run dev:client`). `RoadMap.jsx` automatically
   detects the key and switches from the Demo Map to the real
   `GoogleMapView.jsx` component — no other code changes needed.

You can also set `GOOGLE_MAPS_API_KEY` in `server/.env` if you extend the
backend to do server-side geocoding later.

> **Note on routing:** the alternative-route feature currently computes
> route polylines client-side (straight-line interpolation + a hazard-avoiding
> offset) and scores them against known hazards via the backend
> (`POST /api/routes/alternative`). Once you have a Maps key, swap the
> polyline generation in `RoutePlanner.jsx` for a real
> `google.maps.DirectionsService` call (with `avoidHighways`/waypoints) —
> the scoring endpoint already accepts any array of `{lat, lng}` points.

---

## 5. Connecting a real database

By default `MONGODB_URI` is empty in `server/.env`, so the app uses the
mock data layer. To use real MongoDB:

1. Set `MONGODB_URI` in `server/.env`, e.g.
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/roadguard
   ```
2. Start MongoDB locally (or point at Atlas).
3. The schemas in `server/models/` (`User`, `Complaint`, `RoadIssue`,
   `RoadHistory`) already match the mock data shape — wire the controllers
   in `server/controllers/` to use them instead of `server/data/store.js`
   (a thin swap since the field names line up 1:1).

If the connection fails, the server automatically logs a warning and
falls back to mock mode so the app never breaks.

---

## 6. Environment variables

**`server/.env`**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
MONGODB_URI=                     # leave blank to use mock data
GOOGLE_MAPS_API_KEY=YOUR_API_KEY
```

**`client/.env`**
```env
VITE_GOOGLE_MAPS_API_KEY=        # leave blank for Demo Map Mode
VITE_API_BASE_URL=/api
```

Never commit real API keys or secrets — both `.env` files are git-ignored;
only the `.env.example` templates are tracked.

---

## 7. Key API endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/auth/me` | Current user (requires auth) |
| POST | `/api/complaints` | Submit a complaint (multipart, `image` field) |
| GET | `/api/complaints/my` | Your complaints |
| GET | `/api/complaints/all` | All complaints (admin only) |
| PUT | `/api/complaints/:id` | Update status/severity (admin) |
| GET | `/api/road-issues` | Map markers (potholes, accidents, hazards…) |
| GET | `/api/roads` | List of roads with history |
| GET | `/api/roads/:id/history` | Full history for one road |
| POST | `/api/routes/check` | Score a single route's hazard exposure |
| POST | `/api/routes/alternative` | Compare a fastest vs. safer route |

## 8. Route safety scoring

Implemented in `server/utils/routeSafety.js`, fully modular:

```
Start at 100
– Pothole:      Low -5   Medium -10  High -20
– Accident:     Low -15  Medium -20  High -25
– Construction: Low -5   Medium -10  High -15
– Hazard:       Low -10  Medium -20  High -30

90–100 → Very Safe   75–89 → Safe   50–74 → Moderate   < 50 → Risky
```

Tune the `PENALTIES` object or `HAZARD_RADIUS_METERS` to change scoring
behavior without touching any caller.

---

## 9. Image uploads

Photos are stored locally under `server/uploads/` via Multer, validated
for type (JPG/PNG/WEBP) and size (≤5MB), and served statically at
`/uploads/<filename>`. To move to production storage, replace the
`multer.diskStorage` in `server/middleware/upload.js` with a
Cloudinary/S3/Firebase upload and store the returned URL instead of the
local path — no other code changes are required since controllers only
ever store a URL string.

---

## 10. Notes on this build

This is a demo-quality, fully wired full-stack scaffold intended for
learning, prototyping, and presentation (e.g. a college major project). A
few things are simplified by design and called out in code comments:

- The "Continue with Google" button on the login page is a UI placeholder
  (no OAuth flow is wired up).
- Saved Routes and Settings toggles persist only in memory/local state for
  this demo, not to the backend.
- The Demo Map is a stylized projection, not real map tiles — it exists so
  the whole app works without a paid API key. Swapping in a real key
  upgrades it automatically.
