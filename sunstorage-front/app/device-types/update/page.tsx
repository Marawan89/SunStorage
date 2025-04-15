"use client";

import React, { useState, useEffect } from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
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
  toDelete?: boolean;
}

function UpdateDeviceType() {
  const [name, setName] = useState("");
  const [id, setId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<InputField[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const devicetypesId = urlParams.get("id");
    setId(devicetypesId);

    if (devicetypesId) {
      fetch(`${apiendpoint}api/devicetypes/${devicetypesId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setName(data.name);
          setInputs(data.inputs || []);
        });
    }
  }, []);

  const handleInputChange = (
    index: number,
    field: keyof InputField,
    value: string
  ) => {
    const updatedInputs = [...inputs];

    // Se stiamo cambiando il tipo di input a 'select', inizializziamo `values` come array vuoto
    if (field === "type" && value === "select") {
      updatedInputs[index].values = updatedInputs[index].values || []; // Inizializziamo solo se non esiste già
    }

    // Se il campo è "name", lo trasformiamo in maiuscolo e sostituiamo gli spazi con "_"
    if (field === "name") {
      updatedInputs[index][field] = value.toUpperCase().replace(/\s+/g, "_");
    } else {
      updatedInputs[index][field] = value;
    }

    setInputs(updatedInputs);
  };

  const handleValueChange = (
    index: number,
    valueIndex: number,
    value: string
  ) => {
    const updatedInputs = [...inputs];
    if (value.trim() !== "") {
      updatedInputs[index].values[valueIndex] = value;
    }
    setInputs(updatedInputs);
  };

  const handleAddValue = (index: number) => {
    const updatedInputs = [...inputs];
    const lastValue =
      updatedInputs[index].values[updatedInputs[index].values.length - 1];
    if (lastValue?.trim() !== "") {
      updatedInputs[index].values.push("");
      setInputs(updatedInputs);
    } else {
      alert("Hai lasciato il valore prima vuoto");
    }
  };

  const handleRemoveValue = (index: number, valueIndex: number) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].toDelete = true;
    updatedInputs[index].values = updatedInputs[index].values.filter(
      (_, i) => i !== valueIndex
    );
    setInputs(updatedInputs);
  };

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      { name: "", label: "", type: "text", values: [], placeholder: "" },
    ]);
  };

  const handleRemoveInput = (index: number) => {
    if (window.confirm("Sei sicuro di cancellare l'input?")) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const submit = () => {
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (!name || !regex.test(name)) {
      alert(
        "Il nome del tipo di device non può essere vuoto o contenere caratteri speciali."
      );
      return;
    }

    if (inputs.length === 0) {
      alert("Devi aggiungere almeno un input per il tipo di device.");
      return;
    }

    for (let input of inputs) {
      // Controllo che il nome dell'input inizi con il nome del tipo di device
      if (!input.name.startsWith(name.toUpperCase() + "_")) {
        alert(
          `Il nome dell'input deve essere composto da "${name.toUpperCase()}" seguito dal nome dell'input separato da "_"`
        );
        return;
      }

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

    if (id) {
      fetch(`${apiendpoint}api/devicetypes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          inputs: inputs.filter((input) => !input.toDelete),
        }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("Errore durante l'aggiornamento del tipo di device.");
          } else {
            alert("Device type aggiornato con successo");
            window.location.href = "/device-types";
          }
        })
        .catch((error) => {
          console.error("Errore:", error);
          alert("Errore durante l'aggiornamento del tipo di device.");
        });
    }
  };

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
                  <h2>Modifica tipo di dispositivo</h2>
                  <div className="spacer"></div>
                  Nome del tipo di device
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name_devicetypes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {inputs.map((input, index) => (
                    <div
                      key={index}
                      className={`mt-4 border border-3 p-3 ${
                        input.toDelete
                          ? "bg-secondary text-white opacity-50"
                          : "border-white"
                      }`}
                    >
                      Nome dell'input che sarà visibile nel db (es.
                      LAPTOP_DISK_TYPE)
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Nome dell'input"
                        value={input.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                      />
                      Label dell'input che sarà visibile nella pagina
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Label dell'input"
                        value={input.label}
                        onChange={(e) =>
                          handleInputChange(index, "label", e.target.value)
                        }
                      />
                      Tipo dell'input
                      <select
                        className="form-control mb-2"
                        value={input.type}
                        onChange={(e) =>
                          handleInputChange(index, "type", e.target.value)
                        }
                      >
                        <option value="text">Testo</option>
                        <option value="number">Numero</option>
                        <option value="select">Select</option>
                      </select>
                      {(input.type === "text" || input.type === "number") && (
                        <>
                          Placeholder
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
                        </>
                      )}
                      {input.type === "select" &&
                        input.values.map((value, valueIndex) => (
                          <>
                            <div key={valueIndex} className="input-group mb-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Add value of select"
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
                          </>
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
                        {!input.toDelete ? (
                          <button
                            className="btn btn-danger mt-2"
                            type="button"
                            onClick={() => handleRemoveInput(index)}
                          >
                            Elimina input
                          </button>
                        ) : (
                          <button
                            className="btn btn-warning mt-2"
                            type="button"
                            onClick={() => {
                              const updatedInputs = [...inputs];
                              updatedInputs[index].toDelete = false;
                              setInputs(updatedInputs);
                            }}
                          >
                            Annulla eliminazione
                          </button>
                        )}
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

export default withAuth(UpdateDeviceType);
