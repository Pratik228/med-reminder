"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setSuccess("");

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Welcome back! 💕");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess("Account created! Welcome to MedLove! 🎉");
      }

      setTimeout(() => {
        onLogin();
      }, 1500);
    } catch (err: unknown) {
      console.error("Auth error:", err);
      const error = err as { code?: string; message?: string };
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        default:
          setError(error.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signInAnonymously(auth);
      setSuccess("Welcome, guest! 👋");
      setTimeout(() => {
        onLogin();
      }, 1000);
    } catch (err: unknown) {
      console.error("Guest login error:", err);
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/operation-not-allowed") {
        setError("Guest login is not enabled. Please sign up or sign in.");
      } else {
        setError("Failed to sign in as guest. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neu-900 via-neu-800 to-neu-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-secondary-500 rounded-full blur-2xl opacity-15 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-20 h-20 bg-accent-500 rounded-full blur-2xl opacity-20 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-8xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent mb-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              opacity: { delay: 0.3, duration: 0.8 },
              y: { delay: 0.3, duration: 0.8 },
              backgroundPosition: {
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            style={{ backgroundSize: "300% 100%" }}
          >
            MedLove
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-3xl font-semibold text-neu-700 dark:text-neu-200 mb-3 tracking-wide">
              Your beautiful medication companion{" "}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                💕
              </motion.span>
            </p>
            <motion.p
              className="text-xl text-neu-600 dark:text-neu-300 font-medium tracking-wide"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Stay healthy, stay consistent, stay amazing!
            </motion.p>
          </motion.div>
        </motion.div>

        {/* New Spacious Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-full max-w-lg mx-auto"
        >
          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-12 bg-neu-100 dark:bg-neu-800 p-2 rounded-3xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-300 ${
                isLogin
                  ? "neu-pressed text-primary-600 dark:text-primary-400"
                  : "text-neu-600 dark:text-neu-400 hover:text-primary-500"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-300 ${
                !isLogin
                  ? "neu-pressed text-primary-600 dark:text-primary-400"
                  : "text-neu-600 dark:text-neu-400 hover:text-primary-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">!</span>
                  </div>
                  <p className="text-red-700 dark:text-red-300 font-semibold text-lg">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-3xl"
              >
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <p className="text-green-700 dark:text-green-300 font-semibold text-lg">
                    {success}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Container */}
          <div className="neu p-12 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Field */}
              <div className="space-y-4">
                <label className="block text-lg font-bold text-neu-700 dark:text-neu-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Mail className="h-6 w-6 text-neu-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yo@email.com"
                    className="w-full pl-16 pr-6 py-6 bg-neu-100 dark:bg-neu-800 border border-neu-200 dark:border-neu-700 rounded-2xl text-neu-900 dark:text-neu-100 placeholder-neu-500 dark:placeholder-neu-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-xl"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-4">
                <label className="block text-lg font-bold text-neu-700 dark:text-neu-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-neu-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-16 pr-16 py-6 bg-neu-100 dark:bg-neu-800 border border-neu-200 dark:border-neu-700 rounded-2xl text-neu-900 dark:text-neu-100 placeholder-neu-500 dark:placeholder-neu-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-neu-400 hover:text-neu-600 dark:hover:text-neu-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-xl rounded-2xl hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neu-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </div>
              </motion.button>

              {/* Divider */}
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neu-200 dark:border-neu-700"></div>
                </div>
                <div className="relative flex justify-center text-lg">
                  <span className="px-6 bg-neu-50 dark:bg-neu-800 text-neu-500 dark:text-neu-400 font-semibold">
                    or
                  </span>
                </div>
              </div>

              {/* Guest Login Button */}
              <motion.button
                type="button"
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full py-6 bg-neu-100 dark:bg-neu-800 text-neu-700 dark:text-neu-300 font-bold text-xl rounded-2xl hover:bg-neu-200 dark:hover:bg-neu-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neu-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span>Continue as Guest</span>
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    👋
                  </motion.span>
                </div>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Enhanced Footer - Full Width Sticky to Bottom */}
        <motion.footer
          className="fixed bottom-0 left-0 right-0 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="neu p-6 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5"></div>
            <div className="relative z-10 text-center">
              <div className="text-neu-500 dark:text-neu-400 text-sm flex items-center justify-center">
                Made with{" "}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block"
                >
                  <Heart className="w-4 h-4 mx-1 text-red-500" />
                </motion.span>
                for better health
              </div>
              <p className="text-xs text-neu-400 dark:text-neu-500 mt-1">
                Stay consistent, stay healthy! 💪
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};
