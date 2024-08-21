const pool = require('./db');

const writeLog = async (device_id, log_type, additional_notes) => {
   try {
     const [result] = await pool.query('INSERT INTO devicelogs (device_id, log_type, additional_notes, event_datetime) VALUES (?, ?, ?, NOW())', [device_id, log_type, additional_notes]);
      return true;
   } catch (error) {
     return false;
   }
}

module.exports = writeLog;