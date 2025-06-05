import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import { FaHome } from "react-icons/fa";
// import { MdDashboard } from "react-icons/md";
import logo_sidebar from "../../assets/img/Logo_MRLC.png";
// import { Nav } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const MENU_ITEMS = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/admin/leads", label: "Leads" },
  {
    label: "Sign Up",
    subItems: [
      { path: "/admin/daftar-prospect", label: "Daftar Prospect" },
      { path: "/admin/daftar-customer", label: "Daftar Customer" },
    ],
  },
  { path: "/admin/student", label: "Student" },
  { path: "/admin/payment", label: "Payment" },
];

const getMenuForRole = (role) => {
  switch (role) {
    case "3": // Superadmin
      return MENU_ITEMS;

    case "5": // Finance
      return MENU_ITEMS.filter(item =>
        ["Student", "Payment"].includes(item.label)
      );

    default:
      return [];
  }
};

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const { user } = useAuth(); // <-- Ambil user dari context
  const userRole = String(user?.role_id);
  if (!user) return null;
  console.log(user);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isPathActive = (path) => location.pathname.startsWith(path);
  const menuItems = getMenuForRole(userRole);

  return (
    <aside className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
        <img src={logo_sidebar} alt="logo-sidebar" width={165} />
      </div>

      <div
        className="me-xl-0 d-xl-none"
        style={{
          position: "absolute",
          top: "10px", // Jarak dari atas
          right: "10px", // Jarak dari kanan
          zIndex: 1000, // Biar di atas elemen lain
        }}
      >
        <button
          type="button"
          className="layout-menu-toggle menu-link text-large ms-auto btn btn-primary shadow rounded-circle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            height: "50px",
          }}
        >
          <i className="bx bx-chevron-left bx-sm align-middle"></i>
        </button>
      </div>

      <div className="menu-inner py-3 flex-column overflow-auto">
      {menuItems.map((item) => (
          <div
            key={item.label}
            className={`menu-item ${
              isPathActive(item.path) || openMenus[item.label]
                ? "active open"
                : ""
            }`}
          >
            {item.subItems ? (
              <>
                <a href="#" className="menu-link menu-toggle" onClick={() => toggleMenu(item.label)}>
                  <span className="menu-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
                <div
                  className={`menu-sub ${openMenus[item.label] ? "open" : ""}`}
                >
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.label}
                      className={`menu-item ${
                        isPathActive(subItem.path) || openMenus[subItem.label]
                          ? "active open"
                          : ""
                      }`}
                    >
                      {subItem.subItems ? (
                        <>
                          <button
                            href="#"
                            className="menu-link menu-toggle"
                            onClick={() => toggleMenu(subItem.label)}
                          >
                            <span>{subItem.label}</span>
                          </button>
                          <div
                            className={`menu-sub ${
                              openMenus[subItem.label] ? "open" : ""
                            }`}
                          >
                            {subItem.subItems.map((innerItem) => (
                              <div
                                key={innerItem.path}
                                className={`menu-item ${
                                  isPathActive(innerItem.path) ? "active" : ""
                                }`}
                              >
                                <Link to={innerItem.path} className="menu-link">
                                  {innerItem.label}
                                </Link>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link to={subItem.path} className="menu-link">
                          {subItem.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Link to={item.path} className="menu-link">
                <span className="menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
