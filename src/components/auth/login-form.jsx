"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChromeIcon as Google } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // In a real app, this would trigger Google OAuth
    // For demo purposes, we'll just redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Finance Tracker</CardTitle>
        <CardDescription>Sign in to manage your finances</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center gap-2"
        >
          <Google className="h-5 w-5" />
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </Button>
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </CardFooter>
    </Card>
  );
}
