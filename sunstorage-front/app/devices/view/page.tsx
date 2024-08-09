"use client";

import React, { useEffect, useState } from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";

export default function Devices() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="model">Model</h2>
                <h3 className="sn">Serial Number</h3>
              </div>
              <ul className="list-group">
                <li className="list-group-item active">
                  "DeviceType" specifics:
                </li>
                <li className="list-group-item">Disk Type: </li>
                <li className="list-group-item">Disk Size:</li>
                <li className="list-group-item">RAM(GB) :</li>
                <li className="list-group-item">Processor type :</li>
                {/* se c'è garanzia fa vedere solo una riga che dice not available non c'è bisogno che fai vedere sia start_date: not available e end_date: not availble basta uno */}
                <li className="list-group-item">warranty start_date: </li>
                <li className="list-group-item">warranty end_date: </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
