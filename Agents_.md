
---

## 4. Engineering Principles

### 4.1 Prototype First

Prefer the simplest implementation that demonstrates the concept.

**Do NOT initially build:**

- A nationwide railway model
- A production-grade multi-agent framework
- Deep reinforcement learning
- Complex distributed optimization
- Real railway control integration
- Autonomous operational control

**Build:**

- One corridor
- 5–10 stations
- 10–20 assets
- A few trains
- A few maintenance jobs
- Simulated live events
- One working optimization scenario

### 4.2 Human-in-the-Loop

The system is a **decision-support system**.

AI recommends.

The controller:

- Reviews
- Modifies
- Approves
- Rejects

Never design the prototype as an autonomous system that directly controls railway infrastructure.

### 4.3 Explainability

Every recommendation should expose:

- Why an asset received its priority
- Which constraints affected scheduling
- Why the selected time window was preferred
- Expected operational impact

### 4.4 Event-Driven Design

Real-time changes should enter through events.

Prefer:

```text
Producer → Kafka → Consumer → Processing → State/Database
```

over tightly coupling every service directly to every other service.

### 4.5 Idempotency

Consumers should safely handle duplicate events.

Use:

- `event_id`
- Source timestamp
- Source system
- Entity ID

Avoid creating duplicate state changes when the same event is received twice.

---

## 5. Repository Structure

Recommended:

```text
railsync/
├── AGENTS.md
├── DESIGN.md
├── README.md
├── docker-compose.yml
├── .env.example
│
├── backend/
│   ├── main.py
│   ├── api/
│   ├── schemas/
│   ├── services/
│   └── kafka/
│
├── producers/
│   ├── track.py
│   ├── signalling.py
│   ├── electrical.py
│   ├── traffic.py
│   ├── weather.py
│   └── crew.py
│
├── streaming/
│   ├── consumers/
│   ├── processors/
│   └── enrichment/
│
├── database/
│   ├── schema.sql
│   ├── seed.py
│   └── migrations/
│
├── ai/
│   ├── priority.py
│   ├── anomaly.py
│   └── failure_prediction.py
│
├── agents/
│   ├── base_agent.py
│   ├── track_agent.py
│   ├── signalling_agent.py
│   ├── electrical_agent.py
│   ├── traffic_agent.py
│   ├── weather_agent.py
│   ├── crew_agent.py
│   └── coordinator.py
│
├── optimizer/
│   ├── models.py
│   ├── constraints.py
│   └── scheduler.py
│
├── digital_twin/
│   ├── network.py
│   ├── state.py
│   ├── conflict.py
│   └── simulation.py
│
├── data/
│   ├── stations.json
│   ├── tracks.json
│   ├── trains.json
│   ├── assets.json
│   └── seed_events/
│
└── frontend/
    └── nextjs-app/
```

---

## 6. Event Contract

All Kafka events should contain a common envelope:

```json
{
  "event_id": "uuid",
  "event_type": "TRACK_HEALTH",
  "source": "track-simulator",
  "entity_id": "AST001",
  "timestamp": "2026-09-09T10:30:00Z",
  "version": 1,
  "payload": {}
}
```

**Rules:**

- `event_id` must be unique.
- `timestamp` must be ISO-8601.
- `event_type` must be explicit.
- `payload` contains domain-specific data.
- Do not put secrets into events.
- Validate incoming payloads with Pydantic.

---

## 7. Kafka Topics

Initial topics:

```text
railway.track
railway.signalling
railway.electrical
railway.traffic
railway.weather
railway.crew
railway.maintenance
railway.optimization
railway.execution
railway.feedback
```

For the basic prototype:

- One broker
- One partition per topic is acceptable
- Use consumer groups where multiple independent consumers need the same event stream

Example:

```text
railway.traffic
       ↓
Digital Twin Consumer
       ↓
Dashboard Consumer
       ↓
Analytics Consumer
```

---

## 8. Data Streams

### Track

```json
{
  "asset_id": "TRK001",
  "track_id": "TRACK01",
  "health": 58,
  "vibration": 7.2,
  "temperature": 42
}
```

### Signalling

```json
{
  "signal_id": "SIG01",
  "track_id": "TRACK01",
  "status": "WARNING"
}
```

### Electrical / OHE

```json
{
  "asset_id": "OHE01",
  "track_id": "TRACK01",
  "voltage": 24.5,
  "status": "DEGRADING"
}
```

### Traffic

