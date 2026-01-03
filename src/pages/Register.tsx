import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    password: "",
    role: "employee",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

     if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

    console.log("Register data:", form);

    // Later this will go to backend API
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              placeholder="Company Name"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
  />

            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
    placeholder="Phone"
    name="phone"
    value={form.phone}
    onChange={handleChange}
    required
  />

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Input
  name="confirmPassword"
  type="password"
  placeholder="Confirm Password"
  value={form.confirmPassword}
  onChange={handleChange}
  required
/>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
