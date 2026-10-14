
"use strict";

/* =========================================
   ELEMENTS
========================================= */

const intro = document.getElementById("intro");
const introStars = document.getElementById("introStars");
const introShootingStars = document.getElementById("introShootingStars");
const pageShootingStars = document.getElementById("pageShootingStars");
const countdownNumber = document.getElementById("countdownNumber");
const introCaption = document.getElementById("introCaption");
const mysteryGift = document.getElementById("mysteryGift");

const siteHeader = document.getElementById("siteHeader");
const mainContent = document.getElementById("mainContent");

const aboutButton = document.getElementById("aboutButton");
const aboutModal = document.getElementById("aboutModal");
const closeModal = document.getElementById("closeModal");

const birthdayMusic = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");
const musicButtonText = document.getElementById("musicButtonText");
const musicIcon = document.getElementById("musicIcon");

const particlesLayer = document.getElementById("particlesLayer");
const confettiLayer = document.getElementById("confettiLayer");
const birthdayName = document.getElementById("birthdayName");

const customizationText = document.getElementById("customizationText");
const orderNumberElement = document.getElementById("orderNumber");
const formStatus = document.getElementById("formStatus");
const copyOrderButton = document.getElementById("copyOrder");
const sendOrderButton = document.getElementById("sendOrder");

const WHATSAPP_NUMBER = "201040275280";
const LANGUAGE_KEY = "4u-language";
const TEMPLATE_ID = "boy-birthday";
const ORDER_STORAGE_KEY = "4u-order-" + TEMPLATE_ID;

let currentLanguage = "ar";
let giftOpened = false;
let musicPlaying = false;
let countdownTimer = null;
let lastFocusedElement = null;
let modalIsOpen = false;
let introShootingStarTimer = null;
let pageShootingStarTimer = null;
let lastDefaultCustomization = "";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================
   LANGUAGE
========================================= */

function getSavedLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "ar";
  } catch (error) {
    return "ar";
  }
}

