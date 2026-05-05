import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Slider from "./Slider";

const AdminLayout = () => {
  const location = useLocation();

  return (
        <div className="flex h-screen w-full bg-[#F7F7F7] overflow-hidden">
        
        {/* Sidebar (Fixed) */}
        <div className="h-screen sticky top-0">
            <Slider />
        </div>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto">
            <div className="p-2 md:p-4 min-h-full">

            <AnimatePresence mode="wait">
                <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                >
                <Outlet />
                </motion.div>
            </AnimatePresence>

            </div>
        </main>
        </div>
  );
};

export default AdminLayout;