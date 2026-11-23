// Property page: reads ?id= from the link, finds that property, and fills the page.

// Step 1: find which property to show (link looks like property.html?id=2)
var idText = new URLSearchParams(window.location.search).get("id");
var id = Number(idText);

if (idText === null || isNaN(id)) {
  // No id in the link: show the first property in the list
  id = properties.length > 0 ? properties[0].id : 0;
}

var property = findById(properties, id);

// ---------- EMI calculator ----------
function formatRupees(amount) {
  return "₹ " + Math.round(amount).toLocaleString("en-IN");
}

function setupEmi(p) {
  var amountBox = document.getElementById("emi-amount");
  var rateBox = document.getElementById("emi-rate");
  var yearsBox = document.getElementById("emi-years");

  function calculate() {
    var amount = Number(amountBox.value);
    var rate = Number(rateBox.value);
    var years = Number(yearsBox.value);

    if (!(amount > 0) || !(years > 0) || isNaN(rate) || rate < 0) {
      document.getElementById("emi-monthly").textContent = "—";
      document.getElementById("emi-interest").textContent = "—";
      document.getElementById("emi-total").textContent = "—";
      return;
    }

    var months = years * 12;
    var monthlyRate = rate / 12 / 100;
    var emi;

    if (monthlyRate === 0) {
      emi = amount / months;
    } else {
      var power = Math.pow(1 + monthlyRate, months);
      emi = (amount * monthlyRate * power) / (power - 1);
    }

    var total = emi * months;
    document.getElementById("emi-monthly").textContent = formatRupees(emi);
    document.getElementById("emi-interest").textContent = formatRupees(total - amount);
    document.getElementById("emi-total").textContent = formatRupees(total);
  }

  amountBox.value = Math.round(p.price * 0.8); // a loan of 80% of the price
  amountBox.oninput = calculate;
  rateBox.oninput = calculate;
  yearsBox.oninput = calculate;
  calculate();
}

// ---------- Similar properties ----------
function showSimilar(p) {
  var list = [];
  var i;

  // Same type first
  for (i = 0; i < properties.length; i++) {
    if (properties[i].id !== p.id && properties[i].type === p.type) {
      list.push(properties[i]);
    }
  }
  // Then fill up with other properties
  for (i = 0; i < properties.length && list.length < 3; i++) {
    if (properties[i].id !== p.id && list.indexOf(properties[i]) === -1) {
      list.push(properties[i]);
    }
  }
  list = list.slice(0, 3);

  if (list.length === 0) {
    document.getElementById("similar-section").style.display = "none";
    return;
  }

  var html = "";
  for (i = 0; i < list.length; i++) {
    var s = list[i];
    html += '<article class="property-card">';
    html += '  <div class="photo">';
    html += '    <span class="tag">' + escapeHtml(s.type) + '</span>';
    html += '    <img src="' + escapeHtml(getImage(s.images[0], 600)) + '" alt="' + escapeHtml(s.title) + '">';
    html += '    <span class="status-badge status-' + s.status.toLowerCase() + '">' + escapeHtml(s.status) + '</span>';
    html += '  </div>';
    html += '  <div class="body">';
    html += '    <h3>' + escapeHtml(s.title) + '</h3>';
    html += '    <p class="location">' + escapeHtml(s.location) + '</p>';
    html += '    <div class="card-footer">';
    html += '      <span class="price">' + escapeHtml(s.priceText) + '</span>';
    html += '      <a href="property.html?id=' + s.id + '" class="view-link">View Details</a>';
    html += '    </div>';
    html += '  </div>';
    html += '</article>';
  }
  document.getElementById("similar-grid").innerHTML = html;
}

