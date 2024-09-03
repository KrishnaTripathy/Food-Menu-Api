class Yelp {
  constructor() {
    this.apiKey = "g9EeN1YvpMFGmbPjwKqrAVIVoCCCCK0g-uyPyF9nJigZOIKQpJYJa2S3FOUhlJ9Y6cnJszqMSRFjwrobfelVeALnWAHR1uBlC2L9fVkWZh0-sfqrvRZYjecDMWGRW3Yx";
    this.header = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    };
    this.location = "San Francisco"; 
  }

  // Search for all restaurants based on location
  async searchAllRestaurantsAPI() {
    const baseUrl = `https://api.yelp.com/v3/businesses/search?location=${this.location}&sort_by=rating`;
    const restaurantsInfo = await fetch(baseUrl, this.header);
    const restaurantsData = await restaurantsInfo.json();
    return restaurantsData.businesses;
  }

  // Search for restaurants based on food name
  async searchRestaurantsAPI(foodName) {
    const baseUrl = `https://api.yelp.com/v3/businesses/search?location=${this.location}&term=${foodName}&sort_by=rating`;
    const restaurantsInfo = await fetch(baseUrl, this.header);
    const restaurantsData = await restaurantsInfo.json();
    return restaurantsData.businesses;
  }
}

class UI {
  constructor() {}

  // Show feedback/alert messages
  showFeedback(text) {
    const feedback = document.querySelector(".feedback");
    feedback.classList.add("showItem");
    feedback.innerHTML = `<p>${text}</p>`;
    setTimeout(function () {
      feedback.classList.remove("showItem");
    }, 2000);
  }

  // Show preloader while fetching data
  showPreloader(preLoader) {
    preLoader.classList.add("showItem");
  }

  hidePreloader(preLoader) {
    preLoader.classList.remove("showItem");
  }

  // Display restaurants in the UI
  displayRestaurants(restaurants) {
    const restaurantList = document.getElementById("restaurant-list");
    let info = "";
    restaurants.forEach(function (restaurant) {
      info += ` 
      <div class="col-11 mx-auto my-3 col-md-4">
        <div class="card">
          <div class="row p-3">
            <div class="col-5">
              <img src="${restaurant.image_url}" class="img-fluid img-thumbnail" alt="${restaurant.name}">
            </div>
            <div class="col-5 text-capitalize">
              <h6 class="text-uppercase pt-2 redText">${restaurant.name}</h6>
              <p>${restaurant.location.address1}, ${restaurant.location.city}</p>
            </div>
            <div class="col-1">
              <div class="badge badge-success">
                ${restaurant.rating}
              </div>
            </div>
          </div>
          <hr>
          <div class="row py-3 ml-1">
            <div class="col-5 text-uppercase ">
              <p>Cuisines:</p>
              <p>Cost for two:</p>
            </div>
            <div class="col-7 text-uppercase">
              <p>${restaurant.categories.map(c => c.title).join(', ')}</p>
              <p>Not available</p>
            </div>
          </div>
          <hr>
          <div class="row text-center no-gutters pb-3">
            <div class="col-6">
              <a href="${restaurant.url}" target="_blank" class="btn redBtn text-uppercase">
               Menu
              </a>
            </div>
            <div class="col-6">
              <a href="${restaurant.url}" target="_blank" class="btn redBtn text-uppercase">
               Website
              </a>
            </div>
          </div>
        </div>
      </div>`;
    });
    restaurantList.innerHTML = info;
  }
}

(function () {
  const searchForm = document.getElementById("searchForm");
  const searchFood = document.getElementById("searchFood");
  const preLoader = document.querySelector(".loader");

  const yelp = new Yelp();
  const ui = new UI();

  document.addEventListener("DOMContentLoaded", function () {
    // Load all restaurants initially
    yelp.searchAllRestaurantsAPI().then(function (restaurants) {
      ui.displayRestaurants(restaurants);
    });
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (searchFood.value.trim() === "") {
      ui.showFeedback("Please enter a food name");
    } else {
      ui.showPreloader(preLoader);
      yelp
        .searchRestaurantsAPI(searchFood.value.trim())
        .then(function (restaurants) {
          ui.hidePreloader(preLoader);
          if (restaurants.length > 0) {
            ui.displayRestaurants(restaurants);
          } else {
            ui.showFeedback("No restaurants found");
          }
        });
    }
  });
})();
