/**
 * ============================================================================
 * Real Estate Property Management System (REPMS) - Admin Panel Logic
 * ============================================================================
 * Built with HTML, CSS, Bootstrap 5, and Vanilla JavaScript.
 * Contains:
 *  - Initial Dummy Data (Properties, Users, Inquiries)
 *  - Dynamic Rendering for Dashboard, Tables, and Statistics
 *  - Single-Page Section Navigation (without page reloads)
 *  - Full CRUD: Add, Edit, Delete, and View Properties
 *  - Dynamic Search and Multi-criteria Filtering
 *  - User & Inquiry Management
 *  - Settings Handling and Toast Alerts
 * ============================================================================
 */

// ==========================================
// 1. INITIAL DUMMY DATA STORE
// ==========================================

let propertiesData = [
  {
    id: "PROP-101",
    name: "Skyline Luxury Penthouse",
    location: "Downtown, New York",
    type: "Apartment",
    price: 850000,
    bedrooms: 3,
    bathrooms: 2,
    area: 2100,
    status: "Available",
    description: "Panoramic city skyline views with modern open-concept living and high-end marble finishes."
  },
  {
    id: "PROP-102",
    name: "Greenwood Family Villa",
    location: "Austin, Texas",
    type: "Villa",
    price: 620000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    status: "Available",
    description: "Spacious private backyard, swimming pool, home automation, and close to top-rated schools."
  },
  {
    id: "PROP-103",
    name: "Ocean Breeze Cottage",
    location: "Miami, Florida",
    type: "House",
    price: 480000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1850,
    status: "Sold",
    description: "Charming coastal home walking distance to the beach with a wrap-around sun deck."
  },
  {
    id: "PROP-104",
    name: "TechHub Corporate Office",
    location: "San Francisco, CA",
    type: "Commercial",
    price: 1250000,
    bedrooms: 0,
    bathrooms: 4,
    area: 4500,
    status: "Rented",
    description: "Prime grade-A commercial office space with conference rooms, cafeteria, and fiber connectivity."
  },
  {
    id: "PROP-105",
    name: "Sunset Meadows Suburban Home",
    location: "Denver, Colorado",
    type: "House",
    price: 540000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2600,
    status: "Available",
    description: "Tranquil mountain-view suburban residence with two-car garage and solar energy system."
  }
];

let usersData = [
  {
    id: "USR-001",
    name: "Raj Pratap Singh",
    email: "raj12@gmail.com",
    role: "Buyer",
    status: "Active"
  },
  {
    id: "USR-002",
    name: "David Miller",
    email: "david.m@example.com",
    role: "Seller",
    status: "Active"
  },
  {
    id: "USR-003",
    name: "Rachit Panda",
    email: "rachit12@gmail.com",
    role: "Agent",
    status: "Active"
  },
  {
    id: "USR-004",
    name: "Priyanshi Goyal",
    email: "priyanshi12@gmail.com",
    role: "Tenant",
    status: "Inactive"
  }
];

let inquiriesData = [
  {
    id: "INQ-301",
    userName: "Raushan kumar",
    property: "Skyline Luxury Penthouse",
    email: "raushan12@gmail.com",
    message: "Hi, I am interested in scheduling a physical visit this Saturday afternoon.",
    status: "Pending"
  },
  {
    id: "INQ-302",
    userName: "Alba",
    property: "Greenwood Family Villa",
    email: "alba1@gmail.com",
    message: "Is the price negotiable for an all-cash purchase?",
    status: "Responded"
  },
  {
    id: "INQ-303",
    userName: "Pintu Pagal ",
    property: "TechHub Corporate Office",
    email: "pintu12@gmail.com",
    message: "What is the minimum lease tenure for the commercial floor?",
    status: "Pending"
  }
];

// Currently active section ID
let currentSection = "dashboard";

// Bootstrap Modal Instances
let viewPropertyModalInstance = null;
let editPropertyModalInstance = null;
let viewInquiryModalInstance = null;

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

/**
 * Format numbers as US Dollar currency
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Return Bootstrap badge HTML based on property status
 */
function getStatusBadge(status) {
  switch (status) {
    case "Available":
      return '<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">Available</span>';
    case "Sold":
      return '<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">Sold</span>';
    case "Rented":
      return '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1">Rented</span>';
    default:
      return `<span class="badge bg-secondary">${status}</span>`;
  }
}

