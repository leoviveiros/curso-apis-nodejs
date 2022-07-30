import { equal, ok } from 'assert';

import _api from '../api.js';

describe('Auth Herois test', () => {

    let api;
    const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjU4NjA3MTEyfQ.KYfbRBwUw3hC6XiPysUDbO3RZynCugV0dETZoN--ovw';

    before(async () => {
        api = await _api;
    });

    after(async () => {
        await api.stop();
    });

    it('deve obter um token', async () => {
        const result = await api.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'admin',
                password: '123'
            }
        });

        const { statusCode, payload } = result;

        equal(statusCode, 200);

        const token = JSON.parse(payload).token;
        
        ok(token);
        ok(token.length > 10);
    })

});