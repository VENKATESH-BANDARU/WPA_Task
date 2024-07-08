const request = require('supertest');
const app = require('../index');
const { sequelize, User } = require('../models');

let token;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    await request(app)
        .post('/api/auth/register')
        .send({
            email: 'admin@example.com',
            password: 'password',
        });

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'admin@example.com',
            password: 'password',
        });

    token = res.body.token;
});

describe('User API', () => {
    it('should get all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});