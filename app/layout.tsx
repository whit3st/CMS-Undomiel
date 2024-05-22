import type { Metadata } from "next";
import { Inter, Roboto, Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "400" });
const jost = Jost({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
    title: "Undomiel",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light">
            <body className={jost.className + " container min-h-screen"}>
                <Header />
                {children}
            </body>
        </html>
    );
}
