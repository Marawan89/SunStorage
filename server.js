const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

var path = "./src/server/routes/";

// rotte da importare
const departmentRoutes = require(path + "department");
const deviceRoutes = require(path + "device");
const deviceAssignmentRoutes = require(path + "deviceAssignment");
const deviceLogRoutes = require(path + "deviceLog");
const deviceSpecificRoutes = require(path + "deviceSpecific");
const devicetypesRoutes = require(path + "devicetypes");
const deviceWarrantyRoutes = require(path + "devicewarranty");
const userRoutes = require(path + "user");
const devicesOverviewRoutes = require(path + "devicesOverview");
const deviceSpecificsInputsRoutes = require(path + "devicespecificsinputs");

// use routes
app.use("/api/devices/overview", devicesOverviewRoutes);

app.use("/api/devices", deviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/deviceassignments", deviceAssignmentRoutes);
app.use("/api/devicelogs", deviceLogRoutes);
app.use("/api/devicespecifics", deviceSpecificRoutes);
app.use("/api/devicetypes", devicetypesRoutes);
app.use("/api/devicewarranties", deviceWarrantyRoutes);
app.use("/api/devicespecificsinputs", deviceSpecificsInputsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
