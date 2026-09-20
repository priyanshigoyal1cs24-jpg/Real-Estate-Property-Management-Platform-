const form = document.getElementById("profileForm");
const formCard = document.getElementById("profileFormCard");
const summaryCard = document.getElementById("summaryCard");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const profile = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        location: document.getElementById("location").value,
        about: document.getElementById("about").value,
        propertyType: document.getElementById("property-type").value,
        preferredLocation: document.getElementById("preferred-location").value,
        budget: document.getElementById("budget").value
    };

    if (profile.name === "" || profile.email === "") {
        alert("Please enter Name and Email");
        return;
    }

    localStorage.setItem("userProfile", JSON.stringify(profile));

    showProfile(profile);
});

function showProfile(profile) {

    document.getElementById("summaryName").innerText = profile.name;
    document.getElementById("summaryEmail").innerText = profile.email;
    document.getElementById("summaryPhone").innerText =
        profile.phone || "Not provided";
    document.getElementById("summaryLocation").innerText =
        profile.location || "Not provided";
    document.getElementById("summaryAbout").innerText =
        profile.about || "Not provided";
    document.getElementById("summaryPropertyType").innerText =
        profile.propertyType || "Not provided";
    document.getElementById("summaryPreferredLocation").innerText =
        profile.preferredLocation || "Not provided";
    document.getElementById("summaryBudget").innerText =
        profile.budget || "Not provided";

    formCard.style.display = "none";
    summaryCard.style.display = "block";
}

document.getElementById("editProfile").addEventListener("click", function() {

    const data = localStorage.getItem("userProfile");

    if (data) {

        const profile = JSON.parse(data);

        document.getElementById("name").value = profile.name;
        document.getElementById("email").value = profile.email;
        document.getElementById("phone").value = profile.phone;
        document.getElementById("location").value = profile.location;
        document.getElementById("about").value = profile.about;
        document.getElementById("property-type").value = profile.propertyType;
        document.getElementById("preferred-location").value =
            profile.preferredLocation;
        document.getElementById("budget").value = profile.budget;
    }

    summaryCard.style.display = "none";
    formCard.style.display = "flex";
});

window.addEventListener("DOMContentLoaded", function() {

    const data = localStorage.getItem("userProfile");

    if (data) {
        const profile = JSON.parse(data);
        showProfile(profile);
    }
});