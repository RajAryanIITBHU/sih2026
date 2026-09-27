# TODO — Bare Minimum Prototype

> Get one end-to-end vertical slice working. Nothing fancy. Just prove the concept.

┌────────────────────────────────────────────────────┐
│                    RAILSYNC                        │
├────────────────────────────────────────────────────┤
│                                                    │
│  1. Data Hub                                       │
│       ↓                                            │
│  2. Maintenance Intelligence                       │
│       ↓                                            │
│  3. Block Planner                                  │
│       ↓                                            │
│  4. Digital Twin / Corridor Map                    │
│       ↓                                            │
│  5. Controller Approval                            │
│       ↓                                            │
│  6. Execution + Feedback                           │
│                                                    │
└────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL DATA SOURCES                               │
├────────────────┬────────────────┬────────────────┬──────────────────────────┤
│      TMS       │      SMMS      │      TDMS      │  Control Office / COA   │
│ Train/Traffic  │ Maintenance    │ Defects &      │ Train timetable          │
│ Information    │ Management     │ Asset data     │ Goods train forecast     │
└───────┬────────┴───────┬────────┴───────┬────────┴────────────┬─────────────┘
        │                │                │                     │
        └────────────────┴────────────────┴─────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA INTEGRATION LAYER                              │
│                                                                             │
│  API Connectors │ CSV/Excel Import │ Data Validation │ Transformation       │
│  Scheduler      │ Schema Mapping   │ Deduplication   │ Data Quality        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          UNIFIED DATA PLATFORM                              │
│                                                                             │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────────────┐ │
│ │ Operational DB   │ │ Time-Series DB   │ │ Historical / Analytics Store │ │
│ │ PostgreSQL       │ │ TimescaleDB      │ │ Maintenance History          │ │
│ │                  │ │                  │ │ Train History                 │ │
│ │ Assets           │ │ Asset readings   │ │ Block History                 │ │
│ │ Tasks            │ │ Events           │ │ Failure History              │ │
│ │ Blocks           │ │ Traffic          │ │ Performance Metrics           │ │
│ └──────────────────┘ └──────────────────┘ └──────────────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INTELLIGENCE LAYER                                  │
│                                                                             │
│ ┌────────────────┐ ┌──────────────────┐ ┌────────────────────────────────┐ │
│ │ Maintenance    │ │ Risk / Failure   │ │ Traffic & Goods Forecast       │ │
│ │ Intelligence   │ │ Prediction       │ │                                │ │
│ │                │ │                  │ │ Forecast traffic density       │ │
│ │ Criticality    │ │ Failure risk     │ │ Identify low/high traffic      │ │
│ │ Urgency        │ │ Anomaly          │ │ Predict block pressure         │ │
│ │ Overdue status │ │ RUL*             │ │                                │ │
│ │ Asset impact   │ │                  │ │                                │ │
│ └───────┬────────┘ └────────┬─────────┘ └───────────────┬────────────────┘ │
│         └───────────────────┴────────────────────────────┘                  │
│                             │                                               │
│                             ▼                                               │
│                  ┌──────────────────────────┐                               │
│                  │ AI PRIORITIZATION ENGINE │                               │
│                  │                          │                               │
│                  │ Maintenance Priority    │                               │
│                  │ Risk Score               │                               │
│                  │ Safety Impact             │                               │
│                  │ Availability Impact       │                               │
│                  └────────────┬─────────────┘                               │
└───────────────────────────────┼─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MULTI-DEPARTMENT COORDINATION                           │
│                                                                             │
│     Track Agent       S&T Agent       OHE Agent       Crew Agent             │
│          │                │               │                │                 │
│          └────────────────┴───────────────┴────────────────┘                 │
│                                   │                                         │
│                         Coordination Engine                                 │
│                                   │                                         │
│                  Detect overlapping maintenance                              │
│                  Identify compatible activities                              │
│                  Check crew/resource availability                            │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BLOCK OPTIMIZATION ENGINE                             │
│                              OR-Tools CP-SAT                                │
│                                                                             │
│  INPUTS                                                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Maintenance Tasks │ Priority │ Duration │ Criticality │ Department   │  │
│  │ Available Blocks  │ Timetable│ Freight  │ Crew        │ Constraints  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  HARD CONSTRAINTS                                                           │
│  • Safety constraints                                                       │
│  • Train/block conflicts                                                    │
│  • Crew availability                                                        │
│  • Resource availability                                                    │
│  • Maintenance duration                                                     │
│  • Department constraints                                                   │
│                                                                             │
│  OPTIMIZATION OBJECTIVES                                                    │
│  • Maximize maintenance completion                                          │
│  • Maximize asset availability                                              │
│  • Minimize train disruption                                                │
│  • Minimize number of possessions                                           │
│  • Minimize unused block capacity                                           │
│  • Minimize maintenance backlog                                             │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DIGITAL TWIN / SIMULATION                           │
│                                                                             │
│  Railway Corridor Model                                                     │
│       │                                                                     │
│       ├── Tracks                                                             │
│       ├── Stations                                                           │
│       ├── Assets                                                             │
│       ├── Trains                                                             │
│       ├── Maintenance Zones                                                 │
│       └── Blocks                                                             │
│                                                                             │
│  Conflict Detection → Impact Analysis → What-if Simulation                  │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PLAN GENERATION                                      │
│                                                                             │
│              ┌───────────────────────┐                                      │
│              │ Optimized Block Plan  │                                      │
│              └───────────┬───────────┘                                      │
│                          │                                                  │
│              ┌───────────┴───────────┐                                      │
│              ▼                       ▼                                      │
│       WEEKLY PLAN              MONTHLY PLAN                                 │
│                                                                             │
│  • Maintenance windows   • Long-term capacity planning                     │
│  • Crew allocation       • Planned maintenance                             │
│  • Train impact          • Future block requirements                        │
│  • Daily execution       • Resource forecasting                             │
└───────────────────────────┬─────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONTROLLER DASHBOARD                                 │
│                                                                             │
│  Fleet Health │ Maintenance Queue │ Block Planner │ Digital Twin            │
│                                                                             │
│  AI Recommendations │ Conflicts │ What-if │ Analytics                       │
│                                                                             │
│              ┌───────────┬───────────┬───────────┐                           │
│              │           │           │           │                           │
│            APPROVE      MODIFY      REJECT      SIMULATE                     │
└───────────────────────────┬─────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EXECUTION & FEEDBACK LOOP                                │
│                                                                             │
│       Approved Plan → Work Orders → Maintenance Execution                   │
│                                  │                                          │
│                                  ▼                                          │
│                         Actual vs Planned                                   │
│                                  │                                          │
│             ┌────────────────────┼────────────────────┐                     │
│             ▼                    ▼                    ▼                     │
│         Completion            Delays             New Defects                 │
│             │                    │                    │                      │
│             └────────────────────┴────────────────────┘                     │
│                                  │                                          │
│                                  ▼                                          │
│                         Analytics / Model Improvement                        │
└──────────────────────────────────┴──────────────────────────────────────────┘

