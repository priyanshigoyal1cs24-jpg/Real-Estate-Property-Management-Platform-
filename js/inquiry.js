// Get the inquiry form elements
var button = document.querySelector(".btn-primary");
var inquiryList = document.getElementById("inquiry-list");

// Get saved inquiries from browser storage
function getInquiries() {
    return JSON.parse(localStorage.getItem("inquiries") || "[]");
}

// Save inquiry when customer clicks the button
if (button) {
    button.onclick = function (event) {
        var name = document.getElementById("name").value.trim();
        var phone = document.getElementById("phone").value.trim();
        var message = document.getElementById("message").value.trim();

        if (!name || !phone) {
            alert("Please enter your name and phone number.");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            alert("Phone number must be 10 digits.");
            return;
        }

        // Get current property details
        var params = new URLSearchParams(window.location.search);
        var propertyId = Number(params.get("id"));
        var property = findById(properties, propertyId);

        var inquiry = {
            name: name,
            phone: phone,
            message: message,
            property: property ? property.title : "Unknown Property",
            date: new Date().toLocaleString()
        };

        // Store inquiry in localStorage
        var inquiries = getInquiries();
        inquiries.push(inquiry);

        localStorage.setItem("inquiries", JSON.stringify(inquiries));

        alert("Thank you " + name + "! Your inquiry has been saved.");

        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("message").value = "";
    };
}

// Display all inquiries on inquiries.html
if (inquiryList) {
    var inquiries = getInquiries();

    if (inquiries.length === 0) {
        inquiryList.innerHTML = "<p>No inquiries received yet.</p>";
    } else {
        inquiryList.innerHTML = inquiries.map(function (item) {
            return `
                <div class="property-card" style="padding:25px; margin-bottom:20px;">
                    <h3>${escapeHtml(item.property)}</h3>
                    <p><strong>Customer:</strong> ${escapeHtml(item.name)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(item.phone)}</p>
                    <p><strong>Message:</strong> ${escapeHtml(item.message)}</p>
                    <p><strong>Date:</strong> ${escapeHtml(item.date)}</p>
                </div>
            `;
        }).join("");
    }
}
