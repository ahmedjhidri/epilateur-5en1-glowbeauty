/* Config */
const CONFIG = {
  brand: "GlowBeauty",
  productName: "Épilateur électrique portable 5 en 1",
  priceTND: 89,
  currency: "TND",
  defaultQty: 1,
  ordersStorageKey: "glowbeauty_orders_v1",
  formspreeEndpoint: "", // Optional: set like "https://formspree.io/f/xxxxxx" to receive email orders
  fallbackEmailTo: "hello@example.com", // Used for mailto fallback if Formspree not set
};

function $(id) {
  return document.getElementById(id);
}

function formatTND(n) {
  const v = Number(n);
  return Number.isFinite(v) ? String(v) : String(n);
}

function clampQty(qty) {
  const q = Number(qty);
  if (!Number.isFinite(q)) return CONFIG.defaultQty;
  return Math.min(9, Math.max(1, Math.round(q)));
}

function setContactPhoneLink() {
  const el = $("contact-phone");
  if (!el) return;
  // placeholder: set a click-to-call link and visible text
  const visible = "+216 XX XXX XXX";
  el.textContent = visible;
  el.setAttribute("href", "tel:+21600000000");
}

function getOrders() {
  try {
    const raw = localStorage.getItem(CONFIG.ordersStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(CONFIG.ordersStorageKey, JSON.stringify(orders));
}

function toast(msg) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 2400);
}

/* Modal accessibility */
let lastFocusedEl = null;

function openModal() {
  const modal = $("checkout-modal");
  if (!modal) return;
  lastFocusedEl = document.activeElement;
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const nameInput = $("name");
  if (nameInput) nameInput.focus();
}

function closeModal() {
  const modal = $("checkout-modal");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
}

function onGlobalKeydown(e) {
  if (e.key === "Escape") {
    const modal = $("checkout-modal");
    if (modal && modal.getAttribute("aria-hidden") === "false") closeModal();
  }
}

function initModal() {
  const modal = $("checkout-modal");
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.close === "true") closeModal();
  });

  document.addEventListener("keydown", onGlobalKeydown);
}

/* Email order option */
function buildOrderPayload({ name, phone, address, qty }) {
  return {
    brand: CONFIG.brand,
    product: CONFIG.productName,
    qty: clampQty(qty),
    priceTND: CONFIG.priceTND,
    currency: CONFIG.currency,
    customer: { name: String(name || "").trim(), phone: String(phone || "").trim(), address: String(address || "").trim() },
    createdAt: new Date().toISOString(),
    source: "landing",
    userAgent: navigator.userAgent,
  };
}

function buildMailtoLink(order) {
  const subject = `${CONFIG.brand} — Nouvelle commande (COD)`;
  const lines = [
    `Produit: ${order.product}`,
    `Quantité: ${order.qty}`,
    `Prix: ${order.priceTND} ${order.currency}`,
    "",
    `Nom: ${order.customer.name}`,
    `Téléphone: ${order.customer.phone}`,
    `Adresse: ${order.customer.address}`,
    "",
    `Date: ${order.createdAt}`,
  ];
  const body = lines.join("\n");
  const to = CONFIG.fallbackEmailTo;
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function sendToFormspree(order) {
  if (!CONFIG.formspreeEndpoint) return { ok: false, reason: "no-endpoint" };
  try {
    const res = await fetch(CONFIG.formspreeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(order),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, reason: "network", error: String(err) };
  }
}

function initCheckout() {
  const openers = ["cta-checkout", "cta-checkout-2", "cta-checkout-3"];
  openers.forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener("click", openModal);
  });

  const qtyEl = $("qty");
  const summaryPrice = $("summary-price");
  if (summaryPrice) summaryPrice.textContent = formatTND(CONFIG.priceTND);

  const emailLink = $("email-order");
  if (emailLink) {
    emailLink.addEventListener("click", (e) => {
      // Create a best-effort email link from current field values (even if not submitted)
      e.preventDefault();
      const order = buildOrderPayload({
        name: $("name")?.value,
        phone: $("phone")?.value,
        address: $("address")?.value,
        qty: $("qty")?.value,
      });
      window.location.href = buildMailtoLink(order);
    });
  }

  const form = $("checkout-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = $("name")?.value;
    const phone = $("phone")?.value;
    const address = $("address")?.value;
    const qty = $("qty")?.value;

    const order = buildOrderPayload({ name, phone, address, qty });

    saveOrder(order);
    toast("Commande enregistrée. On te contacte pour confirmer.");

    // Optional: send to Formspree when configured
    const sent = await sendToFormspree(order);
    if (CONFIG.formspreeEndpoint) {
      if (sent.ok) toast("Commande envoyée par email (Formspree).");
      else toast("Commande enregistrée (Formspree non configuré ou erreur).");
    }

    closeModal();
  });
}

function initYear() {
  const el = $("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function init() {
  initYear();
  setContactPhoneLink();

  initModal();
  initCheckout();
}

document.addEventListener("DOMContentLoaded", init);

