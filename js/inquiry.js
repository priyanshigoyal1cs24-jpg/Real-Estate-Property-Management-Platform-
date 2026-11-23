// Inquiries page: shows the messages sent from the property pages

var listBox = document.getElementById("inquiry-list");
var countText = document.getElementById("inquiry-count");
var clearAllBtn = document.getElementById("clear-all");
var tabButtons = document.querySelectorAll(".filter-btn");

var activeTab = "All";

function formatDate(isoText) {
  var date = new Date(isoText);
  if (isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function showInquiries() {
  var all = getInquiries();
  var list = [];
  var newCount = 0;

  for (var i = 0; i < all.length; i++) {
    if (!all[i].read) {
      newCount++;
    }
    if (activeTab === "All" || (activeTab === "New" && !all[i].read) || (activeTab === "Read" && all[i].read)) {
      list.push(all[i]);
    }
  }

  countText.textContent = all.length + " total, " + newCount + " new";
  clearAllBtn.style.display = all.length === 0 ? "none" : "inline";

  if (list.length === 0) {
    if (all.length === 0) {
      listBox.innerHTML = '<p class="empty-msg">No inquiries yet. When someone sends an inquiry from a property page, it will show up here.</p>';
    } else {
      listBox.innerHTML = '<p class="empty-msg">No inquiries in this tab.</p>';
    }
    return;
  }

  var html = "";
  for (var j = 0; j < list.length; j++) {
    var q = list[j];
    var cardClass = q.read ? "inquiry-card" : "inquiry-card unread";

    html += '<article class="' + cardClass + '">';
    html += '  <div class="inquiry-top">';
    html += '    <div>';
    html += '      <h3>' + escapeHtml(q.name) + (q.read ? '' : ' <span class="new-dot">New</span>') + '</h3>';
    html += '      <p class="inquiry-meta">' + escapeHtml(formatDate(q.date)) + '</p>';
    html += '    </div>';
    html += '    <a href="tel:' + escapeHtml(q.phone) + '" class="inquiry-phone">' + escapeHtml(q.phone) + '</a>';
    html += '  </div>';
    html += '  <p class="inquiry-property">About: <a href="property.html?id=' + Number(q.propertyId) + '">' + escapeHtml(q.propertyTitle) + '</a></p>';
    html += '  <p class="inquiry-message">' + escapeHtml(q.message || "(no message)") + '</p>';
    html += '  <div class="card-actions">';
    html += '    <button type="button" class="action-link" data-action="toggle" data-id="' + q.id + '">' + (q.read ? 'Mark as new' : 'Mark as read') + '</button>';
    html += '    <button type="button" class="action-delete" data-action="delete" data-id="' + q.id + '">Delete</button>';
    html += '  </div>';
    html += '</article>';
  }
  listBox.innerHTML = html;
}

// One click handler for all the buttons inside the list
listBox.onclick = function (e) {
  var button = e.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  var id = Number(button.getAttribute("data-id"));
  var action = button.getAttribute("data-action");
  var all = getInquiries();
  var kept = [];

  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      if (action === "toggle") {
        all[i].read = !all[i].read;
        kept.push(all[i]);
      }
      // for "delete" we simply do not keep it
    } else {
      kept.push(all[i]);
    }
  }

  saveInquiries(kept);
  showInquiries();
};

clearAllBtn.onclick = function () {
  if (confirm("Delete all inquiries? This cannot be undone.")) {
    saveInquiries([]);
    showInquiries();
  }
};

for (var i = 0; i < tabButtons.length; i++) {
  tabButtons[i].onclick = function () {
    for (var j = 0; j < tabButtons.length; j++) {
      tabButtons[j].classList.remove("active");
    }
    this.classList.add("active");
    activeTab = this.getAttribute("data-tab");
    showInquiries();
  };
}

showInquiries();
