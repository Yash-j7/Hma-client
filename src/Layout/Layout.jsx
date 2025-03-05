import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main className="pt-24">
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
