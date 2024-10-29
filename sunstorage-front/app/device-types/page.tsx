"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "../globals.css";
import "./style.css";
import apiendpoint from "../../../apiendpoint";
import { withAuth } from "../../../src/server/middleware/withAuth";

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
    // Controllo per dispositivi assegnati
    fetch(`${apiendpoint}api/devicetypes/${id}/devices`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          // Se ci sono dispositivi assegnati, mostra un messaggio di errore
          alert(
            "Questo Tipo di dispositivo ha almeno 1 dispositivo assegnato, non può essere cancellato."
          );
          return; // Interrompe l'eliminazione
        }

        // Prima conferma per l'eliminazione
        if (window.confirm("Sei sicuro di eliminare il tipo di device?")) {
          fetch(`http://localhost:4000/api/devicetypes/${id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((res) => {
              if (res.status === 204) {
                alert("Eliminazione eseguita con successo");
                setDeviceTypes(
                  devicetypes.filter((devicetype) => devicetype.id !== id)
                );
              } else {
                alert("Errore durante l'eliminazione del tipo di device.");
              }
            })
            .catch((error) => {
              console.error("Errore durante l'eliminazione:", error);
              alert("Errore durante l'eliminazione del tipo di device.");
            });
        }
      })
      .catch((error) => {
        console.error(
          "Errore durante il controllo dei dispositivi assegnati:",
          error
        );
        alert("Errore durante il controllo dei dispositivi assegnati.");
      });
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
                  Aggiungi un tipo di dispositivo
                </a>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Tipo di dispositivo</th>
                      <th scope="col">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {devicetypes.map((devicetype) => (
                      <tr key={devicetype.id}>
                        <td scope="row">{devicetype.name}</td>
                        <td>
                          <a
                            className="btn btn-warning m-1"
                            href={`/device-types/update?id=${devicetype.id}`}
                          >
                            Modifica
                          </a>
                          <button
                            className="btn btn-danger m-1"
                            onClick={() => handleDelete(devicetype.id)}
                          >
                            Elimina
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
