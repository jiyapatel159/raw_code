import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout';
import { mockAttendance, mockEmployees } from '@/mockData';
import { AttendanceRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, LogIn, LogOut, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';

const statusStyles = {
  present: 'badge-success',
  absent: 'badge-destructive',
  'half-day': 'badge-warning',
  leave: 'badge-info',
  holiday: 'badge-info',
};

export default function Attendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';
  const [selectedEmployee, setSelectedEmployee] = useState<string>(user?.employeeId || 'all');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Filter attendance records
  const filteredAttendance =
    isAdmin && selectedEmployee === 'all'
      ? mockAttendance
      : mockAttendance.filter((a) => a.employeeId === (isAdmin ? selectedEmployee : user?.employeeId));

  // Get week days for calendar view
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    toast({
      title: 'Checked In',
      description: `Successfully checked in at ${format(new Date(), 'hh:mm a')}`,
    });
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    toast({
      title: 'Checked Out',
      description: `Successfully checked out at ${format(new Date(), 'hh:mm a')}`,
    });
  };

  // Get attendance status for a specific day
  const getAttendanceForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredAttendance.find((a) => a.date === dateStr);
  };

  return (
    <DashboardLayout title="Attendance">
      <div className="page-transition space-y-6">
        {/* Check-in/out Card for Employees */}
        {!isAdmin && (
          <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <p className="text-3xl font-bold text-primary mt-1">
                      {format(new Date(), 'hh:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    onClick={handleCheckIn}
                    disabled={isCheckedIn}
                    className="min-w-32"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Check In
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleCheckOut}
                    disabled={!isCheckedIn}
                    className="min-w-32"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Check Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Calendar View */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </CardTitle>
            {isAdmin && (
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp.employeeId} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const attendance = getAttendanceForDay(day);
                const isCurrentDay = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'rounded-lg border p-3 text-center transition-colors',
                      isCurrentDay ? 'border-primary bg-primary/5' : 'border-border',
                      attendance?.status === 'present' && 'bg-success/5 border-success/20',
                      attendance?.status === 'absent' && 'bg-destructive/5 border-destructive/20',
                      attendance?.status === 'leave' && 'bg-info/5 border-info/20'
                    )}
                  >
                    <p className="text-xs text-muted-foreground">{format(day, 'EEE')}</p>
                    <p className={cn('text-lg font-semibold', isCurrentDay && 'text-primary')}>
                      {format(day, 'd')}
                    </p>
                    {attendance && (
                      <Badge
                        variant="outline"
                        className={cn('mt-1 text-xs', statusStyles[attendance.status])}
                      >
                        {attendance.status}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {isAdmin && <TableHead>Employee</TableHead>}
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Work Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.slice(0, 15).map((record) => {
                    const employee = mockEmployees.find((e) => e.employeeId === record.employeeId);
                    return (
                      <TableRow key={record.id} className="table-row-hover">
                        {isAdmin && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img
                                src={employee?.avatar}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover"
                              />
                              <span className="font-medium">
                                {employee?.firstName} {employee?.lastName}
                              </span>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div>
                            <p className="font-medium">{format(new Date(record.date), 'MMM d, yyyy')}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(record.date), 'EEEE')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{record.checkIn || '-'}</TableCell>
                        <TableCell>{record.checkOut || '-'}</TableCell>
                        <TableCell>{record.workHours ? `${record.workHours}h` : '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('capitalize', statusStyles[record.status])}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
