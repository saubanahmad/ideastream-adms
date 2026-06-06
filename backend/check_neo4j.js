require('dotenv').config();
const neo4j = require('neo4j-driver');

async function check() {
  const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));
  const session = driver.session();
  try {
    const res1 = await session.run('SHOW CONSTRAINTS');
    console.log("CONSTRAINTS:");
    res1.records.forEach(r => console.log(r.toObject()));
    
    const res2 = await session.run('SHOW INDEXES');
    console.log("INDEXES:");
    res2.records.forEach(r => console.log(r.toObject()));
  } catch (err) {
    console.error(err);
  } finally {
    await session.close();
    await driver.close();
  }
}
check();
