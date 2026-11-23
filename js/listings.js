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

  //
