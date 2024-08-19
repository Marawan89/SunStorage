"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import "./style.css";

export default function Actions() {
  const params = useParams();
  const idDevice = params.id;
  const [isAssigned, setIsAssigned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assignmentId, setAssignmentId] = useState(null);

  // Funzione per controllare se il dispositivo è assegnato
  useEffect(() => {
    const checkIfAssigned = async () => {
      try {
        console.log(`Fetching /api/deviceassignments/check/${idDevice}`);
        const response = await fetch(
          `http://localhost:4000/api/deviceassignments/check/${idDevice}`
        );
        const data = await response.json();
        console.log("Data received:", data);

        if (data.length > 0) {
          setIsAssigned(true);
          setAssignmentId(data[0].id);
        } else {
         setIsAssigned(false);
         setAssignmentId(null);
        }
      } catch (error) {
        console.error(
          "Errore nel controllo dell'assegnazione del dispositivo:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkIfAssigned();
  }, [idDevice]);

  // Funzione per deassegnare il dispositivo
  const unassignDevice = async () => {
   if (assignmentId) {
     try {
       const response = await fetch(
         `http://localhost:4000/api/deviceassignments/${assignmentId}`,
         {
           method: "DELETE",
         }
       );

       if (response.ok) {
         setIsAssigned(false);
         setAssignmentId(null);
       } else {
         console.error("Errore nella deassegnazione del dispositivo");
       }
     } catch (error) {
       console.error("Errore nella deassegnazione del dispositivo:", error);
     }
   } else {
     console.error("Assignment ID non impostato.");
   }
   alert("Device deassigned successfuly!")
   window.location.href = "/devices";

 };

  // to view the page only after assignment control
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-6">
            <div className="box d-flex flex-column justify-content-center align-items-center">
              {/* Mostra il pulsante "Assegna" solo se il dispositivo non è assegnato */}
              {!isAssigned && (
                <a className="p-3 btn btn-info" href={`assign`}>
                  Assegna (status: assigned)
                </a>
              )}
              <button className="p-3 btn btn-primary" onClick={unassignDevice}>
                Rientra (status: free)
              </button>
              <button className="p-3 btn btn-success">
                Manda in riparazione (status: under repair)
              </button>
              <button className="p-3 btn btn-danger">
                Dismetti (status: dismissed)
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