## The One Demo That Matters

```text
Storm starts → track health drops → priority rises → block requested →
optimizer finds window → dashboard shows it → controller approves
```

If this works, you have a prototype. Everything else is polish.

---

## 0. Project Setup

- [x] `docker-compose.yml` — PostgreSQL only (`postgres:16-alpine`, add Kafka later)
- [x] Python venv + `requirements.txt` with latest packages (`fastapi>=0.141.1`, `uvicorn[standard]>=0.52.4`, `psycopg2-binary>=2.9.12`, `ortools>=9.15.6755`, `kafka-python>=3.0.11`, `pydantic>=2.13.5`)
- [x] `.env.example` and local `.env`

## 1. Seed Data (hardcoded, ~30 min)

Create minimal JSON files — **don't overthink this**:

- [x] `data/stations.json` — 10 stations on corridor (Delhi → Ghaziabad → Hapur → Moradabad → Bareilly → Shahjahanpur)
- [x] `data/tracks.json` — 10 track segments connecting them
- [x] `data/assets.json` — 10 assets (mix of track, signal, OHE) placed on those tracks
- [x] `data/trains.json` — 10 trains with timetable slots (Vande Bharat, Express, Freight)
- [x] `data/timetable.json` — 10 schedule windows when trains use each track
- [x] `data/crews.json` — 10 crews across Engineering, S&T, and Electrical
- [x] `data/goods_forecast.json` — 10 goods train forecast entries from Control Office

## 2. Database (1 table at a time)

- [x] `database/schema.sql` — tables: `stations`, `tracks`, `assets`, `trains`, `maintenance_requests`, `block_recommendations`
- [x] `database/seed.py` — loads the JSON files into PostgreSQL
- [x] Verify: `SELECT * FROM assets;` returns rows

