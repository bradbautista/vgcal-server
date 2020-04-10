module.exports = {
  PORT: process.env.PORT || 17043,
  DATABASE_URL: process.env.DATABASE_URL || `postgresql://${process.env.DBUSER}:${process.env.DBPASS}@localhost/vgcal_db`,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || `postgresql://${process.env.DBUSER}:${process.env.DBPASS}@localhost/vgcal_test_db`,
  EMAILPASS: process.env.EMAILPASS,
  EMAILUSER: process.env.EMAILUSER,
  GBAPIKEY: process.env.GBAPIKEY
}