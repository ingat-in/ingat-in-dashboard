"use client";

import { motion, Variants } from "framer-motion";
import { Activity, MessageCircle, Shield } from "lucide-react";
import { HeroSection } from "@/components/organisms/heroSection";
import { FeatureCard } from "@/components/molecules/featureCard";
import { HowItWorksSection } from "@/components/organisms/howItWorksSection";
import { TechStackSection } from "@/components/organisms/techStackSection";

export default function LandingPage() {
  const pageTransition: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      title: "Real-time Monitoring",
      description: "Track attendance status in real-time with live dashboard updates",
      icon: Activity,
      gradient: "blue" as const,
    },
    {
      title: "Automatic Reminders",
      description: "Automated WhatsApp reminders for morning and evening attendance",
      icon: MessageCircle,
      gradient: "emerald" as const,
    },
    {
      title: "WhatsApp Integration",
      description: "Seamless integration with WhatsApp for easy user interaction",
      icon: Shield,
      gradient: "violet" as const,
    },
  ];

  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-white focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <motion.main
        id="main-content"
        variants={pageTransition}
        initial="hidden"
        animate="show"
        className="min-h-screen bg-linear-to-br from-white via-zinc-50 to-zinc-100"
        role="main"
        aria-label="Landing page content"
      >
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          <div className="space-y-16 md:space-y-24">
            {/* Hero Section */}
            <HeroSection container={container} item={item} />

            {/* Features Section */}
            <section
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto px-4"
              role="region"
              aria-labelledby="features-heading"
            >
              <h2 id="features-heading" className="sr-only">
                Key Features
              </h2>
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
              ))}
            </section>

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Tech Stack Section */}
            <TechStackSection />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-200 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-zinc-600">
                © 2025 Ingat-In. All rights reserved.
              </p>
              <a
                href="https://github.com/ingat-in/ingat-in-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </footer>
      </motion.main>
    </>
  );
}
