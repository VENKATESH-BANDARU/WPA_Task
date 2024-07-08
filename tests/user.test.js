const request = require('supertest');
const app = require('../server');
const { sequelize, User } = require('../models/index.model');

let token;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    await request(app)
        .post('/api/v1/register')
        .send({
            email: 'admin@example.com',
            password: 'password',
        });

    const res = await request(app)
        .post('/api/v1/login')
        .send({
            email: 'admin@example.com',
            password: 'password',
        });

    token = res.body.token;
});

describe('User API', () => {
    it('should get all users', async () => {
        const res = await request(app)
            .get('/api/v1/user')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});