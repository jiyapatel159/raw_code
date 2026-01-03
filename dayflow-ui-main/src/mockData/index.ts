import { Employee, AttendanceRecord, LeaveRequest, User, ActivityLog, DashboardStats } from '@/types';

// Mock Users for Authentication
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@dayflow.com',
    role: 'admin',
    employeeId: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    email: 'john@dayflow.com',
    role: 'employee',
    employeeId: 'EMP002',
    firstName: 'John',
    lastName: 'Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
];

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@dayflow.com',
    phone: '+1 (555) 123-4567',
    department: 'Human Resources',
    designation: 'HR Manager',
    joinDate: '2022-03-15',
    address: '123 Main Street, New York, NY 10001',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    salary: {
      basic: 75000,
      allowances: 12000,
      deductions: 8500,
      netSalary: 78500,
    },
    status: 'active',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@dayflow.com',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    designation: 'Senior Developer',
    joinDate: '2021-06-01',
    address: '456 Oak Avenue, San Francisco, CA 94102',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    salary: {
      basic: 95000,
      allowances: 15000,
      deductions: 12000,
      netSalary: 98000,
    },
    status: 'active',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily@dayflow.com',
    phone: '+1 (555) 345-6789',
    department: 'Marketing',
    designation: 'Marketing Lead',
    joinDate: '2023-01-10',
    address: '789 Pine Road, Los Angeles, CA 90001',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    salary: {
      basic: 68000,
      allowances: 10000,
      deductions: 7500,
      netSalary: 70500,
    },
    status: 'on-leave',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael@dayflow.com',
    phone: '+1 (555) 456-7890',
    department: 'Engineering',
    designation: 'Full Stack Developer',
    joinDate: '2022-09-20',
    address: '321 Elm Street, Seattle, WA 98101',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    salary: {
      basic: 82000,
      allowances: 12000,
      deductions: 9500,
      netSalary: 84500,
    },
    status: 'active',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'Jessica',
    lastName: 'Wilson',
    email: 'jessica@dayflow.com',
    phone: '+1 (555) 567-8901',
    department: 'Finance',
    designation: 'Financial Analyst',
    joinDate: '2023-04-05',
    address: '654 Maple Drive, Chicago, IL 60601',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    salary: {
      basic: 72000,
      allowances: 11000,
      deductions: 8000,
      netSalary: 75000,
    },
    status: 'active',
  },
];

// Generate attendance records for past 7 days
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: ('present' | 'absent' | 'half-day' | 'leave')[] = ['present', 'present', 'present', 'present', 'absent', 'half-day', 'leave'];
  
  mockEmployees.forEach((employee) => {
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      records.push({
        id: `${employee.id}-${i}`,
        employeeId: employee.employeeId,
        date: date.toISOString().split('T')[0],
        checkIn: status === 'present' || status === 'half-day' ? '09:00' : undefined,
        checkOut: status === 'present' ? '18:00' : status === 'half-day' ? '13:00' : undefined,
        status,
        workHours: status === 'present' ? 9 : status === 'half-day' ? 4 : 0,
      });
    }
  });
  
  return records;
};

export const mockAttendance: AttendanceRecord[] = generateAttendanceRecords();

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'EMP003',
    employeeName: 'Emily Davis',
    leaveType: 'paid',
    startDate: '2026-01-06',
    endDate: '2026-01-08',
    reason: 'Family vacation planned for the new year.',
    status: 'pending',
    appliedOn: '2026-01-02',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'John Smith',
    leaveType: 'sick',
    startDate: '2025-12-28',
    endDate: '2025-12-29',
    reason: 'Not feeling well, need rest.',
    status: 'approved',
    appliedOn: '2025-12-27',
    reviewedBy: 'Sarah Johnson',
    reviewedOn: '2025-12-27',
  },
  {
    id: '3',
    employeeId: 'EMP004',
    employeeName: 'Michael Brown',
    leaveType: 'unpaid',
    startDate: '2026-01-15',
    endDate: '2026-01-17',
    reason: 'Personal emergency.',
    status: 'pending',
    appliedOn: '2026-01-01',
  },
  {
    id: '4',
    employeeId: 'EMP005',
    employeeName: 'Jessica Wilson',
    leaveType: 'paid',
    startDate: '2025-12-20',
    endDate: '2025-12-22',
    reason: 'Attending a wedding.',
    status: 'rejected',
    appliedOn: '2025-12-15',
    reviewedBy: 'Sarah Johnson',
    reviewedOn: '2025-12-16',
    comments: 'Critical deadline during requested period. Please reschedule.',
  },
];

// Mock Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    type: 'leave',
    message: 'Emily Davis submitted a leave request for Jan 6-8',
    timestamp: '2026-01-02T10:30:00',
    userId: 'EMP003',
  },
  {
    id: '2',
    type: 'attendance',
    message: 'Michael Brown checked in at 9:05 AM',
    timestamp: '2026-01-03T09:05:00',
    userId: 'EMP004',
  },
  {
    id: '3',
    type: 'leave',
    message: 'Leave request from John Smith was approved',
    timestamp: '2025-12-27T14:20:00',
    userId: 'EMP002',
  },
  {
    id: '4',
    type: 'profile',
    message: 'Jessica Wilson updated contact information',
    timestamp: '2025-12-26T11:45:00',
    userId: 'EMP005',
  },
  {
    id: '5',
    type: 'system',
    message: 'Monthly payroll processed successfully',
    timestamp: '2025-12-25T00:00:00',
    userId: 'system',
  },
];

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalEmployees: mockEmployees.length,
  presentToday: 4,
  onLeave: 1,
  pendingLeaves: 2,
};
