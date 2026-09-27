export type Department = "Engineering" | "OHE" | "S&T" | "Joint";

export type BlockStatus =
  | "AI Suggested"
  | "Controller Approved"
  | "Pending Review"
  | "Rejected";

export interface TaskItem {
  id: string;
  title: string;
  department: Department;
  sectionKm: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  durationMinutes: number;
  equipment: string;
  crewRequired: number;
}

export interface TrainImpactItem {
  trainNo: string;
  trainName: string;
  trainType: "Express" | "Superfast" | "Freight" | "Passenger";
  scheduledTime: string;
  impactType: "None" | "Regulated" | "Rescheduled" | "Rerouted";
  delayMinutes: number;
  notes: string;
}

export interface MaintenanceBlock {
  id: number;
  blockCode: string;
  date: string;
  shortDate: string;
  day: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  corridorId: string;
  corridorName: string;
  tasksCount: number;
  departments: Department[];
  trainImpactSummary: string;
  trainsRegulated: number;
  aiScore: number;
  status: BlockStatus;
  blockType: "Full Possession" | "Shadow Block" | "Power Disconnection Only";
  weather: string;
  crewMembers: number;
  safetySupervised: boolean;
  downtimeSavedHours: number;
  availabilityGainPercent: number;
  costSavingsLakhs: number;
  tasks: TaskItem[];
  affectedTrains: TrainImpactItem[];
  assignedCrew: string;
  assignedMachines: string[];
  approvalAudit?: {
    approvedBy?: string;
    approvedAt?: string;
    note?: string;
  };
}

export interface CorridorScheduleRow {
  corridorId: string;
  corridorName: string;
  section: string;
  blocks: MaintenanceBlock[];
}

export interface PlanKPIData {
  totalTasks: number;
  tasksTrend: string;
  scheduledBlocks: number;
  blocksTrend: string;
  corridorsCount: number;
  departmentsCount: number;
  resourceUtilization: number;
  utilizationTrend: string;
}

export type PlanViewMode = "week" | "month" | "list";
