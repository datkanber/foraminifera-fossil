// Validation records are isolated from the public ontology graph. All mutations
// use one database lock: appropriate for a two-observer study and safe across
// multiple API processes. No process-local state is used for research records.
class Neo4jValidationStore {
  constructor(driver, database) { this.driver = driver; this.database = database; }
  async init() {
    const session = this.driver.session(this.database ? { database: this.database } : {});
    try {
      await session.run('CREATE CONSTRAINT ev_record_key IF NOT EXISTS FOR (n:EVRecord) REQUIRE n.key IS UNIQUE');
      await session.run('CREATE CONSTRAINT ev_mutex_key IF NOT EXISTS FOR (n:EVMutex) REQUIRE n.key IS UNIQUE');
      await session.run("MERGE (n:EVMutex {key: 'validation'}) ON CREATE SET n.sequence = 0");
    } finally { await session.close(); }
  }
  adapter(tx) {
    return {
      get: async (type, id) => {
        const result = await tx.run('MATCH (n:EVRecord {key: $key}) RETURN n.payload AS payload', { key: `${type}:${id}` });
        return result.records.length ? JSON.parse(result.records[0].get('payload')) : null;
      },
      list: async type => {
        const result = await tx.run('MATCH (n:EVRecord {type: $type}) RETURN n.payload AS payload ORDER BY n.key', { type });
        return result.records.map(r => JSON.parse(r.get('payload')));
      },
      put: async (type, id, value) => {
        await tx.run('MERGE (n:EVRecord {key: $key}) SET n.type = $type, n.payload = $payload',
          { key: `${type}:${id}`, type, payload: JSON.stringify(value) });
      },
      remove: async (type, id) => { await tx.run('MATCH (n:EVRecord {key: $key}) DELETE n', { key: `${type}:${id}` }); }
    };
  }
  async read(fn) {
    const session = this.driver.session(this.database ? { database: this.database } : {});
    try { return await session.executeRead(tx => fn(this.adapter(tx))); }
    finally { await session.close(); }
  }
  async transaction(fn) {
    const session = this.driver.session(this.database ? { database: this.database } : {});
    try {
      return await session.executeWrite(async tx => {
        const lock = await tx.run("MATCH (n:EVMutex {key: 'validation'}) SET n.sequence = n.sequence + 1 RETURN n.sequence");
        if (!lock.records.length) throw new Error('Validation schema missing; run npm run validation:admin -- migrate');
        return fn(this.adapter(tx));
      });
    } finally { await session.close(); }
  }
}
module.exports = { Neo4jValidationStore };
