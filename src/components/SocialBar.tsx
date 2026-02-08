"use client";

import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

import { motion } from "framer-motion";

export default function SocialBar() {
    const socials = [
        { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
        { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
        { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
        // Add more as needed
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transition-transform hover:scale-105 duration-300">
                {socials.map((social) => (
                    <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-full"
                        aria-label={social.name}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <social.icon className="w-5 h-5" />
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
