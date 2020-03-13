module.exports = {
    PORT: process.env.PORT || 17043,
    DB_URL: process.env.DB_URL || 'postgresql://dbuser:userpass@localhost/dbname',
    TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://dbuser:userpass@localhost/dbname'
  }
  