require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authMiddleware = require("./src/server/middleware/authMiddleware");
const cors = require("cors");
const app = express();

// middleware
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
   origin: 'http://localhost:3000',
   credentials: true
}));
 

var path = "./src/server/routes/";

// rotte da importare
const departmentRoutes = require(path + "department");
const deviceRoutes = require(path + "device");
const deviceAssignmentRoutes = require(path + "deviceAssignment");
const deviceLogRoutes = require(path + "deviceLog");
const deviceSpecificRoutes = require(path + "devicespecific");
const devicetypesRoutes = require(path + "devicetypes");
const deviceWarrantyRoutes = require(path + "devicewarranty");
const userRoutes = require(path + "user");
const devicesOverviewRoutes = require(path + "devicesOverview");
const deviceSpecificsInputsRoutes = require(path + "devicespecificsinputs");
const authRoutes = require(path + "auth");

const devicesCount = require(path+"dashboard");

app.use("/api/devices/overview", devicesOverviewRoutes);
app.use("/api/devices/dashboard", authMiddleware, devicesCount);

// Applicare authMiddleware solo alle rotte sotto "/api/devices" e "/api/users"
app.use("/api/devices", authMiddleware, deviceRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/departments", authMiddleware, departmentRoutes);
app.use("/api/deviceassignments", authMiddleware, deviceAssignmentRoutes);
app.use("/api/devicelogs", authMiddleware, deviceLogRoutes);
app.use("/api/devicespecifics", authMiddleware, deviceSpecificRoutes);
app.use("/api/devicetypes", authMiddleware, devicetypesRoutes);
app.use("/api/devicewarranties", authMiddleware, deviceWarrantyRoutes);
app.use("/api/devicespecificsinputs", authMiddleware, deviceSpecificsInputsRoutes);

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

