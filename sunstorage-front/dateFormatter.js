const formatDate = (datetime_string) => {
  const date = new Date(datetime_string);

  // Estrai i componenti della data
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // I mesi sono zero-indicizzati (0-11)
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  // Combina i componenti in una stringa nel formato desiderato
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

module.exports = formatDate;
