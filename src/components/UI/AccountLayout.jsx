import React from "react";
import Sidebar from "./Sidebar";

const NAVBAR_HEIGHT = 112;

const AccountLayout = ({ user, children }) => {
  return (
    <section
      className="min-h-screen bg-gray-100"
      style={{ paddingTop: NAVBAR_HEIGHT }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex gap-8 items-start">
          {/* Sidebar fijo */}
          <Sidebar user={user} navbarHeight={NAVBAR_HEIGHT} />

          {/* ✅ MAIN CONTROLA EL PADDING DE TODAS LAS PÁGINAS */}
          <main className="flex-1 py-6">
            {children}
          </main>
        </div>
      </div>
    </section>
  );
};

export default AccountLayout;
