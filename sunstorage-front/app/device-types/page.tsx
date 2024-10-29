"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "../globals.css";
import "./style.css";
import apiendpoint from "../../../apiendpoint";
import { withAuth } from "../../../src/server/middleware/withAuth";
import axios from "axios";

interface Devicetypes {
  id: number;
  name: string;
}

function Devicetypes() {
  const [devicetypes, setDeviceTypes] = useState<Devicetypes[]>([]);

  useEffect(() => {
    fetch(`${apiendpoint}api/devicetypes`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setDeviceTypes(data);
      });
  }, []);

  // method to handle the deletion of a devicetypes from the db
  const handleDelete = (id: number) => {
    if (window.confirm("Sei sicuro di eliminare il tipo di device?")) {
      if (
        window.confirm(
          "Quando elimini un tipo di device tutti i device di quel tipo vengono eliminati sei sicuro? L'azione è irreversibile!"
        )
      ) {
        fetch(`http://localhost:4000/api/devicetypes/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((res) => {
            if (res.status === 204) {
              alert("Eliminazione eseguita con successo");
              setDeviceTypes(
                devicetypes.filter((devicetypes) => devicetypes.id !== id)
              );
            } else {
              alert("Errore durante l'eliminazione del tipo di device.");
            }
          })
          .catch((error) => {
            console.error("Errore:", error);
            alert("Errore durante l'eliminazione del tipo di device.");
          });
      }
    }
  };

  if (!devicetypes) {
    return "loading...";
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <div className="d-flex mb-3">
                <a className="btn btn-dark" href="/device-types/create">
                  Add a Device Type
                </a>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Device type Name</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {devicetypes.map((devicetypes) => (
                      <tr key={devicetypes.id}>
                        <td scope="row">{devicetypes.name}</td>
                        <td>
                          <a
                            className="btn btn-warning m-1"
                            href={`/device-types/update?id=${devicetypes.id}`}
                          >
                            Edit
                          </a>
                          <button
                            className="btn btn-danger m-1"
                            onClick={() => handleDelete(devicetypes.id)}
                          >
                            Delete
                          </button>
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

export default withAuth(Devicetypes);
