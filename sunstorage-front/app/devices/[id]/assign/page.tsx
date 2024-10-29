"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Menu from "../../../parts/menu";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import "./style.css";
import apiendpoint from "../../../../../apiendpoint";
import { withAuth } from "../../../../../src/server/middleware/withAuth";
import { Dropdown } from "react-bootstrap";

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  department_id: number; // Aggiunto per il mapping del reparto
}

interface Department {
  id: number;
  name: string;
}

function AssignDevice() {
  const params = useParams();
  const idDevice = params.id;

  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${apiendpoint}api/users`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  // fetch all departments
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch(`${apiendpoint}api/departments`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch departments");
        }
        const data: Department[] = await res.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }

    fetchDepartments();
  }, []);

  // assign logic
  const assignDevice = async (userId: number) => {
    try {
      await fetch(`${apiendpoint}api/deviceassignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: idDevice,
          user_id: userId,
        }),
        credentials: "include",
      });
      alert("Device assigned successfully");
      window.location.href = "/devices";
    } catch (error) {
      console.error("Error assigning device:", error);
      alert("Failed to assign device");
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const resetUserSelection = () => {
    setSelectedUser(null);
    setSearchTerm("");
  };

  // filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // department name by user department_id
  const getDepartmentName = (departmentId: number) => {
    const department = departments.find((dep) => dep.id === departmentId);
    return department ? department.name : "N/A";
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <div className="col-12 bg-content p-5">
              <p>Assegna dispositivo</p>
              <div className="spacer"></div>
              <div className="add-device-data">
                <p>Utenti</p>

                <Dropdown className="w-100">
                  <Dropdown.Toggle variant="secondary" className="w-50">
                    {selectedUser ? selectedUser.email : "Scegli un'opzione..."}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-50 dropdown-menu-scrollable">
                    <div className="p-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Cerca utente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <hr className="dropdown-divider" />
                    {filteredUsers.map((user) => (
                      <Dropdown.Item
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                      >
                        {user.email}
                        <hr className="dropdown-divider" />
                      </Dropdown.Item>
                    ))}
                    {filteredUsers.length === 0 && (
                      <Dropdown.Item disabled>
                        Nessun utente trovato
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                {selectedUser && (
                  <div className="mt-4 p-3 border">
                    <p>
                      <strong>Nome:</strong> {selectedUser.name}
                    </p>
                    <p>
                      <strong>Cognome:</strong> {selectedUser.surname}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                      <strong>Reparto:</strong>{" "}
                      {getDepartmentName(selectedUser.department_id)}
                    </p>

                    <div className="form-btns d-flex flex-md-row justify-content-end align-items-center mt-4">
                      <button
                        className="btn btn-secondary"
                        onClick={resetUserSelection}
                      >
                        Scegli un altro utente
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => assignDevice(selectedUser.id)}
                      >
                        Conferma
                        <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(AssignDevice);