/**
 * Show a clean Bootstrap toast notification
 */
function showToast(message, type = "success") {
  const toastEl = document.getElementById("liveToast");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");

  // Remove existing color classes
  toastEl.classList.remove("bg-success", "bg-danger", "bg-primary", "bg-warning");

  if (type === "success") {
    toastEl.classList.add("bg-success");
    toastIcon.className = "bi bi-check-circle-fill fs-5";
  } else if (type === "danger") {
    toastEl.classList.add("bg-danger");
    toastIcon.className = "bi bi-exclamation-triangle-fill fs-5";
  } else if (type === "warning") {
    toastEl.classList.add("bg-warning", "text-dark");
    toastIcon.className = "bi bi-info-circle-fill fs-5";
  } else {
    toastEl.classList.add("bg-primary");
    toastIcon.className = "bi bi-info-circle-fill fs-5";
  }

  toastMessage.textContent = message;

  const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
  toast.show();
}

// ==========================================
// 3. NAVIGATION (SPA STYLE SECTION SWITCHING)
// ==========================================

/**
 * Switch active visible section without reloading the page
 */
function navigateToSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((sec) => {
    sec.classList.add("d-none");
  });

  // Show target section
  const targetSec = document.getElementById(`section-${sectionName}`);
  if (targetSec) {
    targetSec.classList.remove("d-none");
  }

  // Update active navigation link in sidebar
  document.querySelectorAll("#sidebar-wrapper .list-group-item").forEach((link) => {
    if (link.getAttribute("data-section") === sectionName) {
      link.classList.add("active-nav");
    } else {
      link.classList.remove("active-nav");
    }
  });

  // Update navbar header title
  const pageTitle = document.getElementById("pageTitle");
  switch (sectionName) {
    case "dashboard":
      pageTitle.textContent = "Dashboard Overview";
      renderDashboard();
      break;
    case "properties":
      pageTitle.textContent = "Property Listings";
      filterProperties();
      break;
    case "add-property":
      pageTitle.textContent = "Add New Property";
      break;
    case "users":
      pageTitle.textContent = "Users Management";
      renderUsersTable();
      break;
    case "inquiries":
      pageTitle.textContent = "Customer Inquiries";
      renderInquiriesTable();
      break;
    case "settings":
      pageTitle.textContent = "Admin Profile Settings";
      break;
    default:
      pageTitle.textContent = "Admin Dashboard";
  }

  currentSection = sectionName;

  // On small devices, automatically collapse the sidebar after navigation click
  if (window.innerWidth < 992) {
    const sidebar = document.getElementById("sidebar-wrapper");
    if (sidebar) sidebar.classList.remove("toggled");
  }
}

// ==========================================
// 4. DASHBOARD RENDERING & STATS
// ==========================================

/**
 * Recalculate statistics cards and render dashboard summary tables
 */
