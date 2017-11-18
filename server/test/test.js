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
    })
  })

  
  it('it should GET all the accounts', (done) => {
    chai.request(server)
      .get('/api/accounts')
      .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          done();
    });
  });
});