"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(60),
    lastName: z.string().min(1, "Last name is required").max(60),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z.string().optional().or(z.literal("")),
    clientType: z.enum(["INDIVIDUAL", "BUSINESS"]),
    legalName: z.string().optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.clientType !== "BUSINESS" ||
      (data.legalName && data.legalName.trim().length > 0),
    {
      message: "Company / legal name is required for business accounts",
      path: ["legalName"],
    }
  );

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SelfClientSignupPage() {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession, signup } = useSelfClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      clientType: "INDIVIDUAL",
      legalName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const clientType = watch("clientType");

  const signupMutation = useMutation({
    mutationFn: async (values: SignupFormValues) => {
      await signup({
        email: values.email.trim(),
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone?.trim() || undefined,
        legalName:
          values.legalName?.trim() || `${values.firstName.trim()} ${values.lastName.trim()}`,
        clientType: values.clientType,
      });
    },
    onSuccess: () => {
      toast.success("Account created — welcome!");
      router.push("/self-client");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to register. Please try again.");
    },
  });

  useEffect(() => {
    if (!isCheckingSession && isAuthenticated) {
      router.replace("/self-client");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  const submitting = signupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block text-2xl font-semibold text-[#0B1528]">
              A&amp;A<span className="text-[#E35A37]">.</span>
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">Create Client Account</h1>
            <p className="text-sm text-slate-500">
              Register to access your dashboard, view quotes, and track updates.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit((v) => signupMutation.mutate(v))}
            noValidate
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  disabled={submitting}
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />
                <FieldError message={errors.firstName?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  disabled={submitting}
                  aria-invalid={!!errors.lastName}
                  {...register("lastName")}
                />
                <FieldError message={errors.lastName?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                autoComplete="email"
                disabled={submitting}
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                autoComplete="tel"
                disabled={submitting}
                {...register("phone")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clientType">Client Type *</Label>
              <Select id="clientType" disabled={submitting} {...register("clientType")}>
                <option value="INDIVIDUAL">Individual</option>
                <option value="BUSINESS">Business Entity</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="legalName">
                {clientType === "BUSINESS"
                  ? "Company / Legal Name *"
                  : "Legal Name (for filings)"}
              </Label>
              <Input
                id="legalName"
                placeholder={
                  clientType === "BUSINESS"
                    ? "Acme Corp Ltd"
                    : "Leave blank to use First + Last Name"
                }
                disabled={submitting}
                aria-invalid={!!errors.legalName}
                {...register("legalName")}
              />
              <FieldError message={errors.legalName?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={submitting}
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <FieldError message={errors.password?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={submitting}
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/self-client/login"
              className="font-medium text-[#E35A37] hover:text-[#C84626]"
            >
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
