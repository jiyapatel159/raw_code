import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout';
import { mockEmployees } from '@/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Save, X, Mail, Phone, MapPin, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Get current employee data
  const employee = mockEmployees.find((e) => e.employeeId === user?.employeeId) || mockEmployees[0];

  const [formData, setFormData] = useState({
    phone: employee.phone,
    address: employee.address,
  });

  const handleSave = () => {
    // In a real app, this would call an API
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      phone: employee.phone,
      address: employee.address,
    });
    setIsEditing(false);
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="page-transition space-y-6 max-w-4xl">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <img
                  src={employee.avatar}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-background shadow-lg"
                />
                <Badge
                  className={cn(
                    'absolute -bottom-1 left-1/2 -translate-x-1/2',
                    employee.status === 'active' ? 'badge-success' : 'badge-warning'
                  )}
                  variant="outline"
                >
                  {employee.status}
                </Badge>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-lg text-muted-foreground">{employee.designation}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {employee.department}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {employee.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="mr-1 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="mr-1 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">Employee ID</Label>
                  <p className="font-medium text-foreground">{employee.employeeId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium text-foreground">
                    {employee.firstName} {employee.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email Address</Label>
                  <p className="font-medium text-foreground">{employee.email}</p>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-muted-foreground">
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{employee.phone}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address" className="text-muted-foreground">
                    Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{employee.address}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium text-foreground">{employee.department}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Designation</Label>
                  <p className="font-medium text-foreground">{employee.designation}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Join Date</Label>
                  <p className="font-medium text-foreground">
                    {new Date(employee.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Employment Status</Label>
                  <Badge
                    variant="outline"
                    className={cn(
                      'mt-1',
                      employee.status === 'active' ? 'badge-success' : 'badge-warning'
                    )}
                  >
                    {employee.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Salary Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-4">
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Basic Salary</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    ${employee.salary.basic.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-success/5 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Allowances</p>
                  <p className="text-xl font-bold text-success mt-1">
                    +${employee.salary.allowances.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-destructive/5 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Deductions</p>
                  <p className="text-xl font-bold text-destructive mt-1">
                    -${employee.salary.deductions.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/5 p-4 text-center border-2 border-primary/20">
                  <p className="text-sm text-muted-foreground">Net Salary</p>
                  <p className="text-xl font-bold text-primary mt-1">
                    ${employee.salary.netSalary.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
