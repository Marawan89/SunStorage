"use client";

import React, { useEffect, useState } from "react";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../globals.css";
import "./style.css";

interface DeviceType {
  id: number;
  name: string;
}

interface DeviceOverview {
  id: number;
  serial_number: string;
  qr_code: string;
  device_type: string;
  warranty_start: string | null;
  warranty_end: string | null;
  status: string;
}

interface DeviceSpecificInput {
   id: number;
   input_name: string;
   input_label: string;
   input_type: string;
   input_values: string | null;
 }

export default function Devices() {
  const [devices, setDevices] = useState<DeviceOverview[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");
  const [deviceSpecificInputs, setDeviceSpecificInputs] = useState<DeviceSpecificInput[]>([]);


  // Fetch specific inputs for the selected device type
  useEffect(() => {
   async function fetchDeviceSpecificInputs() {
     if (selectedDeviceType) {
       try {
         const res = await fetch(`http://localhost:4000/api/devicespecificsinputs/${selectedDeviceType}`);
         if (!res.ok) {
           throw new Error("Failed to fetch device specific inputs");
         }
         const data: DeviceSpecificInput[] = await res.json();
         setDeviceSpecificInputs(data);
       } catch (error) {
         console.error("Error fetching device specific inputs:", error);
       }
     }
   }

   fetchDeviceSpecificInputs();
 }, [selectedDeviceType]);

  // to get all device types
  useEffect(() => {
    async function fetchDeviceTypes() {
      try {
        const res = await fetch("http://localhost:4000/api/devicetypes");
        if (!res.ok) {
          throw new Error("Failed to fetch device types");
        }
        const data: DeviceType[] = await res.json();
        setDeviceTypes(data);
      } catch (error) {
        console.error("Error fetching device types:", error);
      }
    }

    fetchDeviceTypes();
  }, []);

  // route to get all devices overview
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
            status: device.status,
          }));
          setDevices(mappedData);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching devices:", error));
  }, []);

  // Function to check if warranty is active
  const isWarrantyActive = (start_date: string | null, end_date: string | null) => {
   if (!start_date || !end_date) {
     return "Not available";
   }

   const currentDate = new Date();
   const warrantyEndDate = new Date(end_date);

   return warrantyEndDate >= currentDate ? "Valid" : "Expired";
 };

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

  // Filter devices based on the search term
  const filteredDevices = devices.filter((device) =>
    device.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-md-5">
              <a href="devices/create" className="btn btn-primary mb-2">
                Add a device
              </a>
              <div className="filtering">
                <div className="d-flex mb-3">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search for a Serial Number "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="custom-select"
                  id="inputGroupSelect01"
                  value={selectedDeviceType}
                  onChange={(e) => setSelectedDeviceType(e.target.value)}
                  required
                >
                  <option>Choose an option...</option>
                  {deviceTypes.map((type) => (
                    <option key={type.id} value={type.id.toString()}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rendering device specific inputs based on the selected device type */}
              <div>
                {deviceSpecificInputs.map((input) => {
                  if (input.input_type === 'select') {
                    const options = JSON.parse(input.input_values || '[]');
                    return (
                      <div key={input.id}>
                        <p>{input.input_label}:</p>
                        <select id={input.input_name} name={input.input_name} required>
                          <option>Choose an option...</option>
                          {options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  } else if (input.input_type === 'text') {
                    return (
                      <div key={input.id}>
                        <p>{input.input_label}:</p>
                        <input
                          type="text"
                          id={input.input_name}
                          name={input.input_name}
                          placeholder={input.input_label}
                          required
                        />
                      </div>
                    );
                  } else if (input.input_type === 'number') {
                     return (
                        <div key={input.id}>
                           <p>{input.input_label}:</p>
                           <input 
                           type="number"
                           id={input.input_name}
                           name={input.input_name}
                           placeholder={input.input_label}
                           required
                            />

                        </div>
                     )
                  }
                  return null;
                })}
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Serial Number</th>
                      <th scope="col">Device Type</th>
                      <th scope="col">Warranty</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {filteredDevices.map((device, index) => (
                      <tr key={index}>
                        <th scope="row">{device.serial_number}</th>
                        <td>{device.device_type}</td>
                        <td>
                          {isWarrantyActive(device.warranty_start, device.warranty_end)}
                        </td>
                        <td>
                           {device.status}
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
                              <a
                                className="dropdown-item"
                                href={`devices/${device.id}/actions`}
                              >
                                More
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
