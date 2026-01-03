import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout';
import { StatCard, RecentActivity, LeaveStatusCard, AttendanceOverview } from '@/components/dashboard';
import { mockDashboardStats, mockActivityLogs, mockLeaveRequests, mockAttendance, mockEmployees } from '@/mockData';
import { Users, UserCheck, Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Get current user's data
  const currentEmployee = mockEmployees.find((e) => e.employeeId === user?.employeeId);
  const userAttendance = mockAttendance.filter((a) => a.employeeId === user?.employeeId);
  const userLeaves = mockLeaveRequests.filter((l) => l.employeeId === user?.employeeId);

  // Today's attendance status
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = userAttendance.find((a) => a.date === today);

  return (
    <DashboardLayout title={isAdmin ? 'Admin Dashboard' : 'Dashboard'}>
      <div className="page-transition space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.firstName}!
            </h2>
            <p className="text-muted-foreground mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          {!isAdmin && (
            <div className="flex gap-3">
              <Link to="/leaves">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Apply Leave
                </Button>
              </Link>
              <Link to="/attendance">
                <Button>
                  <Clock className="mr-2 h-4 w-4" />
                  Check In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {isAdmin ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Employees"
              value={mockDashboardStats.totalEmployees}
              icon={Users}
              variant="primary"
            />
            <StatCard
              title="Present Today"
              value={mockDashboardStats.presentToday}
              icon={UserCheck}
              variant="success"
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="On Leave"
              value={mockDashboardStats.onLeave}
              icon={Calendar}
              variant="warning"
            />
            <StatCard
              title="Pending Approvals"
              value={mockDashboardStats.pendingLeaves}
              icon={AlertCircle}
              variant="info"
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Today's Status"
              value={todayAttendance?.status || 'Not Checked In'}
              icon={Clock}
              variant={todayAttendance?.status === 'present' ? 'success' : 'warning'}
            />
            <StatCard
              title="Leave Balance"
              value="12 days"
              icon={Calendar}
              variant="info"
            />
            <StatCard
              title="This Month"
              value="22 days"
              icon={TrendingUp}
              variant="primary"
            />
            <StatCard
              title="Pending Leaves"
              value={userLeaves.filter((l) => l.status === 'pending').length}
              icon={AlertCircle}
              variant="warning"
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Activity & Stats */}
          <div className="lg:col-span-2 space-y-6">
            <AttendanceOverview
              records={isAdmin ? mockAttendance.slice(0, 10) : userAttendance}
              title={isAdmin ? 'Team Attendance Overview' : 'My Recent Attendance'}
            />

            {isAdmin && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base font-semibold">Pending Leave Requests</CardTitle>
                  <Link to="/leave-approvals">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLeaveRequests
                      .filter((l) => l.status === 'pending')
                      .slice(0, 3)
                      .map((leave) => (
                        <div
                          key={leave.id}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <div>
                            <p className="font-medium text-foreground">{leave.employeeName}</p>
                            <p className="text-sm text-muted-foreground">
                              {leave.leaveType} leave • {leave.startDate} to {leave.endDate}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                            <Button size="sm">Approve</Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-6">
            {/* Quick Profile Card */}
            {!isAdmin && currentEmployee && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={currentEmployee.avatar}
                      alt={`${currentEmployee.firstName} ${currentEmployee.lastName}`}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <h3 className="mt-4 font-semibold text-foreground">
                      {currentEmployee.firstName} {currentEmployee.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{currentEmployee.designation}</p>
                    <p className="text-xs text-muted-foreground">{currentEmployee.department}</p>
                    <Link to="/profile" className="mt-4 w-full">
                      <Button variant="outline" className="w-full" size="sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leave Status */}
            <LeaveStatusCard
              leaves={isAdmin ? mockLeaveRequests : userLeaves}
              title={isAdmin ? 'Recent Leave Requests' : 'My Leave Requests'}
            />

            {/* Recent Activity */}
            <RecentActivity activities={mockActivityLogs} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
