import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;


export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg p-4">
      <div className="container">
        <h1 className="logo">
          Sun<span>Storage</span>
        </h1>
        <div className="d-flex justify-content-end align-items-center">
          <div className="userText d-flex align-items-center">
            <p className="mb-0 me-2">Ciao, Marawan</p>
            <FontAwesomeIcon className="user_icon" icon={faCircleUser} />
          </div>
        </div>
      </div>
    </nav>
  );
}
