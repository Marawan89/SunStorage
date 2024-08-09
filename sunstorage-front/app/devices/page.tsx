"use client";

import React, { useEffect, useState } from "react";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";

interface DeviceOverview {
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

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <a href="devices/add-device" className="btn btn-primary mb-2">
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
                          <a href="devices/view" className="btn view-btn">
                            View
                          </a>
                        </td>
                        <td>
                          <button className="btn action-btn">Action</button>
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
