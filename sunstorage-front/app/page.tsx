"use client";

import React, { useState, useEffect } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./style.css";
import { withAuth } from "../../src/server/middleware/withAuth";
import axios from "axios";
import apiendpoint from "../../apiendpoint";
import CreateAdminModal from "./parts/CreateAdminModal";
import AdminsListModal from "./parts/AdminListModal";

function Dashboard() {
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showAdminsListModal, setShowAdminsListModal] = useState(false);
  const [admin, setAdmin] = useState({ name: "", role: "" });
  const [showActions, setShowActions] = useState(false);

  // per rendere maiuscola la prima lettera di una stringa
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // recuperare i dati dell'admin loggato
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${apiendpoint}api/auth/admin-details`,
          {
            withCredentials: true,
          }
        );
        const capitalizedUser = {
          name: capitalizeFirstLetter(response.data.name),
          role: response.data.role,
        };
        setAdmin(capitalizedUser);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleShowCreateAdminModal = () => setShowCreateAdminModal(true);
  const handleCloseCreateAdminModal = () => setShowCreateAdminModal(false);

  const handleShowAdminsListModal = () => setShowAdminsListModal(true);
  const handleCloseAdminsListModal = () => setShowAdminsListModal(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${apiendpoint}api/auth/logout`,
        {},
        { withCredentials: true }
      );
      alert("Logout successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSearchClick = () => {
    setShowActions(true);
  };

  const handleCloseActions = () => {
    setShowActions(false);
  };

  return (
    <>
      <div className="d-flex justify-content-end align-items-center me-3">
        <div className="userText-dashboard d-flex align-items-center m-4">
          <p className="mb-0 me-2">Ciao, {admin.name}</p>
          <DropdownButton
            align="end"
            title={
              <FontAwesomeIcon
                className="user-icon-dashboard"
                icon={faCircleUser}
              />
            }
            id="dropdown-menu-align-end"
            className="dropdown-button"
          >
            {admin.role === "ADMIN_FULL" && (
              <>
                <Dropdown.Item onClick={handleShowCreateAdminModal}>
                  Create new admin
                </Dropdown.Item>
                <Dropdown.Item onClick={handleShowAdminsListModal}>
                  Admins
                </Dropdown.Item>
              </>
            )}

            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      <div className="container d-flex flex-column align-items-center pt-5">
        <div className="text-center">
          <h1 className="logo-dashboard">
            Sun<span>Storage</span>
          </h1>
          <p className="text-white mb-2">
            Cerca, aggiungi, modifica – ogni azione è a portata di mano.
          </p>
          <div className="input-group mb-3 search-group">
            <span className="input-group-text search-emoji">🔍</span>
            <input
              type="text"
              className="form-control search-input"
              onClick={handleSearchClick}
            />
            <button className="btn search-button">search ✨</button>
          </div>
          {showActions && (
            <div className="actions-menu d-flex flex-column">
              <div className="d-flex justify-content-end">
                <button className="close-button" onClick={handleCloseActions}>
                  ×
                </button>
              </div>
              <h5 className="text-black">TOP 5 ACTIONS</h5>
              <ul className="list-group">
                <li className="list-group-item">Add new device</li>
                <li className="list-group-item">View all devices</li>
                <li className="list-group-item">View departments</li>
                <li className="list-group-item">View Device Types</li>
                <li className="list-group-item">Search S/N</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <CreateAdminModal
        showModal={showCreateAdminModal}
        onClose={handleCloseCreateAdminModal}
      />
      <AdminsListModal
        showModal={showAdminsListModal}
        onClose={handleCloseAdminsListModal}
      />
    </>
  );
}

export default withAuth(Dashboard);
