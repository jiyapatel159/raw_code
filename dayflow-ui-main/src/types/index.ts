// User & Authentication Types
export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  employeeId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

// Employee Types
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joinDate: string;
  address: string;
  avatar?: string;
  salary: {
    basic: number;
    allowances: number;
    deductions: number;
    netSalary: number;
  };
  status: 'active' | 'inactive' | 'on-leave';
}

// Attendance Types
export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave' | 'holiday';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workHours?: number;
}

// Leave Types
export type LeaveType = 'paid' | 'sick' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  comments?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingLeaves: number;
}

// Activity Log
export interface ActivityLog {
  id: string;
  type: 'leave' | 'attendance' | 'profile' | 'system';
  message: string;
  timestamp: string;
  userId: string;
}
