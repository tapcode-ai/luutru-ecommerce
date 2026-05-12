import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopHeader from "@/components/layout/TopHeader";
import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartSidebar from "@/components/cart/CartSidebar";
import AIChatbot from "@/components/chat/AIChatbot";
import CartInitializer from "@/components/cart/CartInitializer";
import { ToastProvider } from "@/components/ui/toast";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Mua Sắm Trực Tuyến`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          <ToastProvider>
            <TopHeader />
            <NavigationBar />
            <main>{children}</main>
            <Footer />
            <MobileBottomNav />
            <CartSidebar />
            <AIChatbot />
            <CartInitializer />
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}