## 3. FastAPI — Just CRUD

- [x] `backend/main.py` — app startup, DB connection
- [x] `GET /api/stations` — returns all stations
- [x] `GET /api/assets` — returns all assets
- [x] `GET /api/trains` — returns all trains
- [x] `POST /api/events/track` — accepts `{asset_id, health, vibration, temperature}`, updates asset row
- [x] `GET /api/maintenance/requests` — returns all maintenance requests
- [x] `GET /api/recommendations` — returns all block recommendations
- [x] Verify: `curl localhost:8000/api/assets` returns JSON

## 4. Priority Scoring (no ML, just math)

- [x] `ai/priority.py` — the formula:
  ```text
  priority = 0.30 * failure_prob + 0.20 * criticality + 0.20 * traffic_density + 0.15 * overdue + 0.15 * failure_history
  ```
- [x] Function: `calculate_priority(asset) → {score, level, reasons}`
- [x] Wire it: when `POST /api/events/track` updates health, recalculate priority
- [x] If priority > 60 (HIGH), auto-create a maintenance request
- [x] Verify: POST a low health value → see maintenance request appear

## 5. Optimizer (simplest CP-SAT)

- [x] `optimizer/scheduler.py` — takes pending maintenance requests + train timetable
- [x] Hard constraint: block cannot overlap with a train slot on the same track
- [x] Hard constraint: crew must be available
- [x] Objective: minimize total train delay + maximize priority coverage
- [x] `POST /api/optimize` — runs solver, returns recommended block plan
- [x] Verify: call optimize → get a valid time window back

## 6. Approve / Reject

- [x] `POST /api/recommendations/{id}/approve` — marks as APPROVED
- [x] `POST /api/recommendations/{id}/reject` — marks as REJECTED
- [x] Verify: approve a recommendation → status changes in DB

## 7. Frontend (absolute minimum)

- [x] `npx create-next-app@latest frontend --typescript --tailwind --eslint --app`
- [x] One page: `/` — dashboard with 3 panels:
  - Asset table (asset_id, health, priority, level) — color-coded
  - Maintenance requests table
  - Recommendations with **Approve / Reject** buttons
- [x] Fetch from FastAPI on load
- [x] Verify: see assets, click approve, see status change

---

## 🎯 At This Point You Have

```text
Seed data → PostgreSQL → FastAPI → Priority scoring → Maintenance request →
CP-SAT optimizer → Recommended block → Dashboard → Approve/Reject
```

That's the **full PS flow** without Kafka, without agents, without a map, without a digital twin. It works. It demos. It proves the concept.

---

## 8. Add Kafka (only after above works)

- [ ] Add Kafka (KRaft mode, no ZooKeeper needed) to `docker-compose.yml`
- [ ] Topic: `railway.track`
- [ ] `producers/track.py` — sends synthetic track health events every 3s
- [ ] FastAPI publishes to Kafka on event ingest
- [ ] Consumer reads from Kafka → updates DB → recalculates priority
- [ ] Verify: start producer → watch priorities change in dashboard

## 9. Add the Storm Scenario

- [ ] `producers/weather.py` — weather producer (just one: NORMAL → HEAVY_RAIN)
- [ ] When weather = HEAVY_RAIN, track producer degrades health faster (causal link)
- [ ] Priority auto-rises → maintenance request auto-created → run optimizer
- [ ] Verify: the full storm narrative plays out without manual intervention

## 10. Add a Map (if time permits)

- [ ] Leaflet or MapLibre on the dashboard
- [ ] Plot the 5 stations as markers
- [ ] Color tracks by worst asset health (green/yellow/red)
- [ ] Show active maintenance blocks as overlays

## 11. Add Agents (if time permits)

- [ ] `agents/track_agent.py` — watches track events, generates block requests
- [ ] `agents/coordinator.py` — collects requests, merges overlapping ones
- [ ] Wire coordinator output → optimizer input

---

## What NOT To Build Yet

- ❌ TimescaleDB hypertables
- ❌ Digital Twin simulation engine
- ❌ ML models
- ❌ All 6 department agents
- ❌ Real-time WebSocket updates
- ❌ Azure deployment
- ❌ PostGIS / GeoJSON
- ❌ Monthly planning horizon
- ❌ Feedback loop

These come AFTER the core flow works. See [TODO.md](./TODO.md) for the full plan.
