-- SEE IF THERE'S A WAY TO SEED FROM FILE

-- BUT IT'S GOING TO BE SOMETHING LIKE

BEGIN;

TRUNCATE
  vgcal_releases
  RESTART IDENTITY CASCADE;

INSERT INTO vgcal_releases (id, boxart_url, game_name, game_description, platforms, release_date_utc, release_date_iso, release_day, release_month, release_year, release_quarter)
VALUES
  (
    1, 
    'https://giantbomb1.cbsistatic.com/uploads/original/8/81005/2761706-2331543206-capsu.jpg', 
    "Classroom Aquatic",
    "As a 'foreign-exchange' human in an otherwise all-dolphin school, players must surreptitiously cheat off their classmates.",
    "Mac, PC, PlayStation 4, Linux",
    "2020",
    NULL,
    NULL,
    NULL,
    "2020",
    NULL
  ),
  (
    2, 
    'https://giantbomb1.cbsistatic.com/uploads/original/42/423349/3168914-roguelords_logo_white.png', 
    "Rogue Lords",
    "Turned based Rogue-like game featuring the Devil and control Disciples of Evil such as Dracula and Bloody Mary and others to spread corruption throughout the world. Co-developed by Cyanide & Leikir Studio, published by Nacon.",
    "PC, Xbox One, PlayStation 4, Nintendo Switch",
    "October 2020",
    NULL,
    NULL,
    "10",
    "2020",
    NULL
  );

COMMIT;