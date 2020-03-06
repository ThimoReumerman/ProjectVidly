const request = require('supertest');
const mongoose = require('mongoose');
const {User} = require('../../../models/user');
const adminToken = require('../adminToken');

describe('/api/users', () => {
    let server;
    let user;
    let token;

    beforeEach(async() => {
        server = require('../../../index'); 

        token = adminToken;

        user = new User({
            name: 'UserName',
            email: 'email@email.com',
            password: 'SecurePassword'
        });

        await user.save();
    });

    afterEach(async() => {
        await server.close();
        await User.remove({});
    });

    describe('POST /', () => {
        let name;
        let email;
        let password;        
        
        beforeEach(async () => {
            name = '123';
            email = '12345';
            password = '12345';
        });
    
        const exec = () => {
            return request(server)
                .post('/api/users')
                .set('x-auth-token', token)
                .send({name, email, password});
        }

        it('should return 400 if name is not provided', async() => {
            name = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 400 if name is less than 3 characters', async() => {
            name = '12';
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 400 if name is more than 50 characters', async() => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 400 if email is not provided', async() => {
            email = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 400 if email is less than 5 characters', async() => {
            email = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 400 if email is more than 255 characters', async() => {
            email = new Array(257).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 400 if password is not provided', async() => {
            password = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 400 if password is less than 5 characters', async() => {
            password = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 400 if password is more than 255 characters', async() => {
            password = new Array(257).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 400 if user is already registered', async() => {
            email = 'email@email.com';
            const res = await exec();
            expect(res.status).toBe(400);
        });
    
        it('should return 200 if user is valid', async() => {
            const res = await exec();
            expect(res.status).toBe(200);
        });
    });
});