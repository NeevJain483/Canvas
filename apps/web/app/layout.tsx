import type { Metadata } from "next";
import { Suspense } from "react";
import "../style/global.css";
import RouterChangeListner from "../component/RouterChangeListner";
import Loading from "../component/common/Loading";

export const metadata: Metadata = {
  title: "Canvas",
  description: "Create beautifull drawings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ height: "100vh" }}>
        <Suspense fallback={<Loading />}>
          <RouterChangeListner />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
