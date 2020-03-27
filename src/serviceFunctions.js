const moment = require('moment');

const serviceFunctions = {

    parseReleaseDateToUTC(releaseDateInfo) {

        let { expected_release_year, expected_release_month, expected_release_quarter, expected_release_day, original_release_date } = releaseDateInfo

        // console.log(releaseDateInfo)

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
                return expected_release_year
            } else {

                let dateString = `${expected_release_month}-${expected_release_year}`
                
                return moment(dateString).format("MMMM YYYY")
            }

        } else if (expected_release_day !== null && expected_release_month !== null && expected_release_year !== null) {

            let dateString = `${expected_release_year}-${expected_release_month}-${expected_release_day}`

            return moment(dateString).format("MMMM D, YYYY");

        } else {
            return "Release date info unavailable."
        }

    },

    parseReleaseDateToISO(releaseDateInfo) {

        let { expected_release_year, expected_release_month, expected_release_quarter, expected_release_day, original_release_date } = releaseDateInfo

        if (expected_release_day === null || expected_release_month === null || expected_release_year === null) {
            
            if (original_release_date !== null) {
                return original_release_date
            } else {
                return null
            }
            
        } else {

            return `${expected_release_year}-${expected_release_month}-${expected_release_day}`
        }
    },

    filterReleases(releases) {
        
        const filteredReleases = releases.map(release => {

            const tempObj = {};
            
            let year = release.expected_release_year
            let month = (release.expected_release_month < 10 && release.expected_release_month !== null)
                    ? '0' + release.expected_release_month
                    : release.expected_release_month
            let day = (release.expected_release_day < 10 && release.expected_release_day !== null)
                ? '0' + release.expected_release_day
                : release.expected_release_day

            // let releaseDateInfo = [release.expected_release_year, release.expected_release_month, release.expected_release_quarter, release.expected_release_year]

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
                ? 'Replace with url for custom image'
                : release.image.original_url
            
            tempObj.game_name = release.name
            tempObj.game_description = (release.deck === null || release.deck === "." || release.deck === "" )
                                        ? 'No description available.'
                                        : release.deck
            
            
            tempObj.platforms = (release.platforms === null)
                                    ? 'Platform information unavailable.'
                                    : release.platforms.map(platform => platform.name).join(', ')            
            
            // April 20, 2020, April 2020, Q1 2020, 2020
            // Going to need a function to do this
            tempObj.release_date_UTC = this.parseReleaseDateToUTC(releaseDateInfo)

            // Is expected release year, month or day null? If so, this is null
            // If not 
            // I need to add a case for original release date here for games that have already been released
            tempObj.release_date_ISO = this.parseReleaseDateToISO(releaseDateInfo)

            tempObj.release_day = (tempObj.release_date_ISO !== null) 
                                    ? tempObj.release_date_ISO.split('-')[2]
                                    : day
            tempObj.release_month = (tempObj.release_date_ISO !== null) 
                                    ? tempObj.release_date_ISO.split('-')[1]
                                    : month
            tempObj.release_year = (tempObj.release_date_ISO !== null) 
                                    ? tempObj.release_date_ISO.split('-')[0]
                                    : year
            tempObj.release_quarter = release.expected_release_quarter

            // console.log(tempObj.game_name)
            // console.log(tempObj.release_date_ISO)
            // console.log(tempObj)
            
            return tempObj;

        })

        return filteredReleases
    },



    getAllSubreddits(knex) {
        return knex.raw(
            `select * from subreddit_names;`
        )
    },

    insertRelease(knex, release) {
        return knex
            .insert([
                { boxart_url: release.boxart_url },
                { game_name: release.game_name },
                { game_description: release.game_description },
                { platforms: release.platforms },
                { release_date_UTC: release.release_date_UTC },
                { release_date_ISO: release.release_date_ISO },
                { release_day: release.release_day },
                { release_month: release.release_month },
                { release_year: release.release_year },
                { release_quarter: release.release_quarter }
            ])

        

    },

    insertConversation(knex, randomName) {
        return knex
          .insert([{ conversation_location: randomName }])
          .into('gifchat_conversations')
          .returning('conversation_location');
      },

    insertSubreddit(knex, subreddit) {
        return knex.raw(
            `insert into subreddit_names (subreddit_name) values('${subreddit}') returning *;`
        )
    },

    insertCombo(knex, combo) {
        return knex.raw(
            `insert into subreddit_combos (combo) values('${combo}') returning *;`
        )
    }

}

module.exports = serviceFunctions