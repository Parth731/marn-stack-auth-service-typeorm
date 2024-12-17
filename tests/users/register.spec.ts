import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
  describe('Given all fields', () => {
    it('should return the 201 status code', async () => {
      //AAA
      //Arrange
      const userData = {
        firstName: 'Parth',
        lastName: 'Dangroshiya',
        email: 'BxPnM@example.com',
        password: '123456',
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
        password: '123456',
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
        password: '123456',
      };

      //Act
      await request(app).post('/auth/register').send(userData);

      //Assert
    });
  });
});
