// Add / Edit property page.
// add-property.html          -> add a new property
// add-property.html?edit=3   -> edit the property with id 3

var form = document.getElementById("add-form");
var message = document.getElementById("form-message");
var previewBox = document.getElementById("image-preview");
var urlBox = document.getElementById("image-url");
var fileBox = document.getElementById("image-file");

var MAX_IMAGES = 4;
var imageList = []; // image links (or uploaded images) added so far

// ---------- Which mode are we in? ----------
var editId = new URLSearchParams(window.location.search).get("edit");
var editing = null;

if (editId !== null) {
  editing = findById(properties, Number(editId));
}

// ---------- Small helpers ----------
function getValue(id) {
  return document.getElementById(id).value.trim();
}

function showError(text, fieldId) {
  message.textContent = text;
  if (fieldId) {
    document.getElementById(fieldId).focus();
  }
}

// ---------- Photos ----------
function showPreview() {
  var html = "";

  for (var i = 0; i < imageList.length; i++) {
    html += '<div class="preview-item">';
    html += '  <img src="' + escapeHtml(getImage(imageList[i], 300)) + '" alt="Photo ' + (i + 1) + '">';
    html += '  <button type="button" data-index="' + i + '" title="Remove photo">×</button>';
    if (i === 0) {
      html += '  <span>Cover</span>';
    }
    html += '</div>';
  }
  previewBox.innerHTML = html;

  var removeButtons = previewBox.querySelectorAll("button");
  for (var j = 0; j < removeButtons.length; j++) {
    removeButtons[j].onclick = function () {
      imageList.splice(Number(this.getAttribute("data-index")), 1);
      showPreview();
    };
  }
}

document.getElementById("add-url-btn").onclick = function () {
  var link = urlBox.value.trim();

  if (link.indexOf("http") !== 0) {
    showError("An image link must start with http or https.", "image-url");
    return;
  }
  if (imageList.length >= MAX_IMAGES) {
    showError("You can add up to " + MAX_IMAGES + " photos.");
    return;
  }
  message.textContent = "";
  imageList.push(link);
  urlBox.value = "";
  showPreview();
};

// Makes an uploaded photo smaller so it fits in the browser storage
function shrinkImage(file, done) {
  var reader = new FileReader();

  reader.onload = function () {
    var img = new Image();

    img.onload = function () {
      var biggest = 900;
      var scale = Math.min(1, biggest / Math.max(img.width, img.height));
      var canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      done(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = function () {
      done(null);
    };
    img.src = reader.result;
  };
  reader.onerror = function () {
    done(null);
  };
  reader.readAsDataURL(file);
}

fileBox.onchange = function () {
  var files = Array.prototype.slice.call(fileBox.files);
  var room = MAX_IMAGES - imageList.length;
  var failed = false;

  if (files.length > room) {
    showError("You can add up to " + MAX_IMAGES + " photos. Only the first " + room + " were used.");
    files = files.slice(0, room);
  } else {
    message.textContent = "";
  }

  var waiting = files.length;
  if (waiting === 0) {
    fileBox.value = "";
    return;
  }

  for (var i = 0; i < files.length; i++) {
    shrinkImage(files[i], function (data) {
      if (data) {
        imageList.push(data);
      } else {
        failed = true;
      }
      waiting--;
      if (waiting === 0) {
        if (failed) {
          showError("One of the files could not be read as an image.");
        }
        fileBox.value = "";
        showPreview();
      }
    });
  }
};

// ---------- Fill the form when editing ----------
function fillForm(p) {
  document.getElementById("page-heading").textContent = "Edit property";
  document.getElementById("page-sub").textContent = "Change the details below and save. The listings page updates straight away.";
  document.getElementById("save-btn").textContent = "Update Property";
  document.title = "Edit Property — Haven";

  document.getElementById("title").value = p.title;
  document.getElementById("type").value = p.type;
  document.getElementById("status").value = p.status;
  document.getElementById("price").value = p.price;
  document.getElementById("area").value = p.area;
  document.getElementById("location").value = p.location;
  document.getElementById("bedrooms").value = p.bedrooms;
  document.getElementById("bathrooms").value = p.bathrooms;
  document.getElementById("parking").value = p.parking;
  document.getElementById("agent").value = p.agent;
  document.getElementById("description").value = p.description;
  document.getElementById("amenities").value = p.amenities.join(", ");
  document.getElementById("featured").checked = p.featured === true;

  // Built-in photos are only ids, so turn them into full links
  for (var i = 0; i < p.images.length; i++) {
    imageList.push(getImage(p.images[i], 1000));
  }
  showPreview();
}

if (editId !== null && editing === null) {
  // The id in the link does not match any property
  document.querySelector(".form-card").innerHTML =
    '<p class="empty-msg">Property not found. <a href="listings.html">Go back to listings</a></p>';
} else if (editing !== null) {
  fillForm(editing);
}

// ---------- Save ----------
form.onsubmit = function (e) {
  e.preventDefault();
  message.textContent = "";

  var title = getValue("title");
  var location = getValue("location");
  var price = Number(getValue("price"));
  var area = Number(getValue("area"));
  var description = getValue("description");

  if (title.length < 3) {
    showError("Please enter a title (at least 3 characters).", "title");
    return;
  }
  if (!(price > 0)) {
    showError("Please enter a price more than 0.", "price");
    return;
  }
  if (!(area > 0)) {
    showError("Please enter an area more than 0.", "area");
    return;
  }
  if (location.length < 3) {
    showError("Please enter the location.", "location");
    return;
  }
  if (imageList.length === 0) {
    showError("Please add at least one photo (a link or an upload).", "image-url");
    return;
  }
  if (description.length < 20) {
    showError("Description must be at least 20 characters.", "description");
    return;
  }

  var beds = Number(getValue("bedrooms"));
  var baths = Number(getValue("bathrooms"));
  var parking = Number(getValue("parking"));
  if (beds < 0 || baths < 0 || parking < 0) {
    showError("Bedrooms, bathrooms and parking cannot be negative.");
    return;
  }

  var amenities = [];
  var parts = getValue("amenities").split(",");
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].trim() !== "") {
      amenities.push(parts[i].trim());
    }
  }

  var property = {
    id: editing ? editing.id : getNextId(),
    status: getValue("status"),
    featured: document.getElementById("featured").checked,
    title: title,
    type: getValue("type"),
    location: location,
    price: Math.round(price),
    priceText: formatPrice(Math.round(price)),
    bedrooms: Math.round(beds),
    bathrooms: Math.round(baths),
    area: Math.round(area),
    parking: Math.round(parking),
    agent: getValue("agent") || "Haven Agent",
    description: description,
    amenities: amenities,
    images: imageList.slice()
  };

  if (!saveProperty(property)) {
    showError("Could not save. The browser storage is full. Remove a photo or use image links instead of uploads.");
    return;
  }

  if (editing) {
    setFlash('"' + title + '" was updated.');
  } else {
    setFlash('"' + title + '" was added to the listings.');
  }
  window.location.href = "listings.html";
};
