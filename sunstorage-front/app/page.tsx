"use client"

import React from "react";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./style.css";
import Navbar from "./parts/navbar"
import Menu from "./parts/menu"
import { withAuth } from '../../src/server/middleware/withAuth';

function Dashboard() {
  return (
    <>
      <Navbar/>
      <div className="container">
        <div className="row">
         <Menu/>
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <div className="col-12 bg-content p-3">
            Dashboard
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(Dashboard)
