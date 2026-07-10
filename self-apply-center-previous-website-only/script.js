const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const SAC_EMAIL = "info@selfapplycenter.com";
const SAC_WHATSAPP = "9779761642336";

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  if (href === currentPage) {
    link.classList.add("is-active");
  }
});

document.querySelectorAll("form[data-local-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector("[data-form-message]");
    const formData = new FormData(form);
    const entries = [...formData.entries()].filter(([, value]) => String(value).trim());
    const lead = {
      page: document.title,
      submittedAt: new Date().toISOString(),
      fields: Object.fromEntries(entries),
    };

    const storedLeads = JSON.parse(localStorage.getItem("sacLeads") || "[]");
    storedLeads.push(lead);
    localStorage.setItem("sacLeads", JSON.stringify(storedLeads));

    const summary = entries
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const emailHref = `mailto:${SAC_EMAIL}?subject=${encodeURIComponent(
      `Website enquiry - ${document.title}`
    )}&body=${encodeURIComponent(summary)}`;
    const whatsappHref = `https://wa.me/${SAC_WHATSAPP}?text=${encodeURIComponent(
      `Hello Self Apply Center,\n\n${summary}`
    )}`;

    if (message) {
      message.innerHTML = `Thanks. Your enquiry is saved in this browser. <a href="${emailHref}">Send by email</a> or <a href="${whatsappHref}" target="_blank" rel="noopener">send on WhatsApp</a>.`;
    }

    form.reset();
  });
});

const destinationSearch = document.querySelector("[data-destination-search]");
const destinationButtons = document.querySelectorAll("[data-destination-filter]");
const destinationCards = document.querySelectorAll("[data-destination-card]");

function filterDestinations(filter = "all") {
  const query = (destinationSearch?.value || "").trim().toLowerCase();

  destinationCards.forEach((card) => {
    const tags = card.getAttribute("data-tags") || "";
    const text = card.textContent.toLowerCase();
    const matchesFilter = filter === "all" || tags.includes(filter);
    const matchesQuery = !query || text.includes(query) || tags.includes(query);
    card.hidden = !(matchesFilter && matchesQuery);
  });
}

destinationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    destinationButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    filterDestinations(button.dataset.destinationFilter);
  });
});

destinationSearch?.addEventListener("input", () => {
  const activeFilter =
    document.querySelector("[data-destination-filter].is-active")?.dataset.destinationFilter ||
    "all";
  filterDestinations(activeFilter);
});

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canHover) {
  document.body.classList.add("has-pointer");

  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
  });

  document
    .querySelectorAll(".service-card, .content-card, .team-card, .quote-card, .page-card")
    .forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--card-x", `${x}px`);
        card.style.setProperty("--card-y", `${y}px`);
      });
    });
}

const revealItems = document.querySelectorAll(
  ".section-heading, .content-card, .service-card, .team-card, .quote-card, .journey-step, .page-card, .mini-cta"
);

if ("IntersectionObserver" in window) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal-on-scroll");
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const storyButtons = document.querySelectorAll("[data-story-preview]");
const storyTitle = document.querySelector("[data-story-title]");
const storyCopy = document.querySelector("[data-story-copy]");
const storyDestination = document.querySelector("[data-story-destination]");
const storySupport = document.querySelector("[data-story-support]");

function updateStoryPreview(button) {
  storyButtons.forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");

  if (storyTitle) storyTitle.textContent = button.dataset.title || "";
  if (storyCopy) storyCopy.textContent = button.dataset.copy || "";
  if (storyDestination) storyDestination.textContent = button.dataset.destination || "";
  if (storySupport) storySupport.textContent = button.dataset.support || "";
}

storyButtons.forEach((button, index) => {
  if (index === 0) {
    button.classList.add("is-active");
  }

  button.addEventListener("pointerenter", () => updateStoryPreview(button));
  button.addEventListener("focus", () => updateStoryPreview(button));
  button.addEventListener("click", () => updateStoryPreview(button));
});
