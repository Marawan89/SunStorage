"use client";

import React, { useEffect, useState } from "react";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../globals.css";
import "./style.css";

interface AssignedDeviceOverview {
   user_name: string;
   surname: string;
   email: string;
   department_name: string;
   sn: string;
}

export default function AssignedDevices() {
   const [assignedDevices, setAssignedDevices] = useState<AssignedDeviceOverview[]>([]);
   const [searchTerm, setSearchTerm] = useState<string>("");

   useEffect(() => {
     async function fetchAssignedDevices() {
       try {
         const res = await fetch("http://localhost:4000/api/devices/assigned-overview");
         if (!res.ok) {
           throw new Error("Failed to fetch assigned devices overview");
         }
         const data: AssignedDeviceOverview[] = await res.json();
         setAssignedDevices(data);
       } catch (error) {
         console.error("Error fetching assigned devices overview:", error);
       }
     }
 
     fetchAssignedDevices();
   }, []);

   // Filter devices based on the search term
   const filteredDevices = assignedDevices.filter((device) =>
     device.email.toLowerCase().includes(searchTerm.toLowerCase())
   );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-md-5">
              <div className="filtering">
                <div className="d-flex mb-3">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search for an email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Surname</th>
                      <th scope="col">Email</th>
                      <th scope="col">Department</th>
                      <th scope="col">Device S/N</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                  {filteredDevices.map((device, index) => (
                      <tr key={index}>
                        <th>{device.user_name}</th>
                        <td>{device.surname}</td>
                        <td>{device.email}</td>
                        <td>{device.department_name}</td>
                        <td>{device.sn}</td>
                        <td>
                          <a className="btn view-btn">View</a>
                        </td>
                        <td>
                          <div className="btn-group drop">
                            <button
                              type="button"
                              className="btn action-btn btn-secondary dropdown-toggle"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              Actions
                            </button>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton"
                            >
                              <a className="dropdown-item">Edit</a>
                              <a className="dropdown-item">More</a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
