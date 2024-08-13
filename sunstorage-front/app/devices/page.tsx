"use client";

import React, { useEffect, useState } from "react";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../globals.css";
import "./style.css";

interface DeviceOverview {
  id: number;
  serial_number: string;
  qr_code: string;
  device_type: string;
  warranty_start: string | null;
  warranty_end: string | null;
}

export default function Devices() {
  const [devices, setDevices] = useState<DeviceOverview[]>([]);

  useEffect(() => {
    const url = "http://localhost:4000/api/devices/overview";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mappedData = data.map((device) => ({
            id: device.id,
            serial_number: device.sn,
            qr_code: device.qr_code_string,
            device_type: device.device_type,
            warranty_start: device.start_date,
            warranty_end: device.end_date,
          }));
          setDevices(mappedData);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching devices:", error));
  }, []);

  // Function to handle device deletion
  const handleDelete = async (deviceId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this device?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/devices/${deviceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deviceId)
        );
      } else {
        console.error("Failed to delete device:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <a href="devices/create" className="btn btn-primary mb-2">
                Add a device
              </a>
              <div className="d-flex mb-3">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                />
                <button className="btn btn-success" type="submit">
                  Search
                </button>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Serial Number</th>
                      <th scope="col">Qr Code</th>
                      <th scope="col">Device Type</th>
                      <th scope="col">Warranty Start</th>
                      <th scope="col">Warranty End</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {devices.map((device, index) => (
                      <tr key={index}>
                        <th scope="row">{device.serial_number}</th>
                        <td>{device.qr_code}</td>
                        <td>{device.device_type}</td>
                        <td>
                          {device.warranty_start
                            ? new Date(
                                device.warranty_start
                              ).toLocaleDateString()
                            : "Not available"}
                        </td>
                        <td>
                          {device.warranty_end
                            ? new Date(device.warranty_end).toLocaleDateString()
                            : "Not available"}
                        </td>
                        <td>
                          <a
                            href={`devices/${device.id}/show`}
                            className="btn view-btn"
                          >
                            View
                          </a>
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
                              <a
                                href={`devices/${device.id}/edit`}
                                className="dropdown-item"
                              >
                                Edit
                              </a>
                              <a className="dropdown-item" href="devices/assign">
                                Assign
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => handleDelete(device.id)}
                              >
                                Delete
                              </a>
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
