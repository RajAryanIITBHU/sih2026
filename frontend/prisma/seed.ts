import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function cleanDatabase() {
  console.log("🧹 Cleaning up existing data...");
  const tablenames = [
    "audit_logs",
    "attachments",
    "notifications",
    "data_quality_metrics",
    "sync_logs",
    "simulation_results",
    "simulation_runs",
    "simulation_scenarios",
    "maintenance_executions",
    "work_order_resources",
    "work_orders",
    "plan_tasks",
    "plan_blocks",
    "maintenance_plans",
    "optimization_constraints",
    "optimization_runs",
    "agent_proposals",
    "ai_agents",
    "ai_recommendations",
    "task_priority_scores",
    "asset_predictions",
    "block_conflicts",
    "block_requests",
    "block_windows",
    "goods_forecasts",
    "timetable_slots",
    "train_runs",
    "trains",
    "resources",
    "team_members",
    "teams",
    "employees",
    "maintenance_tasks",
    "defects",
    "inspections",
    "asset_health_history",
    "assets",
    "asset_types",
    "track_segments",
    "stations",
    "corridors",
    "divisions",
    "zones",
    "data_sources",
    "user_roles",
    "roles",
    "users",
    "departments",
  ];

  for (const table of tablenames) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    } catch {
      // ignore if table doesn't exist yet
    }
  }
}

