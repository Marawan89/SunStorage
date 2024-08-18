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

  // Stato per tenere traccia dell'assegnazione del dispositivo
  const [isAssigned, setIsAssigned] = useState(false);

  // Funzione per controllare se il dispositivo è assegnato
  useEffect(() => {
   const checkIfAssigned = async () => {
     try {
       console.log(`Fetching /api/deviceassignments/check/${idDevice}`);
       const response = await fetch(`http://localhost:4000/api/deviceassignments/check/${idDevice}`);
       const data = await response.json();
       console.log("Data received:", data);
 
       if (data.length > 0) {
         setIsAssigned(true);
       }
     } catch (error) {
       console.error("Errore nel controllo dell'assegnazione del dispositivo:", error);
     }
   };
 
   checkIfAssigned();
 }, [idDevice]);
 

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
                  Assegna
                </a>
              )}
              <button className="p-3 btn btn-primary">Rientra</button>
              <button className="p-3 btn btn-success">Device history</button>
              <button className="p-3 btn btn-danger">Dismetti</button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
