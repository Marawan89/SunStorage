"use client";

import React from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";
import apiendpoint from "../../../../apiendpoint";
import { withAuth } from '../../../../src/server/middleware/withAuth';

function AddDepartment() {
   
    async function activateLasers() {
    const nameDepartmentElement = document.getElementById(
      "name_department"
    ) as HTMLInputElement;

    if (nameDepartmentElement) {
      const name = nameDepartmentElement.value.trim();

      // checks if the field is not blank or contains special characters
      const regex = /^[a-zA-Z0-9\s]+$/;
      if (!name || !regex.test(name)) {
        alert(
          "Il nome del dipartimento non può essere vuoto o contenere solo caratteri speciali."
        );
        return;
      }

      try {
        const resAdd = await fetch(`${apiendpoint}api/departments`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name }),
          credentials: 'include',
        });
        const dataAdd = await resAdd.json();

        if (dataAdd.id) {
          // successful insertion
          alert("Inserimento riuscito");
          window.location.href = "/departments"; // redirecting to the /departments page
        } else {
          // if the server response does not contain an id in the JSON response body
          alert(dataAdd.error);
        }
      } catch (error) {
        console.error('Errore nella creazione del dipartimento:', error);
        alert('Errore nella creazione del dipartimento.');
      }
    } else {
      // if the element with the name_department ID is not found in the DOM, then the getElementById resets null
      alert("Elemento non trovato");
    }
  }

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
                  <h3> Add department</h3>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name_department"
                  />
                </div>
                <div className="col-12 mt-3">
                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={activateLasers}
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

export default withAuth(AddDepartment);
