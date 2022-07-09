import { BaseRoute } from "./base-route.js";

export class HeroisRoutes extends BaseRoute {

    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: () => {
                return this.db.read();
            }
        }
    }
}