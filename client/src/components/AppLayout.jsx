import { Outlet, useLocation } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

function AppLayout() {
  return (
    <div className="grid grid-rows-[5rem,1fr] gap-10 bg-[#f0f2f5] transition-all dark:bg-slate-900">
      <Header />
      <main className="min-h-screen overflow-hidden">
        <div className="container">
          <div className="dark:text-white">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
