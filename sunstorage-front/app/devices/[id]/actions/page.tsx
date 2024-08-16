"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import "./style.css";

export default function Actions() {
  const params = useParams();

  const idDevice = params.id;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-6">
            <div className="box d-flex flex-column justify-content-center align-items-center">
              <a
                className="p-3 btn btn-success"
                href={`assign`}
              >
                Assegna
              </a>
              <button className="p-3 btn btn-success">Rientra</button>
              <button className="p-3 btn btn-success">Dismetti</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
