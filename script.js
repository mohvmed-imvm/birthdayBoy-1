
/* =========================================
   MIDNIGHT BIRTHDAY — 4U celebrations
   Complete interactions and language system
========================================= */

"use strict";

/* ---------- Elements ---------- */

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
const modalOrderButton = document.getElementById("modalOrderButton");

const headerOrder = document.getElementById("headerOrder");
const orderButton = document.getElementById("orderButton");

const birthdayMusic = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");
const musicButtonText = document.getElementById("musicButtonText");
const musicIcon = document.getElementById("musicIcon");

const particlesLayer = document.getElementById("particlesLayer");
const confettiLayer = document.getElementById("confettiLayer");

const birthdayName = document.getElementById("birthdayName");
const birthdayTitle = document.getElementById("birthdayTitle");

const WHATSAPP_NUMBER = "201040275280";
const LANGUAGE_KEY = "4u-language";


/* ---------- State ---------- */

let currentLanguage = "ar";
let giftOpened = false;
let musicPlaying = false;
let countdownTimer = null;
let lastFocusedElement = null;
let modalIsOpen = false;
let introShootingStarTimer = null;
let pageShootingStarTimer = null;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================
   LANGUAGE SYSTEM
   Reads the language selected on the main site
========================================= */

function getSavedLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "ar";
  } catch (error) {
    return "ar";
  }
}

function createWhatsAppURL() {
  const message = currentLanguage === "ar"
    ? "عايز أعمل صفحة مناسبة مخصصة من 4U celebrations"
    : "I would like to order a custom occasion page from 4U celebrations";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function applyLanguage() {
  currentLanguage = getSavedLanguage();

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
    const translatedText = element.dataset[currentLanguage];

    if (translatedText !== undefined) {
      element.textContent = translatedText;
    }
  });

  document.querySelectorAll("[data-ar-label][data-en-label]").forEach((element) => {
    const translatedLabel = element.dataset[
      currentLanguage === "ar" ? "arLabel" : "enLabel"
    ];

    if (translatedLabel) {
      element.setAttribute("aria-label", translatedLabel);
    }
  });

  document.title = currentLanguage === "ar"
    ? "مفاجأة عيد ميلاد | 4U celebrations"
    : "Midnight Birthday | 4U celebrations";

  mysteryGift.setAttribute(
    "aria-label",
    currentLanguage === "ar" ? "افتح الهدية" : "Open the gift"
  );

  updateMusicButtonText();

  const whatsappURL = createWhatsAppURL();

  [headerOrder, modalOrderButton, orderButton].forEach((link) => {
    if (link) {
      link.href = whatsappURL;
    }
  });
}

applyLanguage();


/* Update if the main website language changes in another tab */

window.addEventListener("storage", (event) => {
  if (event.key === LANGUAGE_KEY || event.key === null) {
    applyLanguage();
  }
});


/* =========================================
   INTRO STAR FIELD
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
   RANDOM WHITE SHOOTING STARS
   One star approximately every two seconds
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

  star.addEventListener("animationend", () => {
    star.remove();
  }, { once: true });

  scheduleNext();
}

function startIntroShootingStars() {
  if (!introShootingStars) return;

  const scheduleNext = () => {
    if (!intro || intro.classList.contains("leaving")) return;

    const delay = 1300 + Math.random() * 500;

    introShootingStarTimer = window.setTimeout(() => {
      createShootingStar(introShootingStars, scheduleNext);
    }, delay);
  };

  // The first star appears shortly after the page loads.
  introShootingStarTimer = window.setTimeout(() => {
    createShootingStar(introShootingStars, scheduleNext);
  }, 700);
}

function startPageShootingStars() {
  if (!pageShootingStars) return;

  const scheduleNext = () => {
    if (!mainContent || !mainContent.classList.contains("show")) return;

    const delay = 1300 + Math.random() * 500;

    pageShootingStarTimer = window.setTimeout(() => {
      createShootingStar(pageShootingStars, scheduleNext);
    }, delay);
  };

  pageShootingStarTimer = window.setTimeout(() => {
    createShootingStar(pageShootingStars, scheduleNext);
  }, 500);
}

startIntroShootingStars();


/* =========================================
   CINEMATIC COUNTDOWN
   Countdown completes before the gift becomes available
========================================= */

function updateCountdown(value) {
  countdownNumber.textContent = String(value);

  countdownNumber.classList.remove("countdown-change");

  // Restart the CSS animation cleanly.
  void countdownNumber.offsetWidth;

  countdownNumber.classList.add("countdown-change");
}

function startCountdown() {
  let count = 5;

  updateCountdown(count);

  countdownTimer = window.setInterval(() => {
    count -= 1;

    if (count >= 0) {
      updateCountdown(count);
    }

    if (count <= 0) {
      window.clearInterval(countdownTimer);
      countdownTimer = null;

      window.setTimeout(() => {
        intro.classList.add("ready");
        mysteryGift.disabled = false;

        countdownNumber.textContent = "✦";

        introCaption.textContent = currentLanguage === "ar"
          ? "اللحظة اللي مستنيها وصلت"
          : "THE MOMENT HAS ARRIVED";
      },prefersReducedMotion ? 50 : 750);
    }
  }, prefersReducedMotion ? 1000 : 1000);
}


