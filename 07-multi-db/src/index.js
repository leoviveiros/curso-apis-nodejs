import { ContextStrategy } from './db/strategies/base/context-strategy.js'
import { MongoDB } from './db/strategies/mongodb.js';
import { ProstgresDB } from './db/strategies/postgres.js';

const contextMongo = new ContextStrategy(new MongoDB());
contextMongo.create({ name: 'MongoDB' });

const contextProstgres = new ContextStrategy(new ProstgresDB());
contextProstgres.create({ name: 'ProstgresDB' });