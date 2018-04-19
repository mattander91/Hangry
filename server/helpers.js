const request = require('request');

//"Search Restaurants" endpoint: https://developers.eatstreet.com/endpoint/search
let getRestaurants = (location, searchedFood, callback) => {
  let exp = /[a-zA-Z0-9\s]/g;
  let matched = searchedFood.match(exp).join('').split(' ');
  let modifiedSearch = formatSearch(matched);
  let query = {
    headers: {'X-Access-Token': process.env.key},
    url: 'https://api.eatstreet.com/publicapi/v1/restaurant/search?method=pickup&pickup-radius=10&street-address=' + location
  };
  request.get(query, (error, response, body) => {
    if (error) {
      // console.log('ERROR GETTING eatstreet DATA');
    } else {
      callback(relevantRestaurants(body, modifiedSearch));
    }
  });
};

//Standardizes search string to uppercased first letters to match API format
let formatSearch = (arr) => {
  let modified = [];
  let filterFood = arr.filter((word) => {
    if (word !== 'Food' && word !== 'food') {
      return word;
    }
  });
  for (let i = 0; i < filterFood.length; i++) {
    modified.push(filterFood[i][0].toUpperCase() + filterFood[i].slice(1).toLowerCase());
  }
  return modified;
};

//Takes body response from getRestaurants and filters restaurant name,
//  location, apiKey (unique restraurant ID), and restaurant address
//Returns restaurants that serve food types relevant to user's search for getRestaurants function
let relevantRestaurants = (body, searchedFood, callback) => {
  let res = JSON.parse(body);
  let restaurants = res.restaurants;
  let namesAndKeys = [];
  restaurants.forEach((restaurant) => {
    restaurant.foodTypes.forEach((type) => {
      searchedFood.forEach((food) => {
        if (type.includes(food)) {
          let address = restaurant.streetAddress + ', ' + restaurant.city + ', ' + restaurant.state + ', ' + restaurant.zip;
          namesAndKeys.push({
            name: restaurant.name,
            restaurantId: restaurant.apiKey,
            address: address,
            logo: restaurant.logoUrl,
            delivery: restaurant.offersDelivery,
            open: restaurant.open,
            hours: restaurant.hours,
            phone: restaurant.phone
          });
        }
      });
    });
  });
  return namesAndKeys;
};

//Gets menu items from relevant restaurants
//Calls "Restaurant Menu" endpoint: https://developers.eatstreet.com/endpoint/restaurant-menu
let getRelevantMenuItems = (restaurantId, searchedFood, callback) => {
  let query = {
    headers: {'X-Access-Token': process.env.key},
    url: 'https://api.eatstreet.com/publicapi/v1/restaurant/' + restaurantId + '/menu'
  };
  request.get(query, (error, response, body) => {
    if (error) {
      // console.log('ERROR GETTING eatstreet DATA');
    } else {
      let splitFood = cutCommas(searchedFood.split(' '));
      let res = JSON.parse(body);
      if (!res.error) {
        addItemRelevance(res, splitFood, (data) => {
          callback(data);
        });
      } else {
        setTimeout(() => {
          getRelevantMenuItems(restaurantId, searchedFood, (data) => {
            callback(data);
          });
        }, 1000); //Can only make 10 requests/second otherwise throws error
      }
    }
  });
};

//Adds "relevance" property to menu items
//Only menu items with exact matches are returned
//ex - search for "Pepperoni Pizza" will only return menu item names or
// item descriptions that include words "Pepperoni" and "Pizza"
let addItemRelevance = (res, splitFood, callback) => {
  let relevantItems = [];
  res.forEach(menu => {
    menu.items.forEach(item => {
      let name = item.name.split(' ');
      let desc = item.description ? item.description.split(' ') : [];
      let menuItem = cutCommas(desc.concat(name));
      let counter = 0;
      splitFood.forEach(food => {
        if (menuItem.includes(food)) {
          counter++;
        }
      });
      item.relevance = counter;
      if (item.relevance === splitFood.length) {
        relevantItems.push(item);
      }
    });
  });
  if (relevantItems.length > 0) {
    callback(filterUniqueItems(relevantItems));
  }
};

//EatStreet occasionally has duplicate menu items listed, this function returns only unique item names.
let filterUniqueItems = (items) => {
  let itemNames = [];
  let unique = [];
  items.forEach(item => {
    if (!itemNames.includes(item.name)) {
      unique.push(item);
      itemNames.push(item.name);
    }
  });
  return unique;
};

//Extracts menu item name, menu item description (if present), price, and relevance
let formatMenu = (restaurantId, foodType, callback) => {
  let formattedData = [];
  getRelevantMenuItems(restaurantId, foodType, (data) => {
    if (data) {
      data.forEach((menu) => {
        formattedData.push({
          name: menu.name,
          description: menu.description || menu.name,
          price: menu.basePrice,
          relevance: menu.relevance});
      });
      callback(formattedData);
    } else {
      // console.log('failed to get menu data from getRelevantMenuItems function');
    }
  });
};

//Returns all relevant restaurants' menu items, not grouped by restaurant name
let menusByCity = (cityName, searched, callback) => {
  let menus = [];
  getRestaurants(cityName, searched, (restaurants) => {
    restaurants.forEach(restaurant => {
      formatMenu(restaurant.restaurantId, searched, (menu) => {
        menu.forEach(item => {
          menus.push({
            restaurant: restaurant,
            item: item
          });
        });
      });
    });
  });
  setTimeout(() => {
    callback(menus);
  }, 2500);
};

//Calls all functions above to retrieve all relevant menu items within 10 miles of provided location/city.
//Groups all menu item names by restaurant
let groupByRestaurant = (cityName, searched, callback) => {
  menusByCity(cityName, searched, (menus) => {
    if (menus) {
      let groupByRestaurant = [];
      let restaurantNames = [];
      menus.forEach(menu => {
        if (restaurantNames.includes(menu.restaurant.name)) {
          groupByRestaurant.forEach(restaurant => {
            if (restaurant.name === menu.restaurant.name) {
              restaurant.items.push({
                item : menu.item.name,
                description: menu.item.description,
                price: menu.item.price
              });
            }
          });
        } else {
          restaurantNames.push(menu.restaurant.name);
          groupByRestaurant.push({
            name: menu.restaurant.name,
            items: [{
              item: menu.item.name,
              description: menu.item.description,
              price: menu.item.price
            }],
            address: menu.restaurant.address,
            logo: menu.restaurant.logo,
            delivery: menu.restaurant.delivery,
            open: menu.restaurant.open,
            hours: menu.restaurant.hours,
            phone: menu.restaurant.phone
          });
        }
      });
      if (groupByRestaurant.length > 0) {
        callback(groupByRestaurant);
      } else {
        callback([{noData: true}]);
      }
    }
  });
}

let cutCommas = (array) => {
  return array.map(word => {
    let noPunc = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    let cutStr = noPunc.replace(/\s{2,}/g, '');
    return cutStr.charAt(0).toUpperCase() + cutStr.slice(1);
  });
};

module.exports.groupByRestaurant = groupByRestaurant;