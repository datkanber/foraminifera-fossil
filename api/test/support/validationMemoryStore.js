// Isolated software-test store. Never import from the production application.
class MemoryStore {
  constructor() { this.records = new Map(); this.tail = Promise.resolve(); }
  adapter(records) {
    return {
      get: async (type, id) => structuredClone(records.get(`${type}:${id}`) || null),
      list: async type => [...records].filter(([key]) => key.startsWith(`${type}:`)).map(([, value]) => structuredClone(value)),
      put: async (type, id, value) => { records.set(`${type}:${id}`, structuredClone(value)); },
      remove: async (type, id) => { records.delete(`${type}:${id}`); }
    };
  }
  async init() {}
  async read(fn) { await this.tail; return fn(this.adapter(this.records)); }
  transaction(fn) {
    const run = this.tail.then(async () => { const next = structuredClone(this.records); const result = await fn(this.adapter(next)); this.records = next; return result; });
    this.tail = run.catch(() => {}); return run;
  }
}
module.exports = { MemoryStore };
