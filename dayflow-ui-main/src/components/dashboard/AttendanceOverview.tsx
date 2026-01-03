import { AttendanceRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AttendanceOverviewProps {
  records: AttendanceRecord[];
  title?: string;
}

const statusStyles = {
  present: 'badge-success',
  absent: 'badge-destructive',
  'half-day': 'badge-warning',
  leave: 'badge-info',
  holiday: 'badge-info',
};

export function AttendanceOverview({ records, title = 'Recent Attendance' }: AttendanceOverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {records.slice(0, 5).map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {format(new Date(record.date), 'EEE')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(record.date), 'MMM d')}
                  </p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  {record.checkIn && (
                    <p className="text-sm text-foreground">
                      {record.checkIn} - {record.checkOut || 'Active'}
                    </p>
                  )}
                  {!record.checkIn && (
                    <p className="text-sm text-muted-foreground">No check-in</p>
                  )}
                </div>
              </div>
              <Badge variant="outline" className={cn('capitalize', statusStyles[record.status])}>
                {record.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
