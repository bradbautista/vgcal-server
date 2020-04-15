/* eslint-disable no-undef */
const knex = require('knex');
const app = require('../src/app');
const testAPIresult = require('./testAPIresult.json');
const serviceFunctions = require('../src/serviceFunctions');

describe('Releases endpoint', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
    db.raw('TRUNCATE vgcal_releases RESTART IDENTITY')
  );

  afterEach('cleanup', () =>
    db.raw('TRUNCATE vgcal_releases RESTART IDENTITY')
  );

  describe(`GET /api/releases/`, () => {
    context(`Given a request to the root`, () => {

      // In addition to testing the API response, let's
      // also test our chain.  TestAPIresult represents 
      // a response from the GiantBomb API;
      // it is a raw game object wrapped in an array
      const testRelease = serviceFunctions.parseReleases(testAPIresult)
      
      beforeEach('insert release', () => {
        serviceFunctions.insertReleases(db, testRelease).then(x => console.log(x))
      });

      it(`responds with 200 and an array containing the database entries`, () => {
        return supertest(app)
          .get(`/api/releases/`)
          .expect(200)
          .expect(res => {
            expect(res.body).to.be.an('array');
            // Test to see that our data has been formatted properly;
            // one field should suffice, since any parsing errors will
            // throw on the insert call and we can examine the console log
            expect(res.body[0]).to.have.nested.property("game_name");
          });
      });
    });
  });
});
