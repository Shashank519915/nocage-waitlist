import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Img,
    Heading,
    Text,
    Button,
    Hr,
    Link,
    Font,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    userFirstname?: string;
}

export const WelcomeEmail = ({
    userFirstname = "Future Member",
}: WelcomeEmailProps) => {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Helvetica"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Welcome to the Nocage Waitlist - Access the Future</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Logo Section */}
                    <Section style={logoContainer}>
                        <Img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTti2rCSM3oI-dYu21seyWX16CGKs-YWPixfw&s" // Replace with actual deployed URL
                            width="180"
                            alt="Nocage Logo"
                            style={logo}
                        />
                    </Section>

                    {/* Glass Card Content */}
                    <Section style={glassCard}>
                        <Heading style={h1}>You're on the list.</Heading>
                        <Text style={text}>
                            Hello {userFirstname},
                        </Text>
                        <Text style={text}>
                            Thank you for joining the Nocage waitlist. You have taken the first step towards accessing the future of digital freedom.
                        </Text>
                        <Text style={text}>
                            We are building something extraordinary, and we're thrilled to have you with us on this journey. As an early member, you'll be among the first to experience Nocage.
                        </Text>

                        {/* CTA Button */}
                        <Section style={btnContainer}>
                            <Button
                                style={button}
                                href="https://chat.whatsapp.com/YOUR_GROUP_LINK" // Replace with actual link
                            >
                                Join WhatsApp Community
                            </Button>
                        </Section>

                        <Hr style={hr} />

                        <Text style={footerText}>
                            Stay tuned for updates. The future is closer than you think.
                        </Text>

                        <Section style={socialContainer}>
                            <Link href="https://twitter.com/yourhandle" style={socialLink}>Twitter</Link>
                            <Link href="https://instagram.com/yourhandle" style={socialLink}>Instagram</Link>
                            <Link href="https://linkedin.com/company/yourhandle" style={socialLink}>LinkedIn</Link>
                        </Section>
                    </Section>

                    <Text style={footerCopyright}>
                        © 2026 Nocage | All rights reserved.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default WelcomeEmail;

// --- Styles ---

const main = {
    backgroundColor: "#000000",
    fontFamily: "'Inter', Helvetica, Arial, sans-serif",
    padding: "40px 0",
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "580px",
};

const logoContainer = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
    textAlign: "center" as const,
};

const logo = {
    margin: "0 auto",
    display: "block" as const, // Ensure block
    // value was: filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
    // Removed filter as it is not supported in Gmail and many email clients
};

const glassCard = {
    backgroundColor: "rgba(25, 25, 25, 1)", // Fallback for glass
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    padding: "40px",
    textAlign: "center" as const,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
    // Note: backdrop-filter is not supported in most email clients, so we rely on the dark semi-transparent bg and border
};

const h1 = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "1.3",
    margin: "0 0 20px",
    letterSpacing: "-0.5px",
};

const text = {
    color: "#a1a1aa", // Zinc-400
    fontSize: "16px",
    lineHeight: "26px",
    margin: "0 0 20px",
    textAlign: "left" as const,
};

const btnContainer = {
    textAlign: "center" as const,
    margin: "30px 0",
};

const button = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)", // Glow
};

const hr = {
    borderColor: "rgba(255, 255, 255, 0.1)",
    margin: "30px 0",
};

const footerText = {
    color: "#71717a", // Zinc-500
    fontSize: "14px",
    textAlign: "center" as const,
    margin: "0",
};

const socialContainer = {
    textAlign: "center" as const,
    marginTop: "20px",
    gap: "15px",
};

const socialLink = {
    color: "#a1a1aa",
    fontSize: "12px",
    textDecoration: "none",
    margin: "0 10px",
};

const footerCopyright = {
    color: "#52525b", // Zinc-600
    fontSize: "12px",
    textAlign: "center" as const,
    marginTop: "20px",
};