function renderDashboard() {
  // 1. Calculate statistics
  const total = propertiesData.length;
  const available = propertiesData.filter((p) => p.status === "Available").length;
  const closed = propertiesData.filter((p) => p.status === "Sold" || p.status === "Rented").length;
  const totalUsers = usersData.length;

  document.getElementById("statTotalProperties").textContent = total;
  document.getElementById("statAvailableProperties").textContent = available;
  document.getElementById("statClosedProperties").textContent = closed;
  document.getElementById("statTotalUsers").textContent = totalUsers;

  // 2. Render Recent Properties (last 4)
  const recentProps = [...propertiesData].reverse().slice(0, 4);
  const recentPropsBody = document.getElementById("dashboardRecentPropertiesBody");
  recentPropsBody.innerHTML = "";

  if (recentProps.length === 0) {
    recentPropsBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No properties listed yet.</td></tr>`;
  } else {
    recentProps.forEach((prop) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="fw-semibold">${escapeHtml(prop.name)}</div>
          <small class="text-muted">${prop.type}</small>
        </td>
        <td><small class="text-muted"><i class="bi bi-geo-alt me-1"></i>${escapeHtml(prop.location)}</small></td>
        <td class="fw-semibold text-primary">${formatCurrency(prop.price)}</td>
        <td>${getStatusBadge(prop.status)}</td>
      `;
      recentPropsBody.appendChild(tr);
    });
  }

  // 3. Render Recent Inquiries (last 4)
  const recentInquiries = [...inquiriesData].reverse().slice(0, 4);
  const recentInquiriesBody = document.getElementById("dashboardRecentInquiriesBody");
  recentInquiriesBody.innerHTML = "";

  if (recentInquiries.length === 0) {
    recentInquiriesBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-3">No inquiries received.</td></tr>`;
  } else {
    recentInquiries.forEach((inq) => {
      const statusBadge = inq.status === "Pending"
        ? '<span class="badge bg-danger-subtle text-danger border border-danger-subtle">Pending</span>'
        : '<span class="badge bg-success-subtle text-success border border-success-subtle">Responded</span>';

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="fw-semibold">${escapeHtml(inq.userName)}</div>
          <small class="text-muted">${escapeHtml(inq.email)}</small>
        </td>
        <td><small class="text-truncate d-inline-block" style="max-width: 150px;">${escapeHtml(inq.property)}</small></td>
        <td>${statusBadge}</td>
      `;
      recentInquiriesBody.appendChild(tr);
    });
  }

  // Update pending inquiries badge in sidebar
  updateInquiryBadge();
}

/**
 * Update the badge counter in the sidebar for pending inquiries
 */
function updateInquiryBadge() {
  const pendingCount = inquiriesData.filter((i) => i.status === "Pending").length;
  const badge = document.getElementById("inquiryBadge");
  if (badge) {
    badge.textContent = pendingCount;
    badge.style.display = pendingCount > 0 ? "inline-block" : "none";
  }
}

// ==========================================
// 5. PROPERTIES MANAGEMENT (TABLE & FILTER)
// ==========================================

/**
 * Filter properties based on search query, type dropdown, and status dropdown
 */
function filterProperties() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase().trim();
  const selectedType = document.getElementById("typeFilter").value;
  const selectedStatus = document.getElementById("statusFilter").value;

  const filtered = propertiesData.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(searchQuery) ||
      prop.location.toLowerCase().includes(searchQuery);
    const matchesType = selectedType === "" || prop.type === selectedType;
    const matchesStatus = selectedStatus === "" || prop.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  renderPropertiesTable(filtered);
}

/**
 * Reset all filter inputs to defaults
 */
function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("typeFilter").value = "";
  document.getElementById("statusFilter").value = "";
  filterProperties();
}

/**
 * Render the main Properties Table
 */
function renderPropertiesTable(list) {
  const tableBody = document.getElementById("propertiesTableBody");
  const noPropsMsg = document.getElementById("noPropertiesMessage");
  tableBody.innerHTML = "";

  if (list.length === 0) {
    noPropsMsg.classList.remove("d-none");
    return;
  } else {
    noPropsMsg.classList.add("d-none");
  }

  list.forEach((prop) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge bg-light text-dark border">${prop.id}</span></td>
      <td>
        <div class="fw-semibold text-dark">${escapeHtml(prop.name)}</div>
        <small class="text-muted">${prop.bedrooms || 0} Beds • ${prop.bathrooms || 0} Baths • ${prop.area || 0} sq ft</small>
      </td>
      <td><small class="text-muted"><i class="bi bi-geo-alt me-1 text-danger"></i>${escapeHtml(prop.location)}</small></td>
      <td><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">${prop.type}</span></td>
      <td class="fw-bold text-primary">${formatCurrency(prop.price)}</td>
      <td>${getStatusBadge(prop.status)}</td>
      <td class="text-end">
        <div class="btn-group btn-group-sm" role="group">
          <button type="button" class="btn btn-outline-info" title="View Property" onclick="openViewPropertyModal('${prop.id}')">
            <i class="bi bi-eye"></i>
          </button>
          <button type="button" class="btn btn-outline-primary" title="Edit Property" onclick="openEditPropertyModal('${prop.id}')">
            <i class="bi bi-pencil"></i>
          </button>
          <button type="button" class="btn btn-outline-danger" title="Delete Property" onclick="deleteProperty('${prop.id}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ==========================================
// 6. ADD PROPERTY HANDLING
// ==========================================

function handleAddProperty(event) {
  event.preventDefault();

  const name = document.getElementById("propName").value.trim();
  const location = document.getElementById("propLocation").value.trim();
  const type = document.getElementById("propType").value;
  const price = parseFloat(document.getElementById("propPrice").value);
  const bedrooms = parseInt(document.getElementById("propBedrooms").value, 10) || 0;
  const bathrooms = parseInt(document.getElementById("propBathrooms").value, 10) || 0;
  const area = parseInt(document.getElementById("propArea").value, 10) || 0;
  const status = document.getElementById("propStatus").value;
  const description = document.getElementById("propDescription").value.trim();

  // Basic validation check
  if (!name || !location || !type || isNaN(price) || price <= 0) {
    showToast("Please fill in all required fields properly.", "danger");
    return;
  }

  // Generate unique property ID
  const newIdNumber = propertiesData.length + 101;
  const newId = `PROP-${newIdNumber}`;

  // Create new property object
  const newProperty = {
    id: newId,
    name,
    location,
    type,
    price,
    bedrooms,
    bathrooms,
    area,
    status,
    description: description || "No description provided."
  };

  // Add to in-memory array
  propertiesData.unshift(newProperty);

  // Reset form
  document.getElementById("addPropertyForm").reset();

  // Show success toast
  showToast(`Property "${name}" added successfully!`, "success");

  // Re-calculate dashboard and switch to properties view so user can see their added item
  renderDashboard();
  navigateToSection("properties");
}

// ==========================================
// 7. VIEW, EDIT & DELETE PROPERTY
// ==========================================

/**
 * Open View Property Modal
 */
function openViewPropertyModal(propId) {
  const property = propertiesData.find((p) => p.id === propId);
  if (!property) return;

  document.getElementById("viewPropId").textContent = property.id;
  document.getElementById("viewPropName").textContent = property.name;
  document.getElementById("viewPropLocation").textContent = property.location;
  document.getElementById("viewPropType").textContent = property.type;
  document.getElementById("viewPropPrice").textContent = formatCurrency(property.price);
  document.getElementById("viewPropBedrooms").textContent = `${property.bedrooms || 0} Beds`;
  document.getElementById("viewPropBathrooms").textContent = `${property.bathrooms || 0} Baths`;
  document.getElementById("viewPropArea").textContent = `${property.area ? property.area.toLocaleString() : 0} sq ft`;
  document.getElementById("viewPropDescription").textContent = property.description || "No description provided.";

  const statusBadge = document.getElementById("viewPropStatusBadge");
  statusBadge.className = `badge fs-6 ${
    property.status === "Available"
      ? "bg-success"
      : property.status === "Sold"
      ? "bg-danger"
      : "bg-warning text-dark"
  }`;
  statusBadge.textContent = property.status;

  if (!viewPropertyModalInstance) {
    viewPropertyModalInstance = new bootstrap.Modal(document.getElementById("viewPropertyModal"));
  }
  viewPropertyModalInstance.show();
}

/**
 * Open Edit Property Modal and prefill form
 */
function openEditPropertyModal(propId) {
  const property = propertiesData.find((p) => p.id === propId);
  if (!property) return;

  document.getElementById("editPropId").value = property.id;
  document.getElementById("editPropName").value = property.name;
  document.getElementById("editPropLocation").value = property.location;
  document.getElementById("editPropType").value = property.type;
  document.getElementById("editPropPrice").value = property.price;
  document.getElementById("editPropBedrooms").value = property.bedrooms || 0;
  document.getElementById("editPropBathrooms").value = property.bathrooms || 0;
  document.getElementById("editPropArea").value = property.area || 0;
  document.getElementById("editPropStatus").value = property.status;
  document.getElementById("editPropDescription").value = property.description || "";

  if (!editPropertyModalInstance) {
    editPropertyModalInstance = new bootstrap.Modal(document.getElementById("editPropertyModal"));
  }
  editPropertyModalInstance.show();
}

/**
 * Save Edited Property
 */
function handleSaveEditProperty(event) {
  event.preventDefault();

  const id = document.getElementById("editPropId").value;
  const propertyIndex = propertiesData.findIndex((p) => p.id === id);

  if (propertyIndex === -1) return;

  const name = document.getElementById("editPropName").value.trim();
  const location = document.getElementById("editPropLocation").value.trim();
  const type = document.getElementById("editPropType").value;
  const price = parseFloat(document.getElementById("editPropPrice").value);
  const bedrooms = parseInt(document.getElementById("editPropBedrooms").value, 10) || 0;
  const bathrooms = parseInt(document.getElementById("editPropBathrooms").value, 10) || 0;
  const area = parseInt(document.getElementById("editPropArea").value, 10) || 0;
  const status = document.getElementById("editPropStatus").value;
  const description = document.getElementById("editPropDescription").value.trim();

  // Update object
  propertiesData[propertyIndex] = {
    id,
    name,
    location,
    type,
    price,
    bedrooms,
    bathrooms,
    area,
    status,
    description
  };

  // Close modal
  editPropertyModalInstance.hide();

  // Refresh UI
  filterProperties();
  renderDashboard();

  showToast(`Property "${name}" updated successfully!`, "success");
}

/**
 * Delete a Property
 */
function deleteProperty(propId) {
  const property = propertiesData.find((p) => p.id === propId);
  if (!property) return;

  const confirmed = confirm(`Are you sure you want to delete "${property.name}" (${property.id})?`);
  if (!confirmed) return;

  propertiesData = propertiesData.filter((p) => p.id !== propId);

  // Refresh UI
  filterProperties();
  renderDashboard();

  showToast(`Property ${propId} deleted successfully.`, "danger");
}

// ==========================================
// 8. USERS MANAGEMENT
// ==========================================

function renderUsersTable() {
  const tableBody = document.getElementById("usersTableBody");
  tableBody.innerHTML = "";

  document.getElementById("userCountBadge").textContent = `${usersData.length} Total Users`;

  usersData.forEach((user) => {
    const statusBadge = user.status === "Active"
      ? '<span class="badge bg-success-subtle text-success border border-success-subtle">Active</span>'
      : '<span class="badge bg-secondary-subtle text-secondary border">Inactive</span>';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge bg-light text-dark border">${user.id}</span></td>
      <td class="fw-semibold">${escapeHtml(user.name)}</td>
      <td class="text-muted">${escapeHtml(user.email)}</td>
      <td><span class="badge bg-primary-subtle text-primary">${user.role}</span></td>
      <td>${statusBadge}</td>
      <td class="text-end">
        <button class="btn btn-sm ${user.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'} me-1" 
          onclick="toggleUserStatus('${user.id}')" title="Toggle Status">
          <i class="bi bi-arrow-repeat"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${user.id}')" title="Delete User">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function toggleUserStatus(userId) {
  const user = usersData.find((u) => u.id === userId);
  if (user) {
    user.status = user.status === "Active" ? "Inactive" : "Active";
    renderUsersTable();
    showToast(`User status updated to ${user.status}.`, "info");
  }
}

function deleteUser(userId) {
  const user = usersData.find((u) => u.id === userId);
  if (!user) return;

  if (confirm(`Remove user "${user.name}"?`)) {
    usersData = usersData.filter((u) => u.id !== userId);
    renderUsersTable();
    renderDashboard();
    showToast("User removed successfully.", "danger");
  }
}

// ==========================================
// 9. INQUIRIES MANAGEMENT
// ==========================================

let activeViewingInquiryId = null;

function renderInquiriesTable() {
  const tableBody = document.getElementById("inquiriesTableBody");
  tableBody.innerHTML = "";

  if (inquiriesData.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No inquiries available.</td></tr>`;
    return;
  }

  inquiriesData.forEach((inq) => {
    const statusBadge = inq.status === "Pending"
      ? '<span class="badge bg-danger-subtle text-danger border border-danger-subtle">Pending</span>'
      : '<span class="badge bg-success-subtle text-success border border-success-subtle">Responded</span>';

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge bg-light text-dark border">${inq.id}</span></td>
      <td class="fw-semibold">${escapeHtml(inq.userName)}</td>
      <td><span class="fw-medium text-dark">${escapeHtml(inq.property)}</span></td>
      <td class="text-muted small">${escapeHtml(inq.email)}</td>
      <td><div class="text-truncate" style="max-width: 220px;" title="${escapeHtml(inq.message)}">${escapeHtml(inq.message)}</div></td>
      <td>${statusBadge}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-info me-1" onclick="openViewInquiryModal('${inq.id}')" title="View Message">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteInquiry('${inq.id}')" title="Delete Inquiry">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function openViewInquiryModal(inqId) {
  const inq = inquiriesData.find((i) => i.id === inqId);
  if (!inq) return;

  activeViewingInquiryId = inqId;
  document.getElementById("modalInquiryId").textContent = inq.id;
  document.getElementById("modalInquiryUser").textContent = inq.userName;
  document.getElementById("modalInquiryEmail").textContent = inq.email;
  document.getElementById("modalInquiryProperty").textContent = inq.property;
  document.getElementById("modalInquiryMessage").textContent = inq.message;

  const markBtn = document.getElementById("modalMarkRespondedBtn");
  if (inq.status === "Responded") {
    markBtn.textContent = "Responded (Done)";
    markBtn.disabled = true;
    markBtn.className = "btn btn-secondary";
  } else {
    markBtn.textContent = "Mark as Responded";
    markBtn.disabled = false;
    markBtn.className = "btn btn-success";
  }

  if (!viewInquiryModalInstance) {
    viewInquiryModalInstance = new bootstrap.Modal(document.getElementById("viewInquiryModal"));
  }
  viewInquiryModalInstance.show();
}

function markActiveInquiryResponded() {
  if (!activeViewingInquiryId) return;

  const inq = inquiriesData.find((i) => i.id === activeViewingInquiryId);
  if (inq) {
    inq.status = "Responded";
    renderInquiriesTable();
    renderDashboard();
    if (viewInquiryModalInstance) viewInquiryModalInstance.hide();
    showToast("Inquiry marked as responded.", "success");
  }
}

function deleteInquiry(inqId) {
  if (confirm("Are you sure you want to delete this inquiry?")) {
    inquiriesData = inquiriesData.filter((i) => i.id !== inqId);
    renderInquiriesTable();
    renderDashboard();
    showToast("Inquiry deleted.", "danger");
  }
}

// ==========================================
// 10. SETTINGS & LOGOUT
// ==========================================

function handleSettingsSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("settingAdminName").value.trim();
  const email = document.getElementById("settingAdminEmail").value.trim();
  const password = document.getElementById("settingPassword").value;

  if (!name || !email) {
    showToast("Please provide your name and email.", "danger");
    return;
  }

  // Update header profile display
  const headerAdminName = document.getElementById("headerAdminName");
  if (headerAdminName) {
    headerAdminName.textContent = name;
  }

  // Clear password input if typed
  document.getElementById("settingPassword").value = "";

  showToast("Settings and profile updated successfully!", "success");
}

function handleLogout() {
  alert("Logged out successfully");
}

// ==========================================
// 11. SECURITY UTILITY (XSS PROTECTION)
// ==========================================

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// 12. EVENT LISTENERS INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Sidebar Navigation Links
  const navLinks = document.querySelectorAll("#sidebar-wrapper .list-group-item");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionName = link.getAttribute("data-section");
      if (sectionName) {
        navigateToSection(sectionName);
      }
    });
  });

  // 2. Sidebar Mobile Toggle
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarWrapper = document.getElementById("sidebar-wrapper");
  if (sidebarToggle && sidebarWrapper) {
    sidebarToggle.addEventListener("click", () => {
      sidebarWrapper.classList.toggle("toggled");
    });
  }

  // 3. Logout Button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  // 4. Add Property Form
  const addPropForm = document.getElementById("addPropertyForm");
  if (addPropForm) {
    addPropForm.addEventListener("submit", handleAddProperty);
  }

  // 5. Edit Property Form
  const editPropForm = document.getElementById("editPropertyForm");
  if (editPropForm) {
    editPropForm.addEventListener("submit", handleSaveEditProperty);
  }

  // 6. Search & Filter Inputs
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const statusFilter = document.getElementById("statusFilter");
  const resetFilterBtn = document.getElementById("resetFilterBtn");

  if (searchInput) searchInput.addEventListener("input", filterProperties);
  if (typeFilter) typeFilter.addEventListener("change", filterProperties);
  if (statusFilter) statusFilter.addEventListener("change", filterProperties);
  if (resetFilterBtn) resetFilterBtn.addEventListener("click", resetFilters);

  // 7. Settings Form
  const settingsForm = document.getElementById("settingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", handleSettingsSubmit);
  }

  // 8. Inquiry Modal Action Button
  const markRespondedBtn = document.getElementById("modalMarkRespondedBtn");
  if (markRespondedBtn) {
    markRespondedBtn.addEventListener("click", markActiveInquiryResponded);
  }

  // 9. Initial Load Render
  renderDashboard();
  filterProperties();
  renderUsersTable();
  renderInquiriesTable();
});
