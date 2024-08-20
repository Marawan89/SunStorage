"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
// import "./style.css";

interface DeviceDetails {
  id: number;
  serial_number: string;
  qr_code: string;
  device_type: string;
  warranty_start: string | null;
  warranty_end: string | null;
  status: string;
  specifics: string;
  user_name: string;
  surname: string;
  email: string;
  department_name: string;
}

export default function ViewDeviceWithActions() {
  const params = useParams();
  const idDevice = params.id;
  const [device, setDevice] = useState<DeviceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState("");
  const [assignmentId, setAssignmentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const deviceId = params.qr;

        // Fetch device details
        const response = await fetch(
          `http://192.168.16.119:4000/api/devices/overview?qr=${deviceId}`
        );
        const data = await response.json();
        if (data.length > 0) {
          const deviceData = data[0];
          setDevice({
            id: deviceData.id,
            serial_number: deviceData.sn,
            qr_code: deviceData.qr_code_string,
            device_type: deviceData.device_type,
            warranty_start: deviceData.start_date,
            warranty_end: deviceData.end_date,
            specifics: deviceData.specifics,
            status: deviceData.status,
            user_name: deviceData.user_name,
            surname: deviceData.surname,
            email: deviceData.email,
            department_name: deviceData.department_name,
          });
          setDeviceStatus(deviceData.status);
        } else {
          console.error("No device found:", data);
        }

        // Fetch assignment data
        const assignmentResponse = await fetch(
          `http://192.168.16.119:4000/api/deviceassignments/check/${device.id}`
        );
        const assignmentData = await assignmentResponse.json();
        if (assignmentData.length > 0) {
          setAssignmentId(assignmentData[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceData();
  }, [params.id]);

  if (isLoading || !device) {
    return <div>Loading...</div>;
  }

  const specificsList = device.specifics.split(", ").map((spec, index) => (
    <li key={index} className="list-group-item">
      {spec}
    </li>
  ));

  // Funzione per dismettere il dispositivo
  const dismissDevice = async () => {
    try {
      const response = await fetch(
        `http://192.168.16.119:4000/api/devices/${device.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "dismissed" }),
        }
      );

      if (response.ok) {
        const confirmDelete = window.confirm(
          "Are you sure you want to dismiss this device?"
        );
        if (!confirmDelete) return;
        window.location.href = "/devices";
      } else {
        console.error("Errore nella dismissione del dispositivo");
      }
    } catch (error) {
      console.error("Errore nella dismissione del dispositivo:", error);
    }
  };

  // Funzione per cambiare un dispostivo in riparazione (status)
  const freeDevice = async () => {
    try {
      const response = await fetch(
        `http://192.168.16.119:4000/api/devices/${device.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "free" }),
        }
      );

      if (response.ok) {
        alert("Device is now free!");
        window.location.href = "/devices";
      } else {
        console.error("Errore nell'invio del dispositivo in riparazione");
      }
    } catch (error) {
      console.error("Errore nell'invio del dispositivo in riparazione:", error);
    }
  };

  const repairDevice = async () => {
    try {
      const response = await fetch(
        `http://192.168.16.119:4000/api/devices/${device.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "under repair" }),
        }
      );

      if (response.ok) {
        alert("Device sent to repair successfully!");
        window.location.href = "/devices";
      } else {
        console.error("Errore nell'invio del dispositivo in riparazione");
      }
    } catch (error) {
      console.error("Errore nell'invio del dispositivo in riparazione:", error);
    }
  };

  // Funzione per assegnare il dispositivo
  const assignDevice = async () => {
    window.location.href = `/devices/${device.id}/assign`;
  };

  // Funzione per cambiare il proprietario del dispositivo
  const changeOwner = async () => {
    window.location.href = `/devices/${device.id}/assign`;
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="col-12 bg-content p-md-5">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h3 className="sn">S/N: {device.serial_number}</h3>
            </div>
            <ul className="list-group">
              <li className="list-group-item disabled">
                {device.device_type} specifics:
              </li>
              <li className="list-group-item">Status: {device.status}</li>
              {specificsList}
              {device.warranty_start && device.warranty_end ? (
                <>
                  <li className="list-group-item">
                    Warranty Start Date:{" "}
                    {new Date(device.warranty_start).toLocaleDateString()}
                  </li>
                  <li className="list-group-item">
                    Warranty End Date:{" "}
                    {new Date(device.warranty_end).toLocaleDateString()}
                  </li>
                </>
              ) : (
                <li className="list-group-item">Warranty not available</li>
              )}
              <li className="list-group-item">
                <img
                  src={`https://quickchart.io/qr?text=http://192.168.16.119:3000/devices/qr/${device.qr_code}/&size=200px&dark=000000&light=FFFFFF&ecLevel=M&margin=4`}
                  alt="QR Code"
                />
              </li>
              {device.status === "assigned" && (
                <>
                  <li className="list-group-item">
                    Name owner: {device.user_name} {device.surname}
                  </li>
                  <li className="list-group-item">
                    Email owner: {device.email}
                  </li>
                  <li className="list-group-item">
                    Owner department: {device.department_name}
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex justify-content-between align-items-center">
              {deviceStatus === "free" && (
                <>
                  <button className="p-3 btn btn-info" onClick={assignDevice}>
                    Assegna (status: assigned)
                  </button>
                  <button
                    className="p-3 btn btn-success"
                    onClick={repairDevice}
                  >
                    Manda in riparazione (status: under repair)
                  </button>
                  <button
                    className="p-3 btn btn-danger"
                    onClick={dismissDevice}
                  >
                    Dismetti (status: dismissed)
                  </button>
                </>
              )}
              {deviceStatus === "assigned" && (
                <>
                  <button
                    className="p-3 btn btn-secondary"
                    onClick={changeOwner}
                  >
                    Change owner (status: assigned)
                  </button>
                  <button className="p-3 btn btn-primary" onClick={freeDevice}>
                    Rientra (status: free)
                  </button>
                  <button
                    className="p-3 btn btn-success"
                    onClick={repairDevice}
                  >
                    Manda in riparazione (status: under repair)
                  </button>
                  <button
                    className="p-3 btn btn-danger"
                    onClick={dismissDevice}
                  >
                    Dismetti (status: dismissed)
                  </button>
                </>
              )}
              {deviceStatus === "under repair" && (
                <>
                  <button className="p-3 btn btn-info" onClick={assignDevice}>
                    Assegna (status: assigned)
                  </button>
                  <button className="p-3 btn btn-primary" onClick={freeDevice}>
                    Rientra (status: free)
                  </button>
                  <button
                    className="p-3 btn btn-danger"
                    onClick={dismissDevice}
                  >
                    Dismetti (status: dismissed)
                  </button>
                </>
              )}
              {deviceStatus === "dismissed" && (
                <>
                  <button
                    className="p-3 btn btn-success"
                    onClick={repairDevice}
                  >
                    Manda in riparazione (status: under repair)
                  </button>
                  <button className="p-3 btn btn-primary" onClick={freeDevice}>
                    Rientra (status: free)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
