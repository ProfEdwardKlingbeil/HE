
document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const navigationButtons = document.querySelectorAll("[data-open-page]");
  const homeButtons = document.querySelectorAll("[data-go-home]");
  const nav = document.getElementById("main-nav");
  const menuToggle = document.getElementById("menu-toggle");

  function openPage(pageName) {
    const targetPage = document.getElementById(`${pageName}-view`);

    if (!targetPage) {
      console.error(`Página não encontrada: ${pageName}-view`);
      return;
    }

    pages.forEach((page) => {
      page.classList.toggle("active", page === targetPage);
    });

    navigationButtons.forEach((button) => {
      const isActive = button.dataset.openPage === pageName;

      button.classList.toggle(
        "active",
        isActive && button.classList.contains("nav-link")
      );
    });

    if (nav) {
      nav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  navigationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openPage(button.dataset.openPage);
    });
  });

  homeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openPage("inicio");
    });
  });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );
    });
  }

  // Configuração independente de cada carrossel.
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const previousButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");

    if (!track || slides.length === 0) {
      console.warn("Carrossel sem imagens ou sem faixa de slides.", carousel);
      return;
    }

    const gallerySection = carousel.closest(".gallery-section");
    const dotsContainer = gallerySection
      ? gallerySection.querySelector("[data-carousel-dots]")
      : null;
    const counter = gallerySection
      ? gallerySection.querySelector("[data-gallery-count]")
      : null;

    let currentIndex = 0;
    let dots = [];

    if (dotsContainer) {
      dotsContainer.innerHTML = "";

      slides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Ver imagem ${index + 1}`);

        dot.addEventListener("click", () => {
          showSlide(index);
        });

        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === currentIndex);
        slide.setAttribute(
          "aria-hidden",
          String(slideIndex !== currentIndex)
        );
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentIndex;

        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });

      if (counter) {
        const current = String(currentIndex + 1).padStart(2, "0");
        const total = String(slides.length).padStart(2, "0");

        counter.textContent = `${current} / ${total}`;
      }
    }

    if (previousButton) {
      previousButton.addEventListener("click", () => {
        showSlide(currentIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        showSlide(currentIndex + 1);
      });
    }

    showSlide(0);
  });

  console.info("Revista Macedo: JavaScript carregado corretamente.");
});
