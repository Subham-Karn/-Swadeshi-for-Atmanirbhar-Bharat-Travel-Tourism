import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OfflineGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // If we were on the 'no-internet' page, go back to home
      if (location.pathname === "/no-internet") {
        navigate("/");
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Redirect to the 'no-internet' page
      navigate("/no-internet");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check on mount
    if (!navigator.onLine && location.pathname !== "/no-internet") {
      handleOffline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

export default OfflineGuard;