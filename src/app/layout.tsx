import Footer from "@/components/Footer";
import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <main className="max-w-4xl mx-auto mt-8 px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}