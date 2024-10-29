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

    // solo se il valore non è vuoto
    if (value.trim() !== "") {
      updatedInputs[index].values[valueIndex] = value;
    }
    setInputs(updatedInputs);
  };

  const handleAddValue = (index: number) => {
    // solo se l'ultimo valore non è vuoto
    const updatedInputs = [...inputs];
    const lastValue =
      updatedInputs[index].values[updatedInputs[index].values.length - 1];
    if (lastValue?.trim() !== "") {
      updatedInputs[index].values.push("");
      setInputs(updatedInputs);
    } else {
      alert("Non puoi aggiungere un valore vuoto.");
    }
  };

  const handleRemoveValue = (index: number, valueIndex: number) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].values = updatedInputs[index].values.filter(
      (_, i) => i !== valueIndex
    );
    setInputs(updatedInputs);
  };

  async function submit() {
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

    // ogni input deve avere un nome, un'etichetta, e soddisfi le condizioni specifiche per 'select', 'text', e 'number'
    for (let input of inputs) {
      if (!input.name || !input.label) {
        alert("Ogni input deve avere un nome e un'etichetta.");
        return;
      }
      if (input.type === "choose") {
        alert("Devi scegliere un tipo di input valido (text, number, select).");
        return;
      }
      if (input.type === "select" && input.values.length < 2) {
        alert(
          "Se il tipo di input è 'select', devi aggiungere almeno due valori."
        );
        return;
      }
      if (
        input.type === "select" &&
        input.values.some((v) => v.trim() === "")
      ) {
        alert(
          "I valori per il tipo di input 'select' non possono essere vuoti."
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

  const resetPage = () => {
    window.location.href = "/device-types";
  };

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
                  <h2>Aggiungi tipo di dispositivo</h2>
                  <div className="spacer"></div>
                  Nome del tipo di device
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="device_type_name"
                    value={deviceTypeName}
                    onChange={(e) => setDeviceTypeName(e.target.value)}
                  />
                  {inputs.map((input, index) => (
                    <div key={index} className="mt-4 border p-3">
                      Scrivere il nome dell'input che sarà visibile nel db (es.
                      LAPTOP_DISK_TYPE)
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={input.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                      />
                      Scrivere la label dell'input che sarà visibile nella
                      pagina
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={input.label}
                        onChange={(e) =>
                          handleInputChange(index, "label", e.target.value)
                        }
                      />
                      Scegli il tipo dell'input
                      <select
                        className="form-control mb-2"
                        value={input.type}
                        onChange={(e) =>
                          handleInputChange(index, "type", e.target.value)
                        }
                      >
                        <option value="choose">Scegli un'opzione...</option>
                        <option value="text">Testo</option>
                        <option value="number">Numero</option>
                        <option value="select">Select</option>
                      </select>
                      {(input.type === "text" || input.type === "number") && (
                        <>
                          Scrivere il placeholder
                          <input
                            type="text"
                            className="form-control mb-2"
                            value={input.placeholder}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "placeholder",
                                e.target.value
                              )
                            }
                          />
                        </>
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
                                Elimina
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
                          Aggiungi valore
                        </button>
                      )}
                      <div>
                        <button
                          className="btn btn-danger mt-2"
                          type="button"
                          onClick={() => handleRemoveInput(index)}
                        >
                          Elimina input
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-12 mt-3">
                  <button
                    className="btn btn-light"
                    type="button"
                    onClick={handleAddInput}
                  >
                    Aggiungi input
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success m-2"
                    onClick={submit}
                  >
                    Salva dati
                  </button>
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    onClick={resetPage}
                  >
                    Cancella
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
