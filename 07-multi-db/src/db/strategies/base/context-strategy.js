export class ContextStrategy {
    constructor(strategy) {
        this.strategy = strategy;
    }

    create(item) {
        return this.strategy.create(item);
    }

    read(query) {
        return this.strategy.read(query);
    }

    update(id, item) {
        return this.strategy.update(id, item);
    }

    delete(id) {
        return this.strategy.delete(id);
    }
}