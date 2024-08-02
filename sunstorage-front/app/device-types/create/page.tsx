"use client";

import React from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";

export default function CreateDeviceTypes() {

  async function activateLasers() {
    const nameDevicetypesElement = document.getElementById(
      "name_devicetypes"
    ) as HTMLInputElement;

    if (nameDevicetypesElement) {
      const name = nameDevicetypesElement.value.trim();

      // checks if the field is not blank or contains special characters
      const regex = /^[a-zA-Z0-9\s]+$/;
      if (!name || !regex.test(name)) {
        alert(
          "Il nome del tipo di device non può essere vuoto o contenere solo caratteri speciali."
        );
        return;
      }

      const resAdd = await fetch("http://localhost:4000/api/devicetypes", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
      });
      const dataAdd = await resAdd.json();

      if (dataAdd.id) {
        // successful insertion
        alert("Inserimento riuscito");
        window.location.href = "/device-types"; // redirecting to the /device-types page
      } else {
        // if the server response does not contain an id in the JSON response body
        alert(dataAdd.error);
      }
    } else {
      // if the element with the name_devicetypes ID is not found in the DOM, then the getElementById resets null
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
                  <h3> Add Device type</h3>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name_devicetypes"
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
