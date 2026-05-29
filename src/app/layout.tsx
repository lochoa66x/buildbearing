import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://buildbearing.com"),
  title: "BuildBearing | Get your bearing before you build",
  description:
    "BuildBearing turns fuzzy app, website, tool, workflow, and AI-helper ideas into clear Route Cards before you build.",
  openGraph: {
    title: "BuildBearing",
    description: "Get your bearing before you build.",
    url: "https://buildbearing.com",
    siteName: "BuildBearing",
    images: [
      {
        url: "/images/buildbearing-field-guide-hero.png",
        width: 1536,
        height: 864,
        alt: "A warm navigation map with route lines, checkpoints, and compass details.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildBearing",
    description: "Get your bearing before you build.",
    images: ["/images/buildbearing-field-guide-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
