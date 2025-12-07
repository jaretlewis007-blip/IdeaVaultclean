import "./globals.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "IdeaVault",
  description: "Protect and grow your ideas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <div className="sidebar">
            <Sidebar />
          </div>

          <div className="main">
            <div className="navbar">
              <Navbar />
            </div>

            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
