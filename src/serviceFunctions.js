require('dotenv').config();
const { EMAILUSER, EMAILPASS } = require('./config');
const nodemailer = require("nodemailer");
const moment = require('moment');
const fetch = require('node-fetch');
const fs = require('fs');


const serviceFunctions = {

    parseReleaseDateToUTC(releaseDateInfo) {

        let { expected_release_year, expected_release_month, expected_release_quarter, expected_release_day, original_release_date } = releaseDateInfo

        // If an expected release quarter is provided, we can reasonably disregard other release information and construct the string
        if (expected_release_quarter !== null) {
            // i.e. Q3 2020
            return `Q${expected_release_quarter} ${expected_release_year}`;

        // If all expecteds are null, the game has been released, so return the release date
        } else if (expected_release_day === null && expected_release_month === null && expected_release_year === null) {

            // And then format it from YYYY-MM-DD it is to the string we need
            return moment(original_release_date).format("MMMM D, YYYY");
        
        // Next check if expected release day is null;
        } else if (expected_release_day === null) {

            // If so, is expected release month also null? If so, just return the year (i.e. 2020); if not, return a string like September 2020
            if (expected_release_month === null) {
                return expected_release_year;
            } else {
                let dateString = `${expected_release_month}-${expected_release_year}`
                return moment(dateString, "MM-YYYY").format("MMMM YYYY");
            }

        // If there is a non-null value in all day/month/year fields,
        // concatenate a string using those values and then format it
        // into a human-readable string
        } else if (expected_release_day !== null && expected_release_month !== null && expected_release_year !== null) {

            let dateString = `${expected_release_year}-${expected_release_month}-${expected_release_day}`;

            return moment(dateString).format("MMMM D, YYYY");

        // And if we can't do any of that, we don't have enough
        // info to ascertain a release date
        } else {
            return "Release date info unavailable."
        }

    },

    parseReleaseDateToISO(releaseDateInfo) {

        let { expected_release_year, expected_release_month, expected_release_quarter, expected_release_day, original_release_date } = releaseDateInfo

        // If release day, month, or year are null, it might be because
        // the game has already been released, so check to see if that's
        // the case
        if (expected_release_day === null || expected_release_month === null || expected_release_year === null) {
            
            if (original_release_date !== null) {
                return original_release_date;
            } else {
                return null;
            }
            
        } else {

            return `${expected_release_year}-${expected_release_month}-${expected_release_day}`;
        }
    },

    parseReleases(releases) {
        
        const parsedReleases = releases.map(release => {

            const tempObj = {};
            
            // Simplifying references & adding leading 0s
            let year = release.expected_release_year
            let month = (release.expected_release_month < 10 && release.expected_release_month !== null)
                    ? '0' + release.expected_release_month
                    : release.expected_release_month
            let day = (release.expected_release_day < 10 && release.expected_release_day !== null)
                ? '0' + release.expected_release_day
                : release.expected_release_day

            // Have to pass all these to functions for date
            // parsing so let's bundle them; TODO wrote this more
            // verbosely than it needs to be written, can clean up
            let releaseDateInfo = {
                expected_release_year: year,
                expected_release_month: month,
                expected_release_quarter: release.expected_release_quarter,
                expected_release_day: day,
                original_release_date: release.original_release_date
            }

            // If the boxart is placeholder, don't use Giant Bomb's placeholder
            // art, replace it with one that lets people know it's not available
            tempObj.boxart_url = (release.image.original_url === 'https://giantbomb1.cbsistatic.com/uploads/original/11/110673/3026329-gb_default-16_9.png')
                ? 'https://raw.githubusercontent.com/bradbautista/vgcal-server/master/src/images/noart.png'
                : release.image.original_url
            
            tempObj.game_name = release.name
            tempObj.game_description = (release.deck === null || release.deck === "." || release.deck === "" )
                                        ? 'No description available.'
                                        : release.deck
            
            tempObj.platforms = (release.platforms === null)
                                    ? 'Platform information unavailable.'
                                    : release.platforms.map(platform => platform.name).join(', ')            
            
            // September 20, 2020, September 2020, Q1 2020, 2020
            tempObj.release_date_utc = this.parseReleaseDateToUTC(releaseDateInfo)

            // 2020-09-20
            tempObj.release_date_iso = this.parseReleaseDateToISO(releaseDateInfo)

            tempObj.release_day = (tempObj.release_date_iso !== null) 
                                    ? tempObj.release_date_iso.split('-')[2]
                                    : day
            tempObj.release_month = (tempObj.release_date_iso !== null) 
                                    ? tempObj.release_date_iso.split('-')[1]
                                    : month
            tempObj.release_year = (tempObj.release_date_iso !== null) 
                                    ? tempObj.release_date_iso.split('-')[0]
                                    : year
            tempObj.release_quarter = release.expected_release_quarter
            
            return tempObj;

        })

        return parsedReleases;
    },

    insertReleases(knex, releases) {
        return knex
            .insert(releases)
            .into('vgcal_releases')
            .returning('*')
    },

    deleteReleasesByYear(knex, year) {
        return knex
            .del()
            .from('vgcal_releases')
            .where('release_year', year)
    },

    checkStatus(response) {
        if (response.ok) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    },

    parseJSON(response) {
        return response.json()
    },

    emailFile(year) {

        async function main() {
          
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'Sendinblue',
                auth: {
                    user: EMAILUSER,
                    pass: EMAILPASS
                }
            });

            const today = moment().format('MM-DD-YYYY')
          
            // send mail with defined transport object
            let info = await transporter.sendMail({
              from: '"vgCal 📅" <cal@vgcal.now.sh>', // sender address
              to: EMAILUSER, // list of receivers
              subject: `Backup for ${today}-${year}`, // Subject line
              text: `Here's the backup! Your lucky number is: ${Math.ceil(Math.random() * 100)}`, // plain text body
              html: `<h2>Here's the backup!</h2><h3>Your lucky number is: ${Math.ceil(Math.random() * 100)}.</h3>`, // html body
              attachments: [        
                {   
                    // filename and content type is derived from path
                    path: `./${today}-${year}.json`
                }
              ]

            });

            console.log(`Backup of ${today}-${year}.json sent to ${EMAILUSER}`, info.messageId);          
        }

        main().catch(console.error);

    },

    fetchAndManageReleasesByYear(db, year) {

        let offset = 0;

        const urls = [];

        // Delete previous database records; this needs to complete before we
        // call our inserting function
        serviceFunctions.deleteReleasesByYear(db, year).then(x => console.log(x)).catch(err => console.log(err));

        // Fetch the releases for the given year, calculating how many
        // calls we need to make by inspecting the API response
        fetch(`https://www.giantbomb.com/api/games/?api_key=dc3197959811df35567dc05e363745c743c6d2c1&format=json&filter=expected_release_year:${year}&offset=${offset}`)
        .then(response => response.json())
        .then(json => {
            
            const totalResults = json.number_of_total_results;

            // 100 b/c it's the no. of records/page API delivers
            const fetchesToMake = Math.ceil(totalResults / 100);

            for (let i = 0; i < fetchesToMake; i++) {
                urls.push(`https://www.giantbomb.com/api/games/?api_key=dc3197959811df35567dc05e363745c743c6d2c1&format=json&filter=expected_release_year:${year}&offset=${offset + (i * 100)}`);
            }

            Promise.all(urls.map(url => 
                fetch(url)
                .then(this.checkStatus)
                .then(this.parseJSON)
                .catch(error => console.log('There was a problem!', error))
            ))
            .then(data => {

                const dataArray = [];

                data.forEach(obj => dataArray.push(obj.results));

                const releases = dataArray.flat();

                // Format the data for consumption by our app
                const parsedReleases = serviceFunctions.parseReleases(releases);

                const today = moment().format('MM-DD-YYYY');

                // Add the parsed API data to our database
                serviceFunctions.insertReleases(db, parsedReleases).then(x => console.log(x)).catch(err => console.log(err));

                // Heroku deletes files after 24 hrs & when the dyno
                // goes to sleep, so no need to worry about clutter
                fs.writeFile(`${today}-${year}.json`, JSON.stringify(parsedReleases), (err) => {
                    if (err) throw err;
                    console.log(`Releases for ${today}-${year} backed up to file.`);
                });
                

            })
        })
    },

    getAllReleases(knex) {
        return knex
            .select('*')
            .from('vgcal_releases')
    },

    getReleases(knex, release) {
        return knex
            .select('game_name', 'release_date_iso', 'release_date_utc')
            .from('vgcal_releases')
            .where('game_name', release)
    },

    formatICalEvents(array) {

        const objArray = array.map(game => {

            const obj = {}

            obj.domain = 'vgcal.now.sh'
            obj.start = (game.releaseDay === undefined)
            ? moment(game.releaseDate, ['MMMM YYYY', 'YYYY', 'Q YYYY'])
            : game.releaseDay
            obj.allDay = true
            obj.summary = game.gameTitle
    
            return obj;

        });

        return objArray;

    },

}

module.exports = serviceFunctions