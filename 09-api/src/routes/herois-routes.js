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
            handler: (request) => {
                try {
                    const { skip, limit, nome } = request.query;
                    const query = nome ? { nome } : undefined;

                    return this.db.read(query, skip, limit);
                } catch (error) {
                    console.error(error);
                    return 'Erro ao listar os heróis';
                }
            }
        }
    }
}