/***** 

Create the test DB (run only one time) : 
>> "docker-compose -f docker-compose.test.yml up -d"

Execute the tests: 
>> "npm test"

Role of "npm test"
 * Switch to test environnement
 * Run migrations
 * Execute tests with mocha

Run the test without migration (faster) : 
>> "npm run fast_test" 

philippe girard 2017

*****/

// Dependencies for testing
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
var assert = require('assert');

chai.use(chaiHttp);

/* Setup fixtures */
var sqlFixtures = require('sql-fixtures');
var db = require('../models/index');

// db configs
var dbConfig = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bypass_test',
    port: 5433
  }
};

var accounts_fixtures = require('./fixtures/accounts')
var dataSpec = {
  Accounts: accounts_fixtures
}


describe('/GET accounts', () => {


  // reset db and fill it before tests
  before(function(done) {
    this.timeout(3000); // increase timout here if database become larger
    // drop the db
    db.sequelize.drop().then(function() {
      // Sync all models that aren't already in the database
      db.sequelize.sync().then(function() {
        // load fixtures
        sqlFixtures.create(dbConfig, dataSpec, function(err, result) {
          done()
        })
      })
    }).catch(function (err) { 
        console.error(err.stack); 
    }); 
  })

  
  it('it should GET all the accounts', function(done) {
    chai.request(server)
      .get('/api/accounts')
      .end((err, res) => {
          res.should.have.status(200);
          done();
    });
  });

  it('it should display amount of client', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 024, method: '2', clientId: '0123456789' })
      .end((err, res) => {
          assert.equal(res.body['id'], 024);
          assert.equal(res.body['solde'], 1200);
          res.should.have.status(200);
          done();
      });
  })

  it('it should return 400 if client card does not exists', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: "024", method: '2', clientId: 'NOTEXISTS' })
      .end((err, res) => {
          assert.notEqual(res.body['error'], null);
          res.should.have.status(400);
          done();
      });
  })
  
});