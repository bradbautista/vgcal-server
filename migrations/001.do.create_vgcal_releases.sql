CREATE TABLE vgcal_releases (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    boxart_url TEXT NOT NULL,
    -- Server should check to see if it's the URL for the GB placeholder art 
    -- (possibly https://giantbomb1.cbsistatic.com/uploads/original/11/110673/3026329-gb_default-16_9.png)
    -- and if so, replace it with placeholder art of our own
    game_name TEXT NOT NULL,
    game_description TEXT NOT NULL,
    -- If null, server should replace with "No description provided."
    platforms TEXT NOT NULL,
    -- If null, server should replace with "Platform information unavailable."
    release_date_utc TEXT NOT NULL,
    -- Release date in the format January 1, 2020 OR January 2020 OR 2020
    release_date_iso TEXT,
    -- Release date in the format YYYY-MM-DD, can be null;
    -- should be null for cases where full release date is not
    -- available, so that client can filter API response for
    -- release_date_ISO !null to get calendar events
    release_day TEXT,    
    -- Release day, so we can write queries to easily select for days, can be null
    release_month TEXT,
    -- Release months, so we can write queries to easily select for months, can be null
    release_year TEXT,
    -- Release years, so we can write queries to easily select for years, can be null,
    release_quarter TEXT
    -- Release quarters, which we probably won't query for but may as well, can be null
    
);

-- What is the null platform case?


    --   tempObj.title = release.name; // game_name
    --   tempObj.date = `${year}-${month}-${day}`; // release_date_ISO
    --   tempObj.platforms = release.platforms; // platforms
    --   tempObj.image = release.image.original_url; // boxart_url
    --   // Note these are distinct from title and url; the calendar uses
    --   // those properties in a way that makes it difficult to consume
    --   // and use them, so we're naming these such that they'll get passed
    --   // in the event object's extendedProps
    --   tempObj.gameUrl = `/game/${release.name.split(' ').join('-')}`; // game_name; this should probably stay on the client since it's the client's concern
    --   tempObj.gameTitle = release.name; // game_name
    --   // After we pass the date to the calendar it becomes
    --   // difficult to retrieve, so we're passing it again
    --   // as an extendedProp to make it easy to get to
    --   tempObj.releaseDate = `${year}-${month}-${day}`; // release_date_ISO
    --   tempObj.description = // game_description