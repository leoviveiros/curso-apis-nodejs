import { Crud } from './base/crud.js';

export class MongoDB extends Crud {
    constructor() {
        super();
    }

    create(item) {
        console.log('MongoDB create');
    }
}