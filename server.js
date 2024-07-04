const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

// rotte da importare
const departmentRoutes = require('./server/routes/department'); //
const deviceRoutes = require('./server/routes/device'); //
const deviceAssignmentRoutes = require('./server/routes/deviceassignment')
const deviceLogRoutes = require('./server/routes/devicelog');
const deviceSpecificRoutes = require('./server/routes/devicespecific');
const deviceTypeRoutes = require('./server/routes/devicetype');
const deviceWarrantyRoutes = require('./server/routes/devicewarranty');
const userRoutes = require('./server/routes/user');

// use routes
app.use('/api/departments', departmentRoutes); //
app.use('/api/devices', deviceRoutes); //
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
