import { Crud } from './base/crud.js';

export class ProstgresDB extends Crud {
    constructor() {
        super();
    }

    create(item) {
        console.log('ProstgresDB create');
    }
}