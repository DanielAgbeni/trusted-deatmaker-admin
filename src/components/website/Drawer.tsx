import Footer from "./Footer";
import Navbar, { SideDrawer } from "./Navbar";

export default function Drawer({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <Navbar />
        {/* Page content here */}
        {children}
        <Footer />
      </div>
      <SideDrawer />
    </div>
  );
}

