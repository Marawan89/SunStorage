"use client";

import React, { useState } from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";
import apiendpoint from "../../../../apiendpoint";
import { withAuth } from "../../../../src/server/middleware/withAuth";

interface InputField {
  name: string;
  label: string;
  type: string;
  values: string[];
  placeholder: string;
}

function CreateDeviceTypes() {
  const [inputs, setInputs] = useState<InputField[]>([]);
  const [deviceTypeName, setDeviceTypeName] = useState<string>("");

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      { name: "", label: "", type: "choose", values: [], placeholder: "" },
    ]);
  };

  const handleRemoveInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: keyof InputField,
    value: string
  ) => {
    const updatedInputs = [...inputs];
    updatedInputs[index][field] = value;
    setInputs(updatedInputs);
  };

  const handleValueChange = (
    index: number,
    valueIndex: number,
    value: string
  ) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].values[valueIndex] = value;
    setInputs(updatedInputs);
  };

  const handleAddValue = (index: number) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].values.push("");
    setInputs(updatedInputs);
  };

  const handleRemoveValue = (index: number, valueIndex: number) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].values = updatedInputs[index].values.filter(
      (_, i) => i !== valueIndex
    );
    setInputs(updatedInputs);
  };

  async function activateLasers() {
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (!deviceTypeName || !regex.test(deviceTypeName)) {
      alert(
        "Il nome del tipo di device non può essere vuoto o contenere solo caratteri speciali."
      );
      return;
    }

    if (inputs.length === 0) {
      alert("Devi aggiungere almeno un input per il tipo di device.");
      return;
    }

    // Verifica che ogni input abbia un nome, un'etichetta, e soddisfi le condizioni specifiche per 'select', 'text', e 'number'
    for (let input of inputs) {
      if (!input.name || !input.label) {
        alert("Ogni input deve avere un nome e un'etichetta.");
        return;
      }
      if (input.type === "select" && input.values.length < 2) {
        alert(
          "Se il tipo di input è 'select', devi aggiungere almeno due valori."
        );
        return;
      }
      if (
        (input.type === "text" || input.type === "number") &&
        !input.placeholder
      ) {
        alert(
          "I campi di tipo 'text' e 'number' non possono essere lasciati vuoti."
        );
        return;
      }
    }

    try {
      const resAdd = await fetch(`${apiendpoint}api/devicetypes`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: deviceTypeName, inputs }),
        credentials: "include",
      });
      const dataAdd = await resAdd.json();

      if (dataAdd.id) {
        alert("Inserimento riuscito");
        window.location.href = "/device-types";
      } else {
        alert(dataAdd.error);
      }
    } catch (error) {
      console.error("Errore durante l'inserimento del tipo di device:", error);
      alert("Errore durante l'inserimento del tipo di device");
    }
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
                  <h3>Add Device Type</h3>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="device_type_name"
                    placeholder="Device type name"
                    value={deviceTypeName}
                    onChange={(e) => setDeviceTypeName(e.target.value)}
                  />

                  <button
                    className="btn btn-light mt-3"
                    type="button"
                    onClick={handleAddInput}
                  >
                    Add Input
                  </button>

                  {inputs.map((input, index) => (
                    <div key={index} className="mt-4 border p-3">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Input Name"
                        value={input.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Input Label"
                        value={input.label}
                        onChange={(e) =>
                          handleInputChange(index, "label", e.target.value)
                        }
                      />
                      <select
                        className="form-control mb-2"
                        value={input.type}
                        onChange={(e) =>
                          handleInputChange(index, "type", e.target.value)
                        }
                      >
                        <option value="choose">Choose an input type...</option>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                      </select>

                      {(input.type === "text" || input.type === "number") && (
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Placeholder"
                          value={input.placeholder}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "placeholder",
                              e.target.value
                            )
                          }
                        />
                      )}

                      {input.type === "select" &&
                        input.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Value"
                              value={value}
                              onChange={(e) =>
                                handleValueChange(
                                  index,
                                  valueIndex,
                                  e.target.value
                                )
                              }
                            />
                            <div className="input-group-append">
                              <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() =>
                                  handleRemoveValue(index, valueIndex)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}

                      {input.type === "select" && (
                        <button
                          className="btn btn-light"
                          type="button"
                          onClick={() => handleAddValue(index)}
                        >
                          Add Value
                        </button>
                      )}
                      <div>
                        <button
                          className="btn btn-danger mt-2"
                          type="button"
                          onClick={() => handleRemoveInput(index)}
                        >
                          Delete Input
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-12 mt-3">
                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={activateLasers}
                  >
                    Save
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

export default withAuth(CreateDeviceTypes);
