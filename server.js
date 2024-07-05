const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

var path = './src/server/routes/'

// rotte da importare
const departmentRoutes = require(path + 'department');
const deviceRoutes = require(path + 'device');
const deviceAssignmentRoutes = require(path + 'deviceAssignment');
const deviceLogRoutes = require(path + 'deviceLog');
const deviceSpecificRoutes = require(path + 'deviceSpecific');
const deviceTypeRoutes = require(path + 'devicetype');
const deviceWarrantyRoutes = require(path + 'devicewarranty');
const userRoutes = require(path + 'user');

// use routes
app.use('/api/departments', departmentRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/deviceassignments', deviceAssignmentRoutes);
app.use('/api/devicelogs', deviceLogRoutes);
app.use('/api/devicespecifics', deviceSpecificRoutes);
app.use('/api/devicetypes', deviceTypeRoutes);
app.use('/api/devicewarranties', deviceWarrantyRoutes);
app.use('/api/users', userRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
