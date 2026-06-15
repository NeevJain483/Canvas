import type { Metadata } from "next";
// import "@style/global.css";
import "./index.css";

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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        ></link>
      </head>
      <body style={{ height: "100vh" }}>{children}</body>
    </html>
  );
}
