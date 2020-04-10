**********************WILL WANT MOBILE + DESKTOP PICS

# [vgCal](https://vgcal.now.sh/)

[![vgCal home](EVENTUAL LINK TO CLICKABLE PIC)](https://vgcal.now.sh/)

## Table of Contents
[About](#about)
<br>
[Features](#features)
<br>
[Tech](#tech)
 

<a name="about"></a>
## About

vgCal's server serves a few purposes:

* It acts as a buffer/cache for the Giant Bomb API, which is rate-limited to the extent that it makes a purely front-end solution untenable.
* It adds a layer of abstraction between the client and the source data. This allows for easier consumption on the client side, and eases any future expansion or changes in data source.
* It emails its admin a daily backup of the insertion the database, in the event that anything should go wrong.

<a name="features"></a>
## Features

**Automatic updates**

vgCal's server utilizes node-cron to schedule daily retrieval of updated release information from the Giant Bomb API, being careful to run afoul of rate limits by spacing those requests out.

Once it gets that data, it formats it and automatically deletes previous records for that dataset from its database, then inserts the new records.

**Automatic backups**

In addition to inserting data into its database, vgCal's server also writes that data to a json file and emails it to the server admin via nodemailer. This also serves as a helpful log in the event that something goes wrong or you want to check on things.

**Easy expansion**

To add or remove a year from the dataset being fetched, all the admin has to do is add or remove it from an array. The server will take care of the rest.


<a name="tech"></a>
## Tech

vgCal is a full-stack web application. The client is hosted on [Zeit](https://zeit.co/home) and the server and database are hosted on [Heroku](https://www.heroku.com). Here's the stack:

**Back end**
<br>
[Node.js](https://nodejs.org/en/)
<br>
[Express](https://expressjs.com/)
<br>
[PostgreSQL](https://www.postgresql.org/)
<br>
[node-cron](https://github.com/node-cron/node-cron)
<br>
[Knex](https://knexjs.org/)
<br>
[ical-generator](https://www.npmjs.com/package/ical-generator)
<br>
[nodemailer](https://nodemailer.com/about/)
<br>
[Moment.js](https://momentjs.com/)
<br>
[Mocha](https://mochajs.org/) / [Chai](https://www.chaijs.com/) / [Supertest](https://github.com/visionmedia/supertest)
<br>
[Morgan](https://github.com/expressjs/morgan) / [CORS](https://github.com/expressjs/cors) / [Helmet](https://github.com/helmetjs/helmet)

**Front end**
<br>
HTML5/CSS3/JS
<br>
[React](https://reactjs.org/)
<br>
[React Router](https://reacttraining.com/react-router/)
<br>
[Fullcalendar](https://fullcalendar.io/)
<br>
[react-windowed-select](https://www.npmjs.com/package/react-windowed-select)
<br>
[react-responsive](https://www.npmjs.com/package/react-responsive)
<br>
[react-loading-overlay](https://www.npmjs.com/package/react-loading-overlay)
<br>
[react-responsive-modal](https://www.npmjs.com/package/react-responsive-modal)
<br>
[react-collapsible](https://www.npmjs.com/package/react-collapsible)
<br>
[js-file-download](https://www.npmjs.com/package/js-file-download)
<br>
[Moment.js](https://momentjs.com/)

For details about how the vgCal client works, visit [its repo](https://github.com/bradbautista/vgcal-client).

**Misc.**
<br>
[Giant Bomb API](https://www.giantbomb.com/api/)