import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faRightFromBracket,
  faTableList,
  faCirclePlus
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./style.css";

export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg p-4">
        <div className="container">
          <a href="/">
            <h1>
              Sun<span>Storage</span>
            </h1>
          </a>
          <div className="d-flex justify-content-end align-items-center">
            <div className="userText d-flex align-items-center">
              <p className="mb-0 me-2">Ciao, Marawan</p>
              <FontAwesomeIcon className="user_icon" icon={faCircleUser} />
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4 justify-content-center">
            <div className="col-12 col-md-11 bg-side-bar">
              <div className="d-flex flex-column  align-items-start p-2">
                <button className="nav-item btn p-0 mb-2">
                  <a href="/add-device" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
                    <p className="mb-0">Add device</p>
                  </a>
                </button>
                <div className="spacer"></div>
                <button className="nav-item btn p-0 mb-2">
                  <a href="/view-all" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faTableList} className="mr-2" />
                    <p className="mb-0">View all</p>
                  </a>
                </button>
                <div className="spacer"></div>
                <button className="logout-btn nav-item btn p-0">
                  <a href="/login" className="d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="mr-2"
                    />
                    <p className="mb-0">Logout</p>
                  </a>
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <div className="col-12 bg-content p-3">
              <p>Welcome to SunStorage choose an option</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
