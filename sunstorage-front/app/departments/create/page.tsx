"use client"

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
import Menu  from "../../parts/menu";
import Navbar from "../../parts/navbar";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";

export default function Home() {

  function activateLasers(){
      fetch('http://localhost:4000/api/departments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: document.getElementById('name_department').value
        })
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.id){
          //inserimento andato a buon fine
          alert('inserimento andato a buon fine');
        }else{
          //errore inserimento
          alert('errore inserimento');
        }
      })
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
                  <input type="text" name="name" className="form-control" id="name_department" />
                </div>
                <div className="col-12 mt-3">
                  <button className="btn btn-success" onClick={activateLasers}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
