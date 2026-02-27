/* Config */
const CONFIG = {
  brand: "GlowBeauty",
  productName: "Épilateur électrique portable 5 en 1",
  priceTND: 89,
  currency: "TND",
  whatsappNumberE164: "21600000000", // TODO: replace with your WhatsApp number without "+" (e.g. 21620123456)
  defaultQty: 1,
  ordersStorageKey: "glowbeauty_orders_v1",
  abStorageKey: "glowbeauty_hero_variant_v1",
  formspreeEndpoint: "", // Optional: set like "https://formspree.io/f/xxxxxx" to receive email orders
  fallbackEmailTo: "hello@example.com", // Used for mailto fallback if Formspree not set
};

const HERO_VARIANTS = {
  A: {
    eyebrow: "Livraison Tunisie • Paiement à la livraison",
    titleMain: "Un appareil, 5 fonctions",
    titleSub: "— peau douce en 5 minutes",
    image: "./assets/hero-a.svg",
    caption: 'Variante A — “Peau douce en 5 minutes”',
  },
  B: {
    eyebrow: "Routine express • Résultat propre • Sans stress",
    titleMain: "Lisse, nettoie, masse…",
    titleSub: "— ton kit beauté 5-en-1 portable",
    image: "./assets/hero-b.svg",
    caption: 'Variante B — “Kit beauté 5-en-1 portable”',
  },
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

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function setQueryParam(name, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.replaceState({}, "", url.toString());
}

function getHeroVariant() {
  const fromQuery = (getQueryParam("v") || "").toUpperCase();
  if (fromQuery === "A" || fromQuery === "B") return fromQuery;

  const stored = (localStorage.getItem(CONFIG.abStorageKey) || "").toUpperCase();
  if (stored === "A" || stored === "B") return stored;

  const pick = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem(CONFIG.abStorageKey, pick);
  return pick;
}

function applyHeroVariant(variant) {
  const v = HERO_VARIANTS[variant] ? variant : "A";
  const data = HERO_VARIANTS[v];

  $("hero-eyebrow").textContent = data.eyebrow;
  $("hero-title-main").textContent = data.titleMain;
  $("hero-title-sub").textContent = data.titleSub;
  $("hero-image").setAttribute("src", data.image);
  $("hero-caption").textContent = data.caption;

  const variantSelect = $("variant");
  if (variantSelect) variantSelect.value = v;

  setQueryParam("v", v);
}

function buildWhatsAppText({ qty, priceTND }) {
  const q = clampQty(qty);
  const price = formatTND(priceTND);
  return `Je veux commander l'épilateur 5-en-1 – Quantité: ${q} – Prix: ${price} TND`;
}

function buildWhatsAppLink({ qty, priceTND }) {
  const text = buildWhatsAppText({ qty, priceTND });
  const encoded = encodeURIComponent(text);
  const base = `https://wa.me/${CONFIG.whatsappNumberE164}`;
  return `${base}?text=${encoded}`;
}

function updateWhatsAppCTAs({ qty }) {
  const href = buildWhatsAppLink({ qty, priceTND: CONFIG.priceTND });
  ["cta-whatsapp", "cta-whatsapp-2", "cta-whatsapp-3"].forEach((id) => {
    const el = $(id);
    if (el) el.setAttribute("href", href);
  });
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
function buildOrderPayload({ name, phone, address, qty, variant }) {
  return {
    brand: CONFIG.brand,
    product: CONFIG.productName,
    qty: clampQty(qty),
    priceTND: CONFIG.priceTND,
    currency: CONFIG.currency,
    customer: { name: String(name || "").trim(), phone: String(phone || "").trim(), address: String(address || "").trim() },
    heroVariant: variant,
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
    `Hero variant: ${order.heroVariant}`,
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
  const variantEl = $("variant");
  const summaryPrice = $("summary-price");
  if (summaryPrice) summaryPrice.textContent = formatTND(CONFIG.priceTND);

  const update = () => {
    const qty = qtyEl ? qtyEl.value : String(CONFIG.defaultQty);
    updateWhatsAppCTAs({ qty });
  };

  if (qtyEl) qtyEl.addEventListener("change", update);
  if (variantEl) variantEl.addEventListener("change", () => applyHeroVariant(variantEl.value));
  update();

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
        variant: $("variant")?.value,
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
    const variant = ($("variant")?.value || getHeroVariant()).toUpperCase();

    const order = buildOrderPayload({ name, phone, address, qty, variant });

    saveOrder(order);
    toast("Commande enregistrée. On te contacte pour confirmer.");

    // Optional: send to Formspree when configured
    const sent = await sendToFormspree(order);
    if (CONFIG.formspreeEndpoint) {
      if (sent.ok) toast("Commande envoyée par email (Formspree).");
      else toast("Commande enregistrée (Formspree non configuré ou erreur).");
    }

    closeModal();

    // Also open WhatsApp to accelerate confirmation (best conversion)
    const wa = buildWhatsAppLink({ qty: order.qty, priceTND: order.priceTND });
    window.open(wa, "_blank", "noopener,noreferrer");
  });
}

function initYear() {
  const el = $("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function init() {
  initYear();
  setContactPhoneLink();

  const variant = getHeroVariant();
  applyHeroVariant(variant);
  updateWhatsAppCTAs({ qty: CONFIG.defaultQty });

  initModal();
  initCheckout();
}

document.addEventListener("DOMContentLoaded", init);

