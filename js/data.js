// All the built-in property data lives here.
// status can be "Available", "Sold" or "Rented". featured: true shows a Featured badge.
// Properties the user adds, edits or deletes are saved in the browser (see the bottom of this file).

var properties = [
  {
    id: 1,
    status: "Available",
    featured: true,
    title: "Krishna Vihar Villa",
    type: "Villa",
    location: "Vrindavan Road, Mathura",
    price: 18500000,
    priceText: "₹ 1.85 Cr",
    bedrooms: 4,
    bathrooms: 3,
    area: 2600,
    parking: 2,
    agent: "Rohan Verma",
    description: "A spacious independent villa set in a quiet, green neighbourhood along Vrindavan Road, offering a private garden, an open living and dining layout, and a dedicated parking area. Ready for immediate move-in, with easy access to Mathura Junction, local markets, and NH-19.",
    amenities: ["Private garden & lawn", "Covered two-car parking", "24x7 water supply", "Power backup", "Gated community security", "Close to schools & markets"],
    images: ["1613977257363-707ba9348227", "1600585154340-be6161a56a0c", "1600596542815-ffad4c1539a9", "1512917774080-9991f1c4c750"]
  },
  {
    id: 2,
    status: "Available",
    featured: false,
    title: "Radha Residency, 3BHK",
    type: "Apartment",
    location: "Chaitanya Vihar, Mathura",
    price: 7800000,
    priceText: "₹ 78 L",
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    parking: 1,
    agent: "Neha Sharma",
    description: "A bright 3BHK apartment in a well-kept residential society with a lift, covered parking and a peaceful central courtyard. Schools, hospitals and markets are all within a short drive.",
    amenities: ["Lift access", "Covered parking", "24x7 security", "Power backup", "Children's play area", "Near schools & hospitals"],
    images: ["1512917774080-9991f1c4c750", "1600585154340-be6161a56a0c", "1613977257363-707ba9348227", "1568605114967-8130f3a36994"]
  },
  {
    id: 3,
    status: "Sold",
    featured: false,
    title: "Yamuna Kunj Residence",
    type: "Independent House",
    location: "Deeg Gate, Mathura",
    price: 11000000,
    priceText: "₹ 1.1 Cr",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    parking: 1,
    agent: "Amit Gupta",
    description: "A well-built independent house with a front lawn and a spacious terrace, located close to the heart of the city with easy access to the main market and public transport.",
    amenities: ["Front lawn", "Open terrace", "Water storage tank", "Power backup", "Near main market", "Quiet lane"],
    images: ["1570129477492-45c003edd2be", "1600596542815-ffad4c1539a9", "1613977257363-707ba9348227", "1512917774080-9991f1c4c750"]
  },
  {
    id: 4,
    status: "Available",
    featured: false,
    title: "Govind Nagar Residency, 2BHK",
    type: "Apartment",
    location: "Govind Nagar, Mathura",
    price: 5200000,
    priceText: "₹ 52 L",
    bedrooms: 2,
    bathrooms: 2,
    area: 1050,
    parking: 1,
    agent: "Pooja Singh",
    description: "An affordable 2BHK apartment with a modern kitchen and good natural light, ideal for small families and first-time buyers. Located in a developed neighbourhood with daily-needs shops nearby.",
    amenities: ["Modular kitchen", "Covered parking", "24x7 water supply", "CCTV security", "Near daily markets", "Lift access"],
    images: ["1600585154340-be6161a56a0c", "1512917774080-9991f1c4c750", "1570129477492-45c003edd2be", "1568605114967-8130f3a36994"]
  },
  {
    id: 5,
    status: "Available",
    featured: false,
    title: "GLA Enclave Plot #14",
    type: "Plot",
    location: "NH-19, Near GLA University, Mathura",
    price: 3400000,
    priceText: "₹ 34 L",
    bedrooms: 0,
    bathrooms: 0,
    area: 1200,
    parking: 0,
    agent: "Sanjay Verma",
    description: "A clear-title residential plot on NH-19, close to GLA University. The plot is on a 30 ft wide road and is suitable for building a home or for long-term investment.",
    amenities: ["Clear title", "30 ft wide road", "Near NH-19", "Electricity connection nearby", "Close to GLA University", "Good investment location"],
    images: ["1600596542815-ffad4c1539a9", "1613977257363-707ba9348227", "1570129477492-45c003edd2be", "1512917774080-9991f1c4c750"]
  },
  {
    id: 6,
    status: "Available",
    featured: true,
    title: "Vrindavan Heights Villa",
    type: "Villa",
    location: "Parikrama Marg, Vrindavan, Mathura",
    price: 24000000,
    priceText: "₹ 2.4 Cr",
    bedrooms: 5,
    bathrooms: 4,
    area: 3400,
    parking: 3,
    agent: "Karan Mehta",
    description: "A luxury villa near Parikrama Marg with large living spaces, a landscaped garden and a private terrace. A premium choice for families who want space, privacy and a peaceful setting.",
    amenities: ["Landscaped garden", "Private terrace", "Three-car parking", "Power backup", "Gated security", "Near Parikrama Marg"],
    images: ["1568605114967-8130f3a36994", "1613977257363-707ba9348227", "1600596542815-ffad4c1539a9", "1570129477492-45c003edd2be"]
  }
];


