<template>
  <footer class="site-footer">
    <div class="inner container">
      <div class="left">
        <div class="social">
          <a class="social-link" href="#" aria-label="Telegram">
            <img class="social-icon" :src="telegramUrl" alt="telegram" />
          </a>
          <a class="social-link" href="#" aria-label="Instagram">
            <img class="social-icon" :src="instagramUrl" alt="instagram" />
          </a>
          <a class="social-link" href="#" aria-label="VK">
            <img class="social-icon" :src="vkUrl" alt="vk" />
          </a>
        </div>
        <img class="logo" :src="logoUrl" alt="Cyber Dogg" />
        <div class="copyright">2026 © Cyber Dogg</div>
      </div>

      <nav class="footer-nav">
        <router-link to="/" class="footer-link">Главная</router-link>
        <router-link to="/menu" class="footer-link">Меню</router-link>
        <router-link to="/price" class="footer-link">Цены</router-link>
      </nav>

      <div class="contacts">
        <div><span class="label">Адрес:</span> Московская улица,<br> 91А, Муром</div>
        <div><span class="label">Телефон:</span><br> +7 (910) 177-52-52</div>
        <div><span class="label">Почта для связи:</span><br> cyber_dogg@gmail.com</div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const logoUrl = '/img/logo.svg';
const telegramUrl = '/icons/telegram.svg';
const instagramUrl = '/icons/instagram.svg';
const vkUrl = '/icons/vk.svg';
</script>

<style scoped>
.site-footer {
  background: var(--c-bg);
  color: var(--c-white);
  padding: var(--spacing-md) 0 var(--spacing-sm);
  margin-top: auto;
  position: relative;
  width: 100%;
}

.site-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-top: 2px solid var(--c-white);
}

.inner {
  display: grid;
  grid-template-columns: minmax(240px, 1.1fr) minmax(220px, 1fr) minmax(260px, 1.2fr);
  grid-template-areas: "left nav contacts";
  align-items: start;
  gap: var(--spacing-md);
}

.left {
  display: grid;
  gap: var(--spacing-sm);
  align-self: end;
  grid-area: left;
}

.social {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.social-link {
  color: var(--c-white);
  display: inline-flex;
  width: 32px;
  height: 32px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.social-link:hover {
  transform: translateY(-2px);
  opacity: 0.8;
}

.social-icon {
  width: 100%;
  height: 100%;
  display: block;
}

.logo {
  width: clamp(150px, 30vw, 220px);
  height: auto;
}

.footer-nav {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1.2px;
  flex-wrap: wrap;
  grid-area: nav;
}

.footer-link {
  font-family: "Bowler";
  text-decoration: none;
  color: var(--c-white);
  padding: var(--spacing-xs);
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--c-accent);
}

.footer-link.router-link-active {
  color: var(--c-accent);
}

.contacts {
  justify-self: center;
  text-align: center;
  display: grid;
  gap: var(--spacing-xs);
  font-family: "Roboto";
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  grid-area: contacts;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.label {
  font-family: "Bowler";
  display: block;
  margin-bottom: 4px;
  color: var(--c-white-50);
  font-size: 0.85em;
}

.copyright {
  color: var(--c-white-50);
  font-family: "Roboto";
  font-size: clamp(0.75rem, 1.2vw, 0.9rem);
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .inner {
    gap: calc(var(--spacing-md) * 1.2);
  }

  .footer-nav {
    gap: var(--spacing-lg);
  }
}

@media (max-width: 900px) {
  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-md);
    padding: 0 var(--spacing-sm);
  }

  .left {
    display: contents;
  }

  .footer-nav {
    order: 1;
  }

  .contacts {
    order: 3;
    text-align: center;
    justify-self: center;
  }

  .social {
    order: 2;
    justify-content: center;
  }

  .logo {
    order: 4;
    max-width: 180px;
    width: 100%;
    height: auto;
  }

  .copyright {
    order: 5;
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .inner {
    padding: 0 var(--spacing-xs);
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    gap: var(--spacing-sm);
  }

  .footer-nav {
    gap: var(--spacing-sm);
    font-size: 0.85rem;
    width: 100%;
    justify-content: center;
  }

  .logo {
    max-width: 150px;
    margin: 0 auto;
  }

  .contacts {
    font-size: 0.85rem;
    width: 100%;
    max-width: 280px;
  }

  .social {
    justify-content: center;
    width: 100%;
  }

  .copyright {
    width: 100%;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .inner {
    padding: 0 var(--spacing-xs);
    gap: var(--spacing-xs);
  }

  .footer-nav {
    gap: var(--spacing-xs);
    font-size: 0.8rem;
    flex-direction: column;
    align-items: center;
  }

  .footer-nav a {
    padding: 4px 0;
  }

  .logo {
    max-width: 130px;
  }

  .contacts {
    font-size: 0.8rem;
    max-width: 250px;
  }

  .social-link {
    width: 28px;
    height: 28px;
  }

  .copyright {
    font-size: 0.78rem;
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .inner {
    gap: 10px;
  }

  .footer-nav {
    gap: 6px;
    font-size: 0.75rem;
  }

  .logo {
    max-width: 110px;
  }

  .contacts {
    font-size: 0.75rem;
    max-width: 220px;
  }

  .social-link {
    width: 24px;
    height: 24px;
  }

  .copyright {
    font-size: 0.72rem;
  }
}
</style>
