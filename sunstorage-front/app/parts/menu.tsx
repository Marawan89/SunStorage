import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faLaptop,
  faUsers,
  faComputer,
  faHouse
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

export default function Menu() {
  return (
    <div className="col-12 col-md-4 justify-content-center">
      <div className="col-12 col-md-11 bg-side-bar">
        <div className="d-flex flex-column align-items-start p-2">
        <button className="nav-item btn p-0 mb-2">
            <a href="/" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faHouse} className="menuIcons mr-2" />
              <p className="mb-0">Dashboard</p>
            </a>
          </button>
          <div className="spacer"></div>
          <button className="nav-item btn p-0 mb-2">
            <a href="/devices" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faLaptop} className="menuIcons mr-2" />
              <p className="mb-0">Devices</p>
            </a>
          </button>
          <div className="spacer"></div>
          <button className="nav-item btn p-0 mb-2">
            <a href="/departments" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faUsers} className="menuIcons mr-2" />
              <p className="mb-0">Departments</p>
            </a>
          </button>
          <div className="spacer"></div>
          <button className="nav-item btn p-0 mb-2">
            <a href="/device-types" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faComputer} className="menuIcons mr-2" />
              <p className="mb-0">Device Types</p>
            </a>
          </button>    
        </div>
      </div>
    </div>
  );
}