```json
{
  "train_id": "T101",
  "track_id": "TRACK01",
  "position_km": 34.2,
  "speed": 71,
  "status": "RUNNING"
}
```

### Weather

```json
{
  "location": "ST02",
  "rain_mm": 12.4,
  "visibility_km": 4.2,
  "condition": "HEAVY_RAIN"
}
```

### Crew

```json
{
  "crew_id": "C12",
  "department": "ENGINEERING",
  "location": "ST02",
  "available": true
}
```

---

## 9. Data Source Policy

### Prototype

Use:

1. Static railway infrastructure data
2. Synthetic operational streams
3. Optional public/authorized APIs

The synthetic streams should behave realistically rather than being completely random.

Example causal chain:

```text
Heavy rain
    ↓
Track vibration rises
    ↓
Track health falls
    ↓
Failure probability rises
    ↓
Maintenance priority rises
    ↓
Track agent requests maintenance
```

### Real Operational Data

If an authorized live API/feed becomes available, create a connector:

```text
External API
    ↓
Connector / Poller
    ↓
FastAPI
    ↓
Kafka
```

Do not scrape or access restricted/proprietary railway systems without authorization.

---

## 10. Department Agents

Agents are lightweight domain services, not necessarily autonomous LLM agents.

### Track Agent

Responsible for:

- Track health
- Defects
- Overdue work
- Maintenance duration
- Track block request

### Signalling Agent

Responsible for:

- Signal/S&T defects
- Signalling maintenance
- Signalling block requirements

### Electrical Agent

Responsible for:

- Traction/OHE conditions
- Electrical maintenance
- Disconnection requirements

### Traffic Agent

Responsible for:

- Train movement
- Train density
- Corridor occupancy
- Operational conflicts
- Disruption impact

### Weather Agent

Responsible for:

- Weather conditions
- Disruption risk
- Weather-related constraints

### Crew Agent

Responsible for:

- Crew availability
- Crew location
- Required skills
- Resource conflicts

### Coordinator

Responsible for:

- Collecting requests
- Finding overlaps
- Proposing joint possessions
- Resolving obvious conflicts
- Sending the unified request to the optimizer

---

## 11. AI Priority Score

Start with an explainable score:

```text
priority =
    0.30 * failure_probability
  + 0.20 * criticality
  + 0.20 * traffic_density
  + 0.15 * overdue_score
  + 0.15 * failure_history
```

Normalize all inputs to 0–1.

**Output levels:**

| Range  | Level    |
|--------|----------|
| 0–30   | LOW      |
| 30–60  | MEDIUM   |
| 60–80  | HIGH     |
| 80–100 | CRITICAL |

Return both the score and its components.

Example:

```json
{
  "asset_id": "TRK001",
  "priority": 87,
  "level": "CRITICAL",
  "reasons": [
    "high failure probability",
    "high traffic density",
    "low remaining useful life"
  ]
}
```

Only introduce ML after the rule-based flow works.

---

## 12. Optimizer Rules

Use **OR-Tools CP-SAT**.

**Inputs:**

- Maintenance jobs
- Priority scores
- Requested windows
- Train Time Table (passenger timetable from COA)
- Goods trains forecast (from Control Office)
- Corridor availability (block windows from COA)
- Maintenance duration
- Crew availability
- Resource requirements
- Department constraints
- Safety constraints

**Initial objectives:**

Minimize:

- Train disruption
- Number of maintenance blocks
- Resource conflicts
- Operational conflicts

Maximize:

- Asset availability
- Maintenance priority coverage

Hard constraints must never be violated.

Do not allow the optimizer to invent an operationally unsafe schedule.

---

## 13. Digital Twin

The basic Digital Twin is a live virtual state of the selected corridor.

**Represent:**

- Stations
- Tracks
- Assets
- Trains
- Active blocks
- Maintenance jobs

Kafka events update the twin.

Example:

```text
Kafka:
Train T101 moved to TRACK02

        ↓

Digital Twin:
T101.position = new_position
TRACK02.occupied = true
```

The twin should support:

- Live state
- Conflict detection
- What-if simulation
- Impact estimates

The simulation can initially use deterministic rules instead of a complex physical model.

---

## 14. Frontend Requirements

Use **Next.js + TypeScript**.

Minimum screens:

### Live Corridor

- Map
- Stations
- Tracks
- Train positions
- Asset status
- Active maintenance blocks

### Maintenance Requests

- Department
- Asset
- Priority
- Requested window
- Duration
- Status

### AI Recommendation

