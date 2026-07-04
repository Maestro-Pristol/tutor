/* =========================================================
   ЛЕНДИНГ-ПОРТФОЛИО РЕПЕТИТОРА — СКРИПТЫ
   1. Мобильное меню
   2. Плавное появление блоков при прокрутке
   3. Слайдер отзывов
   4. FAQ-аккордеон
   5. Переключатель мессенджера в форме
   6. Отправка заявки + уведомление
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. МОБИЛЬНОЕ МЕНЮ ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("site-nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    // Закрываем меню при клике на любую ссылку навигации
    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 2. ПОЯВЛЕНИЕ БЛОКОВ ПРИ ПРОКРУТКЕ ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Фолбэк для очень старых браузеров без IntersectionObserver
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- 3. СЛАЙДЕР ОТЗЫВОВ ---------- */
  const track = document.getElementById("slider-track");
  const dotsWrap = document.getElementById("slider-dots");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");

  if (track && dotsWrap && prevBtn && nextBtn) {
    const slides = Array.from(track.children);
    let current = 0;
    let autoplayTimer = null;

    // Создаём точки-индикаторы
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Перейти к отзыву ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      render();
      restartAutoplay();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(next, 6000);
    }

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    // Пауза автопрокрутки при наведении/фокусе, чтобы не мешать чтению
    const sliderRoot = document.getElementById("reviews-slider");
    sliderRoot.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
    sliderRoot.addEventListener("mouseleave", restartAutoplay);
    sliderRoot.addEventListener("focusin", () => clearInterval(autoplayTimer));
    sliderRoot.addEventListener("focusout", restartAutoplay);

    // Свайп с касанием на мобильных
    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 50) prev();
      else if (diff < -50) next();
    }, { passive: true });

    render();
    restartAutoplay();
  }

  /* ---------- 4. FAQ-АККОРДЕОН ---------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Закрываем предыдущий открытый вопрос
      faqItems.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      // Открываем текущий, если он был закрыт
      if (!isOpen) {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- 5. ПЕРЕКЛЮЧАТЕЛЬ МЕССЕНДЖЕРА ---------- */
  const messengerToggle = document.getElementById("messenger-toggle");
  const messengerValue = document.getElementById("messenger-value");

  if (messengerToggle && messengerValue) {
    const options = messengerToggle.querySelectorAll(".messenger-option");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        options.forEach((o) => o.classList.remove("is-active"));
        option.classList.add("is-active");
        messengerValue.value = option.dataset.value;
      });
    });
  }

  /* ---------- 6. ФОРМА ЗАЯВКИ + УВЕДОМЛЕНИЕ ---------- */
  const form = document.getElementById("request-form");
  const toast = document.getElementById("toast");
  let toastTimer = null;

  if (form && toast) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Здесь в будущем можно подключить реальную отправку данных
      // (например, на почтовый сервис или в Telegram-бота).
      // Сейчас форма работает как визуальная демонстрация.

      toast.classList.add("is-visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 4500);

      form.reset();
      // Возвращаем визуальный активный пункт мессенджера к значению по умолчанию
      const options = messengerToggle ? messengerToggle.querySelectorAll(".messenger-option") : [];
      options.forEach((o) => o.classList.toggle("is-active", o.dataset.value === "telegram"));
      if (messengerValue) messengerValue.value = "telegram";
    });
  }

});