function getOrderNumber() {
  try {
    let savedNumber = sessionStorage.getItem(ORDER_STORAGE_KEY);

    if (!savedNumber) {
      const date = new Date();
      const datePart = [
        String(date.getFullYear()).slice(-2),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
      ].join("");

      const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();

      savedNumber = `4U-${datePart}-${randomPart}`;
      sessionStorage.setItem(ORDER_STORAGE_KEY, savedNumber);
    }

    return savedNumber;
  } catch (error) {
    const date = new Date();
    const datePart = [
      String(date.getFullYear()).slice(-2),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("");

    return `4U-${datePart}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
}

const orderNumber = getOrderNumber();

if (orderNumberElement) {
  orderNumberElement.textContent = orderNumber;
}

function getDefaultCustomization(language) {
  if (language === "en") {
    return [
      "Birthday Person: ",
      "Age: ",
      "Main Title / Name: ",
      "Personal Message: ",
      "Photo Details (5 photos): ",
      "Music Preference: ",
      "Additional Notes: "
    ].join("\n");
  }

  return [
    "صاحب عيد الميلاد: ",
    "العمر: ",
    "الاسم أو العنوان الرئيسي: ",
    "الرسالة الشخصية: ",
    "الموسيقى المطلوبة: ",
    "تفاصيل إضافية: "
  ].join("\n");
}

function updateCustomizationLanguage(language) {
  if (!customizationText) return;

  const newDefault = getDefaultCustomization(language);

  if (
    !customizationText.value.trim() ||
    customizationText.value === lastDefaultCustomization
  ) {
    customizationText.value = newDefault;
  }

  lastDefaultCustomization = newDefault;

  customizationText.placeholder =
    customizationText.getAttribute(`data-placeholder-${language}`) || "";
}

function updateMusicButtonText() {
  if (!musicButtonText || !musicButton || !musicIcon) return;

  if (musicPlaying) {
    musicButtonText.textContent = currentLanguage === "ar"
      ? "إيقاف الموسيقى"
      : "PAUSE THE MUSIC";

    musicButton.classList.add("playing");
    musicButton.setAttribute("aria-pressed", "true");
  } else {
    musicButtonText.textContent = currentLanguage === "ar"
      ? "شغّل موسيقى الذكريات"
      : "PLAY THE MUSIC";

    musicButton.classList.remove("playing");
    musicButton.setAttribute("aria-pressed", "false");
  }

  musicIcon.textContent = "♫";
}

function applyLanguage() {
  currentLanguage = getSavedLanguage();

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
    const value = element.getAttribute(`data-${currentLanguage}`);
    if (value !== null) element.textContent = value;
  });

  document.querySelectorAll("[data-ar-label][data-en-label]").forEach((element) => {
    const key = currentLanguage === "ar" ? "data-ar-label" : "data-en-label";
    const value = element.getAttribute(key);
    if (value) element.setAttribute("aria-label", value);
  });

  document.title = currentLanguage === "ar"
    ? "مفاجأة عيد ميلاد ولد | 4U celebrations"
    : "Midnight Birthday | 4U celebrations";

  if (mysteryGift) {
    mysteryGift.setAttribute(
      "aria-label",
      currentLanguage === "ar" ? "افتح الهدية" : "Open the gift"
    );
  }

  const closeButton = document.getElementById("closeModal");
  if (closeButton) {
    closeButton.setAttribute(
      "aria-label",
      currentLanguage === "ar" ? "إغلاق" : "Close"
    );
  }

  updateMusicButtonText();
  updateCustomizationLanguage(currentLanguage);
}

applyLanguage();

window.addEventListener("storage", (event) => {
  if (event.key === LANGUAGE_KEY || event.key === null) {
    applyLanguage();
  }
});


/* =========================================
   SCROLL TO CUSTOMIZATION
========================================= */

function scrollToCustomization() {
  closeAboutModal();

  const section = document.getElementById("customization");

  if (section) {
    section.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }
}

document.querySelectorAll("[data-scroll-customization]").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToCustomization();
  });
});


/* =========================================
   INTRO STARS
========================================= */

function createIntroStars() {
  if (!introStars || prefersReducedMotion) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 65; i++) {
    const star = document.createElement("span");
    star.className = "intro-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.animationDuration = `${2.5 + Math.random() * 4}s`;

    const size = Math.random() > 0.85 ? 3 : 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    fragment.appendChild(star);
  }

  introStars.appendChild(fragment);
}

createIntroStars();


/* =========================================
   SHOOTING STARS
========================================= */

function createShootingStar(layer, scheduleNext) {
  if (!layer) return;

  const star = document.createElement("span");
  star.className = "shooting-star";

  const angle = Math.round(Math.random() * 360);
  const length = Math.round(75 + Math.random() * 75);
  const duration = 1.25 + Math.random() * 1.1;
  const distance = Math.round(180 + Math.random() * 320);

  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty("--shoot-angle", `${angle}deg`);
  star.style.setProperty("--shoot-length", `${length}px`);
  star.style.setProperty("--shoot-duration", `${duration}s`);
  star.style.setProperty("--shoot-distance", `${distance}px`);

  layer.appendChild(star);

  star.addEventListener("animationend", () => star.remove(), { once: true });
  scheduleNext();
}

function startIntroShootingStars() {
  if (!introShootingStars ) return;

  const scheduleNext = () => {
    if (!intro || intro.classList.contains("leaving")) return;

    introShootingStarTimer = window.setTimeout(() => {
      createShootingStar(introShootingStars, scheduleNext);
    }, 1300 + Math.random() * 500);
  };

  introShootingStarTimer = window.setTimeout(() => {
    createShootingStar(introShootingStars, scheduleNext);
  }, 700);
}

function startPageShootingStars() {
  if (!pageShootingStars) return;

  const scheduleNext = () => {
    if (!mainContent || !mainContent.classList.contains("show")) return;

    pageShootingStarTimer = window.setTimeout(() => {
      createShootingStar(pageShootingStars, scheduleNext);
    }, 1300 + Math.random() * 500);
  };

  pageShootingStarTimer = window.setTimeout(() => {
    createShootingStar(pageShootingStars, scheduleNext);
  }, 500);
}

startIntroShootingStars();


/* =========================================
   COUNTDOWN
========================================= */

function updateCountdown(value) {
  if (!countdownNumber) return;

  countdownNumber.textContent = String(value);
  countdownNumber.classList.remove("countdown-change");
  void countdownNumber.offsetWidth;
  countdownNumber.classList.add("countdown-change");
}

function startCountdown() {
  if (!intro || !mysteryGift || !countdownNumber) return;

  let count = 5;
  updateCountdown(count);
  mysteryGift.disabled = true;

  countdownTimer = window.setInterval(() => {
    count -= 1;

    if (count >= 0) updateCountdown(count);

    if (count <= 0) {
      window.clearInterval(countdownTimer);
      countdownTimer = null;

      window.setTimeout(() => {
        intro.classList.add("ready");
        mysteryGift.disabled = false;
        countdownNumber.textContent = "✦";

        // introCaption is optional because it is commented out in the HTML.
        if (introCaption) {
          introCaption.textContent = currentLanguage === "ar"
            ? "اللحظة اللي مستنيها وصلت"
            : "THE MOMENT HAS ARRIVED";
        }
      }, prefersReducedMotion ? 50 : 750);
    }
  }, 1000);
}

startCountdown();


/* =========================================
   OPEN GIFT
========================================= */

function openGift() {
  if (!intro || !mysteryGift || giftOpened || mysteryGift.disabled) return;

  giftOpened = true;
  mysteryGift.disabled = true;

  startMusicAutomatically();
  intro.classList.add("opening");

  window.setTimeout(() => {
    intro.classList.add("leaving");

    if (mainContent) mainContent.classList.add("show");
    if (siteHeader) siteHeader.classList.add("visible");

    startPageShootingStars();

    window.setTimeout(() => {
      intro.style.display = "none";

      if (introShootingStarTimer) {
        window.clearTimeout(introShootingStarTimer);
        introShootingStarTimer = null;
      }
    }, prefersReducedMotion ? 50 : 1700);
  }, prefersReducedMotion ? 100 : 1250);
}

if (mysteryGift) {
  mysteryGift.addEventListener("click", openGift);
}


/* =========================================
   MUSIC
========================================= */

function startMusicAutomatically() {
  if (!birthdayMusic) return;

  const playback = birthdayMusic.play();

  if (playback && typeof playback.then === "function") {
    playback
      .then(() => {
        musicPlaying = true;
        updateMusicButtonText();
      })
      .catch(() => {
        musicPlaying = false;
        updateMusicButtonText();
      });
  }
}

async function toggleMusic() {
  if (!birthdayMusic) return;

  if (musicPlaying) {
    birthdayMusic.pause();
    musicPlaying = false;
    updateMusicButtonText();
    return;
  }

  try {
    await birthdayMusic.play();
    musicPlaying = true;
    updateMusicButtonText();
  } catch (error) {
    musicPlaying = false;
    updateMusicButtonText();

    if (musicButtonText) {
      musicButtonText.textContent = currentLanguage === "ar"
        ? "تأكد من وجود ملف الموسيقى"
        : "CHECK THE MUSIC FILE";
    }
  }
}

if (musicButton) musicButton.addEventListener("click", toggleMusic);

if (birthdayMusic) {
  birthdayMusic.addEventListener("ended", () => {
    musicPlaying = false;
    updateMusicButtonText();
  });

  birthdayMusic.addEventListener("pause", () => {
    musicPlaying = false;
    updateMusicButtonText();
  });

  birthdayMusic.addEventListener("play", () => {
    musicPlaying = true;
    updateMusicButtonText();
  });
}


/* =========================================
   ABOUT MODAL
========================================= */

function openModal() {
  if (!aboutModal || modalIsOpen) return;

  modalIsOpen = true;
  lastFocusedElement = document.activeElement;

  aboutModal.classList.add("open");
  aboutModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  window.setTimeout(() => {
    if (closeModal) closeModal.focus();
  }, prefersReducedMotion ? 0 : 100);
}

function closeAboutModal() {
  if (!aboutModal || !modalIsOpen) return;

  modalIsOpen = false;
  aboutModal.classList.remove("open");
  aboutModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

if (aboutButton) aboutButton.addEventListener("click", openModal);
if (closeModal) closeModal.addEventListener("click", closeAboutModal);

if (aboutModal) {
  aboutModal.setAttribute("aria-hidden", "true");

  aboutModal.addEventListener("click", (event) => {
    if (event.target === aboutModal) closeAboutModal();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalIsOpen) {
    closeAboutModal();
  }

  if (event.key === "Tab" && modalIsOpen && aboutModal) {
    const focusable = aboutModal.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});


/* =========================================
   DISABLED PARTICLES / CONFETTI
========================================= */

function createAmbientParticles() {
  if (particlesLayer) particlesLayer.replaceChildren();
}

function createConfetti() {
  if (confettiLayer) confettiLayer.replaceChildren();
}


/* =========================================
   HIDE MISSING PHOTOS
========================================= */

document.querySelectorAll(".memory-card .memory-photo").forEach((image) => {
  const hideMissingImage = () => {
    const card = image.closest(".memory-card");
    if (card) card.classList.add("image-missing");
  };

  image.addEventListener("error", hideMissingImage);

  if (image.complete && image.naturalWidth === 0) {
    hideMissingImage();
  }
});


/* =========================================
   PERSONAL NAME
========================================= */

function normalizeBirthdayName() {
  if (!birthdayName) return;

  const name = birthdayName.textContent.trim();

  if (!name || name.toLowerCase() === "user name") {
    birthdayName.textContent = currentLanguage === "ar"
      ? "اسم صاحب العيد"
      : "YOUR NAME";
  }
}

normalizeBirthdayName();


/* =========================================
   BUILD WHATSAPP ORDER MESSAGE
========================================= */

function getOrderMessage() {
  const language = getSavedLanguage();
  const details = customizationText ? customizationText.value.trim() : "";

  const greeting = language === "en"
    ? "Hello 4U Celebrations,"
    : "أهلا 4U Celebrations,";

  const orderLabel = language === "en"
    ? "Order Number:"
    : "رقم الطلب:";

  const templateLabel = language === "en"
    ? "Template Name:"
    : "اسم القالب:";

  const templateName = language === "en"
    ? "Boy Birthday Template"
    : "قالب عيد ميلاد ولد";

  return [
    greeting,
    "",
    `${orderLabel} ${orderNumber}`,
    `${templateLabel} ${templateName}`,
    "",
    details
  ].join("\n");
}


/* =========================================
   STATUS MESSAGE
========================================= */

function showStatus(message, isError = false) {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.style.color = isError ? "#ffb9c8" : "#b9d6ff";
}


/* =========================================
   COPY ORDER
========================================= */

if (copyOrderButton) {
  copyOrderButton.addEventListener("click", async () => {
    const message = getOrderMessage();
    const language = getSavedLanguage();

    try {
      await navigator.clipboard.writeText(message);

      showStatus(
        language === "en"
          ? "Order details copied successfully."
          : "تم نسخ بيانات الطلب بنجاح"
      );
    } catch (error) {
      const temporaryTextarea = document.createElement("textarea");
      temporaryTextarea.value = message;
      temporaryTextarea.style.position = "fixed";
      temporaryTextarea.style.opacity = "0";

      document.body.appendChild(temporaryTextarea);
      temporaryTextarea.select();

      let copied = false;

      try {
        copied = document.execCommand("copy");
      } catch (copyError) {
        copied = false;
      }

      temporaryTextarea.remove();

      showStatus(
        copied
          ? (language === "en" ? "Order details copied." : "تم نسخ بيانات الطلب")
          : (language === "en"
              ? "Copy failed. Please copy the text manually."
              : "النسخ لم ينجح، انسخ النص يدويًا من فضلك"),
        !copied
      );
    }
  });
}


/* =========================================
   SEND ORDER TO WHATSAPP
========================================= */

if (sendOrderButton) {
  sendOrderButton.addEventListener("click", () => {
    const language = getSavedLanguage();
    const details = customizationText ? customizationText.value.trim() : "";

    if (!details) {
      showStatus(
        language === "en"
          ? "Please fill in your order details first."
          : "اكتب بيانات طلبك الأول من فضلك",
        true
      );

      if (customizationText) customizationText.focus();
      return;
    }

    const message = getOrderMessage();
    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    showStatus(
      language === "en"
        ? "WhatsApp is opening. Review the message and press Send."
        : "واتساب هيفتح دلوقتي، راجع الرسالة واضغط إرسال"
    );

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });
}
