"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import "./style.css";
import apiendpoint from "../../../../../apiendpoint";

export default function Actions() {
  const params = useParams();
  const idDevice = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState("");
  const [assignmentId, setAssignmentId] = useState(null);

  // Funzione per ottenere lo stato del dispositivo
  useEffect(() => {
    const fetchDeviceStatus = async () => {
      try {
        const response = await fetch(
          `${apiendpoint}api/devices/${idDevice}`
        );
        const data = await response.json();
        setDeviceStatus(data.status); // Imposta lo stato del dispositivo

        // Verifica se il dispositivo è assegnato e ottieni l'ID dell'assegnazione
        const assignmentResponse = await fetch(
          `${apiendpoint}api/deviceassignments/check/${idDevice}`
        );
        const assignmentData = await assignmentResponse.json();
        if (assignmentData.length > 0) {
          setAssignmentId(assignmentData[0].id); // Imposta l'ID dell'assegnazione
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

    fetchDeviceStatus(); // Ottieni lo stato del dispositivo
  }, [idDevice]);

  // Funzione per dismettere il dispositivo
  const dismissDevice = async () => {
    try {
      const response = await fetch(
        `${apiendpoint}api/devices/${idDevice}/status`,
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
        `${apiendpoint}api/devices/${idDevice}/status`,
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
        console.error("Errore nell'invio del dispositivo in magazzino");
      }
    } catch (error) {
      console.error("Errore nell'invio del dispositivo in magazzino:", error);
    }
  };

  // Funzione per cambiare un dispostivo in riparazione (status)
  const repairDevice = async () => {
    try {
      const response = await fetch(
        `${apiendpoint}api/devices/${idDevice}/status`,
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
    window.location.href = `/devices/${idDevice}/assign`;
  };

  // to view the page only after control
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="col-12 bg-content p-md-5">
            <div className="box d-flex flex-column justify-content-center align-items-center">
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
