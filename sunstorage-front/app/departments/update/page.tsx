"use client";

import React, { useState, useEffect } from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";
import apiendpoint from "../../../../apiendpoint";
import { withAuth } from "../../../../src/server/middleware/withAuth";
import BackButton from "@/app/parts/BackButton";

interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
}

function UpdateDepartment() {
  const [departmentName, setDepartmentName] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    name: "",
    surname: "",
    email: "",
  });
  const [isUserFormVisible, setIsUserFormVisible] = useState<boolean>(false);
  const [usersToRemove, setUsersToRemove] = useState<number[]>([]); // Track users marked for removal

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUser = (user: User) => {
    return user.name && user.surname && user.email && validateEmail(user.email);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    setDepartmentId(id);

    if (id) {
      fetch(`${apiendpoint}api/departments/${id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setDepartmentName(data.name);
        });

      fetch(`${apiendpoint}api/departments/${id}/users`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
        });
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof User,
    index: number
  ) => {
    const updatedUsers = [...users];
    updatedUsers[index] = { ...updatedUsers[index], [field]: e.target.value };
    setUsers(updatedUsers);
  };

  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof User
  ) => {
    setNewUser({ ...newUser, [field]: e.target.value });
  };

  const handleAddUserForm = () => {
    setIsUserFormVisible(true);
  };

  const handleSaveNewUser = () => {
    if (!validateUser(newUser)) {
      alert(
        "Per favore, riempi tutti i campi per il nuovo utente con un'email valida."
      );
      return;
    }

    setUsers([...users, { ...newUser, id: undefined }]);
    setNewUser({ name: "", surname: "", email: "" });
    setIsUserFormVisible(false);
  };

  const handleRemoveUser = (index: number) => {
    if (window.confirm("Sei sicuro di voler rimuovere questo utente?")) {
      const userId = users[index].id;

      if (userId) {
        // Mark user for removal instead of deleting immediately
        setUsersToRemove((prev) => [...prev, userId]);
      }

      setUsers(users.filter((_, i) => i !== index));
    }
  };

  const handleCancelNewUserForm = () => {
    setIsUserFormVisible(false);
    setNewUser({ name: "", surname: "", email: "" });
  };

  const handleSaveDepartment = async () => {
    if (!departmentName) {
      alert("Il nome del dipartimento non può essere vuoto.");
      return;
    }

    for (const user of users) {
      if (!validateUser(user)) {
        alert(
          "Tutti i campi devono essere riempiti e l'email deve essere valida."
        );
        return;
      }
    }

    if (isUserFormVisible && !validateUser(newUser)) {
      alert(
        "Per favore, riempi tutti i campi per il nuovo utente con un'email valida."
      );
      return;
    }

    try {
      await fetch(`${apiendpoint}api/departments/${departmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: departmentName }),
        credentials: "include",
      });

      for (const user of users) {
        if (user.id) {
          await fetch(`${apiendpoint}api/users/${user.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
            credentials: "include",
          });
        } else {
          await fetch(`${apiendpoint}api/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              department_id: departmentId,
              name: user.name,
              surname: user.surname,
              email: user.email,
            }),
            credentials: "include",
          });
        }
      }

      // Now handle removal of marked users
      for (const userId of usersToRemove) {
        await fetch(`${apiendpoint}api/users/${userId}`, {
          method: "DELETE",
          credentials: "include",
        });
      }

      alert("Reparto e utenti aggiornati con successo!");
      window.location.href = "/departments";
    } catch (error) {
      console.error("Errore durante l'aggiornamento del reparto:", error);
      alert("Errore durante l'aggiornamento del reparto");
    }
  };

  const resetPage = () => {
    window.location.href = "/departments";
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <BackButton />
              <h2>Modifica Reparto</h2>
              <div className="spacer"></div>
              Nome del reparto
              <input
                type="text"
                name="department_name"
                className="form-control"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
              <h4 className="mt-4">Utenti nel reparto</h4>
              {users.map((user, index) => (
                <div
                  key={index}
                  className="mt-4 border border-3 border-white p-3"
                >
                  <h5>Dati dell'utente</h5>
                  Nome
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={user.name}
                    onChange={(e) => handleInputChange(e, "name", index)}
                  />
                  Cognome
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={user.surname}
                    onChange={(e) => handleInputChange(e, "surname", index)}
                  />
                  Email
                  <input
                    type="email"
                    className="form-control mb-2"
                    value={user.email}
                    onChange={(e) => handleInputChange(e, "email", index)}
                  />
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleRemoveUser(index)}
                  >
                    Rimuovi utente
                  </button>
                </div>
              ))}
              {isUserFormVisible && (
                <div className="mt-4 border border-3 border-white p-3">
                  <h5>Aggiungi un nuovo utente</h5>
                  Nome
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={newUser.name}
                    onChange={(e) => handleNewUserChange(e, "name")}
                  />
                  Cognome
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={newUser.surname}
                    onChange={(e) => handleNewUserChange(e, "surname")}
                  />
                  Email
                  <input
                    type="email"
                    className="form-control mb-2"
                    value={newUser.email}
                    onChange={(e) => handleNewUserChange(e, "email")}
                  />
                  <button
                    className="btn btn-success"
                    onClick={handleSaveNewUser}
                  >
                    Salva utente
                  </button>
                  <button
                    className="btn btn-secondary m-2"
                    onClick={handleCancelNewUserForm}
                  >
                    Cancella
                  </button>
                </div>
              )}
              <div className="col-12 mt-3">
                <button className="btn btn-light" onClick={handleAddUserForm}>
                  Aggiungi Nuovo Utente
                </button>
                <button
                  className="btn btn-success m-2"
                  onClick={handleSaveDepartment}
                >
                  Salva dati inseriti
                </button>
                <button className="btn btn-secondary" onClick={resetPage}>
                  Cancella
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(UpdateDepartment);
