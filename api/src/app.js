const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const diagnoseRoutes = require("./routes/diagnoseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/diagnose", diagnoseRoutes);

module.exports = app;