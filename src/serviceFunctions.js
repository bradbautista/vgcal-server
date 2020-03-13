const serviceFunctions = {

    getAllSubreddits(knex) {
        return knex.raw(
            `select * from subreddit_names;`
        )
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