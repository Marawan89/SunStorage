"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "../globals.css";
import "./style.css";
import { withAuth } from "../../../src/server/middleware/withAuth";
import axios from "axios";

const apiendpoint = require("../../../apiendpoint");

interface Department {
  id: number;
  name: string;
}

function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [admin, setAdmin] = useState({ role: "" });

  // fetch per ottenere i dati dell'admin loggato
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          `${apiendpoint}api/auth/admin-details`,
          {
            withCredentials: true,
          }
        );
        setAdmin({ role: response.data.role });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    fetch(`${apiendpoint}api/departments`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
      })
      .catch((error) => {
        console.error("Errore nel fetch dei dipartimenti:", error);
      });
  }, []);

  // method to handle the deletion of a department from the db
  const handleDelete = (id: number) => {
    if (window.confirm("Sei sicuro di eliminare il reparto?")) {
      if (
        window.confirm(
          "Quando elimini un reparto tutti gli utenti di quel reparto vengono eliminati, sei sicuro? L'azione è irreversibile!"
        )
      ) {
        fetch(`${apiendpoint}api/departments/${id}`, {
          credentials: "include",
          method: "DELETE",
        })
          .then((res) => {
            if (res.status === 204) {
              alert("Eliminazione eseguita con successo.");
              setDepartments(
                departments.filter((department) => department.id !== id)
              );
            } else if (res.status === 400) {
              return res.json().then((data) => {
                alert(data.error); // Show the error message
              });
            } else {
              alert("Errore durante l'eliminazione del reparto.");
            }
          })
          .catch((error) => {
            console.error("Errore:", error);
            alert("Errore durante l'eliminazione del reparto.");
          });
      }
    }
  };

  if (!departments) {
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
                <a className="btn btn-dark" href="/departments/create">
                  Aggiungi reparto
                </a>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Nome reparto</th>
                      <th scope="col">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {departments.map((department) => (
                      <tr key={department.id}>
                        <td scope="row">{department.name}</td>
                        <td>
                          <a
                            className="btn btn-warning m-1"
                            href={`/departments/update?id=${department.id}`}
                          >
                            Modifica
                          </a>
                          {admin.role === "ADMIN_FULL" && (
                            <button
                              className="btn btn-danger m-1"
                              onClick={() => handleDelete(department.id)}
                            >
                              Elimina
                            </button>
                          )}
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

export default withAuth(Departments);
