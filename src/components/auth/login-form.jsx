"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle, loginWithEmail, registerWithEmail } from "@/features/auth/authSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { resendVerification } from "@/features/auth/authAPI";

export default function LoginCard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    const accessToken = credentialResponse.credential;

    try {
      await dispatch(loginWithGoogle({ idToken: accessToken })).unwrap();
      router.push("/dashboard");
      window.location.reload();
    } catch (err) {
      setShowMessage({ type: "error", text: err.message || "Google login failed" });
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
    setShowMessage({ type: "error", text: "Google login failed" });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setShowMessage(null);
    setNeedsVerification(false);
    setIsLoading(true);

    try {
      const result = await dispatch(loginWithEmail(loginForm)).unwrap();
      console.log("Login successful:", result);

      // Use window.location.href for a full page reload with redirect
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err || err.message || "Login failed";

      // Check if it's a verification error
      if (errorMsg.toLowerCase().includes("verify your email")) {
        setNeedsVerification(true);
      }

      setShowMessage({ type: "error", text: errorMsg });
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!loginForm.email) {
      setShowMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setIsResending(true);
    setShowMessage(null);

    try {
      await resendVerification(loginForm.email);
      setShowMessage({
        type: "success",
        text: "Verification email sent! Please check your inbox (and spam folder)."
      });
      setNeedsVerification(false);
    } catch (error) {
      setShowMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to resend verification email"
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setShowMessage(null);

    // Validation
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setShowMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setShowMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (registerForm.password.length < 6) {
      setShowMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(registerWithEmail({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      })).unwrap();

      setShowMessage({
        type: "success",
        text: "Registration successful! Please check your email to verify your account.",
      });
      setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
      setIsLoading(false);

      // Switch to login tab after 2 seconds
      setTimeout(() => {
        setActiveTab("login");
        setShowMessage(null);
      }, 2000);
    } catch (err) {
      setShowMessage({ type: "error", text: err.message || "Registration failed" });
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Finance Tracker
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {activeTab === "login" ? "Sign in to manage your finances" : "Create your account"}
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Finance Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === "login"
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => {
              setActiveTab("login");
              setShowMessage(null);
            }}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === "register"
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => {
              setActiveTab("register");
              setShowMessage(null);
            }}
          >
            Register
          </button>
        </div>

        {/* Messages */}
        {showMessage && (
          <div
            className={`p-4 rounded-lg ${
              showMessage.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            <p>{showMessage.text}</p>
            {needsVerification && showMessage.type === "error" && (
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="mt-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
            )}
          </div>
        )}

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
