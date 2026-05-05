import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Regions from "./pages/region/regions";
import Slider from "./components/Slider";
import Setting from "./pages/setting";
import Trips from "./pages/trips";
import Users from "./pages/users";
import Bookings from "./pages/bookings";
import AddRegion from "./pages/region/AddRegion";
import ViewRegion from "./pages/region/ViewRegion";
import Places from "./pages/region/places/Places";
import AdminLayout from "./components/AdminLayout"
import AddPlaces from "./pages/region/places/AddPlaces";
const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" />} />

      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />

        <Route path="regions">
          <Route index element={<Regions />} />
          <Route path="add" element={<AddRegion />} />
          <Route path=":regionId/edit" element={<AddRegion />} />
          <Route path=":regionId/view" element={<ViewRegion />} />
          <Route path=":stateName/cities/:cityName/:cityId">
            <Route path="places">
              <Route index element={<Places />} />
              <Route path="add" element={<AddPlaces />} />
              <Route path=":placeId/edit" element={<AddPlaces />} />
            </Route>
          </Route>

        </Route>

        <Route path="trips" element={<Trips />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="setting" element={<Setting />} />
      </Route>
    </Routes>
  );
};

export default AdminRoute;