- Recommended block
- Participating departments
- Expected train impact
- Resource usage
- Reasons
- Approve / Modify / Reject

### Event Monitor

Show recent real-time events:

```text
10:31:02 TRAIN T101 moved
10:31:04 TRACK001 health → 55
10:31:06 WEATHER → heavy rain
10:31:08 priority TRACK001 → 89
```

---

## 15. API Guidelines

Example endpoints:

```text
GET  /api/stations
GET  /api/tracks
GET  /api/trains
GET  /api/assets

POST /api/events/track
POST /api/events/signalling
POST /api/events/electrical
POST /api/events/traffic
POST /api/events/weather
POST /api/events/crew

GET  /api/maintenance/requests
POST /api/maintenance/requests

GET  /api/recommendations
POST /api/recommendations/{id}/approve
POST /api/recommendations/{id}/reject
POST /api/recommendations/{id}/modify

GET /api/digital-twin/state
POST /api/simulation/run
```

---

## 16. Testing

Every major component should have basic tests.

### Unit Tests

- Priority scoring
- Event validation
- Schedule constraints
- Conflict detection

### Integration Tests

- FastAPI → Kafka
- Kafka → processor
- Processor → PostgreSQL
- Optimizer → recommendation

### Demo Test

Run the complete scenario:

```text
Heavy rain event
    ↓
Track health deteriorates
    ↓
Priority increases
    ↓
Track Agent requests block
    ↓
Traffic Agent reports train conflict
    ↓
Coordinator merges requests
    ↓
CP-SAT finds a feasible window
    ↓
Digital Twin simulates it
    ↓
Dashboard displays recommendation
    ↓
Controller approves
    ↓
Execution feedback is generated
```

---

## 17. Development Order

Implement in this order:

1. PostgreSQL schema
2. Seed railway data
3. FastAPI CRUD
4. Kafka locally
5. One track producer
6. One Kafka consumer
7. TimescaleDB event storage
8. Traffic producer
9. Live Digital Twin
10. Priority scoring
11. Maintenance requests
12. Department agents
13. Coordinator
14. CP-SAT optimizer
15. Simulation
16. Next.js dashboard
17. Approval workflow
18. Feedback loop
19. Add remaining streams
20. Dockerize
21. Optional Azure deployment

Do not start with Azure or AI agents before the basic event pipeline works.

---

## 18. Definition of Done

The MVP is successful when:

- A simulated railway event is generated
- FastAPI can receive it
- Kafka transports it
- A consumer processes it
- The event is stored
- The Digital Twin changes
- AI priority can change
- A maintenance request can be generated
- Department agents can contribute requests
- CP-SAT can produce a feasible block
- Digital Twin can estimate impact
- The dashboard shows the recommendation
- A controller can approve/reject it
- Execution feedback enters the event pipeline

The project should feel like one coherent system rather than a collection of disconnected demos.

---

## 19. What Not To Do

**Avoid:**

- Claiming real Indian Railways API access without authorization
- Hardcoding the final schedule in the frontend
- Using an LLM for deterministic scheduling
- Replacing CP-SAT with an LLM
- Letting AI directly control railway operations
- Building six complicated agent frameworks
- Creating a huge database before the streaming path works
- Deploying everything to Azure before local validation
- Generating random events with no causal relationship
- Hiding why the system made a recommendation

---

## 20. Core Demo Narrative

The strongest demo is:

```text
A storm starts
      ↓
Weather stream changes
      ↓
Kafka distributes the event
      ↓
Track condition deteriorates
      ↓
AI increases maintenance priority
      ↓
Track Agent requests a maintenance block
      ↓
Traffic Agent reports upcoming trains
      ↓
Electrical/Signalling agents contribute overlapping work
      ↓
Coordinator combines compatible jobs
      ↓
CP-SAT searches feasible windows
      ↓
Digital Twin simulates candidate plans
      ↓
Best low-disruption plan is recommended
      ↓
Controller approves
      ↓
Execution result is captured
      ↓
Feedback returns to the system
```

This is the primary behavior the prototype should optimize for.

---

## 21. Time Horizons

The PS requires block plans over multiple time horizons.

For the prototype, support at minimum:

- **Daily** — immediate / emergency blocks (today)
- **Weekly** — rolling 7-day block plan
- **Monthly** — forward-looking 30-day plan

The optimizer should accept a `horizon` parameter that controls the planning window. The dashboard should allow the controller to switch between views.

Weekly and monthly plans can initially be generated as batch runs of the same CP-SAT model over a wider time window with relaxed optimality gaps.