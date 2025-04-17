"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faFloppyDisk,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import axios from "axios";
import apiendpoint from "../../../apiendpoint";
import "./style.css";

interface Admin {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
}

interface AdminsListModalProps {
  showModal: boolean;
  onClose: () => void;
}

const AdminsListModal: React.FC<AdminsListModalProps> = ({
  showModal,
  onClose,
}) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null); // ID dell'admin che si sta modificand
  const [editedRole, setEditedRole] = useState<string>(""); // ruolo modificato dell'admin
  const [isModified, setIsModified] = useState<boolean>(false); // fa il check se ci sono modifiche da salvare
  const [loggedInAdminId, setLoggedInAdminId] = useState<number | null>(null); // ID dell'admin loggato

  useEffect(() => {
    if (!showModal) return;

    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiendpoint}api/auth/admins`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setAdmins(response.data);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLoggedInAdmin = async () => {
      try {
        const response = await axios.get(
          `${apiendpoint}api/auth/admin-details`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setLoggedInAdminId(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching logged-in admin:", error);
      }
    };

    fetchAdmins();
    fetchLoggedInAdmin();
  }, [showModal]);

  // imposta l'ID dell'admin da modificare e il ruolo attuale
  const handleEditRole = (admin: Admin) => {
    setEditingAdminId(admin.id);
    setEditedRole(admin.role);
  };

  // aggiorna il ruolo modificato e segna come modificato
  const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedRole(e.target.value);
    setIsModified(true);
  };

  // salva le modifiche del ruolo e aggiorna lo stato
  const handleSave = async () => {
    if (editingAdminId && editedRole) {
      try {
        await axios.put(
          `${apiendpoint}api/auth/update-admin-role`,
          { id: editingAdminId, role: editedRole },
          { withCredentials: true }
        );

        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin.id === editingAdminId ? { ...admin, role: editedRole } : admin
          )
        );

        setEditingAdminId(null);
        setIsModified(false);
        alert("Role updated successfully");
      } catch (error) {
        console.error("Error updating admin role:", error);
        alert("Error updating role");
      }
    }
  };

  // elimina admin
  const handleDelete = async (adminId: number) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await axios.delete(`${apiendpoint}api/auth/delete-admin/${adminId}`, {
          withCredentials: true,
        });

        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin.id !== adminId)
        );
        alert("Admin deleted successfully");
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Error deleting admin");
      }
    }
  };

  if (!showModal) return null;

  return (
    <>
      <div className={`modal-backdrop fade ${showModal ? "show" : ""}`}></div>
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">List of Admins</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <ul className="list-group">
                  {admins.map((admin) => (
                    <li
                      key={admin.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {admin.email}
                        {admin.id === loggedInAdminId && " (Tu)"}
                      </span>
                      {admin.id !== loggedInAdminId && (
                        <div className="d-flex align-items-center">
                          {editingAdminId === admin.id ? (
                            <select
                              value={editedRole}
                              onChange={handleChangeRole}
                              className="form-select form-select-sm w-auto"
                            >
                              <option value="ADMIN_FULL">ADMIN_FULL</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          ) : (
                            <>
                              {admin.role}
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Edit</Tooltip>}
                              >
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="admin-icons me-2"
                                  onClick={() => handleEditRole(admin)}
                                />
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Delete</Tooltip>}
                              >
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="admin-icons"
                                  style={{ color: "red" }}
                                  onClick={() => handleDelete(admin.id)}
                                />
                              </OverlayTrigger>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!isModified}
              >
                <FontAwesomeIcon icon={faFloppyDisk} /> Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminsListModal;
