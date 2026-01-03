import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout';
import { mockLeaveRequests } from '@/mockData';
import { LeaveRequest, LeaveType, LeaveStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const statusStyles = {
  pending: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-destructive',
};

const leaveTypeLabels = {
  paid: 'Paid Leave',
  sick: 'Sick Leave',
  unpaid: 'Unpaid Leave',
};

export default function Leaves() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(
    mockLeaveRequests.filter((l) => l.employeeId === user?.employeeId)
  );

  const [formData, setFormData] = useState({
    leaveType: '' as LeaveType | '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: user?.employeeId || '',
      employeeName: `${user?.firstName} ${user?.lastName}`,
      leaveType: formData.leaveType as LeaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    setLeaves([newLeave, ...leaves]);
    setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
    setIsDialogOpen(false);

    toast({
      title: 'Leave Request Submitted',
      description: 'Your leave request has been submitted for approval.',
    });
  };

  // Calculate leave balance (mock data)
  const leaveBalance = {
    paid: 12,
    sick: 6,
    unpaid: 0,
    used: {
      paid: 3,
      sick: 1,
      unpaid: 0,
    },
  };

  return (
    <DashboardLayout title="Leave Management">
      <div className="page-transition space-y-6">
        {/* Leave Balance Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paid Leave</p>
                  <p className="text-2xl font-bold text-success">
                    {leaveBalance.paid - leaveBalance.used.paid} days
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {leaveBalance.used.paid} used of {leaveBalance.paid}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-success/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-warning/5 border-warning/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sick Leave</p>
                  <p className="text-2xl font-bold text-warning">
                    {leaveBalance.sick - leaveBalance.used.sick} days
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {leaveBalance.used.sick} used of {leaveBalance.sick}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-warning/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-info/5 border-info/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unpaid Leave</p>
                  <p className="text-2xl font-bold text-info">Available</p>
                  <p className="text-xs text-muted-foreground mt-1">As per policy approval</p>
                </div>
                <Calendar className="h-10 w-10 text-info/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">My Leave Requests</CardTitle>
              <CardDescription>View and manage your leave applications</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Apply for Leave
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Apply for Leave</DialogTitle>
                  <DialogDescription>
                    Submit a new leave request for approval
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaveType">Leave Type</Label>
                    <Select
                      value={formData.leaveType}
                      onValueChange={(value: LeaveType) =>
                        setFormData({ ...formData, leaveType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid Leave</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason / Remarks</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please provide a reason for your leave request..."
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit Request</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {leaves.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No leave requests found</p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  Apply for Leave
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-foreground">
                          {leaveTypeLabels[leave.leaveType]}
                        </h4>
                        <Badge variant="outline" className={cn(statusStyles[leave.status])}>
                          {leave.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(leave.startDate), 'MMM d, yyyy')} -{' '}
                        {format(new Date(leave.endDate), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{leave.reason}</p>
                      {leave.comments && (
                        <p className="text-sm text-destructive mt-2">
                          <span className="font-medium">Admin Comment:</span> {leave.comments}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Applied on {format(new Date(leave.appliedOn), 'MMM d, yyyy')}
                      </p>
                      {leave.reviewedBy && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Reviewed by {leave.reviewedBy}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
