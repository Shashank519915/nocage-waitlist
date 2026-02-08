"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
}

// The SVG filter component directly from the reference design
const GlassFilter = () => (
    <svg style={{ display: "none" }}>
        <filter
            id="glass-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
        >
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.001 0.005"
                numOctaves="1"
                seed="17"
                result="turbulence"
            />
            <feComponentTransfer in="turbulence" result="mapped">
                <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
                <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
            <feSpecularLighting
                in="softMap"
                surfaceScale="5"
                specularConstant="1"
                specularExponent="100"
                lightingColor="white"
                result="specLight"
            >
                <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>
            <feComposite
                in="specLight"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="1"
                k4="0"
                result="litImage"
            />
            <feDisplacementMap
                in="SourceGraphic"
                in2="softMap"
                scale="200"
                xChannelSelector="R"
                yChannelSelector="G"
            />
        </filter>
        <filter
            id="glass-distortion-mobile"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
        >
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.003 0.015"
                numOctaves="1"
                seed="17"
                result="turbulence"
            />
            <feComponentTransfer in="turbulence" result="mapped">
                <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
                <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
            <feSpecularLighting
                in="softMap"
                surfaceScale="5"
                specularConstant="1"
                specularExponent="100"
                lightingColor="white"
                result="specLight"
            >
                <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>
            <feComposite
                in="specLight"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="1"
                k4="0"
                result="litImage"
            />
            <feDisplacementMap
                in="SourceGraphic"
                in2="softMap"
                scale="200"
                xChannelSelector="R"
                yChannelSelector="G"
            />
        </filter>
    </svg>
);
// Note: Reduced scale to 100 for better readability on form text while maintaining effect. 200 might be too extreme for text inputs.

export const GlassContainer: React.FC<GlassProps> = ({ children, className, containerClassName }) => {
    return (
        <div className={cn("relative group", containerClassName)}>
            {/* This filter definition needs to be present in the DOM for the effect to work */}
            <GlassFilter />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "relative overflow-hidden rounded-3xl transition-all duration-700", // Removed generic glass classes to use specific layers
                    className
                )}
                style={{
                    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
                    // The "Liquid" spring feel - Matching reference exactly
                    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
                }}
            >
                {/* Layer 1: Distortion & Blur */}
                <div
                    className="glass-distortion-layer absolute inset-0 z-0 overflow-hidden rounded-inherit"
                // Inline styles moved to CSS class for responsiveness
                />

                {/* Layer 2: White Tint */}
                <div
                    className="absolute inset-0 z-10 rounded-inherit"
                    style={{ background: "rgba(255, 255, 255, 0.25)" }}
                />

                {/* Layer 3: Inner Shadows/Highlights - Softened for curved glass feel */}
                <div
                    className="absolute inset-0 z-20 rounded-inherit overflow-hidden"
                    style={{
                        boxShadow: "inset 0 0 15px 0 rgba(255, 255, 255, 0.15), inset 1px 1px 6px 0 rgba(255, 255, 255, 0.3)",
                    }}
                />

                {/* Content */}
                <div className="relative z-30 p-8 h-full">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
