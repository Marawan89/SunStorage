"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface StatusModalProps {
  showModal: boolean;
  onClose: () => void;
  deviceId: number;
}

export default function StatusModal({
  showModal,
  onClose,
  deviceId,
}: StatusModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState("");
  const [assignmentId, setAssignmentId] = useState<number | null>(null);

  useEffect(() => {
    if (!deviceId) return;

    const fetchDeviceStatus = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `http://localhost:4000/api/devices/${deviceId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch device status");
        }

        const data = await response.json();
        setDeviceStatus(data.status);

        const assignmentResponse = await fetch(
          `http://localhost:4000/api/deviceassignments/check/${deviceId}`,
          {
            credentials: "include",
          }
        );

        if (!assignmentResponse.ok) {
          throw new Error("Failed to fetch device assignment");
        }

        const assignmentData = await assignmentResponse.json();
        if (assignmentData.length > 0) {
          setAssignmentId(assignmentData[0].id);
        }
      } catch (error) {
        console.error(
          "Errore nel recupero dello stato del dispositivo:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceStatus();
  }, [deviceId]);

  const dismissDevice = async () => {
    if (!deviceId) return;
    try {
      const response = await fetch(
        `http://localhost:4000/api/devices/${deviceId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "dismissed" }),
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("Device dismissed successfully!");
        onClose();
        window.location.href = "/devices";
      } else {
        console.error("Errore nella dismissione del dispositivo");
      }
    } catch (error) {
      console.error("Errore nella dismissione del dispositivo:", error);
    }
  };

  const freeDevice = async () => {
    if (!deviceId) return;
    try {
      const response = await fetch(
        `http://localhost:4000/api/devices/${deviceId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "free" }),
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("Device is now free!");
        onClose();
        window.location.href = "/devices";
      } else {
        console.error("Errore nell'invio del dispositivo in magazzino");
      }
    } catch (error) {
      console.error("Errore nell'invio del dispositivo in magazzino:", error);
    }
  };

  const repairDevice = async () => {
    if (!deviceId) return;
    try {
      const response = await fetch(
        `http://localhost:4000/api/devices/${deviceId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "under repair" }),
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("Device sent to repair successfully!");
        onClose();
        window.location.href = "/devices";
      } else {
        console.error("Errore nell'invio del dispositivo in riparazione");
      }
    } catch (error) {
      console.error("Errore nell'invio del dispositivo in riparazione:", error);
    }
  };

  const assignDevice = () => {
    window.location.href = `/devices/${deviceId}/assign`;
  };

  if (!showModal || !deviceId) return null;

  return (
    <>
      <div className={`modal-backdrop fade ${showModal ? "show" : ""}`}></div>
      <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Device Status</h5>
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
                <div className="d-flex flex-column">
                  {deviceStatus === "free" && (
                    <>
                      <button
                        className="p-2 btn btn-outline-secondary mb-2"
                        onClick={assignDevice}
                      >
                        Assegna (status: assigned)
                      </button>
                      <button
                        className="p-2 btn btn-outline-secondary mb-2"
                        onClick={repairDevice}
                      >
                        Manda in riparazione (status: under repair)
                      </button>
                      <button
                        className="p-2 btn btn-outline-danger mb-2"
                        onClick={dismissDevice}
                      >
                        Dismetti (status: dismissed)
                      </button>
                    </>
                  )}
                  {deviceStatus === "assigned" && (
                    <>
                      <button
                        className="p-2 btn btn-outline-secondary mb-2"
                        onClick={freeDevice}
                      >
                        Rientra (status: free)
                      </button>
                      <button
                        className="p-2 btn btn-outline-secondary mb-2"
                        onClick={repairDevice}
                      >
                        Manda in riparazione (status: under repair)
                      </button>
                      <button
                        className="p-2 btn btn-outline-danger mb-2"
                        onClick={dismissDevice}
                      >
                        Dismetti (status: dismissed)
                      </button>
                    </>
                  )}
                  {deviceStatus === "under repair" && (
                    <>
                      <button
                        className="p-2 btn btn-outline-secondary mb-2"
                        onClick={freeDevice}
                      >
                        Rientra (status: free)
                      </button>
                      <button
                        className="p-2 btn btn-outline-danger mb-2"
                        onClick={dismissDevice}
                      >
                        Dismetti (status: dismissed)
                      </button>
                    </>
                  )}
                  {deviceStatus === "dismissed" && (
                    <>
                      <button
                        className="p-2 btn btn-outline-secondary mb-2"
                        onClick={repairDevice}
                      >
                        Manda in riparazione (status: under repair)
                      </button>
                      <button
                        className="p-2 btn btn-outline-secondary mb-2"
                        onClick={freeDevice}
                      >
                        Rientra (status: free)
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
