/* eslint-disable no-undef */
const app = require('../src/app');
const testAPIresult = require('./testAPIresult.json');
const serviceFunctions = require('../src/serviceFunctions');

describe('Favorites endpoint', function() {

    // We need to mock getting an object formatted like the
    // client sends its objects. We'll use our sample API response
    // to supply the data; we're not running it through the exact
    // formatting function that the client would, but this is what it
    // would do with this data
    const testRelease = serviceFunctions.parseReleases(testAPIresult);

    // The difference is that on the client side,
    // the releaseDate/releaseDay property 
    // is not transmitted if its value is null and thus
    // comes into our formatting function as undefined.
    // For our testRelease, it is the case that
    // releaseDay/release_date_iso is null
    const testCalendarData = [{
        "gameTitle" : testRelease[0].game_name,
        "releaseDate" : testRelease[0].release_date_utc
    }];

    // To test the response, we'll compare the text
    // of the ICS file we receive to the actual text of
    // the correct ICS file that is properly generated for
    // our testRelease. We need to do this by checking for
    // two substrings; separating them is a UID, which is
    // different for every calendar event, and a DTSTAMP,
    // which changes when the file is generated, and will thus
    // cause the test to fail
    const actualResponseTop = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//sebbo.net//ical-generator//EN\r\nBEGIN:VEVENT`;
    const actualResponseBottom = `DTSTART;VALUE=DATE:20200101\r\nX-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\nX-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE\r\nSUMMARY:Pantheon: Rise of the Fallen\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  
  describe(`POST /api/favorites/generate`, () => {
    context(`Given an object shaped like one the client would request`, () => {

      it(`responds with 200 and an ics file`, () => {
        return supertest(app)
          .post(`/api/favorites/generate`)
          .send(testCalendarData)
          .expect(200)
          .expect(res => {
            expect(res.text).to.have.string(actualResponseTop);
            expect(res.text).to.have.string(actualResponseBottom);
          });
      });
    });
  });
});
