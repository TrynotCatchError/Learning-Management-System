import SideBarFull from'../../dashboard/page'
import Navbar from "../_components/Navbar";
import Sidebar from "../_components/sidebar";
const DashboardLayout = ({ children }) => {
  return (
    <div className="h-full">
      {/* Navbar section */}
      <div className="fixed top-0 left-0 right-0 h-20 z-50">
        <Navbar />
      </div>

      {/* Sidebar section for medium screens and up */}
      <div className="hidden md:flex h-full w-36 flex-col fixed inset-y-0 z-40">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="md:pl-60 pt-20 h-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;


{
  /* <div className="h-full ">
<div className="h-80 md:pl fixed inset-y-0 w-full z-50">
        <Navbar />
  </div>
 <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
  <Sidebar />
 </div>
 <main className="md:pl-56 h-full pt-[80px]">
  {children}
 </main>
</div> */
}
