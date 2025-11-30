"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSignIn } from "@/services/auth/mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/utils/logger";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Lock, Mail, ArrowRight, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signInMutation = useSignIn();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    signInMutation.mutate(
      { email, password },
      {
        onError: (error) => {
          logger.error("Login error:", error);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 bg-background relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-linear-to-br from-amber-300/30 to-orange-300/20 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-1/4 bottom-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-linear-to-tl from-blue-300/25 to-indigo-300/20 blur-[130px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-zinc-200/60 shadow-2xl bg-white/95 backdrop-blur-2xl overflow-hidden">
          <CardHeader className="space-y-4 text-center pb-8 bg-linear-to-br from-zinc-50/50 to-white pt-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-2"
            >
              <div className="p-4 rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-900 text-white shadow-xl shadow-zinc-500/20">
                <Lock className="w-7 h-7" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold tracking-tight bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent mb-2">
                Welcome back
              </CardTitle>
              <CardDescription className="text-base text-zinc-600 font-medium">
                Enter your credentials to access the dashboard
              </CardDescription>
            </motion.div>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-6 px-8 py-6">
              {signInMutation.isError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-medium">
                    {signInMutation.error?.message || "Login failed"}
                  </span>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="grid gap-3"
              >
                <Label htmlFor="email" className="text-sm font-semibold text-zinc-700">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-zinc-600 group-focus-within:text-blue-600 transition-colors z-10 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-12 h-12 border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 rounded-xl text-base font-medium bg-white relative"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="grid gap-3"
              >
                <Label htmlFor="password" className="text-sm font-semibold text-zinc-700">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-600 group-focus-within:text-blue-600 transition-colors z-10 pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-12 h-12 border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 rounded-xl text-base font-medium bg-white relative"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full"
              >
                <Button
                  className="w-full h-12 bg-linear-to-r from-zinc-800 to-zinc-900 hover:from-zinc-900 hover:to-zinc-950 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                  type="submit"
                  disabled={signInMutation.isPending}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {signInMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-zinc-700 to-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
