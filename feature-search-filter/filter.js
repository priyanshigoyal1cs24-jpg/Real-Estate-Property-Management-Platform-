
const allProperties = [
  { id: 1, title: "2BHK Apartment",    location: "Mathura",   type: "apartment", price: 3200000,  bedrooms: 2, area: 950,  color: "#14213d" },
  { id: 2, title: "Luxury Villa",      location: "Noida",     type: "villa",     price: 12500000, bedrooms: 4, area: 3200, color: "#fca311" },
  { id: 3, title: "1BHK Studio",       location: "Delhi",     type: "apartment", price: 1800000,  bedrooms: 1, area: 480,  color: "#2a9d8f" },
  { id: 4, title: "Independent House", location: "Agra",      type: "house",     price: 5600000,  bedrooms: 3, area: 1600, color: "#e76f51" },
  { id: 5, title: "Residential Plot",  location: "Mathura",   type: "plot",      price: 950000,   bedrooms: 0, area: 1200, color: "#457b9d" },
  { id: 6, title: "3BHK Flat",         location: "Noida",     type: "apartment", price: 6800000,  bedrooms: 3, area: 1350, color: "#14213d" },
  { id: 7, title: "Farmhouse",         location: "Vrindavan", type: "villa",     price: 18000000, bedrooms: 5, area: 4500, color: "#fca311" },
  { id: 8, title: "2BHK House",        location: "Agra",      type: "apartment", price: 4100000,  bedrooms: 2, area: 1020, color: "#2a9d8f" }
];

// live search ke liye timer
let searchTimer = null;


// ---------- 2. PAGE LOAD ----------
// body onload se ye function chalta hai
function loadProperties() {
  fillLocationOptions();
  setupListeners();
  applyFilters();
}

// data me jitni alag cities hain, utne options dropdown me daal deta hai
function fillLocationOptions() {
  const select = document.getElementById("locationFilter");
  const cities = [];

  for (let i = 0; i < allProperties.length; i++) {
    const city = allProperties[i].location;

    // sirf tab add karo jab city list me pehle se na ho
    if (cities.indexOf(city) === -1) {
      cities.push(city);
    }
  }

  cities.sort();

  for (let i = 0; i < cities.length; i++) {
    const option = document.createElement("option");
    option.value = cities[i];
    option.textContent = cities[i];
    select.appendChild(option);
  }
}

// events jodta hai (typing, dropdown change)
function setupListeners() {
  const searchBox = document.getElementById("searchInput");

  // typing rukne ke 300 milliseconds baad search hoga
  // (har key pe nahi, taaki page baar baar na chale)
  searchBox.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 300);
  });

  // dropdown badalte hi filter lag jaye
  document.getElementById("typeFilter").addEventListener("change", applyFilters);
  document.getElementById("locationFilter").addEventListener("change", applyFilters);
  document.getElementById("bedroomsFilter").addEventListener("change", applyFilters);
  document.getElementById("sortSelect").addEventListener("change", applyFilters);
}

// search box me Enter dabane par turant search
function handleSearchKeypress(event) {
  if (event.key === "Enter") {
    clearTimeout(searchTimer);
    applyFilters();
  }
}


// ---------- 3. FILTER LOGIC ----------

// page ke saare input boxes ki value ek object me le aata hai
function getFilters() {
  const filters = {
    keyword: document.getElementById("searchInput").value.trim(),
    type: document.getElementById("typeFilter").value,
    location: document.getElementById("locationFilter").value,
    minPrice: document.getElementById("minPrice").value,
    maxPrice: document.getElementById("maxPrice").value,
    bedrooms: document.getElementById("bedroomsFilter").value
  };
  return filters;
}

// ek property ko check karta hai: filters se match karti hai? (true/false)
// Idea: koi bhi condition fail hui to turant false, sab pass hui to true
function matchesFilters(property, f) {

  // 1. keyword (title ya location me hona chahiye)
  if (f.keyword !== "") {
    const keyword = f.keyword.toLowerCase();
    const title = property.title.toLowerCase();
    const location = property.location.toLowerCase();

    if (title.indexOf(keyword) === -1 && location.indexOf(keyword) === -1) {
      return false;
    }
  }

  // 2. property type
  if (f.type !== "all" && property.type !== f.type) {
    return false;
  }

  // 3. location
  if (f.location !== "all" && property.location !== f.location) {
    return false;
  }

  // 4. minimum price
  if (f.minPrice !== "" && property.price < Number(f.minPrice)) {
    return false;
  }

  // 5. maximum price
  if (f.maxPrice !== "" && property.price > Number(f.maxPrice)) {
    return false;
  }

  // 6. bedrooms ("4" ka matlab 4 ya usse zyada)
  if (f.bedrooms !== "any") {
    const wanted = Number(f.bedrooms);

    if (wanted === 4) {
      if (property.bedrooms < 4) {
        return false;
      }
    } else {
      if (property.bedrooms !== wanted) {
        return false;
      }
    }
  }

  // koi condition fail nahi hui
  return true;
}

// list ko sort karta hai (original list ko nahi chhedta, copy banata hai)
function sortProperties(list, sortBy) {
  const sorted = list.slice();

  if (sortBy === "price-low") {
    sorted.sort(function (a, b) { return a.price - b.price; });
  } else if (sortBy === "price-high") {
    sorted.sort(function (a, b) { return b.price - a.price; });
  } else if (sortBy === "area-high") {
    sorted.sort(function (a, b) { return b.area - a.area; });
  } else if (sortBy === "area-low") {
    sorted.sort(function (a, b) { return a.area - b.area; });
  }

  return sorted;
}

