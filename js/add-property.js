// Add / Edit Property Form

var form = document.getElementById("add-form");
var imageList = [];
var editingId = null;

// Get elements
var titleInput = document.getElementById("title");
var typeInput = document.getElementById("type");
var statusInput = document.getElementById("status");
var priceInput = document.getElementById("price");
var areaInput = document.getElementById("area");
var locationInput = document.getElementById("location");
var bedroomsInput = document.getElementById("bedrooms");
var bathroomsInput = document.getElementById("bathrooms");
var parkingInput = document.getElementById("parking");
var agentInput = document.getElementById("agent");
var descriptionInput = document.getElementById("description");
var amenitiesInput = document.getElementById("amenities");
var featuredInput = document.getElementById("featured");

var imageUrlInput = document.getElementById("image-url");
var imageFileInput = document.getElementById("image-file");
var imagePreview = document.getElementById("image-preview");
var message = document.getElementById("form-message");

// Show message
function showMessage(text, success) {
  message.textContent = text;
  message.style.color = success ? "green" : "red";
}

// Display image previews
function renderImages() {
  imagePreview.innerHTML = "";

  imageList.forEach(function (image, index) {
    var box = document.createElement("div");
    box.className = "preview-item";

    var img = document.createElement("img");
    img.src = getImage(image, 200);
    img.alt = "Property photo";

    var remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";

    remove.addEventListener("click", function () {
      imageList.splice(index, 1);
      renderImages();
    });

    box.appendChild(img);
    box.appendChild(remove);
    imagePreview.appendChild(box);
  });
}

// Add image using URL
document.getElementById("add-url-btn").addEventListener("click", function () {
  var url = imageUrlInput.value.trim();

  if (!url) {
    showMessage("Please enter an image link.", false);
    return;
  }

  if (!/^https?:\/\/.+/i.test(url)) {
    showMessage("Please enter a valid http or https image link.", false);
    return;
  }

  if (imageList.length >= 4) {
    showMessage("You can add a maximum of 4 photos.", false);
    return;
  }

  imageList.push(url);
  imageUrlInput.value = "";
  renderImages();
  showMessage("Image added.", true);
});

// Upload images from device
imageFileInput.addEventListener("change", function () {
  var files = Array.from(imageFileInput.files);

  files.forEach(function (file) {
    if (imageList.length >= 4) return;

    if (!file.type.startsWith("image/")) return;

    if (file.size > 2 * 1024 * 1024) {
      showMessage("Each image must be under 2 MB.", false);
      return;
    }

    var reader = new FileReader();

    reader.onload = function (event) {
      if (imageList.length < 4) {
        imageList.push(event.target.result);
        renderImages();
      }
    };

    reader.readAsDataURL(file);
  });

  imageFileInput.value = "";
});

// Check whether this is an edit or a new property
var params = new URLSearchParams(window.location.search);
var editId = params.get("edit");

if (editId) {
  editingId = Number(editId);

  var property = findById(properties, editingId);

  if (property) {
    document.getElementById("page-heading").textContent = "Edit property";
    document.getElementById("page-sub").textContent = "Update the property details below.";
    document.getElementById("save-btn").textContent = "Update Property";

    titleInput.value = property.title || "";
    typeInput.value = property.type || "Apartment";
    statusInput.value = property.status || "Available";
    priceInput.value = property.price || "";
    areaInput.value = property.area || "";
    locationInput.value = property.location || "";
    bedroomsInput.value = property.bedrooms || 0;
    bathroomsInput.value = property.bathrooms || 0;
    parkingInput.value = property.parking || 0;
    agentInput.value = property.agent || "";
    descriptionInput.value = property.description || "";
    amenitiesInput.value = (property.amenities || []).join(", ");
    featuredInput.checked = property.featured === true;

    imageList = (property.images || []).slice(0, 4);
    renderImages();
  } else {
    showMessage("Property not found.", false);
  }
}

// Save form
form.addEventListener("submit", function (event) {
  event.preventDefault();

  var title = titleInput.value.trim();
  var price = Number(priceInput.value);
  var area = Number(areaInput.value);
  var location = locationInput.value.trim();
  var description = descriptionInput.value.trim();

  if (!title || !location || !agentInput.value.trim()) {
    showMessage("Please fill in the title, location and agent name.", false);
    return;
  }

  if (!Number.isFinite(price) || price <= 0) {
    showMessage("Please enter a valid price greater than zero.", false);
    return;
  }

  if (!Number.isFinite(area) || area <= 0) {
    showMessage("Please enter a valid area greater than zero.", false);
    return;
  }

  if (description.length < 20) {
    showMessage("Description must contain at least 20 characters.", false);
    return;
  }

  var property = {
    id: editingId !== null ? editingId : getNextId(),
    status: statusInput.value,
    featured: featuredInput.checked,
    title: title,
    type: typeInput.value,
    location: location,
    price: price,
    priceText: formatPrice(price),
    bedrooms: Number(bedroomsInput.value) || 0,
    bathrooms: Number(bathroomsInput.value) || 0,
    area: area,
    parking: Number(parkingInput.value) || 0,
    agent: agentInput.value.trim(),
    description: description,
    amenities: amenitiesInput.value.split(",").map(function (item) {
      return item.trim();
    }).filter(Boolean),
    images: imageList.length ? imageList : ["1613977257363-707ba9348227"]
  };

  if (!saveProperty(property)) {
    showMessage("Could not save. Browser storage may be full.", false);
    return;
  }

  setFlash(editingId !== null ? "Property updated successfully!" : "Property added successfully!");

  window.location.href = "listings.html";
});
