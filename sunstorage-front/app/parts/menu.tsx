import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faRightFromBracket,
  faTableList,
  faCirclePlus,
  faCancel,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";

export default function Menu(){
	return (
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
                  <a href="/departments\" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faTableList} className="mr-2" />
                    <p className="mb-0">Departments</p>
                  </a>
                </button>
                <div className="spacer"></div>
                <button className="nav-item btn p-0 mb-2">
                  <a href="/view-all\" className="d-flex align-items-center">
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
	);
}