/* Keep the gift unavailable until the countdown ends. */

mysteryGift.disabled = true;

startCountdown();


/* =========================================
   OPEN THE GIFT
========================================= */

function openGift() {
  if (giftOpened || mysteryGift.disabled) return;

  giftOpened = true;
  mysteryGift.disabled = true;

  // Start the music directly from the gift click.
  // This gives the browser a user interaction to allow playback.
  startMusicAutomatically();

  intro.classList.add("opening");

  /*
    The gift opens first.
    Then the dark intro fades away while the
    full website gradually becomes visible.
  */

  const revealDelay = prefersReducedMotion ? 100 : 1250;

  window.setTimeout(() => {
    intro.classList.add("leaving");

    mainContent.classList.add("show");
    siteHeader.classList.add("visible");

    startPageShootingStars();

    window.setTimeout(() => {
      if (intro) {
        intro.style.display = "none";
      }

      if (introShootingStarTimer) {
        window.clearTimeout(introShootingStarTimer);
        introShootingStarTimer = null;
      }
    }, prefersReducedMotion ? 50 : 1700);

  }, revealDelay);
}

mysteryGift.addEventListener("click", openGift);


/* =========================================
   MUSIC
========================================= */

function updateMusicButtonText() {
  if (!musicButtonText || !musicButton || !musicIcon) return;

  if (musicPlaying) {
    musicButtonText.textContent = currentLanguage === "ar"
      ? "إيقاف الموسيقى"
      : "PAUSE THE MUSIC";

    musicIcon.textContent = "♫";
    musicButton.classList.add("playing");
    musicButton.setAttribute("aria-pressed", "true");
  } else {
    musicButtonText.textContent = currentLanguage === "ar"
      ? "شغّل موسيقى الذكريات"
      : "PLAY THE MUSIC";

    musicIcon.textContent = "♫";
    musicButton.classList.remove("playing");
    musicButton.setAttribute("aria-pressed", "false");
  }
}

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

    musicButtonText.textContent = currentLanguage === "ar"
      ? "تأكد من وجود ملف الموسيقى"
      : "CHECK THE MUSIC FILE";
  }
}

musicButton.addEventListener("click", toggleMusic);

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


/* =========================================
   ABOUT TEMPLATE MODAL
========================================= */

function openModal() {
  if (modalIsOpen) return;

  modalIsOpen = true;
  lastFocusedElement = document.activeElement;

  aboutModal.classList.add("open");
  aboutModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  window.setTimeout(() => {
    closeModal.focus();
  }, prefersReducedMotion ? 0 : 100);
}

function closeAboutModal() {
  if (!modalIsOpen) return;

  modalIsOpen = false;

  aboutModal.classList.remove("open");
  aboutModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

aboutButton.addEventListener("click", openModal);
closeModal.addEventListener("click", closeAboutModal);

aboutModal.addEventListener("click", (event) => {
  if (event.target === aboutModal) {
    closeAboutModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalIsOpen) {
    closeAboutModal();
  }

  /*
    Keep keyboard focus inside the modal while it is open.
  */

  if (event.key === "Tab" && modalIsOpen) {
    const focusableElements = aboutModal.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements.length) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

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
   OLD FLOATING PARTICLES
   Disabled in favor of shooting stars
========================================= */

function createAmbientParticles() {
  if (!particlesLayer) return;
  particlesLayer.replaceChildren();
}


/* =========================================
   OLD CONFETTI
   Disabled in favor of shooting stars
========================================= */

function createConfetti() {
  if (!confettiLayer) return;
  confettiLayer.replaceChildren();
}


/* =========================================
   HIDE PHOTOS THAT HAVE NOT BEEN ADDED YET
========================================= */

document.querySelectorAll(".memory-card .memory-photo").forEach((image) => {
  image.addEventListener("error", () => {
    const card = image.closest(".memory-card");

    if (card) {
      card.classList.add("image-missing");
    }
  });

  /*
    If an image is already cached as broken,
    this handles it when the script runs.
  */

  if (image.complete && image.naturalWidth === 0 && image.src) {
    const card = image.closest(".memory-card");

    if (card) {
      card.classList.add("image-missing");
    }
  }
});


/* =========================================
   OPTIONAL PERSONAL NAME
========================================= */

/*
  To personalize the demo, change YOUR NAME in index.html.
  This helper only prevents an empty name from appearing.
*/

function normalizeBirthdayName() {
  if (!birthdayName) return;

  const name = birthdayName.textContent.trim();

  if (!name) {
    birthdayName.textContent = currentLanguage === "ar"
      ? "اسم صاحب العيد"
      : "YOUR NAME";
  }
}

normalizeBirthdayName();


/* =========================================
   INITIAL ACCESSIBILITY & SAFETY
========================================= */

aboutModal.setAttribute("aria-hidden", "true");
musicButton.setAttribute("aria-pressed", "false");
