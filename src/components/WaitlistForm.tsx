"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { COUNTRY_CODES } from "@/lib/constants";

// --- CONFIGURATION ---
const IS_EMAIL_REQUIRED = true;
const IS_PHONE_REQUIRED = true;

export default function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error" | "conflict">("idle");
    const [message, setMessage] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle Client-side mounting for Portal
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Logic handled by backdrop click in Portal, keeping this for potentially other uses or cleanup
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                // Optional: Logic if we weren't using a full backdrop overlay
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setMessage("");

        // Validation
        if (IS_EMAIL_REQUIRED) {
            if (!email) {
                setStatus("error");
                setMessage("Email is required.");
                setLoading(false);
                return;
            }
            if (!validateEmail(email)) {
                setStatus("error");
                setMessage("Please enter a valid email address.");
                setLoading(false);
                return;
            }
        }

        if (IS_PHONE_REQUIRED) {
            if (!phone) {
                setStatus("error");
                setMessage("Phone number is required.");
                setLoading(false);
                return;
            }

            // Strict Phone Validation
            const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits
            const countryRule = COUNTRY_CODES.find(c => c.code === countryCode);

            if (countryRule) {
                // Parse range from min/max (which handle standard cases)
                // For cases like "8-9", the JSON map gave range. But our array has min/max numbers.
                if (cleanPhone.length < countryRule.min || cleanPhone.length > countryRule.max) {
                    setStatus("error");
                    setMessage(`Invalid phone number length for ${countryRule.country}. Expected ${countryRule.min === countryRule.max ? countryRule.min : `${countryRule.min}-${countryRule.max}`} digits.`);
                    setLoading(false);
                    return;
                }
            }
        }

        const fullPhone = `${countryCode} ${phone}`;

        try {
            const res = await fetch("/api/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone: fullPhone }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setEmail("");
                setPhone("");
                setMessage("You have been added to the waitlist!");
            } else if (res.status === 409) {
                setStatus("conflict");
                setMessage(data.message || "You are already on the list.");
            } else {
                setStatus("error");
                setMessage(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-5 relative z-50">
            <div className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white/80 ml-1">
                        Email Address {IS_EMAIL_REQUIRED && "*"}
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all duration-300 relative z-50"
                        required={IS_EMAIL_REQUIRED}
                    />
                </div>

                {/* Phone Field Group */}
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-white/80 ml-1">
                        Phone Number {IS_PHONE_REQUIRED && "*"}
                    </label>
                    <div className="flex gap-1.5 relative z-50">
                        {/* Country Code Dropdown */}
                        <div className="relative w-20" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full h-full px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-between text-sm hover:bg-white/10 transition-colors focus:ring-2 focus:ring-white/20"
                            >
                                <span>{countryCode}</span>
                                <ChevronDown className="w-4 h-4 opacity-70" />
                            </button>

                            {isMounted && createPortal(
                                <AnimatePresence mode="wait">
                                    {isDropdownOpen && (
                                        <>
                                            {/* Backdrop */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                                                onClick={() => setIsDropdownOpen(false)}
                                            />

                                            {/* Dropdown / Picker Modal */}
                                            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                                                    className="w-[280px] rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/20 shadow-2xl overflow-hidden p-1"
                                                >
                                                    <div className="max-h-[400px] overflow-y-auto glass-scrollbar pr-1">
                                                        {COUNTRY_CODES.map((item) => (
                                                            <button
                                                                key={item.code}
                                                                type="button"
                                                                className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center justify-between rounded-xl group"
                                                                onClick={() => {
                                                                    setCountryCode(item.code);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                            >
                                                                <span className="font-medium group-hover:text-white/90 transition-colors">{item.country}</span>
                                                                <span className="opacity-50 font-mono group-hover:opacity-100 transition-opacity">{item.code}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </>
                                    )}
                                </AnimatePresence>,
                                document.body
                            )}
                        </div>

                        {/* Phone Number Input */}
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={(() => {
                                const country = COUNTRY_CODES.find(c => c.code === countryCode);
                                return country ? "9".repeat(country.max) : "9999999999";
                            })()}
                            className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all duration-300"
                            required={IS_PHONE_REQUIRED}
                        />
                    </div>
                </div>
            </div>

            {/* Status Messages */}
            {message && (
                <div className={cn(
                    "p-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2",
                    status === "success" ? "bg-green-500/20 text-green-200 border border-green-500/30" :
                        status === "error" ? "bg-red-500/20 text-red-200 border border-red-500/30" :
                            status === "conflict" ? "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30" : ""
                )}>
                    {status === "success" && <CheckCircle2 className="w-4 h-4" />}
                    {status === "error" && <AlertCircle className="w-4 h-4" />}
                    {status === "conflict" && <AlertCircle className="w-4 h-4" />}
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3.5 mt-2 rounded-xl bg-white/25 backdrop-blur-xl border border-white/30 text-white font-semibold hover:bg-white/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-white/10"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                    </>
                ) : (
                    "Join Waitlist"
                )}
            </button>
        </form>
    );
}
