import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, MessageSquare, User, LogOut, Book } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout, backendUrl } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar navbar-dark sticky-top bg-gradient-primary flex-md-nowrap p-0 shadow">
      <div className="container-fluid d-flex me-0">
        <div className="d-flex align-items-center">
          <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 d-flex align-items-center" to="/dashboard">
          <Book className="me-2" size={24} />
          <span>Smart LMS</span>
        </Link>
        </div>
        
        <div className="d-flex align-items-center">
          <div className="position-relative me-3">
            <Bell size={20} className="text-white cursor-pointer" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </div>
          
          <div className="position-relative me-3">
            <MessageSquare size={20} className="text-white cursor-pointer" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              5
            </span>
          </div>
          
          <div className="dropdown">
            <button
              className="btn btn-link dropdown-toggle text-white text-decoration-none d-flex align-items-center"
              type="button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="me-2">
                {user?.profile_picture ? (
                  <img
                    src={`${backendUrl}${user.profile_picture}?t=${new Date().getTime()}`}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="rounded-circle"
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 d-flex justify-content-center align-items-center"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <User size={16} className="text-primary" />
                  </div>
                )}
              </div>
              <span className="d-none d-md-inline-block">
                {user?.first_name} {user?.last_name}
              </span>
            </button>
            
            <ul className={`dropdown-menu dropdown-menu-end ${showMenu ? 'show' : ''}`}>
              <li>
                <Link className="dropdown-item" to="/profile">
                  <User size={16} className="me-2" />
                  Profile
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={16} className="me-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;