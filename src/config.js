module.exports = {
  PORT: process.env.PORT || 17043,
  DB_URL: process.env.DB_URL || 'postgresql://postgres:0m8x34s3@localhost/vgcal_db',
  TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://postgres:0m8x34s3@localhost/vgcal_test_db'
}
  