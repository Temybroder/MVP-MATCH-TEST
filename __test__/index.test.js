
const express = require('express');
const app = express();
const routes = require('../api/v1/routes');
app.use(express.json());
app.use('/', routes);

const request = require('supertest')

describe('testing mvp match test endpoints', () => {
   it('returns status code 200 if deposit route successful', async () => {
       const serverResponse = await request(app)
       .get('/deposit')
       expect(serverResponse.statusCode).toEqual(200)
   });

   it('returns status code 200 if buy route successful', async () => {
    const serverResponse = await request(app)
        .post("/buy").send({
        productId: "20593",
        amountOfProducts: 1
      });
    expect(serverResponse.statusCode).toEqual(200)
    });

    it('returns status code 200 if Index route successful', async () => {
        const serverResponse = await request(app)
        .get('/')
        expect(serverResponse.statusCode).toEqual(200)
    });

})

