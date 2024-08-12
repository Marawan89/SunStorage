"use client";

import React, { useState, useEffect } from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";

interface DeviceDetails {
  id: number;
  serial_number: string;
  qr_code: string;
  device_type: string;
  warranty_start: string | null;
  warranty_end: string | null;
  specifics: string[];
}

export default function EditDevice() {
  const [device, setDevice] = useState<DeviceDetails | null>(null);
  const [id, setId] = useState<string | null>(null);

  // Retrieve the device ID from the query parameters
  function getDeviceId() {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      console.log("Retrieved ID:", id);
      return id;
    }
    return null;
  }

  // Fetch the device details on component mount
  useEffect(() => {
    const deviceId = getDeviceId();
    if (deviceId) {
      setId(deviceId);
      console.log("Device ID retrieved:", deviceId);

      const url = `http://localhost:4000/api/devices/overview?id=${deviceId}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const deviceData = data[0];
            console.log("Device data retrieved:", deviceData);

            setDevice({
              id: deviceData.id,
              serial_number: deviceData.sn,
              qr_code: deviceData.qr_code_string,
              device_type: deviceData.device_type,
              warranty_start: formatDate(deviceData.start_date),
              warranty_end: formatDate(deviceData.end_date),
              specifics: deviceData.specifics.split(", "),
            });
          } else {
            console.error("No device found with the provided ID:", deviceId);
          }
        })
        .catch((error) =>
          console.error("Error fetching device details:", error)
        );
    }
  }, []);

  // Helper function to format the date
  const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle the update process
  const handleUpdate = () => {
    if (!id || !device) {
      console.error("Device ID or details are missing.");
      return;
    }

    console.log("Updating device with ID:", id);
    console.log("Device data being sent:", device);

    fetch(`http://localhost:4000/api/devices/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_type_id: device.device_type, // assuming `device_type` is actually the device_type_id
        sn: device.serial_number,
        qr_code_string: device.qr_code,
        specifics: device.specifics.join(", "),
        warranty_start: device.warranty_start,
        warranty_end: device.warranty_end,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || "Unknown error");
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          console.error("Error updating device:", data.error);
          alert("Errore durante l'aggiornamento del dispositivo.");
        } else {
          window.location.href = "/devices";
        }
      })
      .catch((error) => {
        console.error("Errore durante la richiesta PATCH:", error);
        alert("Errore durante l'aggiornamento del dispositivo.");
      });
  };

  // Handle changes in the specifics array
  const handleSpecificChange = (index: number, value: string) => {
    if (device) {
      const updatedSpecifics = [...device.specifics];
      updatedSpecifics[index] = value;
      setDevice({
        ...device,
        specifics: updatedSpecifics,
      });
    }
  };

  // Handle changes in the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (device) {
      const updatedDevice = {
        ...device,
        [e.target.name]: e.target.value,
      };
      console.log("Updated device data:", updatedDevice);
      setDevice(updatedDevice);
    }
  };

  if (!device) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <h3>Edit Device</h3>
              <div className="row">
                <div className="col-12 mb-3">
                  <label>Serial Number</label>
                  <input
                    type="text"
                    name="serial_number"
                    className="form-control"
                    value={device.serial_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label>QR Code</label>
                  <input
                    type="text"
                    name="qr_code"
                    className="form-control"
                    value={device.qr_code}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label>Device Type</label>
                  <input
                    type="text"
                    name="device_type"
                    className="form-control"
                    value={device.device_type}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label>Warranty Start</label>
                  <input
                    type="date"
                    name="warranty_start"
                    className="form-control"
                    value={device.warranty_start || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label>Warranty End</label>
                  <input
                    type="date"
                    name="warranty_end"
                    className="form-control"
                    value={device.warranty_end || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Device Specifics */}
                <div className="col-12 mb-3">
                  <label>Device Specifics</label>
                  {device.specifics.map((spec, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={spec}
                        onChange={(e) =>
                          handleSpecificChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="col-12 mt-3">
                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
