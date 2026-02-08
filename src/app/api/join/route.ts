import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import WelcomeEmail from "@/emails/WelcomeEmail";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use Service Role Key for server-side operations to bypass RLS (needed for duplicate check)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sheet.io Configuration
const SHEET_DB_URL = process.env.SHEET_DB_URL;

export async function POST(request: Request) {
    try {
        const { email, phone } = await request.json();

        if (!email || !phone) {
            return NextResponse.json(
                { message: "Email and Phone are required." },
                { status: 400 }
            );
        }

        // 1. Check for duplicates in Supabase
        const { data: existingUser, error: searchError } = await supabase
            .from("waitlist")
            .select("id")
            .or(`email.eq.${email},phone.eq.${phone}`)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { message: "You are already on the waitlist." },
                { status: 409 }
            );
        }

        // 2. Insert into Supabase
        const { error: insertError } = await supabase
            .from("waitlist")
            .insert([{ email, phone, created_at: new Date().toISOString() }]);

        if (insertError) {
            console.error("Supabase Error:", insertError);
            return NextResponse.json(
                { message: "Failed to join waitlist. Please try again." },
                { status: 500 }
            );
        }

        // 3. Run Non-Critical Integrations in Parallel (Sheet.io & Resend)
        // We use allSettled so one failing doesn't stop the other.
        // Failures here do NOT affect the success response to the user.
        await Promise.allSettled([
            (async () => {
                if (SHEET_DB_URL) {
                    try {
                        const sheetRes = await fetch(SHEET_DB_URL, {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                data: [{
                                    email,
                                    phone: `'${phone}`,
                                    date: new Date().toISOString(),
                                }],
                            }),
                        });
                        const sheetText = await sheetRes.text();
                        if (!sheetRes.ok) console.warn("Sheet.io Sync Error:", sheetText);
                    } catch (e) {
                        console.warn("Sheet.io Sync Failed:", e);
                    }
                }
            })(),
            (async () => {
                const RESEND_API_KEY = process.env.RESEND_API_KEY;
                if (RESEND_API_KEY) {
                    try {
                        const resend = new Resend(RESEND_API_KEY);
                        const { error } = await resend.emails.send({
                            from: "Nocage <onboarding@resend.dev>",
                            to: email,
                            subject: "Welcome to Nocage - Access the Future",
                            react: WelcomeEmail({ userFirstname: "Future Member" }),
                        });
                        if (error) console.error("Resend Email Error:", error);
                    } catch (e) {
                        console.error("Resend Integration Error:", e);
                    }
                }
            })()
        ]);

        return NextResponse.json(
            { message: "Successfully joined the waitlist!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
