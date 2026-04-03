import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/ui/header";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MediMeet - Doctors Appointment App",
  description: "Connect with doctors easily and book appointments online.",
};

export default async function RootLayout({ children }) {
   await checkUser();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header (Client Component) */}
            <Header />

            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made with 💗 by Anuj Kumar</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
