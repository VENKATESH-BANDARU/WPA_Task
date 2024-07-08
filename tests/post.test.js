const request = require('supertest');
const app = require('../server');
const { sequelize, User } = require('../models/index.model');

let token;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    await request(app)
        .post('/api/auth/register')
        .send({
            email: 'editor@example.com',
            password: 'password',
        });

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'editor@example.com',
            password: 'password',
        });

    token = res.body.token;
});

describe('Post API', () => {
    it('should create a post', async () => {
        const res = await request(app)
            .post('/api/v1/post')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Post',
                content: 'This is a test post.',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('title', 'Test Post');
    });

    it('should get all posts', async () => {
        const res = await request(app)
            .get('/api/v1/post')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});