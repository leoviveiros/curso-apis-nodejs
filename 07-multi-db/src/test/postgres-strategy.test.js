import { equal } from 'assert';
import { PostgresDB } from '../db/strategies/postgres.js';
import { ContextStrategy } from '../db/strategies/base/context-strategy.js';

const context = new ContextStrategy(new PostgresDB());

describe('Postgres Strategy', () => {
    it('PostgreSQL Connection', async () => { 
        const actual = await context.isConnected();

        equal(actual, true);
    })
});