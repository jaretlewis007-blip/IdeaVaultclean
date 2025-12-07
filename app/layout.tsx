import "./globals.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "IdeaVault",
  description: "Secure Idea Sharing Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex">
        <Sidebar />

        <div className="flex-1">
          <Navbar />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
