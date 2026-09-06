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
import { usePartner } from "@/components/partner/PartnerProvider";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const partnerSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  legalName: z.string().optional().or(z.literal("")),
  displayName: z.string().optional().or(z.literal("")),
  partnerType: z.enum(["INDIVIDUAL", "AGENCY"]),
  pan: z
    .string()
    .min(1, "PAN is required")
    .transform((v) => v.toUpperCase())
    .refine((v) => PAN_REGEX.test(v), "Enter a valid 10-character PAN (e.g. ABCDE1234F)"),
  addressLine1: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  postalCode: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
});

type PartnerSignupValues = z.infer<typeof partnerSignupSchema>;

export default function PartnerSignupPage() {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession, signup } = usePartner();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerSignupValues>({
    resolver: zodResolver(partnerSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      legalName: "",
      displayName: "",
      partnerType: "INDIVIDUAL",
      pan: "",
      addressLine1: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (values: PartnerSignupValues) => {
      await signup({
        ...values,
        email: values.email.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      });
    },
    onSuccess: () => {
      toast.success("Partner account created — welcome aboard!");
      router.push("/partner");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Registration failed. Please check your inputs.");
    },
  });

  useEffect(() => {
    if (!isCheckingSession && isAuthenticated) {
      router.replace("/partner");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  const submitting = signupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block text-2xl font-semibold text-[#0B1528]">
              A&amp;A<span className="text-[#E35A37]">.</span>
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">Partner Registration</h1>
            <p className="text-sm text-slate-500">
              Join our channel partner program to refer clients and earn a share of active service revenues.
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
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
                  placeholder="+91 98765 43210"
                  disabled={submitting}
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Create Password *</Label>
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

            <div className="pt-4 border-t border-slate-200">
              <h2 className="text-base font-semibold text-slate-900 mb-3">
                Business &amp; Payout Details
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="legalName">Legal Business / Entity Name</Label>
                <Input
                  id="legalName"
                  placeholder="John Doe Consulting LLP"
                  disabled={submitting}
                  {...register("legalName")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="partnerType">Partner Type</Label>
                <Select id="partnerType" disabled={submitting} {...register("partnerType")}>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="AGENCY">Agency</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Display Name / Brand</Label>
                <Input
                  id="displayName"
                  placeholder="John Doe Services"
                  disabled={submitting}
                  {...register("displayName")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pan">PAN Card Number *</Label>
                <Input
                  id="pan"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  disabled={submitting}
                  aria-invalid={!!errors.pan}
                  {...register("pan")}
                />
                <FieldError message={errors.pan?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                placeholder="123 Corporate Tower, Sector 62"
                disabled={submitting}
                {...register("addressLine1")}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Noida" disabled={submitting} {...register("city")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="Uttar Pradesh"
                  disabled={submitting}
                  {...register("state")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="201301"
                  disabled={submitting}
                  {...register("postalCode")}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Registering account…
                </>
              ) : (
                "Register as Partner"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have a partner account?{" "}
            <Link
              href="/partner/login"
              className="font-medium text-[#E35A37] hover:text-[#C84626]"
            >
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
