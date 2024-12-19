import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entities/User';
import { Roles } from '../../src/constants';
import { isJwt } from '../utils';
// import { truncateTable } from '../utils';

describe('POST /auth/register', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // database truncate
    // await truncateTable(connection);
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    //database close
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return the 201 status code', async () => {
      //AAA
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
        // role: 'customer',
      };

      //Act
      const response = await request(app).post('/auth/register').send(userData);

      //Assert
      expect(response.statusCode).toBe(201);
    });

    it('should return valid json response', async () => {
      //AAA
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
        // role: 'customer',
      };

      //Act
      const response = await request(app).post('/auth/register').send(userData);

      //Assert
      expect(response.header['content-type']).toEqual(
        expect.stringContaining('json'),
      );
    });

    it('should persist the user in database', async () => {
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
      };

      //Act
      await request(app).post('/auth/register').send(userData);

      //Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find(); //fetch the table data
      expect(users).toHaveLength(1);
      expect(users[0]?.firstName).toBe(userData.firstName);
      expect(users[0]?.lastName).toBe(userData.lastName);
      expect(users[0]?.email).toBe(userData.email);
    });

    it('should return an id of the created user', async () => {
      const userPayload = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userPayload);

      expect(response.status).toBe(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBeDefined();
      expect(response.body.message).toBe('user created!!');
    });

    it('should assign a customer role', async () => {
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
      };

      //Act
      await request(app).post('/auth/register').send(userData);

      //Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find(); //fetch the table data

      expect(users[0]).toHaveProperty('role');
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it('should store the hashed password in the database', async () => {
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
      };

      //Act
      await request(app).post('/auth/register').send(userData);

      //Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find(); //fetch the table data
      expect(users[0].password).not.toBe(userData.password);

      // $2b$10$P7XmW85oYjqCXTbALOZsM.bzXdo1qbuQIBldVJrvr9XBTALOYGDCC
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/); //check pattern of hash password `$2b$10$`
    });

    it('should return 400 status code if email already exists', async () => {
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
      };
      const userRepository = connection.getRepository(User);
      await userRepository.save({ ...userData, role: Roles.CUSTOMER });

      //Act
      const response = await request(app).post('/auth/register').send(userData);
      const users = await userRepository.find();

      //Assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });

    it('should return the access token and refresh token inside a cookie', async () => {
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
      };

      //Act
      const response = await request(app).post('/auth/register').send(userData);

      interface Headers {
        'set-cookie': string[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      }
      // Assert
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      const cookies = (response.headers as Headers)['set-cookie'] || [];
      // accessToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjkzOTA5Mjc2LCJleHAiOjE2OTM5MDkzMzYsImlzcyI6Im1lcm5zcGFjZSJ9.KetQMEzY36vxhO6WKwSR-P_feRU1yI-nJtp6RhCEZQTPlQlmVsNTP7mO-qfCdBr0gszxHi9Jd1mqf-hGhfiK8BRA_Zy2CH9xpPTBud_luqLMvfPiz3gYR24jPjDxfZJscdhE_AIL6Uv2fxCKvLba17X0WbefJSy4rtx3ZyLkbnnbelIqu5J5_7lz4aIkHjt-rb_sBaoQ0l8wE5KzyDNy7mGUf7cI_yR8D8VlO7x9llbhvCHF8ts6YSBRBt_e2Mjg5txtfBaDq5auCTXQ2lmnJtMb75t1nAFu8KwQPrDYmwtGZDkHUcpQhlP7R-y3H99YnrWpXbP8Zr_oO67hWnoCSw; Max-Age=43200; Domain=localhost; Path=/; Expires=Tue, 05 Sep 2023 22:21:16 GMT; HttpOnly; SameSite=Strict
      cookies.forEach((cookie) => {
        if (cookie.startsWith('accessToken=')) {
          accessToken = cookie.split(';')[0].split('=')[1];
        }

        if (cookie.startsWith('refreshToken=')) {
          refreshToken = cookie.split(';')[0].split('=')[1];
        }
      });
      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();

      // check jwt token
      expect(isJwt(accessToken)).toBeTruthy();
      expect(isJwt(refreshToken)).toBeTruthy();
    });
  });

  describe('Field are missing', () => {
    it('should return 400 status code if email field is missing', async () => {
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: '',
        password: 'Parth@123',
      };

      //Act
      const response = await request(app).post('/auth/register').send(userData);

      //Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it('should return 400 status code if firstName field is missing', async () => {
      // Arrange
      const userData = {
        firstName: '',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
      };

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
    it('should return 400 status code if lastName field is missing', async () => {
      // Arrange
      const userData = {
        firstName: 'Parth',
        lastName: '',
        email: 'BxPnM@example.com',
        password: 'Parth@123',
      };

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
    it('should return 400 status code if password field is missing', async () => {
      // Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: '',
      };

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
  });

  describe('fields are not in proper format', () => {
    it('should trim the email field', async () => {
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: ' BxPnM@example.com ',
        password: 'Parth@123',
      };

      //Act
      await request(app).post('/auth/register').send(userData);

      //Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find(); //fetch the table data
      expect(users[0].email).toBe('BxPnM@example.com');
    });

    it('should return 400 status code if email is a not valid', async () => {
      // Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnMexample.com', // Invalid email format
        password: 'Parth@123',
      };

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
    it('should return 400 status code if password length is less than 8 and alpha-numeric and mustbe atleast one special character and one capital letter', async () => {
      // Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: 'parth@123', // Invalid password format (less than 8 characters)
      };

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
    it('should return an array of error messages if email is missing', async () => {
      // Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: '', // Missing email
        password: 'Parth@123',
      };

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.body).toHaveProperty('errors');
      expect(
        (response.body as Record<string, string>).errors.length,
      ).toBeGreaterThan(0);
    });
  });
});
