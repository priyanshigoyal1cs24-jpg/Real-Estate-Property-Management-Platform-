// Property page: reads ?id= from the link, finds that property, and fills the page.

// Step 1: find which property to show (link looks like property.html?id=2)
var idText = window.location.search.split("=")[1];
var id = Number(idText);
if (isNaN(id) || idText === undefined) {
  id = 1;
}

var property = null;
for (var i = 0; i < properties.length; i++) {
  if (properties[i].id === id) {
    property = properties[i];
  }
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

  // Big image + small thumbnails
  var mainImage = document.getElementById("main-image");
  mainImage.src = getImage(p.images[0], 1000);
  mainImage.alt = p.title + " exterior";

  var thumbsHtml = "";
  for (var i = 0; i < p.images.length; i++) {
    thumbsHtml += '<div class="thumb"><img src="' + getImage(p.images[i], 200) + '" data-index="' + i + '" alt="' + p.title + ' photo ' + (i + 1) + '"></div>';
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
    amenitiesHtml += "<li>" + p.amenities[m] + "</li>";
  }
  document.getElementById("amenities").innerHTML = amenitiesHtml;

  // Inquiry form
  var button = document.getElementById("send-btn");
  var formMsg = document.getElementById("form-msg");

  button.onclick = function () {
    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();

    if (name === "") {
      formMsg.textContent = "Please enter your name.";
      formMsg.className = "form-msg error";
    } else if (phone === "" || isNaN(phone) || phone.length !== 10) {
      formMsg.textContent = "Please enter a valid 10-digit phone number.";
      formMsg.className = "form-msg error";
    } else {
      formMsg.textContent = "Thank you " + name + "! Your inquiry for " + p.title + " has been sent.";
      formMsg.className = "form-msg success";
      document.getElementById("name").value = "";
      document.getElementById("phone").value = "";
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
