const fs = require('fs');
const path = require('path');
const parquet = require('parquet-wasm');

// Create sample data
const data = [];
for (let i = 0; i < 1000; i++) {
  data.push({
    id: i,
    name: `Person ${i}`,
    age: Math.floor(Math.random() * 100),
    salary: Math.random() * 100000,
    department: ['Engineering', 'Sales', 'Marketing', 'HR'][Math.floor(Math.random() * 4)],
    active: Math.random() > 0.2
  });
}

// Define schema
const schema = {
  id: { type: 'INT32' },
  name: { type: 'UTF8' },
  age: { type: 'INT32' },
  salary: { type: 'DOUBLE' },
  department: { type: 'UTF8' },
  active: { type: 'BOOL' }
};

async function writeParquet() {
  const filePath = path.join(__dirname, 'sample.parquet'); // Ensure the path is correct
  const writer = await parquet.ParquetWriter.openFile(schema, filePath);
  await writer.writeRows(data);
  await writer.close();
  console.log('Created sample.parquet with', data.length, 'rows');
}

writeParquet().catch(console.error); 