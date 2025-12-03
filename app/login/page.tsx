"use client";

export const runtime = 'edge';

import { useState } from "react";
import { motion } from "framer-motion";
import { useSignIn } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { logger } from "@/utils/logger";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Mail, ArrowRight, RefreshCw } from "lucide-react";
import { FormInput } from "@/components/molecules/formInput";
import { toast } from "sonner";

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
          toast.error(error?.message || "Login failed. Please try again.");
        },
      }
    );
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const containerAnimation = isMobile
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : {
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.6, type: "spring" as const, stiffness: 100 },
      };

  const iconAnimation = isMobile
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
    : {
        initial: { scale: 0, rotate: -180 },
        animate: { scale: 1, rotate: 0 },
        transition: { delay: 0.2, type: "spring" as const, stiffness: 200 },
      };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-3 md:px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="hidden md:block absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute left-1/4 top-1/4 -z-10 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-linear-to-br from-amber-300/20 to-orange-300/10 md:from-amber-300/30 md:to-orange-300/20 blur-2xl md:blur-[130px]" />
        <div className="absolute right-1/4 bottom-1/4 -z-10 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-linear-to-tl from-blue-300/15 to-indigo-300/10 md:from-blue-300/25 md:to-indigo-300/20 blur-2xl md:blur-[130px]" />
      </div>

      <motion.div
        {...containerAnimation}
        className="relative z-10 w-full max-w-md"
        style={{ willChange: "transform, opacity" }}
      >
        <Card className="border-zinc-200/60 shadow-lg md:shadow-2xl bg-white md:bg-white/95 md:backdrop-blur-2xl overflow-hidden">
          <CardHeader className="space-y-3 md:space-y-4 text-center pb-6 md:pb-8 bg-linear-to-br from-zinc-50/50 to-white pt-6 md:pt-8">
            <motion.div {...iconAnimation} className="flex justify-center mb-1 md:mb-2">
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-900 text-white shadow-lg md:shadow-xl shadow-zinc-500/10 md:shadow-zinc-500/20">
                <Lock className="w-6 h-6 md:w-7 md:h-7" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: isMobile ? 0.1 : 0.3, duration: 0.3 }}
            >
              <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent mb-1 md:mb-2">
                Welcome back
              </CardTitle>
              <CardDescription className="text-sm md:text-base text-zinc-600 font-medium">
                Enter your credentials to access the dashboard
              </CardDescription>
            </motion.div>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4 md:gap-6 px-4 md:px-8 py-4 md:py-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isMobile ? 0.15 : 0.4, duration: 0.3 }}
              >
                <FormInput
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={setEmail}
                  required
                  icon={<Mail className="h-4 w-4 md:h-5 md:w-5" />}
                  className="h-11 md:h-12 border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 rounded-lg md:rounded-xl text-sm md:text-base font-medium bg-white"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isMobile ? 0.2 : 0.5, duration: 0.3 }}
              >
                <FormInput
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={setPassword}
                  required
                  icon={<Lock className="h-4 w-4 md:h-5 md:w-5" />}
                  className="h-11 md:h-12 border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 rounded-lg md:rounded-xl text-sm md:text-base font-medium bg-white"
                />
              </motion.div>
            </CardContent>
            <CardFooter className="px-4 md:px-8 pb-6 md:pb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isMobile ? 0.25 : 0.6, duration: 0.3 }}
                className="w-full"
              >
                <Button
                  className="w-full h-11 md:h-12 bg-linear-to-r from-zinc-800 to-zinc-900 hover:from-zinc-900 hover:to-zinc-950 text-white font-semibold text-sm md:text-base rounded-lg md:rounded-xl shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                  type="submit"
                  disabled={signInMutation.isPending}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {signInMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="hidden md:block absolute inset-0 bg-linear-to-r from-zinc-700 to-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
