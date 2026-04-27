import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Regions from "./pages/region/regions";
import Slider from "./components/Slider";
import Setting from "./pages/setting";
import Trips from "./pages/trips";
import Users from "./pages/users";
import Bookings from "./pages/bookings";
import AddRegion from "./pages/region/AddRegion";
import ViewRegion from "./pages/region/ViewRegion";
const AdminRoute = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="dashboard"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
       {/* Users */}
      <Route path="users" element={<AdminLayout><Users/></AdminLayout>}>
        {/* users sub routes */}
      </Route>

      {/* Regions */}
      <Route
        path="regions"
        
      >
        <Route index element={<AdminLayout><Regions/></AdminLayout>} />
        <Route path="add" element={<AdminLayout><AddRegion/></AdminLayout>} />
        <Route path=":regionId/edit" element={<AdminLayout><AddRegion/></AdminLayout>} />
        <Route path=":regionId/view" element={<AdminLayout><ViewRegion/></AdminLayout>} />
        <Route path=":regionId/cities" element={"Regions Route 2"} />
      </Route>

      {/* Trips */}
      <Route
        path="trips"
        element={
          <AdminLayout>
            <Trips />
          </AdminLayout>
        }
      >
        {/* Trips sub routes */}
      </Route>

      {/* Bookings */}
      <Route
        path="bookings"
        element={
          <AdminLayout>
            <Bookings />
          </AdminLayout>
        }
      >
        {/* Bookings sub routes */}
      </Route>


      

      {/* Setting  */}
      <Route
        path="/setting"
        element={
          <AdminLayout>
            <Setting />
          </AdminLayout>
        }
      />
    </Routes>
  );
};

export default AdminRoute;

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F7F7]">
      {/* Sidebar - Fixed height, no internal overflow unless nav is long */}
      <Slider />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* Inner wrapper for padding and max-width control */}
        <div className="p-4 md:p-8 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};
