import React from 'react'
import {Route, Routes} from "react-router-dom"
import AdminRoute from './admin/adminRoutes'
import Navbar from './components/Navbar'
import HomeRoute from './pages/Home'
import Footer from './components/Footer'
import SearchPage from './pages/SearchPage'
import DestinationRoute from './pages/Destination'
import TripDetails from './pages/TripsRoute'
import AboutIndia from './pages/AboutIndia'
import ContactRoute from './pages/ContactRoutte'
import Notfound from './pages/Notfound.jsx'
import Login from './pages/auth/login'
import SignUp from './pages/auth/signup'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProcetedRoute'
const App = () => {
  return (
    <>
      {/* 1. Place Toaster here so it is global to ALL routes */}
      <Toaster 
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
            fontFamily: 'inherit',
            fontWeight: '600',
            fontSize: '14px'
          },
        }}
      />

      <Routes>
          {/* Home */}
          <Route path="/" element={<UserLayout><HomeRoute/></UserLayout>} />
          
          {/* Auth - Now toasts will work here too! */}
          <Route path="/auth/login" element={<Login/>} />
          <Route path="/auth/signup" element={<SignUp/>} />

          {/* Pages */}
          <Route path='/trips' element={<UserLayout><TripDetails/></UserLayout>} />
          <Route path='/destinations' element={<UserLayout><DestinationRoute/></UserLayout>} />
          <Route path='/search' element={<UserLayout><SearchPage/></UserLayout>} />
          <Route path='/about' element={<UserLayout><AboutIndia/></UserLayout>} />
          <Route path='/contact' element={<UserLayout><ContactRoute/></UserLayout>} />
          
          <Route path='/admin/*' element={<AdminRoute />} />
          <Route path='*' element={<Notfound />} />
      </Routes>
    </>
  )
}

export default App

const UserLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Toaster removed from here */}
        <Navbar />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};
