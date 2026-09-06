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
import { useSelfClient } from "@/components/self-client/SelfClientProvider";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SelfClientLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isCheckingSession, login } = useSelfClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      await login(values.email.trim(), values.password);
    },
    onSuccess: () => {
      toast.success("Signed in — welcome back.");
      router.push("/self-client");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to sign in. Please check your credentials.");
    },
  });

  useEffect(() => {
    if (!isCheckingSession && isAuthenticated) {
      router.replace("/self-client");
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
            <h1 className="text-2xl font-semibold text-slate-900">Client Portal Login</h1>
            <p className="text-sm text-slate-500">
              Sign in to track your services, upload documents, and manage payments.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit((v) => loginMutation.mutate(v))} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
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
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            New client?{" "}
            <Link
              href="/self-client/signup"
              className="font-medium text-[#E35A37] hover:text-[#C84626]"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
