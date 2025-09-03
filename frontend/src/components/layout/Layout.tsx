import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(window.innerWidth >= 768);
  const [sidebarMobileOpen, setSidebarMobileOpen] = React.useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarMobileOpen(!sidebarMobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarMobileOpen(false); // Hide sidebar on mobile
        setSidebarCollapsed(true); // Start collapsed on large screens
      } else {
        setSidebarCollapsed(false); // Ensure mobile opens fully when toggled
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="d-flex flex-grow-1">
        <div 
          className={`sidebar-container ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarMobileOpen ? 'mobile-open' : 'mobile-closed'}`}
        >
          <Sidebar userRole={user?.role || 'student'} collapsed={sidebarCollapsed} />
        </div>
        
        <main className={`main-content flex-grow-1 px-md-4 ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="pt-3 pb-2 mb-3">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;
