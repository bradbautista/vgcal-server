require('dotenv').config();

const knex = require('knex');
const app = require('./app');
const { PORT, DATABASE_URL, EMAILUSER } = require('./config');
const cron = require("node-cron");
const serviceFunctions = require('./serviceFunctions');
const moment = require('moment');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

// CRON KEY //
// * * * * * *
// | | | | | |
// | | | | | day of week
// | | | | month
// | | | day of month
// | | hour
// | minute
// second ( optional )

// Note Heroku server is +4 hrs from EST/EDT
const hour = 19; // 00 - 23
const minute = '45'; // 00 - 59; str for leading 0s

// Want to add a year to the database? Add a year to this array
const years = ['2019'];

// Sequentially schedule updates and backups of data 
// for the years in the array above
years.forEach((year, i) => {

  console.log(`Scheduling refresh of ${year} releases for ${(hour > 12) ? (hour - 12) + i : hour + i}:${minute} ${(hour > 11) ? 'p.m.' : 'a.m.' } `)

    cron.schedule(`00 ${minute} ${hour + i} * * *`, function() {

      console.log(`Refreshing ${year} releases`);
      serviceFunctions.fetchAndManageReleasesByYear(db, year);

    })

  console.log(`Scheduling transmission of backup of ${year} releases for ${(hour > 12) ? (hour - 12) + i : hour + i}:${minute} ${(hour > 11) ? 'p.m.' : 'a.m.' } and 15 seconds`)

    cron.schedule(`15 ${minute} ${hour + i} * * *`, function() {

      console.log(`It's ${(hour > 12) ? (hour - 12) + i : hour + i}:${minute} ${(hour > 11) ? 'p.m.' : 'a.m.' }, e-mailing daily backup of records for ${year} to ${EMAILUSER}`);

      // If we try to chain emailFile off any of the promises in the above-
      // scheduled function, or run it elsewhere in the function, or with
      // a setTimeout, it either jumps the gun or doesn't work, so we're waiting
      // via a separate cron job and adding some time as padding

      serviceFunctions.emailFile(year);

    })

})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})