
const loader = document.getElementById("loader");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

// Loading animation
function hideLoader() {
  loader.classList.add("hide");
}

window.addEventListener("load", hideLoader);
setTimeout(hideLoader, 2500);

// Mobile navigation
menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");

  menuBtn.classList.toggle("open", isOpen);
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Scroll reveal animation
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

// Animated statistics
const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach(counter => {
    const target = Number(counter.dataset.count);
    const duration = 1400;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      counter.textContent = Math.floor(target * eased).toLocaleString("en-IN");

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

const stats = document.querySelector(".hero-stats");

if ("IntersectionObserver" in window) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      animateCounters();
      statsObserver.disconnect();
    }
  });

  statsObserver.observe(stats);
} else {
  animateCounters();
}

// Select a membership plan
document.querySelectorAll("[data-plan]").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("plan").value = button.dataset.plan;
  });
});

// Prepare an enquiry email without storing form data
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const plan = formData.get("plan");
  const message = formData.get("message");

  const subject = encodeURIComponent(`FitZone enquiry - ${plan}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nInterested in: ${plan}\nMessage: ${message || "Not provided"}`
  );

  formNote.textContent =
    "Your email app will open with a prepared enquiry. Review it before sending.";

  window.location.href =
    `mailto:hello@fitzone.example?subject=${subject}&body=${body}`;
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();
