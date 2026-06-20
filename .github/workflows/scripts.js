(function () {
  const addressDialog = document.getElementById("address-dialog");
  const addressTrigger = document.querySelector("[data-address-trigger]");
  const addressClose = document.querySelector("[data-address-close]");

  if (addressTrigger && addressDialog) {
    addressTrigger.addEventListener("click", () => {
      if (typeof addressDialog.showModal === "function") {
        addressDialog.showModal();
      } else {
        window.alert("21073 Hamburg, Germany");
      }
    });
  }

  if (addressClose && addressDialog) {
    addressClose.addEventListener("click", () => {
      addressDialog.close();
    });
  }

  if (addressDialog) {
    addressDialog.addEventListener("click", (event) => {
      if (event.target === addressDialog) {
        addressDialog.close();
      }
    });
  }

  const slideshow = document.getElementById("slideshow");
  if (!slideshow) {
    return;
  }

  const slides = Array.from(slideshow.querySelectorAll(".slide"));
  const prevButton = slideshow.querySelector(".slide-btn.prev");
  const nextButton = slideshow.querySelector(".slide-btn.next");
  const dotsContainer = slideshow.querySelector("#slide-dots");

  if (!slides.length) {
    return;
  }

  let activeIndex = 0;
  let autoplayTimer = null;

  function setActiveSlide(nextIndex) {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    if (dotsContainer) {
      const dots = Array.from(dotsContainer.querySelectorAll(".slide-dot"));
      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }
  }

  function showNextSlide() {
    setActiveSlide(activeIndex + 1);
  }

  function showPreviousSlide() {
    setActiveSlide(activeIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = window.setInterval(showNextSlide, 6000);
  }

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = "";

    slides.forEach((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slide-dot";
      button.setAttribute("aria-label", "Go to slide " + (index + 1));
      button.addEventListener("click", () => {
        setActiveSlide(index);
        startAutoplay();
      });
      dotsContainer.appendChild(button);
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      showPreviousSlide();
      startAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showNextSlide();
      startAutoplay();
    });
  }

  slideshow.addEventListener("mouseenter", stopAutoplay);
  slideshow.addEventListener("mouseleave", startAutoplay);
  slideshow.addEventListener("focusin", stopAutoplay);
  slideshow.addEventListener("focusout", startAutoplay);

  setActiveSlide(0);
  startAutoplay();
})();
