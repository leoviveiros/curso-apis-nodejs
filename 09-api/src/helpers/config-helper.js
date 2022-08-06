import { config } from 'dotenv';
import { join, resolve } from 'path';
import { ok } from 'assert';

export function loadConfig() {
    const env = process.env.NODE_ENV || 'dev';

    ok(env === 'dev' || env === 'prod', 'Environment is not "dev" or "prod".');

    const configPath = join(resolve(), './src/config', `.env.${env}`);

    return config({ path: configPath });
}