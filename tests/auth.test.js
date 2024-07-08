const request = require('supertest');
const app = require('../server');
const { sequelize, User } = require('../models/index.model');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Auth API', () => {
    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/v1/register')
            .send({
                email: 'test@example.com',
                password: 'password',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered. Check your email to verify your account.');

        const user = await User.findOne({ where: { email: 'test@example.com' } });
        expect(user).toBeTruthy();
        expect(user.email).toBe('test@example.com');
    });
});

describe('Auth API', () => {
    it('should login a user', async () => {
        await request(app)
            .post('/api/v1/register')
            .send({
                email: 'test@example.com',
                password: 'password',
            });

        const res = await request(app)
            .post('/api/v1/login')
            .send({
                email: 'test@example.com',
                password: 'password',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
        const res = await request(app)
            .post('/api/v1/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'wrongpassword',
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 401 if email is not verified', async () => {
        await request(app)
            .post('/api/v1/register')
            .send({
                email: 'test@example.com',
                password: 'password',
            });

        const res = await request(app)
            .post('/api/v1/login')
            .send({
                email: 'test@example.com',
                password: 'password',
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Email is not verified');
    });
});