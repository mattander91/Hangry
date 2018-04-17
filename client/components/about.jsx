const React = require('react');

const About = () => (
  <div>
    <div id="hangry-word-logo-about">About</div>
    <div className="about">
      <p style={{'font-size': '25px'}}>About Hangry</p>
      <p>Tired of reading through menus online to see if they have what you're craving? Look no further! Simply search for the food you want ("chicken wings", "meatball sandwich", etc) and enter your city or zip code. If we currently have the relevant restaurants in the database, we'll return specific menu items from restaurants that match your search within 10 miles. If you can't seem to find what you're looking for, please read below.
      </p>
      <p style={{'font-size': '25px'}}>Hangry is supported in select cities of the following states</p>
      <p>Arizona, California, Colorado, Connecticut, Delaware, District of Columbia, Florida, Georgia, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Michigan, Minnesota, Missouri, Montana, Nebraska, Nevada, New Jersey, New Mexico, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania Rhode Island, South Carolina, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin.
      </p>
      <p style={{'font-size': '25px'}}>Why didn't my search return results?</p>
      <p>Hangry is powered by <a href="https://eatstreet.com/" target="_blank">EatStreet</a> which may not necessarily have menu item data for every restaurant in the city you searched. The database is constantly being updated so please check back soon. We apologize for the inconvenience.
      </p>
    </div>
  </div>
);

module.exports = About;
