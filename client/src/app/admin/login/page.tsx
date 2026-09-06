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
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { useAdmin } from "@/components/admin/AdminProvider";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession, login } = useAdmin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "amit.bansal@aa.com", password: "admin123" },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      await login(values.email.trim(), values.password);
    },
    onSuccess: () => {
      toast.success("Signed in — welcome back, Amit.");
      router.push("/admin");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to sign in. Please check your credentials.");
    },
  });

  const handleQuickLogin = async () => {
    setValue("email", "amit.bansal@aa.com");
    setValue("password", "admin123");
    await loginMutation.mutateAsync({ email: "amit.bansal@aa.com", password: "admin123" });
  };

  useEffect(() => {
    if (!isCheckingSession && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  const submitting = loginMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block text-2xl font-semibold text-[#0B1528]">
              A&amp;A<span className="text-[#E35A37]">.</span>
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Panel Login</h1>
            <p className="text-sm text-slate-500">
              Sign in to manage cases, clients, partners, payments and content.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1">
            <div className="font-semibold flex items-center justify-between">
              <span>Demo Admin Credentials</span>
              <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-bold">PRE-FILLED</span>
            </div>
            <div>Email: <code className="font-mono bg-amber-100 px-1 rounded">amit.bansal@aa.com</code></div>
            <div>Password: <code className="font-mono bg-amber-100 px-1 rounded">admin123</code></div>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit((v) => loginMutation.mutate(v))}
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="amit.bansal@aa.com"
                autoComplete="email"
                disabled={submitting}
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={submitting}
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <FieldError message={errors.password?.message} />
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={submitting}
              className="w-full bg-[#0B1528] hover:bg-[#1b2b4d]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Login as Administrator"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={submitting}
              onClick={handleQuickLogin}
              className="w-full border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
            >
              ⚡ 1-Click Instant Demo Login
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Looking for the client portal instead?{" "}
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
