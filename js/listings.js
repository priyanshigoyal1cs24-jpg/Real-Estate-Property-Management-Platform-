// Listings page: shows the cards and handles search, filter, sort and favorites

var grid = document.getElementById("property-grid");
var searchBox = document.getElementById("search-box");
var sortSelect = document.getElementById("sort-select");
var countText = document.getElementById("result-count");
var filterButtons = document.querySelectorAll(".filter-btn");

var activeType = "All";

// ---------- Favorites (saved in the browser) ----------
function getFavorites() {
  try {
    var saved = localStorage.getItem("favorites");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return [];
}

function saveFavorites(list) {
  try {
    localStorage.setItem("favorites", JSON.stringify(list));
  } catch (e) {}
}

function toggleFavorite(id) {
  var favorites = getFavorites();
  var index = favorites.indexOf(id);

  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }
  saveFavorites(favorites);
}

// ---------- Show the cards on the page ----------
function showProperties(list) {
  var favorites = getFavorites();
  var html = "";

  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    var heartClass = "fav-btn";
    if (favorites.indexOf(p.id) !== -1) {
      heartClass = "fav-btn active";
    }

    html += '<article class="property-card">';
    html += '  <div class="photo">';
    html += '    <span class="tag">' + p.type + '</span>';
    html += '    <button type="button" class="' + heartClass + '" data-id="' + p.id + '" title="Save to favorites">♥</button>';
    html += '    <img src="' + getImage(p.images[0], 600) + '" alt="' + p.title + '">';
    html += '  </div>';
    html += '  <div class="body">';
    html += '    <h3>' + p.title + '</h3>';
    html += '    <p class="location">' + p.location + '</p>';
    html += '    <div class="card-footer">';
    html += '      <span class="price">' + p.priceText + '</span>';
    html += '      <a href="property.html?id=' + p.id + '" class="view-link">View Details</a>';
    html += '    </div>';
    html += '  </div>';
    html += '</article>';
  }

  if (list.length === 0) {
    html = '<p class="empty-msg">No properties found. Try a different search or filter.</p>';
  }

  grid.innerHTML = html;

  if (list.length === 1) {
    countText.textContent = "1 result";
  } else {
    countText.textContent = list.length + " results";
  }

  // Make the heart buttons work
  var hearts = document.querySelectorAll(".fav-btn");
  for (var j = 0; j < hearts.length; j++) {
    hearts[j].onclick = function () {
      toggleFavorite(Number(this.getAttribute("data-id")));
      applyFilters();
    };
  }
}

// ---------- Search + filter + sort together ----------
function applyFilters() {
  var searchText = searchBox.value.toLowerCase();
  var favorites = getFavorites();
  var result = [];

  for (var i = 0; i < properties.length; i++) {
    var p = properties[i];

    var typeMatch = false;
    if (activeType === "All") {
      typeMatch = true;
    } else if (activeType === "Favorites") {
      typeMatch = favorites.indexOf(p.id) !== -1;
    } else {
      typeMatch = p.type === activeType;
    }

    var searchMatch =
      p.title.toLowerCase().indexOf(searchText) !== -1 ||
      p.location.toLowerCase().indexOf(searchText) !== -1;

    if (typeMatch && searchMatch) {
      result.push(p);
    }
  }

  if (sortSelect.value === "low") {
    result.sort(function (a, b) { return a.price - b.price; });
  } else if (sortSelect.value === "high") {
    result.sort(function (a, b) { return b.price - a.price; });
  }

  showProperties(result);
}

// ---------- Events ----------
searchBox.oninput = applyFilters;
sortSelect.onchange = applyFilters;

for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].onclick = function () {
    for (var j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("active");
    }
    this.classList.add("active");
    activeType = this.getAttribute("data-type");
    applyFilters();
  };
}

// Show everything when the page first loads
applyFilters();
