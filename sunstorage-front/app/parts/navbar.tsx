"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { config } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";
import axios from "axios";
import apiendpoint from "../../../apiendpoint";
config.autoAddCss = false;

export default function Navbar() {
   const [showModal, setShowModal] = useState(false);
   const [formData, setFormData] = useState({
     name: "",
     surname: "",
     email: "",
     password: "",
     role: "",
   });
 
   const handleShowModal = () => setShowModal(true);
   const handleCloseModal = () => setShowModal(false);
 
   const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     try {
       await axios.post(`${apiendpoint}api/auth/register`, formData);
       handleCloseModal();
       alert("User registered successfully");
     } catch (error) {
       console.error("Error registering user:", error);
       alert("Error during registration");
     }
   };
 
   const handleLogout = async () => {
     try {
       await axios.post(`${apiendpoint}api/auth/logout`, {}, { withCredentials: true });
       alert("logout successfully");
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
              <p className="mb-0 me-2">Ciao, Marawan</p>
              <DropdownButton
                align="end"
                title={
                  <FontAwesomeIcon className="user_icon" icon={faCircleUser} />
                }
                id="dropdown-menu-align-end"
                className="dropdown-button"
              >
                <Dropdown.Item onClick={handleShowModal}>
                  Create new admin
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} >Logout</Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal for Creating New Admin */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Register New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Surname</label>
              <input
                type="text"
                className="form-control"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                className="form-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="ADMIN_FULL">ADMIN_FULL</option>
              </select>
            </div>
            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
