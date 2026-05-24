import type { Metadata } from "next";
import "@style/global.css";

export const metadata: Metadata = {
  title: "Canvas",
  description: "Create beautiful drawings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ height: "100vh" }}>
        {children}
      </body>
    </html>
  );
}