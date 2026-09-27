export type MaintenanceStatus = "Pending" | "Planned" | "Completed";

export type Priority = "Critical" | "High" | "Medium" | "Low";

export type Department = "Engineering" | "Electrical" | "S&T";

export type MaintenanceTask = {
  id: string;
  asset: string;
  assetName: string;
  department: Department;
  priority: Priority;
  dueDate: string;
  risk: number;
  status: MaintenanceStatus;
};

export const DEPARTMENTS: Department[] = ["Engineering", "Electrical", "S&T"];
export const PRIORITIES: Priority[] = ["Critical", "High", "Medium", "Low"];
export const STATUSES: MaintenanceStatus[] = ["Pending", "Planned", "Completed"];
export const ASSET_TYPES = ["Track", "Signal", "OHE"] as const;
export const CORRIDORS = ["C-01", "C-02", "C-03"] as const;
export const DUE_DATE_FILTERS = ["Today", "This Week", "This Month"] as const;

export const maintenanceTasks: MaintenanceTask[] = [
  {
    id: "M104",
    asset: "TRK-C01-024",
    assetName: "Track Segment",
    department: "Engineering",
    priority: "Critical",
    dueDate: "Today",
    risk: 92,
    status: "Pending",
  },
  {
    id: "M105",
    asset: "SIG-C01-018",
    assetName: "Signal System",
    department: "S&T",
    priority: "High",
    dueDate: "2 days",
    risk: 81,
    status: "Pending",
  },
  {
    id: "M106",
    asset: "OHE-C03-012",
    assetName: "OHE Mast",
    department: "Electrical",
    priority: "High",
    dueDate: "3 days",
    risk: 74,
    status: "Planned",
  },
  {
    id: "M107",
    asset: "TRK-C02-088",
    assetName: "Track Segment",
    department: "Engineering",
    priority: "Medium",
    dueDate: "7 days",
    risk: 42,
    status: "Pending",
  },
  {
    id: "M108",
    asset: "PWR-C01-045",
    assetName: "Traction Power",
    department: "Electrical",
    priority: "Medium",
    dueDate: "10 Sep 2025",
    risk: 56,
    status: "Planned",
  },
  {
    id: "M109",
    asset: "SIG-C02-031",
    assetName: "Interlocking",
    department: "S&T",
    priority: "High",
    dueDate: "11 Sep 2025",
    risk: 68,
    status: "Pending",
  },
  {
    id: "M110",
    asset: "TRL-C03-011",
    assetName: "Turnout",
    department: "Engineering",
    priority: "Low",
    dueDate: "12 Sep 2025",
    risk: 28,
    status: "Pending",
  },
  {
    id: "M111",
    asset: "OHE-C01-027",
    assetName: "OHE Wire",
    department: "Electrical",
    priority: "Medium",
    dueDate: "14 Sep 2025",
    risk: 39,
    status: "Planned",
  },
  {
    id: "M112",
    asset: "TRK-C04-019",
    assetName: "Bridge Segment",
    department: "Engineering",
    priority: "High",
    dueDate: "15 Sep 2025",
    risk: 73,
    status: "Pending",
  },
  {
    id: "M113",
    asset: "SIG-C03-007",
    assetName: "Interlocking",
    department: "S&T",
    priority: "Low",
    dueDate: "17 Sep 2025",
    risk: 21,
    status: "Planned",
  },
];