// MAIN FUNCTION: filter -> sort -> screen pe dikhao
function applyFilters() {
  const f = getFilters();
  const priceError = document.getElementById("priceError");

  // min price, max price se zyada hai to error dikhao aur ruk jao
  if (f.minPrice !== "" && f.maxPrice !== "" && Number(f.minPrice) > Number(f.maxPrice)) {
    priceError.style.display = "block";
    return;
  }
  priceError.style.display = "none";

  // jo properties match hui unhe result me daalo
  const result = [];
  for (let i = 0; i < allProperties.length; i++) {
    if (matchesFilters(allProperties[i], f)) {
      result.push(allProperties[i]);
    }
  }

  const sortBy = document.getElementById("sortSelect").value;
  const sortedResult = sortProperties(result, sortBy);

  renderProperties(sortedResult);
  renderActiveFilters(f);
}


// ---------- 4. SCREEN PE DIKHANA ----------

// property cards banata hai
function renderProperties(properties) {
  const grid = document.getElementById("resultsGrid");
  const meta = document.getElementById("resultsMeta");

  meta.textContent = "Showing " + properties.length + " of " + allProperties.length + " properties";

  // pehle ka "no results" message ho to hata do
  const oldMessage = document.getElementById("noResultsMsg");
  if (oldMessage) {
    oldMessage.remove();
  }

  // kuch match nahi hua
  if (properties.length === 0) {
    grid.innerHTML = "";
    grid.insertAdjacentHTML(
      "afterend",
      '<div class="no-results" id="noResultsMsg">No properties match your search. Try changing the filters.</div>'
    );
    return;
  }

  // har property ka card banao
  let cardsHtml = "";

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    const price = "₹" + p.price.toLocaleString("en-IN");

    let bedroomText = p.bedrooms + " BHK";
    if (p.bedrooms === 0) {
      bedroomText = "Plot";
    }

    cardsHtml += '<div class="property-card">';
    cardsHtml += '  <div class="property-thumb" style="background-color: ' + p.color + ';">' + p.type.toUpperCase() + '</div>';
    cardsHtml += '  <div class="property-info">';
    cardsHtml += '    <h4>' + p.title + '</h4>';
    cardsHtml += '    <div class="location">' + p.location + '</div>';
    cardsHtml += '    <div class="price">' + price + '</div>';
    cardsHtml += '    <div class="property-meta"><span>' + bedroomText + '</span><span>' + p.area + ' sq.ft</span></div>';
    cardsHtml += '  </div>';
    cardsHtml += '</div>';
  }

  grid.innerHTML = cardsHtml;
}

// user ke likhe text ko safe banata hai (HTML me galti se code na chal jaye)
function makeSafe(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// jo filters lage hain unke chips (chhote tags) dikhata hai
function renderActiveFilters(f) {
  const box = document.getElementById("activeFilters");
  const chips = [];

  if (f.keyword !== "") {
    chips.push({ key: "keyword", label: "Search: " + f.keyword });
  }
  if (f.type !== "all") {
    chips.push({ key: "type", label: "Type: " + f.type });
  }
  if (f.location !== "all") {
    chips.push({ key: "location", label: "Location: " + f.location });
  }
  if (f.minPrice !== "") {
    chips.push({ key: "minPrice", label: "Min: ₹" + Number(f.minPrice).toLocaleString("en-IN") });
  }
  if (f.maxPrice !== "") {
    chips.push({ key: "maxPrice", label: "Max: ₹" + Number(f.maxPrice).toLocaleString("en-IN") });
  }
  if (f.bedrooms !== "any") {
    let bedroomLabel = f.bedrooms;
    if (f.bedrooms === "4") {
      bedroomLabel = "4+";
    }
    chips.push({ key: "bedrooms", label: "Bedrooms: " + bedroomLabel });
  }

  let html = "";

  for (let i = 0; i < chips.length; i++) {
    html += '<span class="chip">' + makeSafe(chips[i].label);
    html += '<button onclick="removeFilter(\'' + chips[i].key + '\')">×</button></span>';
  }

  // 2 ya zyada filters lage hon to "Clear all" bhi dikhao
  if (chips.length > 1) {
    html += '<button class="clear-all" onclick="resetFilters()">Clear all</button>';
  }

  box.innerHTML = html;
}


// ---------- 5. FILTER HATANA ----------

// chip ke x pe click karne par sirf wahi filter hatao
function removeFilter(key) {
  if (key === "keyword") {
    document.getElementById("searchInput").value = "";
  } else if (key === "type") {
    document.getElementById("typeFilter").value = "all";
  } else if (key === "location") {
    document.getElementById("locationFilter").value = "all";
  } else if (key === "minPrice") {
    document.getElementById("minPrice").value = "";
  } else if (key === "maxPrice") {
    document.getElementById("maxPrice").value = "";
  } else if (key === "bedrooms") {
    document.getElementById("bedroomsFilter").value = "any";
  }

  applyFilters();
}

// saare filters clear
function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("typeFilter").value = "all";
  document.getElementById("locationFilter").value = "all";
  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  document.getElementById("bedroomsFilter").value = "any";
  document.getElementById("sortSelect").value = "default";

  applyFilters();
}