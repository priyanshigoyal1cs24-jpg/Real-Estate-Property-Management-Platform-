
var allProperties = [
  { id: 1, title: "2BHK Apartment", location: "Mathura", type: "apartment", price: 3200000, bedrooms: 2, area: 950, color: "#14213d" },
  { id: 2, title: "Luxury Villa", location: "Noida", type: "villa", price: 12500000, bedrooms: 4, area: 3200, color: "#fca311" },
  { id: 3, title: "1BHK Studio", location: "Delhi", type: "apartment", price: 1800000, bedrooms: 1, area: 480, color: "#2a9d8f" },
  { id: 4, title: "Independent House", location: "Agra", type: "house", price: 5600000, bedrooms: 3, area: 1600, color: "#e76f51" },
  { id: 5, title: "Residential Plot", location: "Mathura", type: "plot", price: 950000, bedrooms: 0, area: 1200, color: "#457b9d" },
  { id: 6, title: "3BHK Flat", location: "Noida", type: "apartment", price: 6800000, bedrooms: 3, area: 1350, color: "#14213d" },
  { id: 7, title: "Farmhouse", location: "Vrindavan", type: "villa", price: 18000000, bedrooms: 5, area: 4500, color: "#fca311" },
  { id: 8, title: "2BHK House", location: "Agra", type: "apartment", price: 4100000, bedrooms: 2, area: 1020, color: "#2a9d8f" }
];

function loadProperties() {
  renderProperties(allProperties);
}

function applyFilters() {

  var search = document.getElementById("searchInput").value.toLowerCase();
  var type = document.getElementById("typeFilter").value;
  var minPrice = document.getElementById("minPrice").value;
  var maxPrice = document.getElementById("maxPrice").value;
  var bedrooms = document.getElementById("bedroomsFilter").value;

  var result = [];

  for (var i = 0; i < allProperties.length; i++) {

    var p = allProperties[i];

    var match = true;

    if (search != "") {
      if (p.title.toLowerCase().indexOf(search) == -1 &&
          p.location.toLowerCase().indexOf(search) == -1) {
        match = false;
      }
    }

    if (type != "all" && p.type != type) {
      match = false;
    }

    if (minPrice != "" && p.price < Number(minPrice)) {
      match = false;
    }

    if (maxPrice != "" && p.price > Number(maxPrice)) {
      match = false;
    }

    if (bedrooms != "any") {
      if (bedrooms == "4") {
        if (p.bedrooms < 4) {
          match = false;
        }
      } else {
        if (p.bedrooms != Number(bedrooms)) {
          match = false;
        }
      }
    }

    if (match == true) {
      result.push(p);
    }
  }

  renderProperties(result);
}

function resetFilters() {

  document.getElementById("searchInput").value = "";
  document.getElementById("typeFilter").value = "all";
  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  document.getElementById("bedroomsFilter").value = "any";

  renderProperties(allProperties);
}

function renderProperties(properties) {

  var grid = document.getElementById("resultsGrid");
  var meta = document.getElementById("resultsMeta");

  grid.innerHTML = "";

  meta.innerHTML = properties.length + " properties found";

  var oldMessage = document.getElementById("noResultsMsg");

  if (oldMessage != null) {
    oldMessage.remove();
  }

  if (properties.length == 0) {
    grid.innerHTML = "<p>No properties found</p>";
    return;
  }

  for (var i = 0; i < properties.length; i++) {

    var p = properties[i];

    var price = "₹" + p.price.toLocaleString("en-IN");

    var bedroomText = p.bedrooms + " BHK";

    if (p.bedrooms == 0) {
      bedroomText = "Plot";
    }

    grid.innerHTML +=
      '<div class="property-card">' +
        '<div class="property-thumb" style="background-color:' + p.color + ';">' +
          p.type.toUpperCase() +
        '</div>' +
        '<div class="property-info">' +
          '<h4>' + p.title + '</h4>' +
          '<div class="location">' + p.location + '</div>' +
          '<div class="price">' + price + '</div>' +
          '<div class="property-meta">' +
            '<span>' + bedroomText + '</span>' +
            '<span>' + p.area + ' sq.ft</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }
}

function handleSearchKeypress(event) {
  if (event.key == "Enter") {
    applyFilters();
  }
}
