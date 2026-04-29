import React from 'react'
import {Route, Routes} from "react-router-dom"
import AdminRoute from './admin/adminRoutes'
import Navbar from './components/Navbar'
import HomeRoute from './pages/Home'
import Footer from './components/Footer'
import SearchPage from './pages/SearchPage'
import DestinationRoute from './pages/destination/Destination.jsx'
import TripDetails from './pages/TripsRoute'
import AboutIndia from './pages/AboutIndia'
import ContactRoute from './pages/ContactRoutte'
import Notfound from './pages/Notfound.jsx'
import Login from './pages/auth/login'
import SignUp from './pages/auth/signup'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProcetedRoute'
import Unauthorized from './pages/Unauthorized.jsx'
import DestinationDetails from './pages/destination/DestinationDetails.jsx'
import NoInternet from './pages/NoInternet.jsx'
import OfflineGuard from './components/OfflineGuard.jsx'
const App = () => {
  return (
    <>
      
      <Toaster 
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '20px',      // Extra rounded for your travel UI
            background: '#1a1a1a',     // Deep Charcoal
            color: '#ffffff',          // White text
            padding: '16px 24px',
            fontFamily: 'inherit',
            fontWeight: '700',         // Bold for readability
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          // Theme-specific overrides
          success: {
            iconTheme: {
              primary: '#00A699',      // Your brand Teal
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '4px solid #00A699', // Thick teal accent
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4b4b',      // Bright Red for errors
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '4px solid #ff4b4b', // Thick red accent
            },
          },
          loading: {
            style: {
              borderLeft: '4px solid #00A699',
            },
          }
        }}
      />
      <OfflineGuard>
      <Routes>
          {/* Home */}
          <Route path="/" element={<UserLayout><HomeRoute/></UserLayout>} />
          <Route path="/no-internet" element={<NoInternet />} />
          {/* Auth - Now toasts will work here too! */}
          <Route path="/auth/login" element={<Login/>} />
          <Route path="/auth/signup" element={<SignUp/>} />

          {/* Pages */}
          <Route path='/trips' element={<UserLayout><TripDetails/></UserLayout>} />
          <Route path='/destinations' element={<UserLayout><DestinationRoute/></UserLayout>} />
          <Route path='/destinations/:id' element={<UserLayout><DestinationDetails/></UserLayout>} />
          <Route path='/search' element={<UserLayout><SearchPage/></UserLayout>} />
          <Route path='/about' element={<UserLayout><AboutIndia/></UserLayout>} />
          <Route path='/contact' element={<UserLayout><ContactRoute/></UserLayout>} />
          
          <Route path='/admin/*' element={
              <ProtectedRoute requiredRoles={["admin"]} >
                <AdminRoute />
              </ProtectedRoute>
              } />
          <Route path='*' element={<Notfound />} />
          <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
      </OfflineGuard>
      
    </>
  )
}

export default App

const UserLayout = ({ children }) => {
  return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </div>
  );
};
