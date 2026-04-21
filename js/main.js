const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
}

const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".dropdown-toggle");

  if (toggle) {
    toggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  }
});

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

const scrollTopBtn = document.getElementById("scrollTop");

if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

const counters = document.querySelectorAll(".stat-number");
let counterAnimated = false;

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current) + "+";
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + "+";
      }
    };

    updateCounter();
  });
};

const observerOptions = {
  threshold: 0.5,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !counterAnimated) {
      animateCounters();
      counterAnimated = true;
    }
  });
}, observerOptions);

const statsSection = document.querySelector(".stats-section");
if (statsSection) {
  observer.observe(statsSection);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (href === "#" || href === "") {
      e.preventDefault();
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 80;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

const currentLocation = window.location.pathname.split("/").pop();
const navItems = document.querySelectorAll(".nav-menu li a");

navItems.forEach((item) => {
  const href = item.getAttribute("href");

  if (
    href === currentLocation ||
    (currentLocation === "" && href === "index.html")
  ) {
    item.classList.add("active");
  }
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");

    let isValid = true;

    document.querySelectorAll(".error-message").forEach((el) => el.remove());

    if (name && name.value.trim() === "") {
      showError(name, "Name is required");
      isValid = false;
    }

    if (email && email.value.trim() === "") {
      showError(email, "Email is required");
      isValid = false;
    } else if (email && !isValidEmail(email.value)) {
      showError(email, "Please enter a valid email");
      isValid = false;
    }

    if (phone && phone.value.trim() === "") {
      showError(phone, "Phone number is required");
      isValid = false;
    } else if (phone && !isValidPhone(phone.value)) {
      showError(phone, "Please enter a valid phone number");
      isValid = false;
    }

    if (message && message.value.trim() === "") {
      showError(message, "Message is required");
      isValid = false;
    }

    if (isValid) {
      showSuccess();
      contactForm.reset();
    }
  });
}

function showError(input, message) {
  const formGroup = input.parentElement;
  const error = document.createElement("div");
  error.className = "error-message";
  error.style.color = "#ff6b35";
  error.style.fontSize = "0.8125rem";
  error.style.marginTop = "0.25rem";
  error.textContent = message;
  formGroup.appendChild(error);
  input.style.borderColor = "#ff6b35";
}

function showSuccess() {
  const successMsg = document.createElement("div");
  successMsg.className = "success-message";
  successMsg.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
  successMsg.textContent =
    "Thank you! Your message has been sent successfully.";

  document.body.appendChild(successMsg);

  setTimeout(() => {
    successMsg.style.animation = "slideOut 0.3s ease";
    setTimeout(() => successMsg.remove(), 300);
  }, 3000);
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone) {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/\s+/g, ""));
}

const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

if (slides.length > 0) {
  const nextSlide = () => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  };

  setInterval(nextSlide, 5000);
}

const ctaSlides = document.querySelectorAll(".cta-slide");
let currentCtaSlide = 0;

if (ctaSlides.length > 0) {
  const nextCtaSlide = () => {
    ctaSlides[currentCtaSlide].classList.remove("active");
    currentCtaSlide = (currentCtaSlide + 1) % ctaSlides.length;
    ctaSlides[currentCtaSlide].classList.add("active");
  };

  setInterval(nextCtaSlide, 6000);
}

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
});

const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log(
  "%cKalahanu Both Group",
  "font-size: 20px; font-weight: bold; color: #1a2c5b;",
);
console.log("%cWebsite developed with ❤️", "font-size: 12px; color: #ff6b35;");

document.addEventListener("DOMContentLoaded", () => {
  const brandCards = document.querySelectorAll(".brand-card");

  if (brandCards.length > 0) {
    const brandCardObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-in");
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    brandCards.forEach((card) => {
      brandCardObserver.observe(card);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement;
      const isOpen = faqItem.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("open");
      });

      if (!isOpen) {
        faqItem.classList.add("open");
      }
    });
  });
});
