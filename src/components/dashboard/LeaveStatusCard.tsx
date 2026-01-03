import { LeaveRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface LeaveStatusCardProps {
  leaves: LeaveRequest[];
  title?: string;
}

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

export function LeaveStatusCard({ leaves, title = 'My Leave Requests' }: LeaveStatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {leaves.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No leave requests found</p>
        ) : (
          <div className="space-y-3">
            {leaves.slice(0, 4).map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {leaveTypeLabels[leave.leaveType]}
                    </p>
                    <Badge variant="outline" className={cn('text-xs', statusStyles[leave.status])}>
                      {leave.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(leave.startDate), 'MMM d')} -{' '}
                    {format(new Date(leave.endDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