// Builds the full image link from a photo id and a width.
// A full link (http...) or an uploaded image (data:...) is used as it is.
function getImage(id, width) {
  var text = String(id);
  if (text.indexOf("http") === 0 || text.indexOf("data:") === 0) {
    return text;
  }
  return "https://images.unsplash.com/photo-" + text + "?auto=format&fit=crop&w=" + width + "&q=80";
}

// ---------- Small helpers ----------

// Stops text typed by the user from breaking the page
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Turns 7800000 into "₹ 78 L" and 18500000 into "₹ 1.85 Cr"
function formatPrice(price) {
  if (price >= 10000000) {
    return "₹ " + (price / 10000000).toFixed(2).replace(/\.?0+$/, "") + " Cr";
  }
  if (price >= 100000) {
    return "₹ " + (price / 100000).toFixed(2).replace(/\.?0+$/, "") + " L";
  }
  return "₹ " + price.toLocaleString("en-IN");
}

// Finds one property in a list by its id (returns null if it is not there)
function findById(list, id) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list[i];
    }
  }
  return null;
}

// ---------- Saving in the browser (localStorage) ----------
// "userProperties" = properties the user added OR edited
// "deletedIds"     = ids of built-in properties the user deleted

function readList(key) {
  try {
    var saved = localStorage.getItem(key);
    if (saved) {
      var list = JSON.parse(saved);
      if (Array.isArray(list)) {
        return list;
      }
    }
  } catch (e) {}
  return [];
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch (e) {
    return false; // for example, the browser storage is full
  }
}

function getSavedProperties() {
  return readList("userProperties");
}

function saveUserProperties(list) {
  return writeList("userProperties", list);
}

function getDeletedIds() {
  return readList("deletedIds");
}

function saveDeletedIds(list) {
  return writeList("deletedIds", list);
}

// ---------- Putting the full list together ----------

var builtInProperties = properties; // the properties written at the top of this file

function isBuiltIn(id) {
  return findById(builtInProperties, id) !== null;
}

// Makes sure every property has a status and a featured value
function fillDefaults(p) {
  if (!p.status) {
    p.status = "Available";
  }
  p.featured = p.featured === true;
  return p;
}

// Built-in + added + edited properties, without the deleted ones
function loadAllProperties() {
  var saved = getSavedProperties();
  var deleted = getDeletedIds();
  var all = [];

  for (var i = 0; i < builtInProperties.length; i++) {
    var original = builtInProperties[i];
    if (deleted.indexOf(original.id) === -1) {
      var edited = findById(saved, original.id);
      all.push(fillDefaults(edited ? edited : original));
    }
  }

  for (var j = 0; j < saved.length; j++) {
    var isNew = !isBuiltIn(saved[j].id);
    if (isNew && deleted.indexOf(saved[j].id) === -1) {
      all.push(fillDefaults(saved[j]));
    }
  }

  return all;
}

// The next free id for a new property
function getNextId() {
  var maxId = 0;
  var lists = [builtInProperties, getSavedProperties()];
  for (var i = 0; i < lists.length; i++) {
    for (var j = 0; j < lists[i].length; j++) {
      if (lists[i][j].id > maxId) {
        maxId = lists[i][j].id;
      }
    }
  }
  return maxId + 1;
}

// Saves a new property, or replaces the one with the same id. Returns true or false.
function saveProperty(p) {
  var saved = getSavedProperties();
  var replaced = false;

  for (var i = 0; i < saved.length; i++) {
    if (saved[i].id === p.id) {
      saved[i] = p;
      replaced = true;
    }
  }
  if (!replaced) {
    saved.push(p);
  }
  return saveUserProperties(saved);
}

// Deletes a property (built-in ones are hidden, added ones are removed)
function deleteProperty(id) {
  var saved = getSavedProperties();
  var kept = [];
  for (var i = 0; i < saved.length; i++) {
    if (saved[i].id !== id) {
      kept.push(saved[i]);
    }
  }
  saveUserProperties(kept);

  if (isBuiltIn(id)) {
    var deleted = getDeletedIds();
    if (deleted.indexOf(id) === -1) {
      deleted.push(id);
      saveDeletedIds(deleted);
    }
  }

  // Also remove it from the saved favorites
  var favorites = readList("favorites");
  var index = favorites.indexOf(id);
  if (index !== -1) {
    favorites.splice(index, 1);
    writeList("favorites", favorites);
  }
}

// Brings back the original demo data
function resetAllChanges() {
  try {
    localStorage.removeItem("userProperties");
    localStorage.removeItem("deletedIds");
  } catch (e) {}
}

// A short message that is shown once on the next page (like "Property saved")
function setFlash(text) {
  try {
    sessionStorage.setItem("flash", text);
  } catch (e) {}
}

function takeFlash() {
  try {
    var text = sessionStorage.getItem("flash");
    sessionStorage.removeItem("flash");
    return text;
  } catch (e) {}
  return null;
}

// From now on, pages use the full list
properties = loadAllProperties();

// ---------- Inquiries (messages sent from the property page) ----------
function getInquiries() {
  return readList("inquiries");
}

function saveInquiries(list) {
  return writeList("inquiries", list);
}

// Adds a new inquiry at the top of the list. Returns true or false.
function addInquiry(inquiry) {
  var list = getInquiries();
  inquiry.id = Date.now();
  inquiry.read = false;
  list.unshift(inquiry);
  return saveInquiries(list);
}
