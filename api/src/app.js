const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const diagnoseRoutes = require("./routes/diagnoseRoutes");
const vlmRoutes = require("./routes/vlmRoutes");
const taxonRoutes = require("./routes/taxonRoutes");

const app = express();

const { Neo4jValidationStore } = require('./validation/store');
const { createValidationRouter } = require('./validation/routes');
const { driver } = require('./db/neo4j');
if (process.env.VALIDATION_TRUST_PROXY_HOPS) app.set('trust proxy', Number(process.env.VALIDATION_TRUST_PROXY_HOPS));
// Private routes precede the public API's permissive CORS and JSON parser.
app.use('/api/expert-validation', createValidationRouter(new Neo4jValidationStore(driver, process.env.VALIDATION_NEO4J_DATABASE)));

app.use(cors());
app.use(express.json({ limit: "12mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/diagnose", diagnoseRoutes);
app.use("/api/vlm", vlmRoutes);
app.use("/api/taxa", taxonRoutes);

module.exports = app;
