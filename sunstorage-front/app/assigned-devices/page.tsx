"use client";

import React, { useEffect, useState } from "react";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../globals.css";
import "./style.css";


export default function Devices() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-md-5">
              <div className="filtering">
                <div className="d-flex mb-3">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search for an email "
                  //   value={searchTerm}
                  //   onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Rendering device specific inputs based on the selected device type */}
              <div>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Surname</th>
                      <th scope="col">Email</th>
                      <th scope="col">Department</th>
                      <th scope="col">Device S/N</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
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
