# TODO — RailSync Prototype

> **PS 26027:** AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways

## Status Key

- [ ] Not started
- [ ] 🔄 In progress
- [x] Complete

---

## Phase 1 — Data Model & Database

- [x] Design PostgreSQL schema (`database/schema.sql`)
- [x] Create seed data files (`data/stations.json`, `tracks.json`, `trains.json`, `assets.json`, `crews.json`)
- [x] Create Train Time Table seed data (`data/timetable.json`)
- [x] Create goods trains forecast seed data (`data/goods_forecast.json`)
- [x] Write seed script (`database/seed.py`)
- [x] Set up Docker Compose (PostgreSQL)

## Phase 2 — FastAPI Backend

- [x] Project scaffolding (`backend/main.py`)
- [x] Pydantic schemas (`backend/schemas/`)
- [x] CRUD endpoints: stations, tracks, trains, assets
- [x] Event ingestion endpoints (`POST /api/events/*`)

## Phase 3 — Kafka Streaming

- [ ] Add Kafka (KRaft mode, no ZooKeeper needed) to Docker Compose
- [ ] Create Kafka topics (see AGENTS.md §7)
- [ ] Track producer (`producers/track.py`)
- [ ] FastAPI → Kafka integration (publish on event ingest)
- [ ] Basic consumer (`streaming/consumers/`)

## Phase 4 — TimescaleDB Events

- [ ] Create hypertables for time-series events
- [ ] Consumer writes validated events to TimescaleDB
- [ ] Event validation + enrichment pipeline

## Phase 5 — Remaining Producers

- [ ] Signalling producer (`producers/signalling.py`)
- [ ] Electrical producer (`producers/electrical.py`)
- [ ] Traffic producer (`producers/traffic.py`)
- [ ] Weather producer (`producers/weather.py`)
- [ ] Crew producer (`producers/crew.py`)
- [ ] Correlated / causal event behavior (weather → track degradation)

## Phase 6 — Digital Twin

- [ ] Network model (`digital_twin/network.py`)
- [ ] State management (`digital_twin/state.py`)
- [ ] Kafka-driven state updates
- [ ] Conflict detection (`digital_twin/conflict.py`)

## Phase 7 — AI Priority Scoring

- [x] Rule-based priority formula (`ai/priority.py`)
- [x] Priority level classification (LOW / MEDIUM / HIGH / CRITICAL)
- [x] Explainable reasons output
- [x] Unit tests for scoring

## Phase 8 — Maintenance Requests

- [x] Maintenance request model + CRUD API
- [x] Auto-generation from priority thresholds

## Phase 9 — Department Agents

- [ ] Base agent class (`agents/base_agent.py`)
- [ ] Track agent (`agents/track_agent.py`)
- [ ] Signalling agent (`agents/signalling_agent.py`)
- [ ] Electrical agent (`agents/electrical_agent.py`)
- [ ] Traffic agent (`agents/traffic_agent.py`)
- [ ] Weather agent (`agents/weather_agent.py`)
- [ ] Crew agent (`agents/crew_agent.py`)

## Phase 10 — Coordinator

- [ ] Coordinator service (`agents/coordinator.py`)
- [ ] Overlap detection between department requests
- [ ] Joint possession proposal
- [ ] Conflict resolution logic

## Phase 11 — CP-SAT Optimizer

- [ ] Optimizer data models (`optimizer/models.py`)
- [ ] Constraints definition (`optimizer/constraints.py`)
- [ ] Scheduler / solver (`optimizer/scheduler.py`)
- [ ] Integrate Train Time Table as constraint input
- [ ] Integrate goods trains forecast as constraint input
- [ ] Weekly + monthly horizon support (see AGENTS.md §21)

## Phase 12 — What-If Simulation

- [ ] Simulation engine (`digital_twin/simulation.py`)
- [ ] Impact estimation (predicted delays, conflicts)
- [ ] Candidate plan comparison (Plan A vs Plan B)

## Phase 13 — Next.js Dashboard

- [ ] Project setup (Next.js + TypeScript + Tailwind CSS)
- [ ] Live Corridor map view (MapLibre / Leaflet)
- [ ] Maintenance Requests table
- [ ] AI Recommendation panel (approve / modify / reject)
- [ ] Event Monitor (live Kafka feed)
- [ ] Time horizon switcher (daily / weekly / monthly)

## Phase 14 — Approval & Feedback

- [ ] Approve / reject / modify API endpoints
- [ ] Execution feedback events → Kafka (`railway.feedback`)
- [ ] Feedback loop closes back to database + model improvement

## Phase 15 — Integration & Testing

- [ ] Unit tests: priority scoring, event validation, constraints
- [ ] Integration tests: FastAPI → Kafka → consumer → PostgreSQL
- [ ] End-to-end demo scenario (storm narrative — see AGENTS.md §20)

## Phase 16 — Dockerize & Deploy

- [ ] Full Docker Compose (all services)
- [ ] `.env.example` with all config vars
- [ ] README with setup + run instructions
- [ ] Optional Azure deployment (Container Apps + Event Hubs + Azure PostgreSQL)
