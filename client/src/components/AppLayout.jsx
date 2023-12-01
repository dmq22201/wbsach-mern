import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

function AppLayout() {
  return (
    <div className="grid grid-rows-[5rem,1fr] gap-10">
      <Header />
      <main className="min-h-screen overflow-hidden">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
