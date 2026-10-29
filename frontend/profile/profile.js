
const profileForm = document.getElementById("profileForm");
const profileFormCard = document.getElementById("profileFormCard");
const summaryCard = document.getElementById("summaryCard");

const getLocationButton = document.getElementById("getLocation");
const locationInput = document.getElementById("location");
const locationMessage = document.getElementById("locationMessage");

const profileMessage = document.getElementById("profileMessage");
const editButton = document.getElementById("editProfile");

const fields = [
    "name",
    "email",
    "phone",
    "location",
    "about",
    "property-type",
    "preferred-location",
    "budget"
];

const summaryFields = [
    "summaryName",
    "summaryEmail",
    "summaryPhone",
    "summaryLocation",
    "summaryAbout",
    "summaryPropertyType",
    "summaryPreferredLocation",
    "summaryBudget"
];

function showSummary(data) {
    fields.forEach((field, index) => {
        document.getElementById(summaryFields[index]).textContent =
            data[field] || "Not provided";
    });

    profileFormCard.style.display = "none";
    summaryCard.style.display = "block";
}

function saveProfile(event) {
    event.preventDefault();

    const profileData = {};

    fields.forEach(field => {
        profileData[field] = document.getElementById(field).value.trim();
    });

    localStorage.setItem("userProfile", JSON.stringify(profileData));

    showSummary(profileData);
    profileMessage.textContent = "Profile saved successfully!";
}

profileForm.addEventListener("submit", saveProfile);

editButton.addEventListener("click", function () {
    profileFormCard.style.display = "grid";
    summaryCard.style.display = "none";
    profileMessage.textContent = "";
});

getLocationButton.addEventListener("click", function () {
    if (!navigator.geolocation) {
        locationMessage.textContent =
            "Geolocation is not supported by your browser.";
        return;
    }

    locationMessage.textContent = "Getting your current location...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            locationInput.value =
                `Latitude: ${position.coords.latitude.toFixed(6)}, Longitude: ${position.coords.longitude.toFixed(6)}`;

            locationMessage.textContent =
                "Current location detected successfully.";
        },
        function () {
            locationMessage.textContent =
                "Location access denied. Please allow location permission.";
        }
    );
});

profileForm.addEventListener("reset", function () {
    profileMessage.textContent = "";
    locationMessage.textContent = "";
});

window.addEventListener("DOMContentLoaded", function () {
    const savedProfile = localStorage.getItem("userProfile");

    if (savedProfile) {
        const profileData = JSON.parse(savedProfile);

        fields.forEach(field => {
            document.getElementById(field).value =
                profileData[field] || "";
        });

        showSummary(profileData);
    }
});
const clearButton = profileForm.querySelector('button[type="reset"]');

clearButton.addEventListener("click", function () {
    localStorage.removeItem("userProfile");

    profileForm.reset();

    summaryCard.style.display = "none";
    profileFormCard.style.display = "grid";

    profileMessage.textContent = "";
    locationMessage.textContent = "";
});