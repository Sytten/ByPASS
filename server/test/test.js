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

process.env.NODE_ENV = 'test'; // defensive programming :( 

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
var items_fixtures = require('./fixtures/items')
var dataSpec = {
  Accounts: accounts_fixtures,
  Items: items_fixtures
}


describe('/GET accounts', () => {


  // reset db and fill it before tests
  beforeEach(function(done) {
    this.timeout(3000); // increase timout here if database become larger
    // drop the db
    db.sequelize.drop({logging: false}).then(function() {
      // Sync all models that aren't already in the database
      db.sequelize.sync({logging: false}).then(function() {
        // load fixtures
        sqlFixtures.create(dbConfig, dataSpec, function(err, result) {
          done()
        }).catch(function (err) {
          console.error(err.stack); 
        });
      })
    }).catch(function (err) { 
        console.error(err.stack); 
    }); 
  })

// ACCOUNTS
  
  it('it should GET all the accounts', function(done) {
    chai.request(server)
      .get('/api/accounts')
      .end((err, res) => {
          res.should.have.status(200);
          done();
      });
  });

// GENERAL CASES FOR METHOD

  it('it should return 400 when no method is defined ', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge')
      .end((err, res) => {
          res.should.have.status(400);
          done();
      });
  });

// METHOD 1

  it('it should create a transaction', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '1', clientId: '0123456789', merchantId: '6969', items: [11, 12, 14], qty: [1, 5, 2]})
      .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body['id'], 765);
          assert.equal(res.body['status'], true);
          assert.equal(res.body['solde'], 113390);
          
          done();
      });
  })

  it('it should fail if items does not exists', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '1', clientId: '0123456789', merchantId: '6969', items: [10, 12, 14], qty: [1, 5, 2]})
      .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body['id'], 765);
          assert.equal(res.body['status'], false);
          done();
      });
  })

  it('it should fail if merchant does not exists', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '1', clientId: '0123456789', merchantId: '9900', items: [11, 12, 14], qty: [1, 5, 2]})
      .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body['id'], 765);
          assert.equal(res.body['status'], false);
          done();
      });
  })

  it('it should fail if client does not exists', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '1', clientId: 'NOTEXISTS', merchantId: '6969', items: [11, 12, 14], qty: [1, 5, 2]})
      .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body['id'], 765);
          assert.equal(res.body['status'], false);
          done();
      });
  })

  it('it should fail when qty length differ from item length', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '1', clientId: '0123456789', merchantId: '6969', items: [11, 12, 14], qty: [5, 2]})
      .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body['id'], 765);
          assert.equal(res.body['status'], false);
          done();
      });
  })

  it('it should fail when client does not have enough money', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '1', clientId: '0123456789', merchantId: '6969', items: [11, 12, 14], qty: [120, 5, 2]})
      .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body['id'], 765);
          assert.equal(res.body['status'], false);
          done();
      });
  })

// METHOD 2

  it('it should display amount of client', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 024, method: '2', clientId: '0123456789' })
      .end((err, res) => {
          assert.equal(res.body['id'], 024);
          assert.equal(res.body['solde'], 120000);
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

// METHOD 3

  it('it should add money to the account', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '3', clientId: '0123456789', amount: 1246})
      .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body['id'], 765);
          assert.equal(res.body['status'], true);
          assert.equal(res.body['solde'], 121246);
          done();
      });
  })

  it('it should fail when client does not exists', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '3', clientId: 'NOTEXISTS', amount: 1246})
      .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body['id'], 765);
          assert.equal(res.body['status'], false);
          assert.equal(res.body['solde'], -1);
          done();
      });
  })

// METHOD 4 

  it('it should display the total for the checkout', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '4', merchantId: '6969', items: [11, 12, 14], qty: [1, 5, 2]})
      .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body['id'], 765);
          assert.equal(res.body['total'], 6610);
          done();
      });
  })

  it('it should fail if one item does not exists', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '4', merchantId: '6969', items: [11, 12, 0], qty: [1, 5, 2]})
      .end((err, res) => {
          res.should.have.status(400);
          assert.notEqual(res.body['error'], null);
          done();
      });
  })

  it('it should fail if qty size does not match item size', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '4', merchantId: '6969', items: [11, 12, 14], qty: [ 5, 2]})
      .end((err, res) => {
          res.should.have.status(400);
          assert.notEqual(res.body['error'], null);
          done();
      });
  })

  it('it should fail if one of the items does not belong to merchant', function(done) {
    chai.request(server)
      .post('/api/zigbee/bridge', )
      .send({ id: 765, method: '4', merchantId: '6969', items: [11, 12, 20], qty: [1, 5, 2]})
      .end((err, res) => {
          res.should.have.status(400);
          assert.notEqual(res.body['error'], null);
          done();
      });
  })

  
});