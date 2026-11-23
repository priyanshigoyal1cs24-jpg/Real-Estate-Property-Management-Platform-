// Listings page: shows the cards and handles search, filters, sort, favorites, edit and delete

var grid = document.getElementById("property-grid");
var searchBox = document.getElementById("search-box");
var sortSelect = document.getElementById("sort-select");
var priceSelect = document.getElementById("price-select");
var bedroomSelect = document.getElementById("bedroom-select");
var statusSelect = document.getElementById("status-select");
var countText = document.getElementById("result-count");
var flashBox = document.getElementById("flash");
var clearBtn = document.getElementById("clear-filters");
var resetDataBtn = document.getElementById("reset-data");
var filterButtons = document.querySelectorAll(".filter-btn");

var activeType = "All";

// ---------- Short message at the top (saved, deleted...) ----------
function showFlash(text) {
  flashBox.textContent = text;
  flashBox.className = "flash show";
  setTimeout(function () {
    flashBox.className = "flash";
  }, 4000);
}

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
    html += '    <span class="tag">' + escapeHtml(p.type) + '</span>';
    html += '    <button type="button" class="' + heartClass + '" data-id="' + p.id + '" title="Save to favorites">♥</button>';
    html += '    <img src="' + escapeHtml(getImage(p.images[0], 600)) + '" alt="' + escapeHtml(p.title) + '">';
    html += '    <span class="status-badge status-' + p.status.toLowerCase() + '">' + escapeHtml(p.status) + '</span>';
    if (p.featured) {
      html += '    <span class="featured-badge">★ Featured</span>';
    }
    html += '  </div>';
    html += '  <div class="body">';
    html += '    <h3>' + escapeHtml(p.title) + '</h3>';
    html += '    <p class="location">' + escapeHtml(p.location) + '</p>';
    html += '    <div class="card-footer">';
    html += '      <span class="price">' + escapeHtml(p.priceText) + '</span>';
    html += '      <a href="property.html?id=' + p.id + '" class="view-link">View Details</a>';
    html += '    </div>';
    html += '    <div class="card-actions">';
    html += '      <a href="add-property.html?edit=' + p.id + '" class="action-link">Edit</a>';
    html += '      <button type="button" class="action-delete" data-id="' + p.id + '">Delete</button>';
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
  var hearts = grid.querySelectorAll(".fav-btn");
  for (var j = 0; j < hearts.length; j++) {
    hearts[j].onclick = function () {
      toggleFavorite(Number(this.getAttribute("data-id")));
      applyFilters();
    };
  }

  // Make the delete buttons work
  var deleteButtons = grid.querySelectorAll(".action-delete");
  for (var k = 0; k < deleteButtons.length; k++) {
    deleteButtons[k].onclick = function () {
      var id = Number(this.getAttribute("data-id"));
      var item = findById(properties, id);

      if (item && confirm('Delete "' + item.title + '"? This cannot be undone.')) {
        deleteProperty(id);
        properties = loadAllProperties();
        applyFilters();
        showFlash("Property deleted.");
      }
    };
  }
}

// ---------- Price and bedroom checks ----------
function priceMatch(price) {
  var range = priceSelect.value;

  if (range === "under50") {
    return price < 5000000;
  } else if (range === "50to100") {
    return price >= 5000000 && price < 10000000;
  } else if (range === "100to200") {
    return price >= 10000000 && price < 20000000;
  } else if (range === "above200") {
    return price >= 20000000;
  }
  return true;
}

function bedroomMatch(bedrooms) {
  if (bedroomSelect.value === "any") {
    return true;
  }
  return bedrooms >= Number(bedroomSelect.value);
}

// ---------- Search + filters + sort together ----------
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

    var statusMatch = statusSelect.value === "all" || p.status === statusSelect.value;

    if (typeMatch && searchMatch && statusMatch && priceMatch(p.price) && bedroomMatch(p.bedrooms)) {
      result.push(p);
    }
  }

  if (sortSelect.value === "low") {
    result.sort(function (a, b) { return a.price - b.price; });
  } else if (sortSelect.value === "high") {
    result.sort(function (a, b) { return b.price - a.price; });
  } else if (sortSelect.value === "newest") {
    result.sort(function (a, b) { return b.id - a.id; });
  }

  showProperties(result);
}

// ---------- Events ----------
searchBox.oninput = applyFilters;
sortSelect.onchange = applyFilters;
priceSelect.onchange = applyFilters;
bedroomSelect.onchange = applyFilters;
statusSelect.onchange = applyFilters;

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

// "Clear filters" puts search, filters and sort back to normal
clearBtn.onclick = function () {
  searchBox.value = "";
  sortSelect.value = "default";
  priceSelect.value = "all";
  bedroomSelect.value = "any";
  statusSelect.value = "all";
  activeType = "All";

  for (var j = 0; j < filterButtons.length; j++) {
    filterButtons[j].classList.remove("active");
  }
  filterButtons[0].classList.add("active");
  applyFilters();
};

// "Reset demo data" brings back the original properties
resetDataBtn.onclick = function () {
  if (confirm("Remove your added, edited and deleted changes and bring back the original properties?")) {
    resetAllChanges();
    properties = loadAllProperties();
    applyFilters();
    showFlash("Original properties restored.");
  }
};

// Show everything when the page first loads
applyFilters();

var flashText = takeFlash();
if (flashText) {
  showFlash(flashText);
}
