"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";

export default function AssignDevice() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <div className="col-12 bg-content p-5">
              <p>Assign Device</p>
              <div className="spacer"></div>
              <div className="add-device-data">
                <p>Is it used?</p>{" "}
                {/* se si fa vedere gli input per salvare i dati del vecchio proprietario */}
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                  />
                </div>
                <p>Fill the fields with the old owner data</p>
                <p>Name</p>
                <input type="text" />
                <p>Surname</p>
                <input type="text" />
                <p>Email</p>
                <input type="text" />
                <p>Department</p>
                <select name="" id=""></select>
                <p>Fill the fields with the new owner data</p>
                <p>Name</p>
                <input type="text" />
                <p>Surname</p>
                <input type="text" />
                <p>Email</p>
                <input type="text" />
                <p>Department</p>
                <select name="" id=""></select>
                <div className="form-btns d-flex flex-md-row justify-content-end align-items-center">
                  <button className="cl-btn" type="reset">
                    Cancel
                    <FontAwesomeIcon
                      className="btn-icon"
                      icon={faCancel}
                    ></FontAwesomeIcon>
                  </button>
                  <button className="sbmt-btn" type="button">
                    Save and assign device
                    <FontAwesomeIcon
                      className="btn-icon"
                      icon={faArrowRight}
                    ></FontAwesomeIcon>
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
