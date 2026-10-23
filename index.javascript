
document.addEventListener("DOMContentLoaded", () => {
  const pages = [...document.querySelectorAll(".page-view")];
  const navButtons = [...document.querySelectorAll("[data-open-page]")];
  const homeButtons = [...document.querySelectorAll("[data-go-home]")];
  const nav = document.querySelector(".main-nav");
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const topButton = document.getElementById("topButton");

  function openPage(pageName) {
    const target = document.getElementById(`${pageName}-view`);

    if (!target) return;

    pages.forEach(page => {
      page.classList.toggle("active", page === target);
    });

    navButtons.forEach(button => {
      const selected = button.dataset.openPage === pageName;

      button.classList.toggle("is-active", selected);

      if (selected) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    if (nav) {
      nav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Navegação principal.
  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      openPage(button.dataset.openPage);
    });
  });

  // Botões que retornam à página inicial.
  homeButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      openPage("home");
    });
  });

  // Menu para celulares.
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });
  }

  // Inicializa cada carrossel de forma independente.
  function initializeCarousel(card) {
    const images = [
      ...card.querySelectorAll(".carousel-image")
    ];

    const previous = card.querySelector(".carousel-prev");
    const next = card.querySelector(".carousel-next");
    const indicator = card.querySelector(
      ".instagram-dots-indicator"
    );

    if (!images.length) return;

    let current = images.findIndex(image =>
      image.classList.contains("active")
    );

    if (current < 0) current = 0;

    // Cria os pequenos indicadores de imagem.
    if (indicator) {
      indicator.replaceChildren();

      images.forEach((image, index) => {
        const dot = document.createElement("button");

        dot.type = "button";

        dot.setAttribute(
          "aria-label",
          `Mostrar imagem ${index + 1} de ${images.length}`
        );

        dot.addEventListener("click", () => {
          showImage(index);
        });

        indicator.appendChild(dot);
      });
    }

    function showImage(index) {
      current = (index + images.length) % images.length;

      images.forEach((image, imageIndex) => {
        const selected = imageIndex === current;

        image.classList.toggle("active", selected);

        image.setAttribute(
          "aria-hidden",
          String(!selected)
        );
      });

      if (indicator) {
        [...indicator.children].forEach((dot, dotIndex) => {
          const selected = dotIndex === current;

          dot.classList.toggle("active", selected);

          dot.setAttribute(
            "aria-pressed",
            String(selected)
          );
        });
      }

      if (previous) {
        previous.disabled = images.length < 2;
      }

      if (next) {
        next.disabled = images.length < 2;
      }
    }

    if (previous) {
      previous.addEventListener("click", () => {
        showImage(current - 1);
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        showImage(current + 1);
      });
    }

    // Permite trocar imagens com as setas do teclado.
    const carousel = card.querySelector(".instagram-carousel");

    if (carousel) {
      carousel.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") {
          showImage(current - 1);
        }

        if (event.key === "ArrowRight") {
          showImage(current + 1);
        }
      });
    }

    showImage(current);
  }

  document.querySelectorAll(".instagram-card").forEach(card => {
    initializeCarousel(card);
  });

  // Botão de voltar ao topo.
  function updateTopButton() {
    if (!topButton) return;

    topButton.classList.toggle(
      "visible",
      window.scrollY > 350
    );
  }

  window.addEventListener("scroll", updateTopButton, {
    passive: true
  });

  updateTopButton();

  if (topButton) {
    topButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Abre a página inicial ao carregar.
  openPage("home");
});

