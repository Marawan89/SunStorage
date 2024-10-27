"use client";

import React, { useState } from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";
import apiendpoint from "../../../../apiendpoint";
import { withAuth } from "../../../../src/server/middleware/withAuth";

interface User {
  name: string;
  surname: string;
  email: string;
}

function CreateDepartment() {
  const [departmentName, setDepartmentName] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    name: "",
    surname: "",
    email: "",
  });
  const [isUserFormVisible, setIsUserFormVisible] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddUserForm = () => {
    setIsUserFormVisible(true); // Mostra il form per aggiungere un utente
  };

  const handleSaveUser = () => {
    if (!newUser.name || !newUser.surname || !newUser.email) {
      alert("Per favore, riempi tutti i campi per l'utente.");
      return;
    }

    if (!validateEmail(newUser.email)) {
      alert("L'email inserita non è valida. Usa il formato prova@prova.prova.");
      return;
    }

    setUsers([...users, newUser]);
    setNewUser({ name: "", surname: "", email: "" });
    setIsUserFormVisible(false);
  };

  const handleRemoveUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof User
  ) => {
    setNewUser({ ...newUser, [field]: e.target.value });
  };

  const handleSaveDepartment = async () => {
    if (!departmentName) {
      alert("Il nome del dipartimento non può essere vuoto.");
      return;
    }

    if (users.length === 0) {
      alert("Devi aggiungere almeno un utente.");
      return;
    }

    try {
      const departmentRes = await fetch(`${apiendpoint}api/departments`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: departmentName }),
        credentials: "include",
      });

      const departmentData = await departmentRes.json();

      if (departmentData.id) {
        for (const user of users) {
          await fetch(`${apiendpoint}api/users`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              department_id: departmentData.id,
              name: user.name,
              surname: user.surname,
              email: user.email,
            }),
            credentials: "include",
          });
        }

        alert("Dipartimento e utenti creati con successo!");
        window.location.href = "/departments";
      } else {
        alert(departmentData.error);
      }
    } catch (error) {
      console.error("Errore durante la creazione del dipartimento:", error);
      alert("Errore durante la creazione del dipartimento");
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
              <h3>Aggiungi un reparto</h3>
              Inserisci il nome del reparto
              <input
                type="text"
                name="department_name"
                className="form-control"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />

              {/* Elenco degli utenti aggiunti */}
              {users.map((user, index) => (
                <div key={index} className="mt-4 border p-3">
                  <p>
                    <strong>
                      {user.name} {user.surname}
                    </strong>{" "}
                    - {user.email}
                  </p>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleRemoveUser(index)}
                  >
                    Elimina utente
                  </button>
                </div>
              ))}

              {/* Form per aggiungere un nuovo utente */}
              {isUserFormVisible && (
                <div className="mt-4 border p-3">
                  <h5>Aggiungi un nuovo utente</h5>
                  Nome
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={newUser.name}
                    onChange={(e) => handleInputChange(e, "name")}
                  />
                  Cognome
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={newUser.surname}
                    onChange={(e) => handleInputChange(e, "surname")}
                  />
                  Email
                  <input
                    type="email"
                    className="form-control mb-2"
                    value={newUser.email}
                    onChange={(e) => handleInputChange(e, "email")}
                  />
                  <button
                    className="btn btn-success"
                    type="button"
                    onClick={handleSaveUser}
                  >
                    Salva utente
                  </button>
                </div>
              )}

              <button
                className="btn btn-light mt-3"
                type="button"
                onClick={handleAddUserForm}
              >
                Aggiungi un nuovo utente
              </button>

              <div className="col-12 mt-3">
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={handleSaveDepartment}
                >
                  Salva reparto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(CreateDepartment);
