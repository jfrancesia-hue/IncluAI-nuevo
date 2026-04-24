// One-off: corre la migración 003-schema-v21.sql contra DATABASE_URL.
// Uso: node --env-file=.env.local scripts/run-migration-003.mjs
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const sqlPath = path.resolve('supabase/migrations/003-schema-v21.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

try {
  await client.connect();
  console.log('Conectado. Ejecutando migración...');
  await client.query(sql);
  console.log('Migración aplicada OK.');

  // Verificación: que las dos columnas nuevas existen
  const check = await client.query(`
    SELECT column_name, data_type
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'consultas'
       AND column_name IN ('respuesta_ia_estructurada','version_schema')
     ORDER BY column_name;
  `);
  console.log('Columnas verificadas:');
  console.table(check.rows);
} catch (err) {
  console.error('ERROR al correr la migración:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
