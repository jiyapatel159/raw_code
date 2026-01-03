import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { mockLeaveRequests, mockEmployees } from '@/mockData';
import { LeaveRequest, LeaveStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, MessageSquare, Calendar, Clock, AlertCircle } from 'lucide-react';
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

export default function LeaveApprovals() {
  const { toast } = useToast();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | 'all'>('all');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  const filteredLeaves =
    filterStatus === 'all' ? leaves : leaves.filter((l) => l.status === filterStatus);

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  const handleApprove = (leaveId: string) => {
    setLeaves(
      leaves.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: 'approved' as LeaveStatus,
              reviewedBy: 'Sarah Johnson',
              reviewedOn: new Date().toISOString().split('T')[0],
            }
          : l
      )
    );
    toast({
      title: 'Leave Approved',
      description: 'The leave request has been approved successfully.',
    });
  };

  const handleReject = () => {
    if (!selectedLeave) return;

    setLeaves(
      leaves.map((l) =>
        l.id === selectedLeave.id
          ? {
              ...l,
              status: 'rejected' as LeaveStatus,
              reviewedBy: 'Sarah Johnson',
              reviewedOn: new Date().toISOString().split('T')[0],
              comments: rejectComment,
            }
          : l
      )
    );

    toast({
      title: 'Leave Rejected',
      description: 'The leave request has been rejected.',
      variant: 'destructive',
    });

    setSelectedLeave(null);
    setRejectComment('');
  };

  const getEmployee = (employeeId: string) =>
    mockEmployees.find((e) => e.employeeId === employeeId);

  return (
    <DashboardLayout title="Leave Approvals">
      <div className="page-transition space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-warning/5 border-warning/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-3xl font-bold text-warning">{pendingCount}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-warning/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved This Month</p>
                  <p className="text-3xl font-bold text-success">
                    {leaves.filter((l) => l.status === 'approved').length}
                  </p>
                </div>
                <Check className="h-10 w-10 text-success/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected This Month</p>
                  <p className="text-3xl font-bold text-destructive">
                    {leaves.filter((l) => l.status === 'rejected').length}
                  </p>
                </div>
                <X className="h-10 w-10 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Leave Requests</CardTitle>
              <CardDescription>Review and manage employee leave requests</CardDescription>
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value: LeaveStatus | 'all') => setFilterStatus(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaves.map((leave) => {
                    const employee = getEmployee(leave.employeeId);
                    return (
                      <TableRow key={leave.id} className="table-row-hover">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={employee?.avatar}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-foreground">{leave.employeeName}</p>
                              <p className="text-xs text-muted-foreground">
                                {employee?.department}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{leaveTypeLabels[leave.leaveType]}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(new Date(leave.startDate), 'MMM d')} -{' '}
                            {format(new Date(leave.endDate), 'MMM d')}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Applied: {format(new Date(leave.appliedOn), 'MMM d, yyyy')}
                          </p>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-muted-foreground truncate">{leave.reason}</p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn('capitalize', statusStyles[leave.status])}
                          >
                            {leave.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {leave.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedLeave(leave)}
                              >
                                <X className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                              <Button size="sm" onClick={() => handleApprove(leave.id)}>
                                <Check className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {leave.reviewedBy && `by ${leave.reviewedBy}`}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Reject Dialog */}
        <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Leave Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this leave request from{' '}
                {selectedLeave?.employeeName}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Leave Details:</p>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium">
                    {selectedLeave && leaveTypeLabels[selectedLeave.leaveType]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLeave &&
                      `${format(new Date(selectedLeave.startDate), 'MMM d')} - ${format(
                        new Date(selectedLeave.endDate),
                        'MMM d, yyyy'
                      )}`}
                  </p>
                </div>
              </div>
              <div>
                <Textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedLeave(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Reject Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
