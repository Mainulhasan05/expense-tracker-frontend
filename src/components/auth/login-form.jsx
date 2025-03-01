"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "@/features/auth/authSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function LoginCard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    const accessToken = credentialResponse.credential;
    console.log(accessToken);
    dispatch(loginWithGoogle({ idToken: accessToken }));

    router.push("/dashboard");
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Finance Tracker
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to manage your finances
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=100&width=100"
            alt="Finance Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
