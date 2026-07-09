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
import AddCity from "./pages/region/city/AddCity";
import AddHotels from "./pages/hotels/AddHotels";
import AdminHotelsPage from "./pages/hotels/Hotels";
import AddTransport from "./pages/transport/AddTransport";
import Transport from "./pages/transport/Transport";
import TripFormPage from "./pages/TripFormPage";
import BookingDetails from "./pages/BookingDetails";
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
          <Route path=":stateId/edit" element={<AddRegion />} />
          <Route path=":stateId/view" element={<ViewRegion />} />
          <Route path=":stateId/city/add" element={<AddCity />} />
          <Route path=":stateId/city/:cityId/edit" element={<AddCity />} />
          <Route path=":stateName/cities/:cityName/:cityId">
            <Route path="places">
              <Route index element={<Places />} />
              <Route path="add" element={<AddPlaces />} />
              <Route path=":placeId/edit" element={<AddPlaces />} />
            </Route>
          
          </Route>
          <Route path=":cityName/:cityId">
            <Route path="hotels" index element={<AdminHotelsPage/>} />
            <Route path="hotels/add" element={<AddHotels/>}/>
            <Route path="hotels/:id/edit" element={<AddHotels/>}/>
          </Route>
          <Route path=":cityName/:cityId">
            <Route path="transport" index element={<Transport/>} />
            <Route path="transport/add" element={<AddTransport/>}/>
            <Route path="transport/:id/edit" element={<AddTransport/>}/>
          </Route>
        </Route>

        <Route path="trips"  >
          <Route index element={<Trips/>}/>
          <Route path="create" element={<TripFormPage/>}/>
          <Route path=":id/edit" element={<TripFormPage/>}/>
        </Route>
        <Route path="bookings" >
           <Route index element={<Bookings/>} />
           <Route path="details/:id" element={<BookingDetails />} />
        </Route>
        <Route path="setting" element={<Setting />} />
      </Route>
    </Routes>
  );
};

export default AdminRoute;