async function main() {
  await cleanDatabase();
  console.log("🌱 Starting comprehensive database seed for SIH 2026 Railway Decision Support System...");

  const now = new Date();
  const monthsAgo = (m: number, d = 15) => new Date(now.getFullYear(), now.getMonth() - m, d, 10, 0, 0);
  const weeksAgo = (w: number) => new Date(now.getTime() - w * 7 * 24 * 3600 * 1000);
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 3600 * 1000);
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000);

  // ==========================================
  // 1. Departments
  // ==========================================
  console.log("-> Seeding Departments...");
  const deptEng = await prisma.department.create({
    data: {
      code: "ENG",
      name: "Engineering (Track & Permanent Way)",
      description: "Responsible for rail track, formation, turnouts, switches, and civil structures maintenance.",
    },
  });

  const deptOhe = await prisma.department.create({
    data: {
      code: "OHE",
      name: "Overhead Equipment (Electrical Traction)",
      description: "Maintains 25kV AC contact wire, catenary wire, tension masts, and traction substations.",
    },
  });

  const deptSnt = await prisma.department.create({
    data: {
      code: "SNT",
      name: "Signaling & Telecommunication",
      description: "Maintains electronic interlocking, point machines, signals, track circuits, and axle counters.",
    },
  });

  const deptTraffic = await prisma.department.create({
    data: {
      code: "TRAFFIC",
      name: "Traffic & Operations",
      description: "Handles train scheduling, line capacity, section controllers, and timetable adherence.",
    },
  });

  const deptCivil = await prisma.department.create({
    data: {
      code: "CIVIL",
      name: "Civil Works & Bridges",
      description: "Maintains bridges, culverts, station platforms, and drainage systems.",
    },
  });

  // ==========================================
  // 2. Roles
  // ==========================================
  console.log("-> Seeding Roles...");
  const roleAdmin = await prisma.role.create({
    data: { name: "ADMIN", description: "Full system administration and user access control." },
  });
  const roleController = await prisma.role.create({
    data: { name: "CONTROLLER", description: "Section Controller with block approval and timetable rights." },
  });
  const roleEngOfficer = await prisma.role.create({
    data: { name: "ENGINEERING_OFFICER", description: "Senior Section Engineer (P-Way/Track)." },
  });
  const roleOheOfficer = await prisma.role.create({
    data: { name: "OHE_OFFICER", description: "Divisional Electrical Engineer (Traction Distribution)." },
  });
  const roleSigOfficer = await prisma.role.create({
    data: { name: "SIGNALING_OFFICER", description: "Senior Divisional Signal & Telecom Engineer." },
  });
  const roleMaintMgr = await prisma.role.create({
    data: { name: "MAINTENANCE_MANAGER", description: "Coordinates multi-departmental block possessions." },
  });
  const roleFieldEng = await prisma.role.create({
    data: { name: "FIELD_ENGINEER", description: "Field site engineers executing work orders." },
  });
  const roleViewer = await prisma.role.create({
    data: { name: "VIEWER", description: "Read-only access to Digital Twin and dashboards." },
  });

  // ==========================================
  // 3. Users & UserRoles
  // ==========================================
  console.log("-> Seeding Users & Roles...");
  const userAdmin = await prisma.user.create({
    data: {
      employeeCode: "EMP-ADMIN-01",
      name: "Rajesh Sharma",
      email: "rajesh.sharma@railways.gov.in",
      phone: "+91 9876543210",
      departmentId: deptTraffic.id,
      designation: "Chief Section Controller",
      isActive: true,
      userRoles: {
        create: [{ roleId: roleAdmin.id }, { roleId: roleController.id }],
      },
    },
  });

  const userEng = await prisma.user.create({
    data: {
      employeeCode: "EMP-ENG-102",
      name: "Amit Verma",
      email: "amit.verma@railways.gov.in",
      phone: "+91 9811223344",
      departmentId: deptEng.id,
      designation: "Sr. Section Engineer (Track)",
      isActive: true,
      userRoles: {
        create: [{ roleId: roleEngOfficer.id }, { roleId: roleMaintMgr.id }],
      },
    },
  });

  const userOhe = await prisma.user.create({
    data: {
      employeeCode: "EMP-OHE-204",
      name: "Priya Nair",
      email: "priya.nair@railways.gov.in",
      phone: "+91 9822334455",
      departmentId: deptOhe.id,
      designation: "Divisional Electrical Engineer",
      isActive: true,
      userRoles: {
        create: [{ roleId: roleOheOfficer.id }],
      },
    },
  });

  const userSnt = await prisma.user.create({
    data: {
      employeeCode: "EMP-SNT-305",
      name: "Vikramaditya Singh",
      email: "vikram.singh@railways.gov.in",
      phone: "+91 9833445566",
      departmentId: deptSnt.id,
      designation: "Sr. DSTE (Signaling)",
      isActive: true,
      userRoles: {
        create: [{ roleId: roleSigOfficer.id }],
      },
    },
  });

  const userField = await prisma.user.create({
    data: {
      employeeCode: "EMP-FLD-409",
      name: "Deepak Kumar",
      email: "deepak.kumar@railways.gov.in",
      phone: "+91 9844556677",
      departmentId: deptEng.id,
      designation: "Junior Engineer (P-Way)",
      isActive: true,
      userRoles: {
        create: [{ roleId: roleFieldEng.id }],
      },
    },
  });

  // ==========================================
  // 4. Railway Network (Zone, Division, Corridors, Stations, Segments)
  // ==========================================
  console.log("-> Seeding Railway Network (Zone, Division, Corridors, Stations)...");
  const zoneNR = await prisma.zone.create({
    data: {
      code: "NR",
      name: "Northern Railway",
    },
  });

  const divisionDelhi = await prisma.division.create({
    data: {
      zoneId: zoneNR.id,
      code: "DLI",
      name: "Delhi Division",
    },
  });

  const divisionLucknow = await prisma.division.create({
    data: {
      zoneId: zoneNR.id,
      code: "LKO",
      name: "Lucknow Division",
    },
  });

  const divisionPrayagraj = await prisma.division.create({
    data: {
      zoneId: zoneNR.id,
      code: "PRYJ",
      name: "Prayagraj Division",
    },
  });

  // Stations for C-01 & C-02
  const stationNDLS = await prisma.station.create({
    data: {
      code: "NDLS",
      name: "New Delhi",
      latitude: 28.6143,
      longitude: 77.209,
    },
  });

  const stationGZB = await prisma.station.create({
    data: {
      code: "GZB",
      name: "Ghaziabad Junction",
      latitude: 28.6692,
      longitude: 77.4538,
    },
  });

  const stationALJN = await prisma.station.create({
    data: {
      code: "ALJN",
      name: "Aligarh Junction",
      latitude: 27.8974,
      longitude: 78.088,
    },
  });

  const stationCNB = await prisma.station.create({
    data: {
      code: "CNB",
      name: "Kanpur Central",
      latitude: 26.4547,
      longitude: 80.3507,
    },
  });

  // Stations for C-03: Lucknow - Varanasi Corridor
  const stationLKO = await prisma.station.create({
    data: {
      code: "LKO",
      name: "Lucknow Charbagh",
      latitude: 26.8322,
      longitude: 80.9234,
    },
  });

  const stationSLN = await prisma.station.create({
    data: {
      code: "SLN",
      name: "Sultanpur Junction",
      latitude: 26.2648,
      longitude: 82.0727,
    },
  });

  const stationJOP = await prisma.station.create({
    data: {
      code: "JOP",
      name: "Jaunpur City",
      latitude: 25.7534,
      longitude: 82.6841,
    },
  });

  const stationBSB = await prisma.station.create({
    data: {
      code: "BSB",
      name: "Varanasi Junction (Cantt)",
      latitude: 25.3284,
      longitude: 82.9882,
    },
  });

  // Stations for C-04: Varanasi - Prayagraj Corridor
  const stationMZP = await prisma.station.create({
    data: {
      code: "MZP",
      name: "Mirzapur",
      latitude: 25.1462,
      longitude: 82.5694,
    },
  });

  const stationPRYJ = await prisma.station.create({
    data: {
      code: "PRYJ",
      name: "Prayagraj Junction",
      latitude: 25.4437,
      longitude: 81.826,
    },
  });

  // Corridor C-01: High Density Trunk
  const corridorC01 = await prisma.corridor.create({
    data: {
      divisionId: divisionDelhi.id,
      code: "C-01",
      name: "New Delhi - Ghaziabad - Aligarh High Density Corridor",
      startStationId: stationNDLS.id,
      endStationId: stationALJN.id,
      distanceKm: 130.5,
      isActive: true,
    },
  });

  // Corridor C-02: Aligarh - Kanpur Central
  const corridorC02 = await prisma.corridor.create({
    data: {
      divisionId: divisionDelhi.id,
      code: "C-02",
      name: "Aligarh - Tundla - Kanpur Central Trunk Corridor",
      startStationId: stationALJN.id,
      endStationId: stationCNB.id,
      distanceKm: 304.2,
      isActive: true,
    },
  });

  // Corridor C-03: Lucknow - Varanasi
  const corridorC03 = await prisma.corridor.create({
    data: {
      divisionId: divisionLucknow.id,
      code: "C-03",
      name: "Lucknow - Sultanpur - Varanasi Main Line Corridor",
      startStationId: stationLKO.id,
      endStationId: stationBSB.id,
      distanceKm: 284.0,
      isActive: true,
    },
  });

  // Corridor C-04: Varanasi - Prayagraj
  const corridorC04 = await prisma.corridor.create({
    data: {
      divisionId: divisionPrayagraj.id,
      code: "C-04",
      name: "Varanasi - Mirzapur - Prayagraj Fast Trunk",
      startStationId: stationBSB.id,
      endStationId: stationPRYJ.id,
      distanceKm: 125.0,
      isActive: true,
    },
  });

  // Link station corridor references
  await prisma.station.update({ where: { id: stationNDLS.id }, data: { corridorId: corridorC01.id } });
  await prisma.station.update({ where: { id: stationGZB.id }, data: { corridorId: corridorC01.id } });
  await prisma.station.update({ where: { id: stationALJN.id }, data: { corridorId: corridorC01.id } });
  await prisma.station.update({ where: { id: stationCNB.id }, data: { corridorId: corridorC02.id } });
  await prisma.station.update({ where: { id: stationLKO.id }, data: { corridorId: corridorC03.id } });
  await prisma.station.update({ where: { id: stationSLN.id }, data: { corridorId: corridorC03.id } });
  await prisma.station.update({ where: { id: stationJOP.id }, data: { corridorId: corridorC03.id } });
  await prisma.station.update({ where: { id: stationBSB.id }, data: { corridorId: corridorC03.id } });
  await prisma.station.update({ where: { id: stationMZP.id }, data: { corridorId: corridorC04.id } });
  await prisma.station.update({ where: { id: stationPRYJ.id }, data: { corridorId: corridorC04.id } });

  // Digital Twin Track Segments
  const trackSegment1 = await prisma.trackSegment.create({
    data: {
      corridorId: corridorC01.id,
      code: "TS-NDLS-GZB-01",
      startKm: 0.0,
      endKm: 28.5,
      lengthKm: 28.5,
      status: "ACTIVE",
      geometry: {
        type: "LineString",
        coordinates: [
          [77.209, 28.6143],
          [77.312, 28.638],
          [77.4538, 28.6692],
        ],
      },
    },
  });

  const trackSegment2 = await prisma.trackSegment.create({
    data: {
      corridorId: corridorC01.id,
      code: "TS-GZB-ALJN-02",
      startKm: 28.5,
      endKm: 130.5,
      lengthKm: 102.0,
      status: "ACTIVE",
      geometry: {
        type: "LineString",
        coordinates: [
          [77.4538, 28.6692],
          [77.721, 28.214],
          [78.088, 27.8974],
        ],
      },
    },
  });

  const trackSegment3 = await prisma.trackSegment.create({
    data: {
      corridorId: corridorC03.id,
      code: "TS-LKO-SLN-03",
      startKm: 0.0,
      endKm: 140.0,
      lengthKm: 140.0,
      status: "ACTIVE",
      geometry: {
        type: "LineString",
        coordinates: [
          [80.9234, 26.8322],
          [81.451, 26.541],
          [82.0727, 26.2648],
        ],
      },
    },
  });

  const trackSegment4 = await prisma.trackSegment.create({
    data: {
      corridorId: corridorC04.id,
      code: "TS-BSB-PRYJ-04",
      startKm: 0.0,
      endKm: 125.0,
      lengthKm: 125.0,
      status: "ACTIVE",
      geometry: {
        type: "LineString",
        coordinates: [
          [82.9882, 25.3284],
          [82.5694, 25.1462],
          [81.826, 25.4437],
        ],
      },
    },
  });

  // ==========================================
  // 5. Data Sources (34) & Ingestion Health
  // ==========================================
  console.log("-> Seeding Data Sources...");
  const dsTms = await prisma.dataSource.create({
    data: {
      name: "TMS",
      sourceType: "REST_API",
      systemName: "Train Management System",
      description: "Real-time train positioning, live tracking, and signal occupancy.",
      endpoint: "https://tms.cris.indianrailways.gov.in/api/v1/feed",
      updateFrequency: 30,
      status: "ACTIVE",
      lastSyncAt: new Date(),
      configuration: { protocol: "HTTPS", format: "JSON", rateLimitRps: 50 },
    },
  });

  const dsSmms = await prisma.dataSource.create({
    data: {
      name: "SMMS",
      sourceType: "IOT_TELEMETRY",
      systemName: "Smart Maintenance Management System",
      description: "Asset IoT telemetry, vibration sensors, thermal cameras, and point machine stroke counters.",
      endpoint: "mqtts://iot.smms.cris.org.in:8883/telemetry",
      updateFrequency: 60,
      status: "ACTIVE",
      lastSyncAt: new Date(),
    },
  });

  const dsFois = await prisma.dataSource.create({
    data: {
      name: "FOIS",
      sourceType: "DATABASE_MIRROR",
      systemName: "Freight Operating Information System",
      description: "Goods rake locations, loading forecasts, and heavy commodity haulage plans.",
      updateFrequency: 300,
      status: "ACTIVE",
      lastSyncAt: new Date(),
    },
  });

  const dsWeather = await prisma.dataSource.create({
    data: {
      name: "IMD_WEATHER",
      sourceType: "REST_API",
      systemName: "Indian Meteorological Department Weather Radar",
      description: "Temperature, heavy monsoon rainfall warnings, fog visibility, and lightning alerts.",
      updateFrequency: 1800,
      status: "ACTIVE",
      lastSyncAt: new Date(),
    },
  });

  // Sync Logs & Quality Metrics
  await prisma.syncLog.createMany({
    data: [
      {
        sourceId: dsTms.id,
        status: "SUCCESS",
        recordsReceived: 1420,
        recordsInserted: 120,
        recordsUpdated: 1300,
        recordsFailed: 0,
      },
      {
        sourceId: dsSmms.id,
        status: "SUCCESS",
        recordsReceived: 5600,
        recordsInserted: 5580,
        recordsUpdated: 20,
        recordsFailed: 0,
      },
    ],
  });

  await prisma.dataQualityMetric.create({
    data: {
      sourceId: dsTms.id,
      measuredAt: new Date(),
      totalRecords: 10000,
      validRecords: 9600,
      missingRecords: 200,
      errorRecords: 200,
      qualityScore: 96.0,
    },
  });

  // ==========================================
  // 6. Asset Management & Digital Twin Assets
  // ==========================================
  console.log("-> Seeding Asset Types & Assets...");
  const typeTrack = await prisma.assetType.create({
    data: {
      code: "TRACK",
      name: "60kg UIC Rail & Turnout Point",
      departmentId: deptEng.id,
      criticality: "CRITICAL",
    },
  });

  const typePoint = await prisma.assetType.create({
    data: {
      code: "POINT_MACHINE",
      name: "IRS Thick Web Point Machine",
      departmentId: deptSnt.id,
      criticality: "CRITICAL",
    },
  });

  const typeOhe = await prisma.assetType.create({
    data: {
      code: "OHE",
      name: "25kV AC Catenary & Contact Wire Span",
      departmentId: deptOhe.id,
      criticality: "HIGH",
    },
  });

  const typeSignal = await prisma.assetType.create({
    data: {
      code: "SIGNAL",
      name: "Multi-Aspect Colour Light Signal (MACLS)",
      departmentId: deptSnt.id,
      criticality: "HIGH",
    },
  });

  const typeBridge = await prisma.assetType.create({
    data: {
      code: "BRIDGE",
      name: "Open Web Steel Girder Bridge",
      departmentId: deptCivil.id,
      criticality: "HIGH",
    },
  });

  const typeRollingStock = await prisma.assetType.create({
    data: {
      code: "ROLLING_STOCK",
      name: "Electric Locomotives & Heavy Haul Freight Wagons",
      departmentId: deptTraffic.id,
      criticality: "HIGH",
    },
  });

  // Assets in C-01 (New Delhi - Ghaziabad - Aligarh)
  const assetTrack = await prisma.asset.create({
    data: {
      assetCode: "AST-TRK-NDLS-101",
      assetTypeId: typeTrack.id,
      corridorId: corridorC01.id,
      trackSegmentId: trackSegment1.id,
      stationId: stationGZB.id,
      name: "Turnout Point 1:12 Gauge Face Crossing (Km 24/1)",
      description: "60kg 1080 Head Hardened rail turnout at Ghaziabad entry junction.",
      installationDate: new Date("2021-04-15"),
      lastMaintenanceAt: monthsAgo(1),
      nextMaintenanceAt: daysAgo(-5),
      criticalityScore: 92.5,
      operationalStatus: "ACTIVE",
      latitude: 28.665,
      longitude: 77.448,
      metadata: { railSection: "60kg", sleeperType: "PSC-Mono", wearMm: 4.8 },
    },
  });

  const assetPoint = await prisma.asset.create({
    data: {
      assetCode: "AST-PM-GZB-44B",
      assetTypeId: typePoint.id,
      corridorId: corridorC01.id,
      trackSegmentId: trackSegment1.id,
      stationId: stationGZB.id,
      name: "Point Machine 44B (Turnout Crossover)",
      description: "High-speed clamp point machine on Mainline crossover.",
      installationDate: new Date("2022-01-20"),
      lastMaintenanceAt: monthsAgo(2),
      criticalityScore: 95.0,
      operationalStatus: "ACTIVE",
      latitude: 28.666,
      longitude: 77.449,
      metadata: { operatingCurrentAmp: 4.6, operatingTimeSec: 4.9 },
    },
  });

  const assetOhe = await prisma.asset.create({
    data: {
      assetCode: "AST-OHE-GZB-M14",
      assetTypeId: typeOhe.id,
      corridorId: corridorC01.id,
      trackSegmentId: trackSegment2.id,
      name: "Traction Mast & Tension Assembly Span 32/1-4",
      description: "25kV AC contact wire span with auto-tensioning device.",
      installationDate: new Date("2019-11-01"),
      lastMaintenanceAt: monthsAgo(1),
      criticalityScore: 86.0,
      operationalStatus: "ACTIVE",
      latitude: 28.621,
      longitude: 77.512,
      metadata: { wireTensionKg: 1000, contactWireThicknessMm: 9.3 },
    },
  });

  const assetSignal = await prisma.asset.create({
    data: {
      assetCode: "AST-SIG-NDLS-H2",
      assetTypeId: typeSignal.id,
      corridorId: corridorC01.id,
      stationId: stationNDLS.id,
      name: "Home Signal Post H-2",
      description: "4-aspect LED automatic block signal unit.",
      criticalityScore: 88.0,
      operationalStatus: "ACTIVE",
      latitude: 28.618,
      longitude: 77.214,
    },
  });

  // Assets in C-03 (Lucknow - Varanasi Corridor)
  const assetTrackLKO = await prisma.asset.create({
    data: {
      assetCode: "AST-TRK-SLN-101",
      assetTypeId: typeTrack.id,
      corridorId: corridorC03.id,
      trackSegmentId: trackSegment3.id,
      stationId: stationSLN.id,
      name: "UIC 60kg Rail & Turnout Point (Km 68/2)",
      description: "Heavy freight route turnout on Lucknow - Sultanpur section.",
      installationDate: new Date("2021-02-10"),
      lastMaintenanceAt: monthsAgo(2),
      criticalityScore: 78.0,
      operationalStatus: "ACTIVE",
      latitude: 26.2648,
      longitude: 82.0727,
      metadata: { railSection: "60kg", sleeperType: "PSC-Mono" },
    },
  });

  const assetTrackBSB = await prisma.asset.create({
    data: {
      assetCode: "AST-TRK-BSB-202",
      assetTypeId: typeTrack.id,
      corridorId: corridorC03.id,
      stationId: stationBSB.id,
      name: "Diamond Scissor Crossover (Varanasi Cantt Yard)",
      description: "Heavy passenger junction crossover with 1080 Head Hardened rails.",
      installationDate: new Date("2020-08-15"),
      lastMaintenanceAt: monthsAgo(1),
      criticalityScore: 84.0,
      operationalStatus: "ACTIVE",
      latitude: 25.3284,
      longitude: 82.9882,
      metadata: { railSection: "60kg", layout: "1:12 Diamond" },
    },
  });

  const assetSignalBSB = await prisma.asset.create({
    data: {
      assetCode: "AST-SIG-BSB-12",
      assetTypeId: typeSignal.id,
      corridorId: corridorC03.id,
      stationId: stationBSB.id,
      name: "Electronic Interlocking & Digital Axle Counter Rack",
      description: "Dual fail-safe electronic interlocking for 64 route signals at Varanasi.",
      installationDate: new Date("2023-03-10"),
      lastMaintenanceAt: monthsAgo(2),
      criticalityScore: 72.0,
      operationalStatus: "ACTIVE",
      latitude: 25.329,
      longitude: 82.989,
    },
  });

  const assetOheLKO = await prisma.asset.create({
    data: {
      assetCode: "AST-OHE-LKO-88",
      assetTypeId: typeOhe.id,
      corridorId: corridorC03.id,
      trackSegmentId: trackSegment3.id,
      name: "25kV Traction Catenary & Substation Span 18/2-4",
      description: "Heavy traction feeder line supplying Lucknow - Sultanpur section.",
      installationDate: new Date("2021-06-20"),
      lastMaintenanceAt: monthsAgo(1),
      criticalityScore: 76.0,
      operationalStatus: "ACTIVE",
      latitude: 26.541,
      longitude: 81.451,
    },
  });

  // Assets in C-04 (Varanasi - Prayagraj Corridor)
  const assetTrackMZP = await prisma.asset.create({
    data: {
      assetCode: "AST-TRK-MZP-105",
      assetTypeId: typeTrack.id,
      corridorId: corridorC04.id,
      trackSegmentId: trackSegment4.id,
      stationId: stationMZP.id,
      name: "Continuous Welded Rail (Mirzapur Section Km 48)",
      description: "Long welded rail panel under 25-ton axle load freight traffic.",
      installationDate: new Date("2022-04-12"),
      lastMaintenanceAt: monthsAgo(1),
      criticalityScore: 81.0,
      operationalStatus: "ACTIVE",
      latitude: 25.1462,
      longitude: 82.5694,
    },
  });

  const assetSignalPRYJ = await prisma.asset.create({
    data: {
      assetCode: "AST-SIG-PRYJ-08",
      assetTypeId: typeSignal.id,
      corridorId: corridorC04.id,
      stationId: stationPRYJ.id,
      name: "Multi-Aspect Colour Light Signal Cluster (Prayagraj Entry)",
      description: "LED signal cluster regulating converging routes from Varanasi & Kanpur.",
      installationDate: new Date("2022-09-01"),
      lastMaintenanceAt: monthsAgo(2),
      criticalityScore: 74.0,
      operationalStatus: "ACTIVE",
      latitude: 25.4437,
      longitude: 81.826,
    },
  });

  const assetOhePRYJ = await prisma.asset.create({
    data: {
      assetCode: "AST-OHE-PRYJ-52",
      assetTypeId: typeOhe.id,
      corridorId: corridorC04.id,
      name: "Auto-Tensioning Catenary Span (Prayagraj East Section)",
      description: "High-temperature compensated pulley regulation tension device.",
      installationDate: new Date("2020-05-18"),
      lastMaintenanceAt: monthsAgo(1),
      criticalityScore: 75.0,
      operationalStatus: "ACTIVE",
      latitude: 25.385,
      longitude: 82.124,
    },
  });

  // Rolling Stock Assets
  const assetLocoWAP7 = await prisma.asset.create({
    data: {
      assetCode: "AST-RS-WAP7-302",
      assetTypeId: typeRollingStock.id,
      corridorId: corridorC03.id,
      stationId: stationLKO.id,
      name: "WAP-7 High-Speed Electric Locomotive #30214",
      description: "6000 HP passenger locomotive assigned to Lucknow - Varanasi express trains.",
      installationDate: new Date("2021-10-05"),
      lastMaintenanceAt: weeksAgo(2),
      criticalityScore: 86.0,
      operationalStatus: "ACTIVE",
      latitude: 26.8322,
      longitude: 80.9234,
      metadata: { powerHp: 6000, maxSpeedKmph: 140, bogieType: "Co-Co" },
    },
  });

  const assetFreightBOXN = await prisma.asset.create({
    data: {
      assetCode: "AST-RS-BOXN-554",
      assetTypeId: typeRollingStock.id,
      corridorId: corridorC04.id,
      stationId: stationPRYJ.id,
      name: "BOXNHL Heavy Coal Freight Rake (58 Wagons)",
      description: "25T axle load coal rake operating on Varanasi - Prayagraj trunk.",
      installationDate: new Date("2022-07-20"),
      lastMaintenanceAt: monthsAgo(1),
      criticalityScore: 82.0,
      operationalStatus: "ACTIVE",
      latitude: 25.4437,
      longitude: 81.826,
      metadata: { axleLoadTons: 25.0, wagonCount: 58, brakeType: "BMBS" },
    },
  });

  // ==========================================
  // 7. Asset Health History & AI Predictions (with 6 Months of Temporal Depth)
  // ==========================================
  console.log("-> Seeding Asset Health History & Predictions across past 6 months...");
  await prisma.assetHealthHistory.createMany({
    data: [
      // 5 months ago (Apr 2026)
      { assetId: assetTrack.id, recordedAt: monthsAgo(5), healthScore: 95.5, failureProbability: 0.045, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackLKO.id, recordedAt: monthsAgo(5), healthScore: 96.0, failureProbability: 0.038, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackBSB.id, recordedAt: monthsAgo(5), healthScore: 94.2, failureProbability: 0.052, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackMZP.id, recordedAt: monthsAgo(5), healthScore: 95.0, failureProbability: 0.048, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetOhe.id, recordedAt: monthsAgo(5), healthScore: 93.8, failureProbability: 0.055, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetOheLKO.id, recordedAt: monthsAgo(5), healthScore: 94.5, failureProbability: 0.050, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetSignal.id, recordedAt: monthsAgo(5), healthScore: 97.0, failureProbability: 0.025, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetSignalBSB.id, recordedAt: monthsAgo(5), healthScore: 96.5, failureProbability: 0.030, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetLocoWAP7.id, recordedAt: monthsAgo(5), healthScore: 98.0, failureProbability: 0.020, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetFreightBOXN.id, recordedAt: monthsAgo(5), healthScore: 95.0, failureProbability: 0.042, conditionStatus: "GOOD", sourceId: dsSmms.id },

      // 4 months ago (May 2026)
      { assetId: assetTrack.id, recordedAt: monthsAgo(4), healthScore: 91.8, failureProbability: 0.075, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackBSB.id, recordedAt: monthsAgo(4), healthScore: 90.5, failureProbability: 0.088, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetOhe.id, recordedAt: monthsAgo(4), healthScore: 90.0, failureProbability: 0.090, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetSignalBSB.id, recordedAt: monthsAgo(4), healthScore: 93.0, failureProbability: 0.060, conditionStatus: "GOOD", sourceId: dsSmms.id },

      // 3 months ago (Jun 2026)
      { assetId: assetTrack.id, recordedAt: monthsAgo(3), healthScore: 87.2, failureProbability: 0.115, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackLKO.id, recordedAt: monthsAgo(3), healthScore: 88.0, failureProbability: 0.105, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackMZP.id, recordedAt: monthsAgo(3), healthScore: 89.2, failureProbability: 0.095, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetOheLKO.id, recordedAt: monthsAgo(3), healthScore: 86.4, failureProbability: 0.120, conditionStatus: "GOOD", sourceId: dsSmms.id },

      // 2 months ago (Jul 2026)
      { assetId: assetTrack.id, recordedAt: monthsAgo(2), healthScore: 82.5, failureProbability: 0.145, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackBSB.id, recordedAt: monthsAgo(2), healthScore: 83.0, failureProbability: 0.140, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetSignalPRYJ.id, recordedAt: monthsAgo(2), healthScore: 85.0, failureProbability: 0.125, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetOhePRYJ.id, recordedAt: monthsAgo(2), healthScore: 84.0, failureProbability: 0.130, conditionStatus: "GOOD", sourceId: dsSmms.id },

      // 1 month ago (Aug 2026)
      { assetId: assetTrack.id, recordedAt: monthsAgo(1), healthScore: 78.5, failureProbability: 0.152, remainingUsefulLife: 60.0, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackLKO.id, recordedAt: monthsAgo(1), healthScore: 80.2, failureProbability: 0.160, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackMZP.id, recordedAt: monthsAgo(1), healthScore: 81.5, failureProbability: 0.145, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetLocoWAP7.id, recordedAt: monthsAgo(1), healthScore: 88.0, failureProbability: 0.095, conditionStatus: "GOOD", sourceId: dsSmms.id },

      // 2 weeks ago
      { assetId: assetTrack.id, recordedAt: weeksAgo(2), healthScore: 74.0, failureProbability: 0.220, conditionStatus: "FAIR", sourceId: dsSmms.id },
      { assetId: assetTrackBSB.id, recordedAt: weeksAgo(2), healthScore: 75.0, failureProbability: 0.210, conditionStatus: "FAIR", sourceId: dsSmms.id },
      { assetId: assetOhePRYJ.id, recordedAt: weeksAgo(2), healthScore: 76.5, failureProbability: 0.195, conditionStatus: "FAIR", sourceId: dsSmms.id },

      // 3 days ago & Today (Current condition)
      { assetId: assetTrack.id, recordedAt: daysAgo(3), healthScore: 70.4, failureProbability: 0.310, conditionStatus: "ALERT", sourceId: dsSmms.id },
      { assetId: assetTrack.id, recordedAt: now, healthScore: 68.2, failureProbability: 0.384, remainingUsefulLife: 32.5, conditionStatus: "ALERT", sourceId: dsSmms.id },
      { assetId: assetTrackLKO.id, recordedAt: now, healthScore: 78.0, failureProbability: 0.180, remainingUsefulLife: 65.0, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetTrackBSB.id, recordedAt: now, healthScore: 64.5, failureProbability: 0.420, remainingUsefulLife: 18.0, conditionStatus: "ALERT", sourceId: dsSmms.id },
      { assetId: assetTrackMZP.id, recordedAt: now, healthScore: 81.0, failureProbability: 0.150, remainingUsefulLife: 80.0, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetPoint.id, recordedAt: now, healthScore: 70.0, failureProbability: 0.290, remainingUsefulLife: 42.0, conditionStatus: "ALERT", sourceId: dsSmms.id },
      { assetId: assetSignal.id, recordedAt: now, healthScore: 84.0, failureProbability: 0.120, remainingUsefulLife: 95.0, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetSignalBSB.id, recordedAt: now, healthScore: 76.0, failureProbability: 0.190, remainingUsefulLife: 70.0, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetSignalPRYJ.id, recordedAt: now, healthScore: 74.0, failureProbability: 0.210, remainingUsefulLife: 62.0, conditionStatus: "FAIR", sourceId: dsSmms.id },
      { assetId: assetOhe.id, recordedAt: now, healthScore: 79.0, failureProbability: 0.170, remainingUsefulLife: 75.0, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetOheLKO.id, recordedAt: now, healthScore: 76.0, failureProbability: 0.200, remainingUsefulLife: 68.0, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetOhePRYJ.id, recordedAt: now, healthScore: 69.5, failureProbability: 0.350, remainingUsefulLife: 28.0, conditionStatus: "ALERT", sourceId: dsSmms.id },
      { assetId: assetLocoWAP7.id, recordedAt: now, healthScore: 86.0, failureProbability: 0.110, remainingUsefulLife: 120.0, conditionStatus: "GOOD", sourceId: dsSmms.id },
      { assetId: assetFreightBOXN.id, recordedAt: now, healthScore: 82.0, failureProbability: 0.140, remainingUsefulLife: 90.0, conditionStatus: "GOOD", sourceId: dsSmms.id },
    ],
  });

  // AI Predictive Maintenance Models
  await prisma.assetPrediction.createMany({
    data: [
      {
        assetId: assetTrack.id,
        modelName: "XGBoost-TrackFatigue-v2.4",
        modelVersion: "2.4.1",
        predictionTime: hoursAgo(2),
        failureProbability: 0.384,
        rulValue: 32.5,
        confidenceScore: 92.4,
        prediction: {
          dominantFailureMode: "Rolling Contact Fatigue (RCF)",
          recommendedAction: "Deep rail grinding or 20m rail switch renewal within 14 days.",
        },
      },
      {
        assetId: assetTrackBSB.id,
        modelName: "LSTM-CrossingWear-v3.1",
        modelVersion: "3.1.0",
        predictionTime: hoursAgo(3),
        failureProbability: 0.420,
        rulValue: 18.0,
        confidenceScore: 89.5,
        prediction: {
          dominantFailureMode: "Tongue Rail Micro-Flaw",
          recommendedAction: "Replace tongue blade and test crossover interlocking.",
        },
      },
      {
        assetId: assetOhePRYJ.id,
        modelName: "OHE-ThermalDrift-v1.8",
        modelVersion: "1.8.2",
        predictionTime: hoursAgo(5),
        failureProbability: 0.350,
        rulValue: 28.0,
        confidenceScore: 91.0,
        prediction: {
          dominantFailureMode: "Auto-Tension Pulley Friction",
          recommendedAction: "Re-tension catenary wire and lubricate pulley bearings.",
        },
      },
    ],
  });

  // ==========================================
  // 8. Inspections & Defects (with Realistic Temporal Distribution)
  // ==========================================
  console.log("-> Seeding Inspections & Defects across time...");
  const inspectionTrack = await prisma.inspection.create({
    data: {
      assetId: assetTrack.id,
      inspectorId: userField.id,
      inspectionType: "USFD Ultrasonic Flaw Detection",
      inspectionDate: daysAgo(2),
      conditionScore: 65.0,
      findings: "Sub-surface transverse micro-fissure detected in gauge corner near weld junction.",
      measurements: { flawSizeMm: 4.2, echoAmplitudeDb: 18.5 },
      status: "COMPLETED",
    },
  });

  // Historical resolved defects (months ago)
  await prisma.defect.createMany({
    data: [
      {
        defectCode: "DEF-2026-TRK-APR",
        assetId: assetTrack.id,
        corridorId: corridorC01.id,
        category: "TRACK",
        title: "Track alignment drift at Km 18/4",
        severity: "MEDIUM",
        status: "RESOLVED",
        detectedAt: monthsAgo(5, 12),
        resolvedAt: monthsAgo(5, 15),
        priorityScore: 65.0,
        locationKm: 18.4,
      },
      {
        defectCode: "DEF-2026-OHE-MAY",
        assetId: assetOhe.id,
        corridorId: corridorC01.id,
        category: "OHE",
        title: "Dropper clip displacement on Span 24",
        severity: "HIGH",
        status: "RESOLVED",
        detectedAt: monthsAgo(4, 10),
        resolvedAt: monthsAgo(4, 12),
        priorityScore: 78.0,
        locationKm: 24.1,
      },
      {
        defectCode: "DEF-2026-SIG-JUN",
        assetId: assetSignal.id,
        corridorId: corridorC01.id,
        category: "SIGNAL",
        title: "LED aspect current fluctuation at Signal H-2",
        severity: "LOW",
        status: "CLOSED",
        detectedAt: monthsAgo(3, 8),
        resolvedAt: monthsAgo(3, 9),
        priorityScore: 52.0,
      },
      {
        defectCode: "DEF-2026-TRK-JUL",
        assetId: assetTrackLKO.id,
        corridorId: corridorC03.id,
        category: "TRACK",
        title: "Fishplate bolt loose on Km 65/1",
        severity: "MEDIUM",
        status: "RESOLVED",
        detectedAt: monthsAgo(2, 14),
        resolvedAt: monthsAgo(2, 16),
        priorityScore: 62.0,
        locationKm: 65.1,
      },
      {
        defectCode: "DEF-2026-OHE-AUG",
        assetId: assetOhePRYJ.id,
        corridorId: corridorC04.id,
        category: "OHE",
        title: "Mast insulator dust deposition near Mirzapur",
        severity: "MEDIUM",
        status: "RESOLVED",
        detectedAt: monthsAgo(1, 18),
        resolvedAt: monthsAgo(1, 20),
        priorityScore: 68.0,
      },
    ],
  });

  // Active Defects (Detected recently)
  const defectTrack = await prisma.defect.create({
    data: {
      defectCode: "DEF-2026-TRK-001",
      assetId: assetTrack.id,
      corridorId: corridorC01.id,
      reportedBy: userField.id,
      category: "TRACK",
      title: "Transverse Micro-Crack at Switch Point",
      description: "4.2mm fatigue flaw found at UIC-60 rail switch. Requires urgent replacement.",
      severity: "CRITICAL",
      status: "OPEN",
      detectedAt: hoursAgo(48),
      priorityScore: 94.0,
      aiRiskScore: 91.5,
      locationKm: 24.1,
    },
  });

  const defectTrackBSB = await prisma.defect.create({
    data: {
      defectCode: "DEF-2026-TRK-BSB-002",
      assetId: assetTrackBSB.id,
      corridorId: corridorC03.id,
      reportedBy: userField.id,
      category: "TRACK",
      title: "Diamond Crossing Nose Wear (Varanasi Cantt)",
      description: "Nose rail clearance exceeding 6mm under heavy express traffic.",
      severity: "CRITICAL",
      status: "OPEN",
      detectedAt: hoursAgo(18),
      priorityScore: 92.0,
      aiRiskScore: 89.0,
      locationKm: 284.0,
    },
  });

  const defectOhe = await prisma.defect.create({
    data: {
      defectCode: "DEF-2026-OHE-002",
      assetId: assetOhe.id,
      corridorId: corridorC01.id,
      reportedBy: userOhe.id,
      category: "OHE",
      title: "Contact Wire Excessive Wear & Dropper Slack",
      description: "Contact wire cross-section reduced below safety margin.",
      severity: "HIGH",
      status: "OPEN",
      detectedAt: hoursAgo(24),
      priorityScore: 82.0,
      aiRiskScore: 78.5,
      locationKm: 32.1,
    },
  });

  const defectOhePRYJ = await prisma.defect.create({
    data: {
      defectCode: "DEF-2026-OHE-PRYJ-004",
      assetId: assetOhePRYJ.id,
      corridorId: corridorC04.id,
      reportedBy: userOhe.id,
      category: "OHE",
      title: "Catenary Auto-Tensioning Pulley Seizure Risk",
      description: "Pulley bearing friction increasing under temperature shifts near Mirzapur.",
      severity: "HIGH",
      status: "OPEN",
      detectedAt: hoursAgo(6),
      priorityScore: 80.0,
      aiRiskScore: 76.0,
    },
  });

  const defectPoint = await prisma.defect.create({
    data: {
      defectCode: "DEF-2026-SNT-003",
      assetId: assetPoint.id,
      corridorId: corridorC01.id,
      reportedBy: userSnt.id,
      category: "POINT_MACHINE",
      title: "Point Machine Operating Time Degradation",
      description: "Motor throwing time exceeded 5.2 seconds (threshold: 4.5s).",
      severity: "MEDIUM",
      status: "OPEN",
      detectedAt: hoursAgo(12),
      priorityScore: 71.0,
      aiRiskScore: 66.0,
      locationKm: 24.2,
    },
  });

  const defectSignalBSB = await prisma.defect.create({
    data: {
      defectCode: "DEF-2026-SNT-BSB-005",
      assetId: assetSignalBSB.id,
      corridorId: corridorC03.id,
      reportedBy: userSnt.id,
      category: "SIGNAL",
      title: "Axle Counter Track Sensor Attenuation",
      description: "Channel A high-frequency signal voltage dropped by 18%.",
      severity: "MEDIUM",
      status: "OPEN",
      detectedAt: hoursAgo(8),
      priorityScore: 73.0,
      aiRiskScore: 69.0,
    },
  });

  // ==========================================
  // 9. Maintenance Tasks across Past 6 Months (Apr - Sep)
  // ==========================================
  console.log("-> Seeding Historical & Current Maintenance Tasks (TMS, SMMS, TDMS)...");

  // Historical completed tasks across past 6 months to create authentic completion rates
  const historicalTasksData = [
    // Month 5 ago (Apr) - 10 tasks, 7 completed -> 70%
    { taskCode: "TSK-HIST-APR-01", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "USFD Ultrasonic Track Testing Km 10-30", taskType: "TRACK_TESTING", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(5, 5), dueDate: monthsAgo(5, 10) },
    { taskCode: "TSK-HIST-APR-02", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Catenary Height Calibration Ghaziabad", taskType: "OHE_MAINTENANCE", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(5, 8), dueDate: monthsAgo(5, 12) },
    { taskCode: "TSK-HIST-APR-03", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Automatic Signal Lamp Array Check", taskType: "SIGNAL_CHECK", criticality: "LOW", status: "COMPLETED", estimatedDuration: 90, createdAt: monthsAgo(5, 12), dueDate: monthsAgo(5, 15) },
    { taskCode: "TSK-HIST-APR-04", assetId: assetTrackLKO.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Ballast Packing & Tamping Sultanpur", taskType: "TRACK_PACKING", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 240, createdAt: monthsAgo(5, 15), dueDate: monthsAgo(5, 18) },
    { taskCode: "TSK-HIST-APR-05", assetId: assetOheLKO.id, departmentId: deptOhe.id, corridorId: corridorC03.id, title: "Substation Isolator Greasing", taskType: "OHE_SUBSTATION", criticality: "LOW", status: "COMPLETED", estimatedDuration: 60, createdAt: monthsAgo(5, 18), dueDate: monthsAgo(5, 20) },
    { taskCode: "TSK-HIST-APR-06", assetId: assetTrackMZP.id, departmentId: deptEng.id, corridorId: corridorC04.id, title: "LWR Destressing Km 40-50", taskType: "TRACK_DESTRESS", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 210, createdAt: monthsAgo(5, 22), dueDate: monthsAgo(5, 25) },
    { taskCode: "TSK-HIST-APR-07", assetId: assetSignalPRYJ.id, departmentId: deptSnt.id, corridorId: corridorC04.id, title: "Interlocking Correspondence Verification", taskType: "SIGNAL_OVERHAUL", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 150, createdAt: monthsAgo(5, 25), dueDate: monthsAgo(5, 28) },
    { taskCode: "TSK-HIST-APR-08", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Sleeper Fastening Renewal Section 3", taskType: "TRACK_REPAIR", criticality: "LOW", status: "PENDING", estimatedDuration: 180, createdAt: monthsAgo(5, 28), dueDate: monthsAgo(5, 30) },
    { taskCode: "TSK-HIST-APR-09", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Cantilever Insulator Washing", taskType: "OHE_CLEANING", criticality: "MEDIUM", status: "PENDING", estimatedDuration: 120, createdAt: monthsAgo(5, 29), dueDate: monthsAgo(4, 2) },
    { taskCode: "TSK-HIST-APR-10", assetId: assetPoint.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Point Rodding Adjustment", taskType: "POINT_ADJUST", criticality: "HIGH", status: "PENDING", estimatedDuration: 90, createdAt: monthsAgo(5, 30), dueDate: monthsAgo(4, 3) },

    // Month 4 ago (May) - 12 tasks, 8 completed -> 67%
    { taskCode: "TSK-HIST-MAY-01", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Track Grinding Section 1", taskType: "TRACK_GRINDING", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 240, createdAt: monthsAgo(4, 4), dueDate: monthsAgo(4, 8) },
    { taskCode: "TSK-HIST-MAY-02", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Dropper Replacement Ghaziabad", taskType: "OHE_MAINTENANCE", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(4, 6), dueDate: monthsAgo(4, 10) },
    { taskCode: "TSK-HIST-MAY-03", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Relay Room Inspection", taskType: "SIGNAL_CHECK", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(4, 10), dueDate: monthsAgo(4, 14) },
    { taskCode: "TSK-HIST-MAY-04", assetId: assetTrackBSB.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Turnout Nose Re-profiling Varanasi", taskType: "TRACK_REPAIR", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(4, 12), dueDate: monthsAgo(4, 16) },
    { taskCode: "TSK-HIST-MAY-05", assetId: assetOheLKO.id, departmentId: deptOhe.id, corridorId: corridorC03.id, title: "Feeder Cable Insulation Testing", taskType: "OHE_SUBSTATION", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 90, createdAt: monthsAgo(4, 16), dueDate: monthsAgo(4, 20) },
    { taskCode: "TSK-HIST-MAY-06", assetId: assetSignalBSB.id, departmentId: deptSnt.id, corridorId: corridorC03.id, title: "Axle Counter Tuning Varanasi", taskType: "SIGNAL_CHECK", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 150, createdAt: monthsAgo(4, 18), dueDate: monthsAgo(4, 22) },
    { taskCode: "TSK-HIST-MAY-07", assetId: assetTrackMZP.id, departmentId: deptEng.id, corridorId: corridorC04.id, title: "Weld Joint Radiography Mirzapur", taskType: "TRACK_TESTING", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(4, 22), dueDate: monthsAgo(4, 25) },
    { taskCode: "TSK-HIST-MAY-08", assetId: assetOhePRYJ.id, departmentId: deptOhe.id, corridorId: corridorC04.id, title: "Neutral Section Overhaul Prayagraj", taskType: "OHE_MAINTENANCE", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 240, createdAt: monthsAgo(4, 25), dueDate: monthsAgo(4, 28) },
    { taskCode: "TSK-HIST-MAY-09", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Cess Clearance & Drainage", taskType: "TRACK_DRAINAGE", criticality: "LOW", status: "PENDING", estimatedDuration: 180, createdAt: monthsAgo(4, 26), dueDate: monthsAgo(3, 2) },
    { taskCode: "TSK-HIST-MAY-10", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Cable Meggering GZB-ALJN", taskType: "SIGNAL_CHECK", criticality: "MEDIUM", status: "PENDING", estimatedDuration: 120, createdAt: monthsAgo(4, 27), dueDate: monthsAgo(3, 3) },
    { taskCode: "TSK-HIST-MAY-11", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Bonding & Earthing Check", taskType: "OHE_MAINTENANCE", criticality: "LOW", status: "PENDING", estimatedDuration: 90, createdAt: monthsAgo(4, 28), dueDate: monthsAgo(3, 4) },
    { taskCode: "TSK-HIST-MAY-12", assetId: assetPoint.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Switch Lock Lubrication", taskType: "POINT_ADJUST", criticality: "HIGH", status: "PENDING", estimatedDuration: 90, createdAt: monthsAgo(4, 29), dueDate: monthsAgo(3, 5) },

    // Month 3 ago (Jun) - 14 tasks, 10 completed -> 71%
    { taskCode: "TSK-HIST-JUN-01", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Pre-Monsoon Track Inspection", taskType: "TRACK_TESTING", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 240, createdAt: monthsAgo(3, 3), dueDate: monthsAgo(3, 7) },
    { taskCode: "TSK-HIST-JUN-02", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Tree Trimming & OHE Clearance", taskType: "OHE_CLEARANCE", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(3, 5), dueDate: monthsAgo(3, 9) },
    { taskCode: "TSK-HIST-JUN-03", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Lightning Arrester Grounding Verification", taskType: "SIGNAL_CHECK", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(3, 8), dueDate: monthsAgo(3, 12) },
    { taskCode: "TSK-HIST-JUN-04", assetId: assetTrackLKO.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Curve Realignment Km 72", taskType: "TRACK_ALIGN", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 210, createdAt: monthsAgo(3, 10), dueDate: monthsAgo(3, 14) },
    { taskCode: "TSK-HIST-JUN-05", assetId: assetTrackBSB.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Yard Point Gauge Tie Bar Renewal", taskType: "TRACK_REPAIR", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(3, 13), dueDate: monthsAgo(3, 17) },
    { taskCode: "TSK-HIST-JUN-06", assetId: assetOheLKO.id, departmentId: deptOhe.id, corridorId: corridorC03.id, title: "ATD Weight Glide Rod Lubrication", taskType: "OHE_MAINTENANCE", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 90, createdAt: monthsAgo(3, 15), dueDate: monthsAgo(3, 18) },
    { taskCode: "TSK-HIST-JUN-07", assetId: assetSignalBSB.id, departmentId: deptSnt.id, corridorId: corridorC03.id, title: "Varanasi Relay Logic Card Replacement", taskType: "SIGNAL_OVERHAUL", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(3, 18), dueDate: monthsAgo(3, 21) },
    { taskCode: "TSK-HIST-JUN-08", assetId: assetTrackMZP.id, departmentId: deptEng.id, corridorId: corridorC04.id, title: "Bridge Approach Tamping", taskType: "TRACK_PACKING", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 240, createdAt: monthsAgo(3, 20), dueDate: monthsAgo(3, 24) },
    { taskCode: "TSK-HIST-JUN-09", assetId: assetSignalPRYJ.id, departmentId: deptSnt.id, corridorId: corridorC04.id, title: "Track Circuit Shunt Sensitivity Test", taskType: "SIGNAL_CHECK", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(3, 22), dueDate: monthsAgo(3, 26) },
    { taskCode: "TSK-HIST-JUN-10", assetId: assetOhePRYJ.id, departmentId: deptOhe.id, corridorId: corridorC04.id, title: "Pantograph Dynamic Force Recording", taskType: "OHE_MAINTENANCE", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(3, 25), dueDate: monthsAgo(3, 28) },
    { taskCode: "TSK-HIST-JUN-11", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Sleeper Spacing Regularization", taskType: "TRACK_REPAIR", criticality: "LOW", status: "PENDING", estimatedDuration: 150, createdAt: monthsAgo(3, 27), dueDate: monthsAgo(2, 2) },
    { taskCode: "TSK-HIST-JUN-12", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Substation Transformer Oil Filtration", taskType: "OHE_SUBSTATION", criticality: "MEDIUM", status: "PENDING", estimatedDuration: 180, createdAt: monthsAgo(3, 28), dueDate: monthsAgo(2, 3) },
    { taskCode: "TSK-HIST-JUN-13", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Battery Bank Load Capacity Test", taskType: "SIGNAL_CHECK", criticality: "LOW", status: "PENDING", estimatedDuration: 90, createdAt: monthsAgo(3, 29), dueDate: monthsAgo(2, 4) },
    { taskCode: "TSK-HIST-JUN-14", assetId: assetPoint.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Point Machine Current Profiling", taskType: "POINT_ADJUST", criticality: "HIGH", status: "PENDING", estimatedDuration: 120, createdAt: monthsAgo(3, 30), dueDate: monthsAgo(2, 5) },

    // Month 2 ago (Jul) - 16 tasks, 12 completed -> 75%
    { taskCode: "TSK-HIST-JUL-01", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Deep Screening of Ballast Section 2", taskType: "TRACK_SCREENING", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 300, createdAt: monthsAgo(2, 2), dueDate: monthsAgo(2, 6) },
    { taskCode: "TSK-HIST-JUL-02", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Power Block Maintenance Feeder 1", taskType: "OHE_MAINTENANCE", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 240, createdAt: monthsAgo(2, 4), dueDate: monthsAgo(2, 8) },
    { taskCode: "TSK-HIST-JUL-03", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Interlocking Logic Simulation Audit", taskType: "SIGNAL_OVERHAUL", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(2, 7), dueDate: monthsAgo(2, 11) },
    { taskCode: "TSK-HIST-JUL-04", assetId: assetTrackLKO.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Monsoon Track Washout Protection", taskType: "TRACK_DRAINAGE", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(2, 10), dueDate: monthsAgo(2, 14) },
    { taskCode: "TSK-HIST-JUL-05", assetId: assetTrackBSB.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Switch Lubrication & Clearance Check", taskType: "TRACK_REPAIR", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 90, createdAt: monthsAgo(2, 12), dueDate: monthsAgo(2, 15) },
    { taskCode: "TSK-HIST-JUL-06", assetId: assetOheLKO.id, departmentId: deptOhe.id, corridorId: corridorC03.id, title: "Catenary Sag Measurement & Correction", taskType: "OHE_MAINTENANCE", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(2, 14), dueDate: monthsAgo(2, 18) },
    { taskCode: "TSK-HIST-JUL-07", assetId: assetSignalBSB.id, departmentId: deptSnt.id, corridorId: corridorC03.id, title: "Axle Counter Evaluation Box Calibration", taskType: "SIGNAL_CHECK", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(2, 16), dueDate: monthsAgo(2, 19) },
    { taskCode: "TSK-HIST-JUL-08", assetId: assetTrackMZP.id, departmentId: deptEng.id, corridorId: corridorC04.id, title: "Continuous Rail Flash Butt Weld Repair", taskType: "TRACK_WELD", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 240, createdAt: monthsAgo(2, 18), dueDate: monthsAgo(2, 22) },
    { taskCode: "TSK-HIST-JUL-09", assetId: assetSignalPRYJ.id, departmentId: deptSnt.id, corridorId: corridorC04.id, title: "Point Machine 12B Gear Overhaul", taskType: "POINT_ADJUST", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 150, createdAt: monthsAgo(2, 21), dueDate: monthsAgo(2, 25) },
    { taskCode: "TSK-HIST-JUL-10", assetId: assetOhePRYJ.id, departmentId: deptOhe.id, corridorId: corridorC04.id, title: "25kV Isolator Contact Blade Replacement", taskType: "OHE_SUBSTATION", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(2, 24), dueDate: monthsAgo(2, 27) },
    { taskCode: "TSK-HIST-JUL-11", assetId: assetLocoWAP7.id, departmentId: deptTraffic.id, corridorId: corridorC03.id, title: "Locomotive Traction Motor Blower Servicing", taskType: "ROLLING_STOCK", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(2, 25), dueDate: monthsAgo(2, 28) },
    { taskCode: "TSK-HIST-JUL-12", assetId: assetFreightBOXN.id, departmentId: deptTraffic.id, corridorId: corridorC04.id, title: "Brake Pipe Pressure Rigidity Test", taskType: "ROLLING_STOCK", criticality: "LOW", status: "COMPLETED", estimatedDuration: 90, createdAt: monthsAgo(2, 26), dueDate: monthsAgo(2, 29) },
    { taskCode: "TSK-HIST-JUL-13", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Fishplate Oiling Section 4", taskType: "TRACK_REPAIR", criticality: "LOW", status: "PENDING", estimatedDuration: 120, createdAt: monthsAgo(2, 27), dueDate: monthsAgo(1, 2) },
    { taskCode: "TSK-HIST-JUL-14", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Mast Earth Continuity Check", taskType: "OHE_MAINTENANCE", criticality: "MEDIUM", status: "PENDING", estimatedDuration: 90, createdAt: monthsAgo(2, 28), dueDate: monthsAgo(1, 3) },
    { taskCode: "TSK-HIST-JUL-15", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Cable Meggering Sultanpur Line", taskType: "SIGNAL_CHECK", criticality: "LOW", status: "PENDING", estimatedDuration: 120, createdAt: monthsAgo(2, 29), dueDate: monthsAgo(1, 4) },
    { taskCode: "TSK-HIST-JUL-16", assetId: assetPoint.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Point Machine Clutch Recalibration", taskType: "POINT_ADJUST", criticality: "HIGH", status: "PENDING", estimatedDuration: 120, createdAt: monthsAgo(2, 30), dueDate: monthsAgo(1, 5) },

    // Month 1 ago (Aug) - 18 tasks, 15 completed -> 83%
    { taskCode: "TSK-HIST-AUG-01", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Heavy Ultrasonic Rail Flaw Inspection", taskType: "TRACK_TESTING", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 240, createdAt: monthsAgo(1, 2), dueDate: monthsAgo(1, 6) },
    { taskCode: "TSK-HIST-AUG-02", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "OHE Contact Wire Profile Measurement", taskType: "OHE_MAINTENANCE", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(1, 4), dueDate: monthsAgo(1, 8) },
    { taskCode: "TSK-HIST-AUG-03", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Track Circuit Relays Overhaul", taskType: "SIGNAL_CHECK", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(1, 6), dueDate: monthsAgo(1, 10) },
    { taskCode: "TSK-HIST-AUG-04", assetId: assetTrackLKO.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Track Alignment Tamping LKO-SLN", taskType: "TRACK_PACKING", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 240, createdAt: monthsAgo(1, 8), dueDate: monthsAgo(1, 12) },
    { taskCode: "TSK-HIST-AUG-05", assetId: assetTrackBSB.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Crossing Check Rail Tightening", taskType: "TRACK_REPAIR", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 90, createdAt: monthsAgo(1, 11), dueDate: monthsAgo(1, 14) },
    { taskCode: "TSK-HIST-AUG-06", assetId: assetOheLKO.id, departmentId: deptOhe.id, corridorId: corridorC03.id, title: "Catenary Auto Tensioner Weight Check", taskType: "OHE_MAINTENANCE", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 150, createdAt: monthsAgo(1, 13), dueDate: monthsAgo(1, 17) },
    { taskCode: "TSK-HIST-AUG-07", assetId: assetSignalBSB.id, departmentId: deptSnt.id, corridorId: corridorC03.id, title: "Electronic Interlocking Power Supply Audit", taskType: "SIGNAL_CHECK", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(1, 15), dueDate: monthsAgo(1, 18) },
    { taskCode: "TSK-HIST-AUG-08", assetId: assetTrackMZP.id, departmentId: deptEng.id, corridorId: corridorC04.id, title: "Weld Joint Dressing & Grinding", taskType: "TRACK_GRINDING", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(1, 17), dueDate: monthsAgo(1, 21) },
    { taskCode: "TSK-HIST-AUG-09", assetId: assetSignalPRYJ.id, departmentId: deptSnt.id, corridorId: corridorC04.id, title: "Home Signal Transformer Overhaul", taskType: "SIGNAL_CHECK", criticality: "MEDIUM", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(1, 19), dueDate: monthsAgo(1, 22) },
    { taskCode: "TSK-HIST-AUG-10", assetId: assetOhePRYJ.id, departmentId: deptOhe.id, corridorId: corridorC04.id, title: "Section Insulator Air Clearance Test", taskType: "OHE_MAINTENANCE", criticality: "CRITICAL", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(1, 21), dueDate: monthsAgo(1, 24) },
    { taskCode: "TSK-HIST-AUG-11", assetId: assetLocoWAP7.id, departmentId: deptTraffic.id, corridorId: corridorC03.id, title: "Pantograph Carbon Strip Renewal", taskType: "ROLLING_STOCK", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(1, 23), dueDate: monthsAgo(1, 26) },
    { taskCode: "TSK-HIST-AUG-12", assetId: assetFreightBOXN.id, departmentId: deptTraffic.id, corridorId: corridorC04.id, title: "Wheel Flange Wear Ultrasonic Check", taskType: "ROLLING_STOCK", criticality: "HIGH", status: "COMPLETED", estimatedDuration: 150, createdAt: monthsAgo(1, 24), dueDate: monthsAgo(1, 27) },
    { taskCode: "TSK-HIST-AUG-13", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Level Crossing Surface Re-sheeting", taskType: "TRACK_REPAIR", criticality: "LOW", status: "COMPLETED", estimatedDuration: 180, createdAt: monthsAgo(1, 25), dueDate: monthsAgo(1, 28) },
    { taskCode: "TSK-HIST-AUG-14", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Tower Wagon Night Patrol Inspection", taskType: "OHE_INSPECTION", criticality: "LOW", status: "COMPLETED", estimatedDuration: 120, createdAt: monthsAgo(1, 26), dueDate: monthsAgo(1, 29) },
    { taskCode: "TSK-HIST-AUG-15", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Signal Aspect Visibility Range Survey", taskType: "SIGNAL_CHECK", criticality: "LOW", status: "COMPLETED", estimatedDuration: 90, createdAt: monthsAgo(1, 27), dueDate: monthsAgo(1, 30) },
    { taskCode: "TSK-HIST-AUG-16", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Rail Lubricator Reservoir Refill", taskType: "TRACK_REPAIR", criticality: "LOW", status: "PENDING", estimatedDuration: 60, createdAt: monthsAgo(1, 28), dueDate: daysAgo(5) },
    { taskCode: "TSK-HIST-AUG-17", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Feeder Jumper Clamp Replacement", taskType: "OHE_MAINTENANCE", criticality: "MEDIUM", status: "PENDING", estimatedDuration: 90, createdAt: monthsAgo(1, 29), dueDate: daysAgo(4) },
    { taskCode: "TSK-HIST-AUG-18", assetId: assetPoint.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Point Machine Motor Carbon Brushes", taskType: "POINT_ADJUST", criticality: "HIGH", status: "PENDING", estimatedDuration: 90, createdAt: monthsAgo(1, 30), dueDate: daysAgo(3) },
  ];

  await prisma.maintenanceTask.createMany({
    data: historicalTasksData,
  });

  // Current Month (Sep 2026) Active & Critical Tasks for Dashboard Displays
  const taskTrack = await prisma.maintenanceTask.create({
    data: {
      taskCode: "TSK-TRK-401",
      defectId: defectTrack.id,
      assetId: assetTrack.id,
      departmentId: deptEng.id,
      corridorId: corridorC01.id,
      title: "Replace 20m Rail Section & Switch Blade",
      description: "Complete replacement of switch rail and re-welding using mobile flash butt welding plant.",
      taskType: "TRACK_RENEWAL",
      criticality: "CRITICAL",
      urgency: "HIGH",
      estimatedDuration: 240, // 4 hours
      requiredWorkers: 14,
      dueDate: new Date(Date.now() + 3600 * 1000 * 24 * 3),
      status: "PENDING",
      aiPriorityScore: 92.0,
      createdAt: daysAgo(2),
    },
  });

  const taskTrackBSB = await prisma.maintenanceTask.create({
    data: {
      taskCode: "TSK-TRK-BSB-404",
      defectId: defectTrackBSB.id,
      assetId: assetTrackBSB.id,
      departmentId: deptEng.id,
      corridorId: corridorC03.id,
      title: "Renew Tongue Rail & Crossing Nose (Varanasi Cantt)",
      description: "Diamond crossover rail replacement during scheduled traffic window.",
      taskType: "TRACK_RENEWAL",
      criticality: "CRITICAL",
      urgency: "HIGH",
      estimatedDuration: 180,
      requiredWorkers: 12,
      dueDate: new Date(Date.now() + 3600 * 1000 * 24 * 2),
      status: "PENDING",
      aiPriorityScore: 91.0,
      createdAt: hoursAgo(18),
    },
  });

  const taskOhe = await prisma.maintenanceTask.create({
    data: {
      taskCode: "TSK-OHE-402",
      defectId: defectOhe.id,
      assetId: assetOhe.id,
      departmentId: deptOhe.id,
      corridorId: corridorC01.id,
      title: "Overhead Catenary Wire Re-tensioning & Dropper Replacement",
      description: "Power block possession required to isolate 25kV traction line and adjust contact wire height.",
      taskType: "OHE_MAINTENANCE",
      criticality: "HIGH",
      urgency: "MEDIUM",
      estimatedDuration: 180,
      requiredWorkers: 6,
      dueDate: new Date(Date.now() + 3600 * 1000 * 24 * 4),
      status: "PENDING",
      aiPriorityScore: 81.0,
      createdAt: daysAgo(1),
    },
  });

  const taskOhePRYJ = await prisma.maintenanceTask.create({
    data: {
      taskCode: "TSK-OHE-PRYJ-405",
      defectId: defectOhePRYJ.id,
      assetId: assetOhePRYJ.id,
      departmentId: deptOhe.id,
      corridorId: corridorC04.id,
      title: "Auto-Tension Pulley Overhaul & Regulating Cable Tensioning",
      description: "Adjust pulley wheel bearings and verify wire tension balance near Mirzapur.",
      taskType: "OHE_MAINTENANCE",
      criticality: "HIGH",
      urgency: "HIGH",
      estimatedDuration: 180,
      requiredWorkers: 8,
      dueDate: new Date(Date.now() + 3600 * 1000 * 24 * 5),
      status: "PENDING",
      aiPriorityScore: 83.0,
      createdAt: hoursAgo(6),
    },
  });

  const taskSnt = await prisma.maintenanceTask.create({
    data: {
      taskCode: "TSK-SNT-403",
      defectId: defectPoint.id,
      assetId: assetPoint.id,
      departmentId: deptSnt.id,
      corridorId: corridorC01.id,
      title: "Overhaul Point Machine 44B & Lubricate Switch Clamps",
      description: "Inspect carbon brushes, clean commutator, and grease lock slide gears.",
      taskType: "SIGNAL_OVERHAUL",
      criticality: "MEDIUM",
      urgency: "MEDIUM",
      estimatedDuration: 120,
      requiredWorkers: 4,
      dueDate: new Date(Date.now() + 3600 * 1000 * 24 * 5),
      status: "PENDING",
      aiPriorityScore: 73.0,
      createdAt: hoursAgo(12),
    },
  });

  const taskSignalBSB = await prisma.maintenanceTask.create({
    data: {
      taskCode: "TSK-SNT-BSB-406",
      defectId: defectSignalBSB.id,
      assetId: assetSignalBSB.id,
      departmentId: deptSnt.id,
      corridorId: corridorC03.id,
      title: "Digital Axle Counter High-Frequency Sensor Tuning",
      description: "Calibrate transmitter-receiver coils and align magnetic wheel sensors.",
      taskType: "SIGNAL_OVERHAUL",
      criticality: "MEDIUM",
      urgency: "LOW",
      estimatedDuration: 90,
      requiredWorkers: 3,
      dueDate: new Date(Date.now() + 3600 * 1000 * 24 * 6),
      status: "PENDING",
      aiPriorityScore: 70.0,
      createdAt: hoursAgo(8),
    },
  });

  // Additional Active tasks for priority balance (TMS, SMMS, TDMS)
  await prisma.maintenanceTask.createMany({
    data: [
      { taskCode: "TSK-ACT-TRK-01", assetId: assetTrackLKO.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Sultanpur Junction Crossover Tamping", taskType: "TRACK_PACKING", criticality: "HIGH", urgency: "MEDIUM", estimatedDuration: 180, requiredWorkers: 10, status: "PENDING", createdAt: hoursAgo(14) },
      { taskCode: "TSK-ACT-TRK-02", assetId: assetTrackMZP.id, departmentId: deptEng.id, corridorId: corridorC04.id, title: "Continuous Welded Rail De-stressing Km 48", taskType: "TRACK_DESTRESS", criticality: "HIGH", urgency: "HIGH", estimatedDuration: 210, requiredWorkers: 14, status: "PENDING", createdAt: hoursAgo(20) },
      { taskCode: "TSK-ACT-TRK-03", assetId: assetTrack.id, departmentId: deptEng.id, corridorId: corridorC01.id, title: "Ultrasonic Flaw Verification Section 5", taskType: "TRACK_TESTING", criticality: "MEDIUM", urgency: "LOW", estimatedDuration: 120, requiredWorkers: 4, status: "PENDING", createdAt: daysAgo(1) },
      { taskCode: "TSK-ACT-TRK-04", assetId: assetTrackLKO.id, departmentId: deptEng.id, corridorId: corridorC03.id, title: "Track Drainage Culvert Clearance", taskType: "TRACK_DRAINAGE", criticality: "LOW", urgency: "LOW", estimatedDuration: 90, requiredWorkers: 6, status: "PENDING", createdAt: daysAgo(2) },
      { taskCode: "TSK-ACT-SIG-01", assetId: assetSignalPRYJ.id, departmentId: deptSnt.id, corridorId: corridorC04.id, title: "Prayagraj West Home Signal Relamping", taskType: "SIGNAL_OVERHAUL", criticality: "CRITICAL", urgency: "HIGH", estimatedDuration: 60, requiredWorkers: 2, status: "PENDING", createdAt: hoursAgo(10) },
      { taskCode: "TSK-ACT-SIG-02", assetId: assetSignal.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Audio Frequency Track Circuit Receiver Check", taskType: "SIGNAL_CHECK", criticality: "HIGH", urgency: "MEDIUM", estimatedDuration: 90, requiredWorkers: 3, status: "PENDING", createdAt: hoursAgo(16) },
      { taskCode: "TSK-ACT-SIG-03", assetId: assetPoint.id, departmentId: deptSnt.id, corridorId: corridorC01.id, title: "Point Detector Switch Contact Cleaning", taskType: "POINT_ADJUST", criticality: "LOW", urgency: "LOW", estimatedDuration: 45, requiredWorkers: 2, status: "PENDING", createdAt: daysAgo(1) },
      { taskCode: "TSK-ACT-OHE-01", assetId: assetOheLKO.id, departmentId: deptOhe.id, corridorId: corridorC03.id, title: "Sultanpur Feeder Power Isolation & Catenary Check", taskType: "OHE_MAINTENANCE", criticality: "HIGH", urgency: "MEDIUM", estimatedDuration: 180, requiredWorkers: 6, status: "PENDING", createdAt: hoursAgo(12) },
      { taskCode: "TSK-ACT-OHE-02", assetId: assetOhe.id, departmentId: deptOhe.id, corridorId: corridorC01.id, title: "Pantograph Pressure Contact Test", taskType: "OHE_INSPECTION", criticality: "MEDIUM", urgency: "LOW", estimatedDuration: 120, requiredWorkers: 4, status: "PENDING", createdAt: daysAgo(2) },
      { taskCode: "TSK-ACT-OHE-03", assetId: assetOhePRYJ.id, departmentId: deptOhe.id, corridorId: corridorC04.id, title: "Mast Stagger Adjustment Span 12-14", taskType: "OHE_MAINTENANCE", criticality: "LOW", urgency: "LOW", estimatedDuration: 90, requiredWorkers: 4, status: "PENDING", createdAt: daysAgo(3) },
    ],
  });

  // Task Priority Score breakdown (Powers UI: 28/30, 18/20, 14/15, etc.)
  await prisma.taskPriorityScore.create({
    data: {
      taskId: taskTrack.id,
      calculatedAt: new Date(),
      failureRisk: 28.0, // out of 30
      criticalityScore: 18.0, // out of 20
      urgencyScore: 14.0, // out of 15
      assetImpactScore: 13.0, // out of 15
      trafficImpactScore: 7.0, // out of 10
      overdueScore: 4.0,
      historicalFailureScore: 4.0,
      finalScore: 88.0,
      modelVersion: "AI-Prioritizer-v3.2",
      explanation: {
        reason: "High track axle-load section with active micro-fracture. Deferring increases derailment risk exponent.",
        trafficImpact: "Blocks peak passenger route if delayed beyond week 3.",
      },
    },
  });

  // ==========================================
  // 10. Resources, Teams & Employees (12)
  // ==========================================
  console.log("-> Seeding Resources, Teams & Crew Members...");
  const emp1 = await prisma.employee.create({
    data: {
      employeeCode: "EMP-PW-01",
      name: "Sohan Lal",
      departmentId: deptEng.id,
      role: "Keyman / Trackman",
      skillSet: { certifications: ["USFD-Level-1", "Alumino-Thermic Welding"] },
      availability: "AVAILABLE",
    },
  });

  const emp2 = await prisma.employee.create({
    data: {
      employeeCode: "EMP-OHE-01",
      name: "Gopal Mukherjee",
      departmentId: deptOhe.id,
      role: "Traction Lineman Grade-1",
      skillSet: { certifications: ["25kV Power Isolation", "Tower Wagon Operator"] },
      availability: "AVAILABLE",
    },
  });

  const emp3 = await prisma.employee.create({
    data: {
      employeeCode: "EMP-SIG-01",
      name: "Arun Krishnan",
      departmentId: deptSnt.id,
      role: "Signal Maintainer",
      skillSet: { certifications: ["Solid State Interlocking", "Siemens Point Machine"] },
      availability: "AVAILABLE",
    },
  });

  // Crews
  const teamTrack = await prisma.team.create({
    data: {
      name: "Track Maintenance Gang No. 4 (Ghaziabad)",
      departmentId: deptEng.id,
      teamType: "HEAVY_TRACK_REPAIR",
      capacity: 16,
      status: "AVAILABLE",
    },
  });

  const teamOhe = await prisma.team.create({
    data: {
      name: "OHE Traction Line Crew 2 (Sahibabad)",
      departmentId: deptOhe.id,
      teamType: "OHE_LINE_CREW",
      capacity: 8,
      status: "AVAILABLE",
    },
  });

  await prisma.teamMember.createMany({
    data: [
      { teamId: teamTrack.id, employeeId: emp1.id },
      { teamId: teamOhe.id, employeeId: emp2.id },
    ],
  });

  // Machinery & Vehicles
  const resourceTamper = await prisma.resource.create({
    data: {
      resourceCode: "MCH-CSM-09",
      name: "Plasser Continuous Action Tamper 09-32 CSM",
      resourceType: "TRACK_MACHINE",
      departmentId: deptEng.id,
      status: "AVAILABLE",
    },
  });

  const resourceTowerWagon = await prisma.resource.create({
    data: {
      resourceCode: "VEH-TW-18",
      name: "8-Wheeler Self-Propelled OHE Tower Wagon RU-18",
      resourceType: "TOWER_WAGON",
      departmentId: deptOhe.id,
      status: "AVAILABLE",
    },
  });

  // ==========================================
  // 11. Train Operations (13) & Goods Forecast (14)
  // ==========================================
  console.log("-> Seeding Trains, Train Runs, Timetables, Goods Forecasts across C-01, C-02, C-03, C-04...");
  const trainShatabdi = await prisma.train.create({
    data: {
      trainNumber: "12004",
      trainName: "Lucknow Swarna Shatabdi Express",
      trainType: "EXPRESS",
      operator: "Northern Railway",
      priority: 1,
    },
  });

  const trainRajdhani = await prisma.train.create({
    data: {
      trainNumber: "12302",
      trainName: "Howrah Rajdhani Express",
      trainType: "EXPRESS",
      operator: "Eastern Railway",
      priority: 1,
    },
  });

  const trainVandeBharat = await prisma.train.create({
    data: {
      trainNumber: "22436",
      trainName: "Vande Bharat Express (NDLS - BSB)",
      trainType: "EXPRESS",
      operator: "Northern Railway",
      priority: 1,
    },
  });

  const trainPrayagraj = await prisma.train.create({
    data: {
      trainNumber: "12418",
      trainName: "Prayagraj Express (NDLS - PRYJ)",
      trainType: "EXPRESS",
      operator: "North Central Railway",
      priority: 1,
    },
  });

  const trainGangaGomti = await prisma.train.create({
    data: {
      trainNumber: "14210",
      trainName: "Ganga Gomti Express (LKO - PRYJ)",
      trainType: "EXPRESS",
      operator: "Northern Railway",
      priority: 2,
    },
  });

  const trainBSBIntercity = await prisma.train.create({
    data: {
      trainNumber: "20942",
      trainName: "Varanasi - Prayagraj Fast Passenger",
      trainType: "PASSENGER",
      operator: "Northern Railway",
      priority: 2,
    },
  });

  const trainFreightDadri = await prisma.train.create({
    data: {
      trainNumber: "BOXN-9421",
      trainName: "Dadri Thermal Power Coal Rake",
      trainType: "FREIGHT",
      operator: "DFCCIL / Indian Railways",
      priority: 3,
    },
  });

  const trainFreightGrain = await prisma.train.create({
    data: {
      trainNumber: "BCNHL-8102",
      trainName: "FCI Foodgrain Bulk Rake",
      trainType: "FREIGHT",
      operator: "Northern Railway",
      priority: 3,
    },
  });

  const trainFreightTanker = await prisma.train.create({
    data: {
      trainNumber: "BTPN-3319",
      trainName: "IOCL Petroleum Tanker Rake",
      trainType: "FREIGHT",
      operator: "Northern Railway",
      priority: 3,
    },
  });

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Historical and Today's Train Runs across 7 days for authentic punctuality (~94.4%)
  const runShatabdi = await prisma.trainRun.create({
    data: {
      trainId: trainShatabdi.id,
      runDate: todayDateOnly,
      originStationId: stationNDLS.id,
      destinationStationId: stationCNB.id,
      status: "ON_TIME",
      actualDelayMinutes: 0,
    },
  });

  const runRajdhani = await prisma.trainRun.create({
    data: {
      trainId: trainRajdhani.id,
      runDate: todayDateOnly,
      originStationId: stationNDLS.id,
      destinationStationId: stationCNB.id,
      status: "ON_TIME",
      actualDelayMinutes: 0,
    },
  });

  const runVandeBharat = await prisma.trainRun.create({
    data: {
      trainId: trainVandeBharat.id,
      runDate: todayDateOnly,
      originStationId: stationLKO.id,
      destinationStationId: stationBSB.id,
      status: "ON_TIME",
      actualDelayMinutes: 0,
    },
  });

  const runPrayagraj = await prisma.trainRun.create({
    data: {
      trainId: trainPrayagraj.id,
      runDate: todayDateOnly,
      originStationId: stationNDLS.id,
      destinationStationId: stationPRYJ.id,
      status: "ON_TIME",
      actualDelayMinutes: 0,
    },
  });

  const runGangaGomti = await prisma.trainRun.create({
    data: {
      trainId: trainGangaGomti.id,
      runDate: todayDateOnly,
      originStationId: stationLKO.id,
      destinationStationId: stationPRYJ.id,
      status: "ON_TIME",
      actualDelayMinutes: 4,
    },
  });

  const runBSBIntercity = await prisma.trainRun.create({
    data: {
      trainId: trainBSBIntercity.id,
      runDate: todayDateOnly,
      originStationId: stationBSB.id,
      destinationStationId: stationPRYJ.id,
      status: "ON_TIME",
      actualDelayMinutes: 0,
    },
  });

  const runFreightDadri = await prisma.trainRun.create({
    data: {
      trainId: trainFreightDadri.id,
      runDate: todayDateOnly,
      originStationId: stationGZB.id,
      destinationStationId: stationCNB.id,
      status: "RUNNING",
      actualDelayMinutes: 22,
    },
  });

  const runFreightGrain = await prisma.trainRun.create({
    data: {
      trainId: trainFreightGrain.id,
      runDate: todayDateOnly,
      originStationId: stationBSB.id,
      destinationStationId: stationPRYJ.id,
      status: "ON_TIME",
      actualDelayMinutes: 0,
    },
  });

  const runFreightTanker = await prisma.trainRun.create({
    data: {
      trainId: trainFreightTanker.id,
      runDate: todayDateOnly,
      originStationId: stationLKO.id,
      destinationStationId: stationBSB.id,
      status: "RUNNING",
      actualDelayMinutes: 18,
    },
  });

  // Additional runs across past 7 days for punctuality metric calculation
  await prisma.trainRun.createMany({
    data: [
      { trainId: trainShatabdi.id, runDate: daysAgo(1), originStationId: stationNDLS.id, destinationStationId: stationCNB.id, status: "ON_TIME", actualDelayMinutes: 2 },
      { trainId: trainRajdhani.id, runDate: daysAgo(1), originStationId: stationNDLS.id, destinationStationId: stationCNB.id, status: "ON_TIME", actualDelayMinutes: 0 },
      { trainId: trainVandeBharat.id, runDate: daysAgo(1), originStationId: stationLKO.id, destinationStationId: stationBSB.id, status: "ON_TIME", actualDelayMinutes: 0 },
      { trainId: trainPrayagraj.id, runDate: daysAgo(2), originStationId: stationNDLS.id, destinationStationId: stationPRYJ.id, status: "ON_TIME", actualDelayMinutes: 5 },
      { trainId: trainGangaGomti.id, runDate: daysAgo(2), originStationId: stationLKO.id, destinationStationId: stationPRYJ.id, status: "ON_TIME", actualDelayMinutes: 0 },
      { trainId: trainBSBIntercity.id, runDate: daysAgo(2), originStationId: stationBSB.id, destinationStationId: stationPRYJ.id, status: "ON_TIME", actualDelayMinutes: 3 },
      { trainId: trainShatabdi.id, runDate: daysAgo(3), originStationId: stationNDLS.id, destinationStationId: stationCNB.id, status: "ON_TIME", actualDelayMinutes: 0 },
      { trainId: trainRajdhani.id, runDate: daysAgo(3), originStationId: stationNDLS.id, destinationStationId: stationCNB.id, status: "ON_TIME", actualDelayMinutes: 4 },
      { trainId: trainVandeBharat.id, runDate: daysAgo(4), originStationId: stationLKO.id, destinationStationId: stationBSB.id, status: "ON_TIME", actualDelayMinutes: 0 },
      { trainId: trainPrayagraj.id, runDate: daysAgo(4), originStationId: stationNDLS.id, destinationStationId: stationPRYJ.id, status: "ON_TIME", actualDelayMinutes: 0 },
      { trainId: trainFreightDadri.id, runDate: daysAgo(1), originStationId: stationGZB.id, destinationStationId: stationCNB.id, status: "COMPLETED", actualDelayMinutes: 25 },
      { trainId: trainFreightTanker.id, runDate: daysAgo(2), originStationId: stationLKO.id, destinationStationId: stationBSB.id, status: "COMPLETED", actualDelayMinutes: 14 },
    ],
  });

  // Timetable Slots covering the 9 Dashboard Timeline intervals (06:00 to 22:00 every 2 hrs)
  // for corridors C-01, C-02, C-03, C-04
  const makeSlotTime = (hours: number, minutes = 0) =>
    new Date(todayDateOnly.getTime() + (hours * 3600 + minutes * 60) * 1000);

  await prisma.timetableSlot.createMany({
    data: [
      // Corridor C-01 (New Delhi - Ghaziabad)
      { trainRunId: runShatabdi.id, corridorId: corridorC01.id, startTime: makeSlotTime(6, 15), endTime: makeSlotTime(7, 0), direction: "DOWN", operationalPriority: 1 },
      { trainRunId: runRajdhani.id, corridorId: corridorC01.id, startTime: makeSlotTime(8, 30), endTime: makeSlotTime(9, 15), direction: "DOWN", operationalPriority: 1 },
      { trainRunId: runShatabdi.id, corridorId: corridorC01.id, startTime: makeSlotTime(16, 20), endTime: makeSlotTime(17, 10), direction: "UP", operationalPriority: 1 },
      { trainRunId: runFreightDadri.id, corridorId: corridorC01.id, startTime: makeSlotTime(20, 10), endTime: makeSlotTime(21, 30), direction: "DOWN", operationalPriority: 3 },

      // Corridor C-02 (Ghaziabad - Kanpur Central via Aligarh)
      { trainRunId: runShatabdi.id, corridorId: corridorC02.id, startTime: makeSlotTime(8, 0), endTime: makeSlotTime(12, 10), direction: "DOWN", operationalPriority: 1 },
      { trainRunId: runRajdhani.id, corridorId: corridorC02.id, startTime: makeSlotTime(10, 15), endTime: makeSlotTime(14, 0), direction: "DOWN", operationalPriority: 1 },
      { trainRunId: runPrayagraj.id, corridorId: corridorC02.id, startTime: makeSlotTime(18, 45), endTime: makeSlotTime(23, 0), direction: "DOWN", operationalPriority: 1 },
      { trainRunId: runFreightGrain.id, corridorId: corridorC02.id, startTime: makeSlotTime(22, 15), endTime: makeSlotTime(23, 45), direction: "UP", operationalPriority: 3 },

      // Corridor C-03 (Lucknow Charbagh - Varanasi Cantt)
      { trainRunId: runVandeBharat.id, corridorId: corridorC03.id, startTime: makeSlotTime(6, 0), endTime: makeSlotTime(10, 8), direction: "DOWN", operationalPriority: 1 },
      { trainRunId: runGangaGomti.id, corridorId: corridorC03.id, startTime: makeSlotTime(8, 0), endTime: makeSlotTime(12, 30), direction: "DOWN", operationalPriority: 2 },
      { trainRunId: runVandeBharat.id, corridorId: corridorC03.id, startTime: makeSlotTime(14, 0), endTime: makeSlotTime(18, 5), direction: "UP", operationalPriority: 1 },
      { trainRunId: runFreightTanker.id, corridorId: corridorC03.id, startTime: makeSlotTime(18, 30), endTime: makeSlotTime(21, 45), direction: "DOWN", operationalPriority: 3 },
      { trainRunId: runGangaGomti.id, corridorId: corridorC03.id, startTime: makeSlotTime(20, 0), endTime: makeSlotTime(23, 40), direction: "UP", operationalPriority: 2 },

      // Corridor C-04 (Varanasi Cantt - Prayagraj Junction)
      { trainRunId: runBSBIntercity.id, corridorId: corridorC04.id, startTime: makeSlotTime(8, 15), endTime: makeSlotTime(10, 45), direction: "UP", operationalPriority: 2 },
      { trainRunId: runPrayagraj.id, corridorId: corridorC04.id, startTime: makeSlotTime(14, 0), endTime: makeSlotTime(16, 20), direction: "DOWN", operationalPriority: 1 },
      { trainRunId: runBSBIntercity.id, corridorId: corridorC04.id, startTime: makeSlotTime(16, 30), endTime: makeSlotTime(19, 0), direction: "DOWN", operationalPriority: 2 },
      { trainRunId: runFreightGrain.id, corridorId: corridorC04.id, startTime: makeSlotTime(18, 0), endTime: makeSlotTime(20, 30), direction: "UP", operationalPriority: 3 },
      { trainRunId: runFreightTanker.id, corridorId: corridorC04.id, startTime: makeSlotTime(22, 0), endTime: makeSlotTime(23, 50), direction: "DOWN", operationalPriority: 3 },
    ],
  });

  // Goods Forecasts (Control Office Freight Predictions)
  await prisma.goodsForecast.createMany({
    data: [
      {
        corridorId: corridorC01.id,
        forecastDate: todayDateOnly,
        forecastHour: 12,
        expectedTrainCount: 14,
        expectedVolume: 38500.0,
        trafficDensity: 64.2,
        confidenceScore: 91.0,
        sourceId: dsFois.id,
      },
      {
        corridorId: corridorC02.id,
        forecastDate: todayDateOnly,
        forecastHour: 16,
        expectedTrainCount: 10,
        expectedVolume: 28000.0,
        trafficDensity: 55.0,
        confidenceScore: 88.5,
        sourceId: dsFois.id,
      },
      {
        corridorId: corridorC03.id,
        forecastDate: todayDateOnly,
        forecastHour: 8,
        expectedTrainCount: 12,
        expectedVolume: 31000.0,
        trafficDensity: 58.4,
        confidenceScore: 89.0,
        sourceId: dsFois.id,
      },
      {
        corridorId: corridorC04.id,
        forecastDate: todayDateOnly,
        forecastHour: 14,
        expectedTrainCount: 16,
        expectedVolume: 42000.0,
        trafficDensity: 68.9,
        confidenceScore: 92.5,
        sourceId: dsFois.id,
      },
    ],
  });

  // ==========================================
  // 12. Block Management (15, 16, 17) - Available Windows & Multi-Department Requests
  // ==========================================
  console.log("-> Seeding Block Windows, Requests & Conflicts...");
  // Window 1: C-01 Today 11:00 AM to 15:00 PM (4 hours / 240 mins)
  const blockStart1 = makeSlotTime(11, 0);
  const blockEnd1 = makeSlotTime(15, 0);
  const blockWindowC01 = await prisma.blockWindow.create({
    data: {
      corridorId: corridorC01.id,
      startTime: blockStart1,
      endTime: blockEnd1,
      status: "AVAILABLE",
      capacityMinutes: 240,
      sourceId: dsTms.id,
    },
  });

  // Window 2: C-03 Tomorrow 09:00 AM to 13:00 PM (4 hours / 240 mins)
  const tomorrowDateOnly = new Date(todayDateOnly.getTime() + 3600 * 1000 * 24);
  const blockStart2 = new Date(tomorrowDateOnly.getTime() + (9 * 3600) * 1000);
  const blockEnd2 = new Date(tomorrowDateOnly.getTime() + (13 * 3600) * 1000);
  const blockWindowC03 = await prisma.blockWindow.create({
    data: {
      corridorId: corridorC03.id,
      startTime: blockStart2,
      endTime: blockEnd2,
      status: "AVAILABLE",
      capacityMinutes: 240,
      sourceId: dsTms.id,
    },
  });

  // Window 3: C-02 +2 Days 14:00 PM to 18:00 PM (4 hours / 240 mins)
  const day2DateOnly = new Date(todayDateOnly.getTime() + 3600 * 1000 * 48);
  const blockStart3 = new Date(day2DateOnly.getTime() + (14 * 3600) * 1000);
  const blockEnd3 = new Date(day2DateOnly.getTime() + (18 * 3600) * 1000);
  const blockWindowC02 = await prisma.blockWindow.create({
    data: {
      corridorId: corridorC02.id,
      startTime: blockStart3,
      endTime: blockEnd3,
      status: "AVAILABLE",
      capacityMinutes: 240,
      sourceId: dsTms.id,
    },
  });

  // Window 4: C-01 +4 Days 11:00 AM to 15:00 PM (4 hours / 240 mins)
  const day4DateOnly = new Date(todayDateOnly.getTime() + 3600 * 1000 * 96);
  const blockStart4 = new Date(day4DateOnly.getTime() + (11 * 3600) * 1000);
  const blockEnd4 = new Date(day4DateOnly.getTime() + (15 * 3600) * 1000);
  const blockWindowC01_Next = await prisma.blockWindow.create({
    data: {
      corridorId: corridorC01.id,
      startTime: blockStart4,
      endTime: blockEnd4,
      status: "AVAILABLE",
      capacityMinutes: 240,
      sourceId: dsTms.id,
    },
  });

  // Window 5: C-04 +5 Days 10:00 AM to 14:00 PM (4 hours / 240 mins)
  const day5DateOnly = new Date(todayDateOnly.getTime() + 3600 * 1000 * 120);
  const blockStart5 = new Date(day5DateOnly.getTime() + (10 * 3600) * 1000);
  const blockEnd5 = new Date(day5DateOnly.getTime() + (14 * 3600) * 1000);
  const blockWindowC04 = await prisma.blockWindow.create({
    data: {
      corridorId: corridorC04.id,
      startTime: blockStart5,
      endTime: blockEnd5,
      status: "AVAILABLE",
      capacityMinutes: 240,
      sourceId: dsTms.id,
    },
  });

  // Block Requests
  const reqEng = await prisma.blockRequest.create({
    data: {
      requestCode: "BR-2026-ENG-088",
      departmentId: deptEng.id,
      corridorId: corridorC01.id,
      requestedStart: blockStart1,
      requestedEnd: blockEnd1,
      durationMinutes: 240,
      reason: "Emergency replacement of fatigued switch blade and turnout crossing.",
      priority: "CRITICAL",
      status: "PENDING",
      createdBy: userEng.id,
    },
  });

  const reqOhe = await prisma.blockRequest.create({
    data: {
      requestCode: "BR-2026-OHE-089",
      departmentId: deptOhe.id,
      corridorId: corridorC01.id,
      requestedStart: blockStart1,
      requestedEnd: new Date(blockStart1.getTime() + 3600 * 1000 * 3),
      durationMinutes: 180,
      reason: "Co-possession block to re-tension overhead wire while track is occupied.",
      priority: "HIGH",
      status: "PENDING",
      createdBy: userOhe.id,
    },
  });

  const reqTrackBSB = await prisma.blockRequest.create({
    data: {
      requestCode: "BR-2026-ENG-090",
      departmentId: deptEng.id,
      corridorId: corridorC03.id,
      requestedStart: blockStart2,
      requestedEnd: new Date(blockStart2.getTime() + 3600 * 1000 * 3),
      durationMinutes: 180,
      reason: "Renew Tongue Rail & Crossing Nose at Varanasi Cantt diamond crossover.",
      priority: "CRITICAL",
      status: "PENDING",
      createdBy: userEng.id,
    },
  });

  const reqOhePRYJ = await prisma.blockRequest.create({
    data: {
      requestCode: "BR-2026-OHE-091",
      departmentId: deptOhe.id,
      corridorId: corridorC04.id,
      requestedStart: blockStart5,
      requestedEnd: new Date(blockStart5.getTime() + 3600 * 1000 * 3),
      durationMinutes: 180,
      reason: "Auto-tension pulley overhaul & regulating cable tensioning near Mirzapur.",
      priority: "HIGH",
      status: "PENDING",
      createdBy: userOhe.id,
    },
  });

  // Block Conflicts
  await prisma.blockConflict.createMany({
    data: [
      {
        blockWindowId: blockWindowC01.id,
        trainRunId: runFreightDadri.id,
        maintenanceTaskId: taskTrack.id,
        conflictType: "FREIGHT_CROSSING_CONFLICT",
        severity: "MODERATE",
        estimatedDelay: 17,
        resolutionStatus: "OPEN",
      },
      {
        blockWindowId: blockWindowC03.id,
        trainRunId: runGangaGomti.id,
        maintenanceTaskId: taskTrackBSB.id,
        conflictType: "PASSENGER_BUFFER_CONFLICT",
        severity: "LOW",
        estimatedDelay: 12,
        resolutionStatus: "OPEN",
      },
      {
        blockWindowId: blockWindowC04.id,
        trainRunId: runFreightTanker.id,
        maintenanceTaskId: taskOhePRYJ.id,
        conflictType: "FREIGHT_CROSSING_CONFLICT",
        severity: "MODERATE",
        estimatedDelay: 15,
        resolutionStatus: "OPEN",
      },
    ],
  });

  // ==========================================
  // 13. Multi-Agent AI System & Recommendations (20, 21, 22)
  // ==========================================
  console.log("-> Seeding AI Agents, Proposals & Recommendations...");
  const agentTrack = await prisma.aiAgent.create({
    data: {
      name: "TRACK_AGENT",
      agentType: "SPECIALIST",
      departmentId: deptEng.id,
      description: "Monitors track geometry car data, USFD flaws, and calculates minimum safe block possession durations.",
      isActive: true,
    },
  });

  const agentOhe = await prisma.aiAgent.create({
    data: {
      name: "ELECTRICAL_AGENT",
      agentType: "SPECIALIST",
      departmentId: deptOhe.id,
      description: "Calculates power isolation sub-sectors and synchronizes OHE maintenance with track possessions.",
      isActive: true,
    },
  });

  const agentSignal = await prisma.aiAgent.create({
    data: {
      name: "SIGNAL_AGENT",
      agentType: "SPECIALIST",
      departmentId: deptSnt.id,
      description: "Evaluates interlocking disconnect requirements and point machine test sequences.",
      isActive: true,
    },
  });

  const agentTraffic = await prisma.aiAgent.create({
    data: {
      name: "TRAFFIC_AGENT",
      agentType: "COORDINATOR",
      departmentId: deptTraffic.id,
      description: "Evaluates timetable buffer slots, passenger train impacts, and freight rerouting options.",
      isActive: true,
    },
  });

  // Multi-Agent Proposals
  await prisma.agentProposal.createMany({
    data: [
      {
        agentId: agentTrack.id,
        taskId: taskTrack.id,
        corridorId: corridorC01.id,
        proposedStart: blockStart1,
        proposedEnd: blockEnd1,
        priorityScore: 92.0,
        proposal: { action: "MERGE_WINDOW", suggestedBlock: "11:00-15:00", expectedDurationMin: 240 },
        status: "AGREED",
      },
      {
        agentId: agentOhe.id,
        taskId: taskOhe.id,
        corridorId: corridorC01.id,
        proposedStart: blockStart1,
        proposedEnd: new Date(blockStart1.getTime() + 3600 * 1000 * 3),
        priorityScore: 81.0,
        proposal: { action: "CO_POSSESSION", piggybackOn: "TRACK_RENEWAL", powerShutdownZone: "GZB-Substation-Feeder-3" },
        status: "AGREED",
      },
      {
        agentId: agentTrack.id,
        taskId: taskTrackBSB.id,
        corridorId: corridorC03.id,
        proposedStart: blockStart2,
        proposedEnd: new Date(blockStart2.getTime() + 3600 * 1000 * 3),
        priorityScore: 91.0,
        proposal: { action: "ISOLATE_CROSSOVER", suggestedBlock: "09:00-12:00", expectedDurationMin: 180 },
        status: "AGREED",
      },
    ],
  });

  // AI Recommendations
  await prisma.aiRecommendation.createMany({
    data: [
      {
        recommendationType: "COMBINED_POSSESSION_CORRIDOR_BLOCK",
        maintenanceTaskId: taskTrack.id,
        blockWindowId: blockWindowC01.id,
        recommendationText:
          "Co-schedule TRACK (4h), OHE (3h), and S&T (2h) in single 11:00-15:00 window on C-01. Avoids 3 independent corridor closures and saves 310 total train delay minutes.",
        confidenceScore: 94.5,
        expectedDelay: 17,
        expectedAvailabilityGain: 84.0,
        reasoning: {
          primaryObjective: "Minimize total network train delay while executing critical rail renewal.",
          synergyGain: "Track and OHE work safely parallelized under common section isolator.",
        },
        status: "APPROVED",
      },
      {
        recommendationType: "TURNOUT_CROSSOVER_CO_POSSESSION",
        maintenanceTaskId: taskTrackBSB.id,
        blockWindowId: blockWindowC03.id,
        recommendationText:
          "Synchronize Varanasi Cantt diamond crossover rail replacement with axle counter sensor calibration on C-03 (09:00–12:00).",
        confidenceScore: 91.0,
        expectedDelay: 12,
        expectedAvailabilityGain: 78.0,
        reasoning: {
          primaryObjective: "Parallelize S&T signaling checks during track disconnection.",
          synergyGain: "Prevents double yard speed restriction.",
        },
        status: "APPROVED",
      },
      {
        recommendationType: "CATENARY_SHADOW_WINDOW",
        maintenanceTaskId: taskOhePRYJ.id,
        blockWindowId: blockWindowC04.id,
        recommendationText:
          "Execute Mirzapur auto-tension pulley overhaul during low freight density shadow window (10:00–13:00) on C-04.",
        confidenceScore: 88.0,
        expectedDelay: 15,
        expectedAvailabilityGain: 75.0,
        reasoning: {
          primaryObjective: "Utilize daylight thermal window for precise dropper tensioning.",
        },
        status: "APPROVED",
      },
    ],
  });

  // ==========================================
  // 14. Optimization Engine & Master Plans (23, 24, 25, 26, 27)
  // ==========================================
  console.log("-> Seeding OR-Tools Optimization Runs & Master Maintenance Plans...");
  const optRun = await prisma.optimizationRun.create({
    data: {
      corridorId: corridorC01.id,
      planningStart: blockStart1,
      planningEnd: blockEnd1,
      solver: "OR-TOOLS-CP-SAT",
      status: "SOLVED_OPTIMAL",
      startedAt: new Date(Date.now() - 3600 * 1000 * 2),
      completedAt: new Date(Date.now() - 3600 * 1000 * 2 + 1840),
      objectiveScore: 96.4,
      runtimeMs: 1840,
      resultSummary: {
        solverStatus: "OPTIMAL",
        conflictsResolved: 3,
        totalTasksScheduled: 5,
        assetAvailabilityGainPercent: 14.8,
      },
    },
  });

  // Optimization Constraints
  await prisma.optimizationConstraint.createMany({
    data: [
      {
        optimizationRunId: optRun.id,
        constraintType: "SAFETY_REQUIRED",
        constraintName: "NO_TRAIN_INSIDE_ACTIVE_POSSESSION",
        hardConstraint: true,
        weight: 1000.0,
      },
      {
        optimizationRunId: optRun.id,
        constraintType: "CREW_AVAILABLE",
        constraintName: "TRACK_GANG_CERTIFIED_OPERATOR_REQUIRED",
        hardConstraint: true,
        weight: 500.0,
      },
      {
        optimizationRunId: optRun.id,
        constraintType: "MERGE_COMPATIBLE_TASKS",
        constraintName: "COMBINE_OHE_TRACK_CO_POSSESSION",
        hardConstraint: false,
        weight: 250.0,
      },
    ],
  });

  // Maintenance Master Plan
  const maintPlan = await prisma.maintenancePlan.create({
    data: {
      planCode: "PLAN-2026-SEP-W3-014",
      optimizationRunId: optRun.id,
      planType: "WEEKLY",
      startDate: todayDateOnly,
      endDate: new Date(todayDateOnly.getTime() + 3600 * 1000 * 24 * 7),
      status: "APPROVED",
      totalTasks: 7,
      totalBlocks: 5,
      optimizationScore: 94.5,
      createdBy: userEng.id,
      approvedBy: userAdmin.id,
      approvedAt: new Date(),
    },
  });

  // Plan Blocks: Exactly matching the 5 Upcoming Maintenance Blocks on Dashboard
  // PB-01: C-01 Today 11:00–15:00 ("CONFIRMED")
  const planBlock1 = await prisma.planBlock.create({
    data: {
      planId: maintPlan.id,
      blockWindowId: blockWindowC01.id,
      corridorId: corridorC01.id,
      startTime: blockStart1,
      endTime: blockEnd1,
      status: "CONFIRMED",
      optimizationScore: 94.5,
      expectedDelay: 17,
      assetAvailabilityGain: 85.0,
    },
  });

  // PB-02: C-03 Tomorrow 09:00–12:00 ("PLANNED")
  const planBlock2 = await prisma.planBlock.create({
    data: {
      planId: maintPlan.id,
      blockWindowId: blockWindowC03.id,
      corridorId: corridorC03.id,
      startTime: blockStart2,
      endTime: new Date(blockStart2.getTime() + 3600 * 1000 * 3), // 09:00 - 12:00
      status: "PLANNED",
      optimizationScore: 91.0,
      expectedDelay: 12,
      assetAvailabilityGain: 80.0,
    },
  });

  // PB-03: C-02 +2 Days 14:00–18:00 ("PLANNED")
  const planBlock3 = await prisma.planBlock.create({
    data: {
      planId: maintPlan.id,
      blockWindowId: blockWindowC02.id,
      corridorId: corridorC02.id,
      startTime: blockStart3,
      endTime: blockEnd3,
      status: "PLANNED",
      optimizationScore: 89.5,
      expectedDelay: 14,
      assetAvailabilityGain: 76.0,
    },
  });

  // PB-04: C-01 +4 Days 11:00–15:00 ("AI_SUGGESTED")
  const planBlock4 = await prisma.planBlock.create({
    data: {
      planId: maintPlan.id,
      blockWindowId: blockWindowC01_Next.id,
      corridorId: corridorC01.id,
      startTime: blockStart4,
      endTime: blockEnd4,
      status: "AI_SUGGESTED",
      optimizationScore: 93.0,
      expectedDelay: 10,
      assetAvailabilityGain: 82.0,
    },
  });

  // PB-05: C-04 +5 Days 10:00–13:00 ("TENTATIVE")
  const planBlock5 = await prisma.planBlock.create({
    data: {
      planId: maintPlan.id,
      blockWindowId: blockWindowC04.id,
      corridorId: corridorC04.id,
      startTime: blockStart5,
      endTime: new Date(blockStart5.getTime() + 3600 * 1000 * 3), // 10:00 - 13:00
      status: "TENTATIVE",
      optimizationScore: 87.0,
      expectedDelay: 15,
      assetAvailabilityGain: 75.0,
    },
  });

  // Assign Plan Tasks to each Plan Block
  // PB-01 Tasks (C-01: Track 4h, OHE 3h, S&T 2h)
  await prisma.planTask.createMany({
    data: [
      {
        planBlockId: planBlock1.id,
        maintenanceTaskId: taskTrack.id,
        departmentId: deptEng.id,
        sequenceOrder: 1,
        allocatedDuration: 240,
        status: "CONFIRMED",
      },
      {
        planBlockId: planBlock1.id,
        maintenanceTaskId: taskOhe.id,
        departmentId: deptOhe.id,
        sequenceOrder: 2,
        allocatedDuration: 180,
        status: "CONFIRMED",
      },
      {
        planBlockId: planBlock1.id,
        maintenanceTaskId: taskSnt.id,
        departmentId: deptSnt.id,
        sequenceOrder: 3,
        allocatedDuration: 120,
        status: "CONFIRMED",
      },
      // PB-02 Tasks (C-03: Track BSB 3h, Signal BSB 1.5h)
      {
        planBlockId: planBlock2.id,
        maintenanceTaskId: taskTrackBSB.id,
        departmentId: deptEng.id,
        sequenceOrder: 1,
        allocatedDuration: 180,
        status: "PLANNED",
      },
      {
        planBlockId: planBlock2.id,
        maintenanceTaskId: taskSignalBSB.id,
        departmentId: deptSnt.id,
        sequenceOrder: 2,
        allocatedDuration: 90,
        status: "PLANNED",
      },
      // PB-05 Tasks (C-04: OHE PRYJ 3h)
      {
        planBlockId: planBlock5.id,
        maintenanceTaskId: taskOhePRYJ.id,
        departmentId: deptOhe.id,
        sequenceOrder: 1,
        allocatedDuration: 180,
        status: "TENTATIVE",
      },
    ],
  });

  // ==========================================
  // 15. Work Orders & Maintenance Execution (28, 29, 30)
  // ==========================================
  console.log("-> Seeding Work Orders & Execution Feedback Loop...");
  const workOrderTrack = await prisma.workOrder.create({
    data: {
      workOrderCode: "WO-2026-TRK-901",
      maintenanceTaskId: taskTrack.id,
      planBlockId: planBlock1.id,
      assetId: assetTrack.id,
      departmentId: deptEng.id,
      assignedTeamId: teamTrack.id,
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      scheduledStart: blockStart1,
      scheduledEnd: blockEnd1,
      actualStart: blockStart1,
      progressPercent: 65.0,
      description: "Replace 20m switch rail, execute mobile flash butt weld, destress rail, and verify track gauge tolerance.",
      safetyRequirements: {
        bannerFlagProtectionMeters: 600,
        detonatorsPlaced: true,
        lookoutManDeputed: true,
        tractionPowerTripped: true,
      },
    },
  });

  // Allocate resource to work order
  await prisma.workOrderResource.create({
    data: {
      workOrderId: workOrderTrack.id,
      resourceId: resourceTamper.id,
      employeeId: emp1.id,
      quantity: 1,
      allocatedFrom: blockStart1,
      allocatedTo: blockEnd1,
    },
  });

  // Maintenance Execution Log (Feedback loop updating asset condition)
  await prisma.maintenanceExecution.create({
    data: {
      workOrderId: workOrderTrack.id,
      startedAt: blockStart1,
      completedAt: new Date(blockStart1.getTime() + 3600 * 1000 * 3 + 3600 * 1000 * 0.8), // 3h 48m
      actualDuration: 228,
      completionStatus: "SUCCESS",
      delayMinutes: 0,
      issueFound: false,
      executionNotes: "New 60kg rail successfully laid, welded, and ultrasonic checked. Point machine clamps aligned cleanly.",
      assetConditionAfter: 95.0,
      executedBy: userField.id,
    },
  });

  // ==========================================
  // 16. Digital Twin Simulations (31, 32, 33)
  // ==========================================
  console.log("-> Seeding Digital Twin Simulation Scenarios & Results...");
  const simScenario = await prisma.simulationScenario.create({
    data: {
      name: "What-If: Severe Monsoon Delay + 2 Extra Rakes",
      corridorId: corridorC01.id,
      basePlanId: maintPlan.id,
      description: "Simulates shifting possession window by 60 minutes with 2 extra freight trains entering from Dadri freight terminal.",
      parameters: {
        windowShiftMinutes: 60,
        additionalFreightRakes: 2,
        weatherCondition: "HEAVY_RAIN_WATERLOGGING",
      },
      createdBy: userAdmin.id,
    },
  });

  const simRun = await prisma.simulationRun.create({
    data: {
      scenarioId: simScenario.id,
      status: "COMPLETED",
      startedAt: new Date(Date.now() - 3600 * 1000),
      completedAt: new Date(Date.now() - 3600 * 1000 + 4200),
      resultSummary: { simulationSteps: 500, timeStepSec: 10 },
    },
  });

  await prisma.simulationResult.create({
    data: {
      simulationRunId: simRun.id,
      trainConflicts: 2,
      affectedTrains: 4,
      expectedDelay: 14,
      maintenanceTasksCompleted: 3,
      assetAvailability: 96.8,
      infrastructureImpact: 12.5,
      riskScore: 32.0,
      recommendations: {
        decision: "FEASIBLE_WITH_MARGINAL_DELAY",
        advice: "Loop freight rake BOXN-9421 at Maripat loop line to let Shatabdi pass without conflict.",
      },
    },
  });

  // ==========================================
  // 17. Notifications, Attachments & Audit Logs (37, 38, 39)
  // ==========================================
  console.log("-> Seeding Notifications, Attachments & Audit Logs...");
  await prisma.notification.createMany({
    data: [
      {
        userId: userAdmin.id,
        type: "CRITICAL_DEFECT_ALERT",
        title: "🔴 Critical Rail Fatigue Defect on C-01",
        message: "USFD flaw DEF-2026-TRK-001 requires track block within 72 hours.",
        severity: "CRITICAL",
        isRead: false,
        referenceType: "DEFECT",
        referenceId: defectTrack.id,
      },
      {
        userId: userAdmin.id,
        type: "PLAN_APPROVED",
        title: "🟢 Maintenance Plan Approved",
        message: "Plan PLAN-2026-SEP-W3-014 approved for unified possession on 14 Sept.",
        severity: "LOW",
        isRead: true,
        referenceType: "PLAN",
        referenceId: maintPlan.id,
      },
      {
        userId: userEng.id,
        type: "AI_RECOMMENDATION",
        title: "🔵 AI Multi-Department Co-possession Suggested",
        message: "OR-Tools recommended grouping Track, OHE, and S&T tasks into Block PB-01.",
        severity: "MEDIUM",
        isRead: false,
        referenceType: "BLOCK",
        referenceId: blockWindowC01.id,
      },
    ],
  });

  await prisma.attachment.create({
    data: {
      entityType: "INSPECTION",
      entityId: inspectionTrack.id,
      fileName: "USFD_Ultrasonic_Calibration_Report_GZB_Point44.pdf",
      fileUrl: "https://railways.gov.in/docs/usfd/2026/GZB_Point44_Scan.pdf",
      mimeType: "application/pdf",
      fileSize: BigInt(2048576),
      uploadedBy: userField.id,
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        userId: userAdmin.id,
        action: "APPROVED_MAINTENANCE_PLAN",
        entityType: "MAINTENANCE_PLAN",
        entityId: maintPlan.id,
        newValues: { status: "APPROVED", approvedBy: userAdmin.name },
        ipAddress: "10.24.112.45",
      },
      {
        userId: userEng.id,
        action: "SUBMITTED_BLOCK_REQUEST",
        entityType: "BLOCK_REQUEST",
        entityId: reqEng.id,
        newValues: { requestCode: reqEng.requestCode, durationMinutes: 240 },
        ipAddress: "10.24.112.89",
      },
    ],
  });

  console.log("✅ Seed finished successfully! All 40 tables populated with realistic railway data.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
