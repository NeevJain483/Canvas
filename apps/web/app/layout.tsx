import type { Metadata } from "next";
import { Suspense } from "react";
import "@style/global.css";
import RouterChangeListner from "@component/RouterChangeListner";
import Loading from "@component/common/Loading";
import ClientStateInitializer from "@component/ClientStateInitializer";

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
        <ClientStateInitializer />

        <Suspense fallback={<Loading />}>
          <RouterChangeListner />
        </Suspense>
        
        {children}
      </body>
    </html>
  );
}