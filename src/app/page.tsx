"use client";

import { GlassContainer } from "@/components/GlassContainer";
import WaitlistForm from "@/components/WaitlistForm";
import SocialBar from "@/components/SocialBar";
import Image from "next/image";
import { LiquidGlassCard } from "react-liquid-glass-card";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto flex flex-col items-center justify-start pt-8 px-4 pb-4 md:justify-center md:p-4">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center animate-move-background"
        style={{
          backgroundImage: `url("/bg3.jpg")`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center gap-6 md:gap-10"
      >

        {/* Library Based Glass Card */}
        <LiquidGlassCard
          padding="1.5rem"
          borderRadius="24px"
          blur={20}
          backgroundColor="rgba(255, 255, 255, 0.05)"
        >
          <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
            {/* Logo moved inside */}
            <div className="relative w-60 h-20 hover:scale-105 transition-transform duration-500 flex items-center justify-center">
              {/* Density/Glow behind logo */}
              <div
                className="absolute w-[120%] h-[150%] -z-10 blur-2xl opacity-60 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)"
                }}
              />
              <Image
                src="/logo1.png"
                alt="Nocage Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Header Text */}
            <div className="text-center space-y-2 relative z-50">
              <h1 className="text-3xl font-bold text-white tracking-tight">Access the Future</h1>
              <p className="text-white/80 text-sm font-light">Join the exclusive waitlist for Nocage.</p>
            </div>

            <WaitlistForm />
          </div>
        </LiquidGlassCard>

        {/* Custom Implementation (Commented Out) */}
        {/*
        <GlassContainer className="w-full">
            <WaitlistForm />
        </GlassContainer>
        */}

      </motion.div>

      {/* Footer Socials */}
      <SocialBar />

    </main>
  );
}
