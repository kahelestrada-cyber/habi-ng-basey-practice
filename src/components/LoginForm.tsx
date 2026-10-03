import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInOfficer } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email("Enter the officer email"),
  password: z.string().min(1, "Enter the password"),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }: LoginValues) => {
    try {
      await signInOfficer(email, password);
      toast.success("Signed in. Maupay nga adlaw!");
    } catch (err) {
      toast.error("Could not sign in", {
        description:
          err instanceof Error
            ? err.message
            : "Check the email and password, then try again.",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Officer sign-in</CardTitle>
        <CardDescription>
          Only the coop's order officer can see and update orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              className="h-11"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-11"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="min-h-11 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" /> Signing
                in…
              </>
            ) : (
              <>
                <LogIn aria-hidden="true" /> Sign in
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
