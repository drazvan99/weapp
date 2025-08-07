import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Threadly — Online Clothing Shop",
  description: "A minimal, modern clothing shop built with Next.js"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="nav">
          <div className="container nav-inner">
            <Navbar />
          </div>
        </div>
        <main className="container">{children}</main>
        <div className="footer">
          <div className="container">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
