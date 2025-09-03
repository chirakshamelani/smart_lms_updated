import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Book, 
  Users, 
  Award, 
  Calendar, 
  MessageSquare, 
  Settings,
  PieChart,
  FileText,
  User,
  BarChart2,
  Bot,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  userRole: 'student' | 'teacher' | 'admin';
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, collapsed }) => {
  return (
    <div className={`sidebar position-sticky pt-3 ${collapsed ? 'collapsed' : ''}`}>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
            }
            data-label="Dashboard"
          >
            <Home size={18} />
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/courses" 
            className={({ isActive }) => 
              `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
            }
            data-label="Courses"
          >
            <Book size={18} />
            <span className="nav-text">Courses</span>
          </NavLink>
        </li>
        
        {userRole === 'student' && (
          <>
            <li className="nav-item">
              <NavLink 
                to="/calendar" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                data-label="Calendar"
              >
                <Calendar size={18} />
                <span className="nav-text">Calendar</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/grades" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                data-label="Grades"
              >
                <Award size={18} />
                <span className="nav-text">Grades</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/mentoring" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                data-label="Peer Mentoring"
              >
                <Users size={18} />
                <span className="nav-text">Peer Mentoring</span>
              </NavLink>
            </li>
          </>
        )}
        
        {userRole === 'teacher' && (
          <>
            <li className="nav-item">
              <NavLink 
                to="/calendar" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                data-label="Calendar"
              >
                <Calendar size={18} />
                <span className="nav-text">Calendar</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/assignments" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                data-label="Assignments"
              >
                <FileText size={18} />
                <span className="nav-text">Assignments</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                data-label="Analytics"
              >
                <BarChart2 size={18} />
                <span className="nav-text">Analytics</span>
              </NavLink>
            </li>
          </>
        )}
        
        {userRole === 'admin' && (
          <>
            <li className="nav-item">
              <NavLink 
                to="/admin/students" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                data-label="Students"
              >
                <Users size={18} />
                <span className="nav-text">Students</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/admin/teachers" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                data-label="Teachers"
              >
                <Users size={18} />
                <span className="nav-text">Teachers</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/admin/reports" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                data-label="Reports"
              >
                <PieChart size={18} />
                <span className="nav-text">Reports</span>
              </NavLink>
            </li>
          </>
        )}
        <li className="nav-item">
          <NavLink 
            to="/chatbot" 
            className={({ isActive }) => 
              `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
            }
            data-label="AI Assistant"
          >
            <Bot size={18} />
            <span className="nav-text">AI Assistant</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/messages" 
            className={({ isActive }) => 
              `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
            }
            data-label="Messages"
          >
            <MessageSquare size={18} />
            <span className="nav-text">Messages</span>
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
            }
            data-label="Profile"
          >
            <User size={18} />
            <span className="nav-text">Profile</span>
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
            }
            data-label="Settings"
          >
            <Settings size={18} />
            <span className="nav-text">Settings</span>
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink 
            to="/help" 
            className={({ isActive }) => 
              `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
            }
            data-label="Help Center"
          >
            <HelpCircle size={18} />
            <span className="nav-text">Help Center</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;