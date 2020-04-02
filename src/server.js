require('dotenv').config();

const knex = require('knex');
const app = require('./app');
const fs = require('fs');
const { PORT, DB_URL } = require('./config');
const cron = require("node-cron");
const fetch = require("node-fetch");
const serviceFunctions = require('./serviceFunctions');
// const jsonParser = express.json()
const rawResults = require('../results.json');

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

// * * * * * *
// | | | | | |
// | | | | | day of week
// | | | | month
// | | | day of month
// | | hour
// | minute
// second ( optional )

dataArray = [];

// GET THE RELEASES
    // FETCH RELEASES BY YEAR?
      // FOR SOME REASON EXPECTED_RELEASE_YEAR:YEAR WORKS AND RETURNS GAMES WHERE
      // ORIGINAL_RELEASE_DATE HAS YEAR IN IT
        // WE GET 2176 FOR 2019 
            // LIMIT 100, OFFSET 0, NUMBER OF TOTAL RESULTS 2176
// FORMAT THE RELEASES
// WRITE TO FILE AND EMAIL BACKUP?
// DELETE RELEASES
// INSERT RELEASES

cron.schedule('00 16 00 * * *', function() {

  console.log('12:16:00')

  serviceFunctions.fetchReleasesByYear('2020', '0')

  // DELETE RELEASES
  // serviceFunctions.deleteReleasesByYear(db, '2020').then(x => console.log(x));

  // const releases = rawResults.flat();

  // FORMAT THE RELEASES
  // const filteredReleases = serviceFunctions.filterReleases(releases)

  // DOESN'T WORK
  // serviceFunctions.insertReleases(filteredReleases).then(x => console.log(x)).catch(err => console.log(err))

  // WORKS
  // filteredReleases.forEach(release => console.log(release));

  // ALSO DOESN'T WORK
  // filteredReleases.forEach(release => serviceFunctions.insertReleases(db, release).then(x => console.log(x)));

  // WORKS!
  // const releasesToInsert = filteredReleases.map(release => 
  //   ({ boxart_url: release.boxart_url, game_name: release.game_name, game_description: release.game_description, platforms: release.platforms, release_date_utc: release.release_date_UTC, release_date_iso: release.release_date_ISO, release_day: release.release_day, release_month: release.release_month, release_year: release.release_year, release_quarter: release.release_quarter }));

  // INSERT RELEASES
  // serviceFunctions.insertReleases(db, releasesToInsert).then(x => console.log(x)).catch(err => console.log(err))

})

cron.schedule('* * * * *', function() {  

  // console.log(`It's been a minute`)

  // 2020 releases
  // const urls = [
  //   'https://www.giantbomb.com/api/games/?api_key=dc3197959811df35567dc05e363745c743c6d2c1&format=json&filter=expected_release_year:2020&offset=0',
  //   'https://www.giantbomb.com/api/games/?api_key=dc3197959811df35567dc05e363745c743c6d2c1&format=json&filter=expected_release_year:2020&offset=100',
  //   'https://www.giantbomb.com/api/games/?api_key=dc3197959811df35567dc05e363745c743c6d2c1&format=json&filter=expected_release_year:2020&offset=200',
  //   'https://www.giantbomb.com/api/games/?api_key=dc3197959811df35567dc05e363745c743c6d2c1&format=json&filter=expected_release_year:2020&offset=300',
  //   'https://www.giantbomb.com/api/games/?api_key=dc3197959811df35567dc05e363745c743c6d2c1&format=json&filter=expected_release_year:2020&offset=400',
  //   'https://www.giantbomb.com/api/games/?api_key=dc3197959811df35567dc05e363745c743c6d2c1&format=json&filter=expected_release_year:2020&offset=500',
  //   'https://www.giantbomb.com/api/games/?api_key=dc3197959811df35567dc05e363745c743c6d2c1&format=json&filter=expected_release_year:2020&offset=600',
  // ];
  
  //   Promise.all(urls.map(url =>
  //     fetch(url)
  //       .then(checkStatus)                 
  //       .then(parseJSON)
  //       .catch(error => console.log('There was a problem!', error))
  //   ))
  //   .then(data => {
  //     data.forEach(obj => dataArray.push(obj.results));
  //     // console.log(dataArray)

    // SELF, YOU CAN JUST FLATTEN DATAARRAY TO GET YOUR ARRAY OF OBJECTS

    // WRITE TO FILE

  //     fs.writeFile('results.json', JSON.stringify(dataArray), (err) => {
  //       if (err) throw err;
  //       console.log('The file has been saved!');
  //     });
  //   })
  //   .catch(error => console.log('There was a problem!', error))
    
  // });

  // Server makes request to API
  // API sends response
  // Server ingests response
  // Formats it
  // Inserts it into database

  function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function parseJSON(response) {
    return response.json();
  }

})

// Are they going to want me to establish /game/:game routes and /date/:date routes or something?

// If so you might need a /favorites/ or something for the post requests?

/// Will need to filter out all releases for which expected_release_day, expected_release_month and expected_release_year are all null and see what that looks like


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
