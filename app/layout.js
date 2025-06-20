import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const outfit = Outfit({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Expense Tracker App",
  description: "List Your Expenses",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={outfit.className}
        >
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
