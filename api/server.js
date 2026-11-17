require("dotenv").config();

const app = require("./src/app");
const { driver } = require("./src/db/neo4j");
const { Neo4jValidationStore } = require("./src/validation/store");
const { ValidationAuth } = require("./src/validation/auth");

const PORT = process.env.PORT || 5000;

async function bootstrapValidationAdmin() {
  const login = process.env.VALIDATION_BOOTSTRAP_LOGIN;
  const password = process.env.VALIDATION_BOOTSTRAP_PASSWORD;
  if (login === undefined && password === undefined) return;
  if (!login || !password) throw new Error("VALIDATION_BOOTSTRAP_LOGIN and VALIDATION_BOOTSTRAP_PASSWORD must be set together");

  const store = new Neo4jValidationStore(driver, process.env.VALIDATION_NEO4J_DATABASE);
  await store.init();
  const normalizedLogin = login.toLowerCase();
  const existing = await store.read(async tx => {
    const entry = await tx.get("login", normalizedLogin);
    return entry ? tx.get("user", entry.userId) : null;
  });
  if (existing) {
    if (existing.role !== "COORDINATOR") throw new Error(`Bootstrap login "${normalizedLogin}" belongs to a non-coordinator account`);
    console.log(`Validation coordinator "${normalizedLogin}" already exists; bootstrap skipped.`);
    return;
  }

  await new ValidationAuth(store).createAdmin(login, password);
  console.log(`Validation coordinator "${normalizedLogin}" created from bootstrap settings.`);
}

bootstrapValidationAdmin()
  .then(() => {
    app.listen(PORT, "0.0.0.0", function () {
      console.log(`Foraminifera Fossil API is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error(`API startup failed: ${error.message}`);
    driver.close().catch(closeError => console.error(`Neo4j driver shutdown failed: ${closeError.message}`));
    process.exitCode = 1;
  });