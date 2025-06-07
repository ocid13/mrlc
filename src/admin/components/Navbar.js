import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBranch } from "../../context/BranchContext";
import { useFilter } from "../../context/FilterContext";
import avatar from "../../assets/img/icon-mrevents.png";
import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";

const NavbarItem = () => {
  const { logout, user: rawUser } = useAuth();
  const { branches } = useBranch();
  const { filterValue, setFilterValue } = useFilter();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnDashboard = location.pathname === "/admin/dashboard";

  const user = {
    ...rawUser,
    jobs:
      typeof rawUser?.jobs === "string"
        ? rawUser.jobs.split(",").map(Number)
        : rawUser?.jobs,
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      <Container>
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
          <a
            className="nav-item nav-link px-0 me-xl-4"
            href="javascript:void(0)"
          >
            <i className="bx bx-menu bx-sm" />
          </a>
        </div>
        <Nav className="navbar-nav-right d-flex align-items-center ms-auto">
          <div>
            {isOnDashboard && (
              <select
                className="form-select"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              >
                {user.jobs &&
                  user.jobs.length > 0 &&
                  Array.isArray(branches) && (
                    <>
                      {/* Menampilkan opsi "All" jika user.jobs memiliki lebih dari satu atau jika user.jobs[0] === 1 */}
                      {(user.jobs.length > 1 || user.jobs[0] === 1) && (
                        <option value="">All</option>
                      )}

                      {(user.jobs[0] === 1
                        ? branches
                        : branches.filter((branch) =>
                            user.jobs.includes(branch.id)
                          )
                      ).map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.kode_cabang}
                        </option>
                      ))}
                    </>
                  )}
              </select>
            )}
          </div>
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <NavDropdown
                title={
                  <Image
                    src={avatar}
                    className="w-px-40 h-auto rounded-circle"
                  />
                }
                align="end"
                className="nav-link dropdown-toggle hide-arrow"
              >
                <NavDropdown.ItemText>
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <Image
                          src={avatar}
                          className="w-px-40 h-auto rounded-circle"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-semibold d-block">Admin</span>
                      <small className="text-muted">Admin</small>
                    </div>
                  </div>
                </NavDropdown.ItemText>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  href="javascript:void(0);"
                  onClick={handleLogout}
                >
                  <i className="bx bx-power-off me-2" />
                  <span className="align-middle">Log Out</span>
                </NavDropdown.Item>
              </NavDropdown>
            </li>
          </ul>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarItem;
