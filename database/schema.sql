-- RailSync Core Database Schema
-- Prototype PostgreSQL Schema for Corridor Maintenance Planning

-- 1. Stations Table
CREATE TABLE IF NOT EXISTS stations (
    station_id VARCHAR(10) PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    division VARCHAR(50) NOT NULL,
    zone VARCHAR(10) NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lon NUMERIC(9, 6) NOT NULL,
    platforms INT DEFAULT 2,
    km_marker NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tracks Table
CREATE TABLE IF NOT EXISTS tracks (
    track_id VARCHAR(10) PRIMARY KEY,
    from_station_id VARCHAR(10) NOT NULL REFERENCES stations(station_id),
    to_station_id VARCHAR(10) NOT NULL REFERENCES stations(station_id),
    name VARCHAR(100) NOT NULL,
    length_km NUMERIC(6, 2) NOT NULL,
    track_type VARCHAR(50) DEFAULT 'DOUBLE_ELECTRIFIED',
    max_speed_kmh INT DEFAULT 110,
    electrification VARCHAR(20) DEFAULT '25kV AC',
    criticality NUMERIC(3, 2) NOT NULL DEFAULT 0.50,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Assets Table (Fixed Infrastructure: Track, Signalling, TRD/OHE)
CREATE TABLE IF NOT EXISTS assets (
    asset_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    department VARCHAR(30) NOT NULL, -- ENGINEERING, SIGNALLING, ELECTRICAL
    asset_type VARCHAR(50) NOT NULL,
    track_id VARCHAR(10) NOT NULL REFERENCES tracks(track_id),
    location_km NUMERIC(6, 2) NOT NULL,
    health_score NUMERIC(5, 2) NOT NULL DEFAULT 100.0,
    failure_probability NUMERIC(4, 3) NOT NULL DEFAULT 0.05,
    rul_days INT NOT NULL DEFAULT 60,
    criticality NUMERIC(3, 2) NOT NULL DEFAULT 0.50,
    last_inspection_date DATE,
    overdue_days INT DEFAULT 0,
    priority_score NUMERIC(5, 2) DEFAULT 0.0,
    priority_level VARCHAR(20) DEFAULT 'LOW',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Trains Table
CREATE TABLE IF NOT EXISTS trains (
    train_id VARCHAR(20) PRIMARY KEY,
    train_name VARCHAR(100) NOT NULL,
    train_type VARCHAR(30) NOT NULL, -- PREMIUM_PASSENGER, EXPRESS, FREIGHT
    origin VARCHAR(10) NOT NULL,
    destination VARCHAR(10) NOT NULL,
    priority INT DEFAULT 2, -- 1: highest (Rajdhani/Vande Bharat), 2: Express, 3: Freight
    max_speed_kmh INT DEFAULT 110,
    current_station_id VARCHAR(10) REFERENCES stations(station_id),
    next_station_id VARCHAR(10) REFERENCES stations(station_id),
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Timetable Slots Table (Passenger Timetable from COA)
CREATE TABLE IF NOT EXISTS timetable_slots (
    slot_id VARCHAR(20) PRIMARY KEY,
    train_id VARCHAR(20) NOT NULL REFERENCES trains(train_id),
    track_id VARCHAR(10) NOT NULL REFERENCES tracks(track_id),
    from_station_id VARCHAR(10) NOT NULL REFERENCES stations(station_id),
    to_station_id VARCHAR(10) NOT NULL REFERENCES stations(station_id),
    scheduled_departure VARCHAR(10) NOT NULL,
    scheduled_arrival VARCHAR(10) NOT NULL,
    direction VARCHAR(10) DEFAULT 'DN',
    is_critical BOOLEAN DEFAULT FALSE,
    corridor_window_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Crews Table (Maintenance Gangs & Resources)
CREATE TABLE IF NOT EXISTS crews (
    crew_id VARCHAR(20) PRIMARY KEY,
    gang_name VARCHAR(100) NOT NULL,
    department VARCHAR(30) NOT NULL, -- ENGINEERING, SIGNALLING, ELECTRICAL
    base_station_id VARCHAR(10) NOT NULL REFERENCES stations(station_id),
    headcount INT NOT NULL DEFAULT 8,
    lead_supervisor VARCHAR(100),
    skills TEXT[] DEFAULT '{}',
    available BOOLEAN DEFAULT TRUE,
    shift_start VARCHAR(10) DEFAULT '08:00',
    shift_end VARCHAR(10) DEFAULT '16:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Goods Forecasts Table (FOIS / Control Office)
CREATE TABLE IF NOT EXISTS goods_forecasts (
    forecast_id VARCHAR(20) PRIMARY KEY,
    rake_type VARCHAR(50) NOT NULL,
    origin_station VARCHAR(50) NOT NULL,
    destination_station VARCHAR(50) NOT NULL,
    expected_track_id VARCHAR(10) NOT NULL REFERENCES tracks(track_id),
    forecast_entry_time VARCHAR(10) NOT NULL,
    forecast_exit_time VARCHAR(10) NOT NULL,
    tonnage NUMERIC(8, 2),
    speed_restriction_kmh INT DEFAULT 75,
    flexibility_window_mins INT DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Maintenance Requests Table (BDMS / TMS / SMMS / TDMS)
CREATE TABLE IF NOT EXISTS maintenance_requests (
    request_id VARCHAR(50) PRIMARY KEY,
    source_system VARCHAR(20) NOT NULL, -- TMS, SMMS, TDMS, BDMS
    department VARCHAR(30) NOT NULL,
    asset_id VARCHAR(20) REFERENCES assets(asset_id),
    track_id VARCHAR(10) NOT NULL REFERENCES tracks(track_id),
    description TEXT,
    requested_date DATE NOT NULL,
    preferred_window_start VARCHAR(10) NOT NULL,
    preferred_window_end VARCHAR(10) NOT NULL,
    duration_minutes INT NOT NULL,
    priority_score NUMERIC(5, 2) DEFAULT 50.0,
    urgency VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SCHEDULED, APPROVED, REJECTED, COMPLETED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Block Recommendations Table (Optimizer Output)
CREATE TABLE IF NOT EXISTS block_recommendations (
    recommendation_id VARCHAR(30) PRIMARY KEY,
    track_id VARCHAR(10) NOT NULL REFERENCES tracks(track_id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT NOT NULL,
    participating_departments TEXT[] NOT NULL DEFAULT '{}',
    maintenance_request_ids TEXT[] NOT NULL DEFAULT '{}',
    expected_delay_minutes INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, MODIFIED, EXECUTED
    reasons TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Weather Reports Table
CREATE TABLE IF NOT EXISTS weather_reports (
    weather_id VARCHAR(20) PRIMARY KEY,
    station_id VARCHAR(10) NOT NULL REFERENCES stations(station_id),
    temperature_c NUMERIC(4, 1),
    rainfall_mm NUMERIC(5, 1) DEFAULT 0.0,
    wind_speed_kmh NUMERIC(5, 1) DEFAULT 0.0,
    visibility_km NUMERIC(4, 1) DEFAULT 10.0,
    condition VARCHAR(50) DEFAULT 'CLEAR',
    track_risk_factor NUMERIC(3, 2) DEFAULT 1.0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assets_track ON assets(track_id);
CREATE INDEX IF NOT EXISTS idx_assets_department ON assets(department);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_track ON maintenance_requests(track_id);
CREATE INDEX IF NOT EXISTS idx_timetable_track ON timetable_slots(track_id);
CREATE INDEX IF NOT EXISTS idx_block_recommendations_status ON block_recommendations(status);
