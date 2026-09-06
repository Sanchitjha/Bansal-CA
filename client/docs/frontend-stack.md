# Frontend Stack & Pattern Guide

The client is a Next.js 16 App Router project. Existing pages use **global CSS**
(`src/app/globals.css`, keyed by BEM-ish class names). New portal work uses a
Tailwind v4 + shadcn-style component stack **co-existing** with those global
styles. The two systems live side by side: don't rewrite an existing page just
to change its styling approach.

## Installed libraries

| Concern | Library | Notes |
|---|---|---|
| Styling utilities | `tailwindcss@^4` | Preflight/reset is **disabled** so it doesn't clobber `globals.css`. |
| Component primitives | Manually-added shadcn-style in `src/components/ui/` | Button, Input, Label, Card, FieldError. No CLI. |
| Class merging | `clsx` + `tailwind-merge` | Exposed as `cn()` from `src/lib/utils.ts`. |
| Variant styling | `class-variance-authority` | Used by `Button`; standard shadcn pattern. |
| Icons | `lucide-react` | Already used; keep using it. |
| Data fetching | `@tanstack/react-query` | Provider mounted in `src/components/providers.tsx`. |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` | Zod schema is the source of truth for validation. |
| Toasts | `sonner` | Toaster in `providers.tsx`; call `toast.success/error(...)`. |
| Dates | `date-fns` | Prefer over ad-hoc `Date` formatting. |
| Charts | `recharts` | Already used in admin dashboards. |

## API access

All backend calls go through `src/lib/api.ts`:

```ts
import { api, ApiError } from "@/lib/api";

const cases = await api<Case[]>("/api/cases?clientId=abc");
```

- Base URL: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`).
  Copy `.env.example` to `.env.local` for local dev.
- Auth: JWT is read from `localStorage['aa_token']` and sent as
  `Authorization: Bearer <token>`. Use `setToken(t)` after login and
  `setToken(null)` on logout.
- Errors: non-2xx responses throw `ApiError` with `status` + server-provided
  `message`. Catch it in mutations to show a toast.

## The pattern: form + mutation + toast

`src/app/self-client/login/page.tsx` is the reference implementation. In brief:

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { api } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  const login = useMutation({
    mutationFn: (v: Values) => api("/api/users/login", { method: "POST", body: v, skipAuth: true }),
    onSuccess: () => toast.success("Signed in"),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => login.mutate(v))}>
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...register("email")} />
      <FieldError message={errors.email?.message} />
      {/* ... */}
      <Button type="submit" disabled={login.isPending}>Login</Button>
    </form>
  );
}
```

## Adding another shadcn primitive

The CLI (`npx shadcn add ...`) is interactive and doesn't run in our automated
setup. To add a new primitive (e.g. `Select`, `Dialog`, `Table`):

1. Copy the component source from the shadcn/ui docs
   (<https://ui.shadcn.com/docs/components>).
2. Drop it in `src/components/ui/<name>.tsx`.
3. Replace `import { cn } from "@/lib/utils"` — already present in our repo.
4. If the primitive needs Radix (e.g. `Dialog`, `Popover`, `Select`), install
   just that Radix package: `npm i @radix-ui/react-dialog`.

## Migrating an existing global-CSS page

Not urgent. If you decide to migrate one:

1. Rewrite the JSX with `<Button>`, `<Input>`, `<Card>` etc.
2. Replace ad-hoc class names with Tailwind utilities.
3. When the file no longer references a `globals.css` class, that class can be
   deleted from `globals.css` in a follow-up pass.

Both styling systems compile cleanly at the same time — no rush.

## Backend auth caveat

`SelfClientProvider.login()` currently calls `POST /api/users/login` (Manav's
route). That endpoint returns `{user, client}` — **it does not currently
return a JWT**. Protected endpoints (like `/api/users/*` guarded by the auth
middleware) will therefore fail from the browser until either:

- `POST /api/users/login` starts returning a JWT and the provider calls
  `setToken(...)` from `@/lib/api`, or
- The frontend switches to `POST /api/auth/login` (which does issue a JWT).

The plumbing on the frontend (`api.ts` + `setToken`) is already in place; only
the login-response wiring is missing.
