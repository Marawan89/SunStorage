"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { config } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";
import axios from "axios";
import apiendpoint from "../../../apiendpoint";
import CreateAdminModal from "./CreateAdminModal";
import AdminsListModal from "./AdminListModal";

config.autoAddCss = false;

export default function Navbar() {
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showAdminsListModal, setShowAdminsListModal] = useState(false);
  const [admin, setAdmin] = useState({ name: "", role: "" });

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "",
  });

  // per rendere maiuscola la prima lettera di una stringa
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // recuperare i dati dell'admin loggato
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiendpoint}api/auth/admin-details`, {
          withCredentials: true,
        });
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

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  return (
    <>
      <nav className="navbar navbar-expand-lg p-4">
        <div className="container">
          <a href="/" className="logo">
            Sun<span>Storage</span>
          </a>
          <div className="d-flex justify-content-end align-items-center">
            <div className="userText d-flex align-items-center">
              <p className="mb-0 me-2">Ciao, {admin.name}</p>
              <DropdownButton
                align="end"
                title={
                  <FontAwesomeIcon className="user_icon" icon={faCircleUser} />
                }
                id="dropdown-menu-align-end"
                className="dropdown-button"
              >
                {admin.role === "ADMIN_FULL" && (
                  <>
                    <Dropdown.Item onClick={handleShowCreateAdminModal}>
                      Create new admin
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleShowAdminsListModal}>Admins</Dropdown.Item>
                  </>
                )}

                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        </div>
      </nav>
      <CreateAdminModal showModal={showCreateAdminModal} onClose={handleCloseCreateAdminModal} />
      <AdminsListModal showModal={showAdminsListModal} onClose={handleCloseAdminsListModal} />
    </>
  );
}