// Step 2: fill the page
function showProperty(p) {
  document.title = p.title + " — Haven";

  document.getElementById("crumb-name").textContent = p.title;
  document.getElementById("prop-title").textContent = p.title;
  document.getElementById("prop-price").textContent = p.priceText;
  document.getElementById("prop-location").textContent = p.location + " — " + p.type;
  document.getElementById("prop-description").textContent = p.description;
  document.getElementById("agent-name").textContent = "Listed by " + p.agent;
  document.getElementById("message").value = "I'm interested in " + p.title + ". Please share more details.";

  // Status and featured badges
  var badgeHtml = '<span class="status-badge status-' + p.status.toLowerCase() + '">' + escapeHtml(p.status) + '</span>';
  if (p.featured) {
    badgeHtml += '<span class="featured-badge">★ Featured</span>';
  }
  document.getElementById("badge-row").innerHTML = badgeHtml;

  // Edit and delete
  document.getElementById("edit-link").href = "add-property.html?edit=" + p.id;
  document.getElementById("delete-btn").onclick = function () {
    if (confirm('Delete "' + p.title + '"? This cannot be undone.')) {
      deleteProperty(p.id);
      setFlash("Property deleted.");
      window.location.href = "listings.html";
    }
  };

  // Big image + small thumbnails
  var mainImage = document.getElementById("main-image");
  mainImage.src = getImage(p.images[0], 1000);
  mainImage.alt = p.title + " exterior";

  var thumbsHtml = "";
  for (var i = 0; i < p.images.length; i++) {
    thumbsHtml += '<div class="thumb"><img src="' + escapeHtml(getImage(p.images[i], 200)) + '" data-index="' + i + '" alt="' + escapeHtml(p.title) + ' photo ' + (i + 1) + '"></div>';
  }
  document.getElementById("thumbs").innerHTML = thumbsHtml;

  var thumbs = document.querySelectorAll("#thumbs img");
  for (var j = 0; j < thumbs.length; j++) {
    thumbs[j].onclick = function () {
      var index = Number(this.getAttribute("data-index"));
      mainImage.src = getImage(p.images[index], 1000);
      mainImage.alt = this.alt;
    };
  }

  // Specs (a plot has no bedrooms, bathrooms or parking, so we skip those)
  var specs = [];
  if (p.bedrooms > 0) {
    specs.push({ num: p.bedrooms, label: "Bedrooms" });
  }
  if (p.bathrooms > 0) {
    specs.push({ num: p.bathrooms, label: "Bathrooms" });
  }
  specs.push({ num: p.area.toLocaleString("en-IN"), label: "Sq. Ft." });
  if (p.parking > 0) {
    specs.push({ num: p.parking, label: "Parking" });
  }

  var specHtml = "";
  for (var k = 0; k < specs.length; k++) {
    specHtml += '<div><span class="num">' + specs[k].num + '</span><span class="label">' + specs[k].label + '</span></div>';
  }
  document.getElementById("spec-strip").innerHTML = specHtml;

  // Amenities list
  var amenitiesHtml = "";
  for (var m = 0; m < p.amenities.length; m++) {
    amenitiesHtml += "<li>" + escapeHtml(p.amenities[m]) + "</li>";
  }
  if (p.amenities.length === 0) {
    amenitiesHtml = "<li>No amenities listed.</li>";
  }
  document.getElementById("amenities").innerHTML = amenitiesHtml;

  // Map
  document.getElementById("map-frame").src =
    "https://www.google.com/maps?q=" + encodeURIComponent(p.location) + "&output=embed";

  // EMI calculator and similar properties
  setupEmi(p);
  showSimilar(p);

  // Inquiry form
  var button = document.getElementById("send-btn");
  var formMsg = document.getElementById("form-msg");

  button.onclick = function () {
    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();

    if (name === "") {
      formMsg.textContent = "Please enter your name.";
      formMsg.className = "form-msg error";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      formMsg.textContent = "Please enter a valid 10-digit phone number.";
      formMsg.className = "form-msg error";
    } else {
      // Save the inquiry so it shows on the Inquiries page
      var saved = addInquiry({
        propertyId: p.id,
        propertyTitle: p.title,
        name: name,
        phone: phone,
        message: document.getElementById("message").value.trim(),
        date: new Date().toISOString()
      });

      if (saved) {
        formMsg.textContent = "Thank you " + name + "! Your inquiry for " + p.title + " has been sent.";
        formMsg.className = "form-msg success";
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
      } else {
        formMsg.textContent = "Sorry, the inquiry could not be saved. Please try again.";
        formMsg.className = "form-msg error";
      }
    }
  };
}

// Step 3: show the property, or a message if the id is wrong
if (property === null) {
  document.querySelector(".details-section .wrap").innerHTML =
    '<p class="empty-msg">Property not found. <a href="listings.html">Go back to listings</a></p>';
} else {
  showProperty(property);
}
