# AGENTS.md — RailSync Prototype

## 1. Project Context

**Problem Statement ID:** 26027
**Title:** AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways

**PS Flow:** Predict → Prioritize → Coordinate → Optimize → Simulate → Human Approve → Execute → Learn

### Verbatim Problem Statement

> **Background:** Railway maintenance for fixed infrastructure of Engineering, Traction Distribution, and Signal & Telecommunication departments is currently planned independently. Each department requests maintenance blocks/disconnections via the BDMS system. This planning process is decentralized and manual. This often leads to inefficient block utilization, poor coordination, and suboptimal scheduling, which may reduce asset availability and impact train operations.
>
> **Detailed Description:** Maintenance data — such as defects and overdue tasks — is maintained separately in systems like Track Management System (TMS), Signalling Maintenance & Management System (SMMS), and Traction Distribution Management System (TDMS). Meanwhile, the Control Office Application (COA) manages block corridor availability. Without integration and coordinated scheduling, maintenance blocks/disconnections are not optimally planned, resulting in asset downtime and reduced availability of fixed infrastructure for train operation. Your task is to develop an Automatic Block Planning system that integrates maintenance, defects and corridor data to generate optimized block schedules. The system should prioritize maintenance activities to minimize asset downtime and maximize the availability of critical infrastructure, ensuring uninterrupted train operations.
>
> **Expected Solution:** Participants should build an AI system that includes:
>
> 1. Integration of maintenance data (defects, overdue maintenance) from TMS, SMMS, and TDMS with corridor block and block availability as per the Train Time Table and the goods trains forecast from the Control Office.
> 2. Uses AI/ML algorithms to prioritize and schedule maintenance tasks based on criticality, urgency, and impact on asset availability.
> 3. Optimize block scheduling to maximize asset uptime by minimizing downtime and efficiently coordinating multi-department activities.
> 4. Provides block plans over multiple time horizons — weekly and monthly — to support both short-term and long-term maintenance.
>
> The solution should transform current decentralized and manual block planning into a data-driven, coordinated process that maximizes asset availability, improves safety, and supports reliable train operations.

### How RailSync Maps to the PS

| PS Requirement | RailSync Component |
|---|---|
| Integration of TMS, SMMS, TDMS data | Kafka streams + FastAPI ingestion (§6–§9) |
| Corridor block availability from COA | Traffic Agent + Train Time Table data (§10) |
| Train Time Table + goods trains forecast | Optimizer inputs (§12) |
| AI/ML prioritization | AI Priority Score (§11) |
| Optimized block scheduling | CP-SAT Optimizer (§12) |
| Multi-department coordination | Department Agents + Coordinator (§10) |
| Weekly and monthly block plans | Time Horizons (§21) |
| Data-driven, coordinated process | Full pipeline (§2) |

### Scope

RailSync is a prototype decision-support platform for coordinating fixed-infrastructure maintenance across:

- Engineering / Track
- Traction Distribution / Electrical / OHE
- Signal & Telecommunication (S&T)
- Traffic / Operations
- Weather / Disruptions
- Maintenance Crew / Resources

The core problem is decentralized maintenance planning. Departments may request blocks independently through systems such as BDMS, while maintenance/defect data is separated across TMS, SMMS and TDMS and corridor availability is handled by COA. The prototype should integrate these inputs, prioritize maintenance, coordinate departments, optimize block schedules and present the recommendation to a railway controller.

> **Important:** This is a prototype/simulation. Do not claim access to proprietary Indian Railways operational systems unless an actual authorized integration exists.

---

## 2. Primary Goal

Build one complete vertical slice:

```text
Data Sources
    ↓
FastAPI Ingestion
    ↓
Kafka Event Streams
    ↓
Stream Processing
    ↓
PostgreSQL / TimescaleDB
    ↓
Digital Twin
    ↓
AI Maintenance Priority
    ↓
Department Agents
    ↓
CP-SAT Optimization
    ↓
Digital Twin What-If Simulation
    ↓
Controller Dashboard
    ↓
Approval / Execution
    ↓
Feedback → Kafka
```

The prototype should favor a working end-to-end flow over sophisticated individual components.

---

## 3. Technology Stack

### Backend

- Python
- FastAPI
- Pydantic

### Streaming

- Apache Kafka
- Kafka producers and consumers
- One broker is sufficient for local development

### Data Processing

- Pandas
- GeoPandas where geospatial processing is required

### Storage

- PostgreSQL
- TimescaleDB for time-series events
- PostGIS for railway geography if available

### AI / ML

- Python
- scikit-learn for a basic model when needed
- Start with an explainable priority-scoring formula before introducing ML

### Optimization

- Google OR-Tools
- CP-SAT

### Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS

### Maps / Digital Twin

- GeoJSON
- PostGIS
- MapLibre or Leaflet

### Infrastructure

- Docker / Docker Compose
- Azure for optional cloud deployment

### Azure

A possible cloud mapping is:

```text
FastAPI          → Azure Container Apps
Kafka            → Azure Event Hubs Kafka-compatible endpoint
PostgreSQL       → Azure Database for PostgreSQL
Containers       → Azure Container Registry
Secrets          → Azure Key Vault
Monitoring       → Azure Monitor
Frontend         → Azure Container Apps or Static Web Apps
```
