"use client";

import React, { useState, useEffect } from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "../../globals.css";
import "./style.css";

export default function UpdateDeviceType() {
   const [name, setName] = useState("");
   const [id, setId] = useState<string | null>(null);

   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const devicetypesId = urlParams.get('id');
      setId(devicetypesId);
  
      if (devicetypesId) {
        fetch(`http://localhost:4000/api/devicetypes/${devicetypesId}`)
          .then((res) => res.json())
          .then((data) => {
            setName(data.name);
          });
      }
    }, []);

    const handleUpdate = () => {
      if (id) {
        fetch(`http://localhost:4000/api/devicetypes/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              alert("Errore durante l'aggiornamento del tipo di device.");
            } else {
              window.location.href = '/device-types';
            }
          })
          .catch((error) => {
            console.error("Errore:", error);
            alert("Errore durante l'aggiornamento del tipo di device.");
          });
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
              <div className="row">
                <div className="col-12">
                  <h3> Edit Device type</h3>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name_devicetypes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
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
