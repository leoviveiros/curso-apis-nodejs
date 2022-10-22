import { BaseRoute } from "./base-route.js";
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export class UtilRoutes extends BaseRoute {

    coverage() {
        return {
            path: '/coverage/{param*}',
            method: 'GET',
            config: {
                auth: false,
            },
            handler: {
                directory: {
                    path: join(dirname(fileURLToPath(import.meta.url)), '../../coverage'),
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    }
}
