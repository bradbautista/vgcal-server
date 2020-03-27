require('dotenv').config();

const knex = require('knex');
const app = require('./app');
const fs = require('fs');
const { PORT, DB_URL } = require('./config');
const cron = require("node-cron");
const fetch = require("node-fetch");
const serviceFunctions = require('./serviceFunctions');
// const jsonParser = express.json()

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

// Schedule a ping of the reddit API for two random subreddits and stick them in a database

dataArray = [];

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

/// Will need to filter out all releases for which expected_release_day, expected_release_month and expected_release_year are all null and see what that looks like


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
