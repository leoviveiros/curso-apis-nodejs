class NotImplementedException extends Error {
    constructor() {
        super('Not implemented');
    }
}

export class Crud {
    create(item) {
        throw new NotImplementedException();
    }

    read(query, skip, limit) {
        throw new NotImplementedException();
    }

    update(id, item) {
        throw new NotImplementedException();
    }

    delete(id) {
        throw new NotImplementedException();
    }

    isConnected() {
        throw new NotImplementedException();
    }

    disconnect() {
        throw new NotImplementedException();
    }

}