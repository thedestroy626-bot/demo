const PHONE = "+966535757650";
const WA = "966535757650";
const path = location.pathname.replace(/\/+$/, "") || "/";
const isAR = document.documentElement.lang === "ar";
document.body.classList.toggle("rtl", isAR);

function waLink(message) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll("[data-wa]").forEach((a) => {
  const base = a.getAttribute("data-wa") || (
    isAR
      ? "السلام عليكم، أحتاج خدمة من للتبريد والتكييف."
      : "Hello, I need a service from للتبريد والتكييف."
  );
  a.href = waLink(base);
  a.target = "_blank";
  a.rel = "noopener";
});

document.querySelectorAll("[data-call]").forEach((a) => {
  a.href = `tel:${PHONE}`;
});

const menuBtn = document.querySelector(".mobile-menu");
const drawer = document.querySelector(".drawer");
if (menuBtn && drawer) {
  const setMenuState = (open) => {
    drawer.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? (isAR ? "إغلاق القائمة" : "Close menu") : (isAR ? "فتح القائمة" : "Open menu"));
  };

  setMenuState(false);
  menuBtn.addEventListener("click", () => {
    setMenuState(!drawer.classList.contains("open"));
  });
  drawer.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenuState(false))
  );
}

document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.setAttribute("aria-expanded", "false");
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    if (!item) return;
    const open = item.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
});

document.querySelectorAll("[data-problem]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.problem || "";
    const service = document.querySelector("#service");
    const details = document.querySelector("#details");
    if (service) {
      const serviceMap = [
        [/مكيف|مكيفات|تكييف/i, "صيانة المكيفات"],
        [/ثلاج/i, "إصلاح الثلاجات"],
        [/غسال/i, "إصلاح الغسالات"],
        [/عاجل|طوارئ|urgent/i, "خدمة عاجلة"],
        [/\bac\b|air[\s-]?condition/i, "AC repair/service"],
        [/fridge|refrigerator/i, "Refrigerator repair"],
        [/wash/i, "Washing machine repair"],
        [/urgent|emergency/i, "Urgent service"],
      ];
      const mapped = serviceMap.find(([pattern]) => pattern.test(val));
      const desired = mapped ? mapped[1] : val;
      const option = [...service.options].find(
        (o) => o.textContent.trim() === desired || o.value === desired
      );
      if (option) service.value = option.value;
    }
    if (details) {
      details.value = details.value ? `${details.value}\n${val}` : val;
    }
    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
  });
});

const form = document.querySelector("#bookingForm");
const toast = document.querySelector(".toast");
const showToast = (msg) => {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
};
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const service = String(data.get("service") || "").trim();
    const area = String(data.get("area") || "").trim();
    const preferred = String(data.get("preferred") || "").trim();
    const details = String(data.get("details") || "").trim();

    const msg = isAR
      ? [
          "السلام عليكم، أريد حجز خدمة من للتبريد والتكييف.",
          `الاسم: ${name}`,
          `الخدمة: ${service}`,
          `الحي/الموقع: ${area}`,
          `الوقت المفضل: ${preferred || "لم يحدد"}`,
          `التفاصيل: ${details || "لا توجد تفاصيل إضافية"}`,
        ].join("\n")
      : [
          "Hello, I would like to book a service from للتبريد والتكييف.",
          `Name: ${name}`,
          `Service: ${service}`,
          `Area/location: ${area}`,
          `Preferred time: ${preferred || "Not specified"}`,
          `Details: ${details || "No additional details"}`,
        ].join("\n");

    showToast(isAR ? "جاري فتح واتساب…" : "Opening WhatsApp…");
    setTimeout(() => {
      window.location.href = waLink(msg);
    }, 600);
  });
}

const lb = document.querySelector(".lightbox");
document.querySelectorAll("[data-lightbox]").forEach((img) => {
  img.addEventListener("click", () => {
    if (!lb) return;
    const target = lb.querySelector("img");
    if (!target) return;
    target.src = img.currentSrc || img.src;
    target.alt = img.alt || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

if (lb) {
  const closeLightbox = () => {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  };
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("close-light")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const langLink = document.querySelector("[data-lang-switch]");
if (langLink) {
  let target;
  if (path === "/") {
    target = "/ar/";
  } else if (path === "/ar" || path.startsWith("/ar/")) {
    target = "/en" + (path.slice(3) || "/");
  } else if (path === "/en" || path.startsWith("/en/")) {
    target = "/ar" + (path.slice(3) || "/");
  } else {
    target = isAR ? "/en/" : "/ar/";
  }
  langLink.href = target.endsWith("/") ? target : `${target}/`;
}
