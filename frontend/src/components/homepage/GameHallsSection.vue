<template>
  <section class="game-halls">
    <div class="container">
      <h2 class="game-halls__title">Игровые залы</h2>
      <div class="game-halls__list">
        <GameRoomCard
          v-for="(room, index) in rooms"
          :key="index"
          :name="room.name"
          :image="room.image"
          :features="room.features"
          :min-price="room.minPrice"
          :reverse="index === 1 || index === 3"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import GameRoomCard from "./GameRoomCard.vue";

const rooms = [
  {
    name: "Common room",
    image: "/img/commonRoom.png",
    features: [
      "Процессор: Intel core i5 12400f",
      "Оперативная память: G.skill AEGIS 16gb ddr4",
      "Видеокарта: Nvidia RTX 4060 8gb",
      "Мышь проводная: Logitech g102 Lightsync",
      "Гарнитура: Hyperx Cloud II",
      "Клавиатура: a4tech BLOODY S87",
      "Монитор: 27” ACER LCD 180Hz",
      "Кресло игровое: ZONE 51 ARENA PRO",
    ],
    minPrice: 80,
  },
  {
    name: "Arena",
    image: "/img/arena.png",
    features: [
      "Процессор: Intel core i5 12400f",
      "Оперативная память: G.skill AEGIS 16gb ddr4",
      "Видеокарта: Nvidia RTX 4060 8gb",
      "Мышь проводная: Logitech g102 Lightsync",
      "Гарнитура: Hyperx Cloud II",
      "Клавиатура: a4tech BLOODY S98",
      "Монитор: 27” ACER LCD 240Hz",
      "Кресло игровое: ZONE 51 Cyberpunk Royal",
    ],
    minPrice: 110,
  },
  {
    name: "VIP",
    image: "/img/vip.png",
    features: [
      "Процессор: Intel core i5 12400f",
      "Оперативная память: G.skill AEGIS 16gb ddr4",
      "Видеокарта: Nvidia RTX 4060 8gb",
      "Мышь проводная Logitech g403 Hero Lightsync",
      "Гарнитура Hyperx Cloud Alpha S",
      "Клавиатура a4tech BLOODY S98",
      "Монитор 27” ACER NITRO 280Hz",
      "Кресло игровое ZONE 51 Cyberpunk Royal",
    ],
    minPrice: 140,
  },
  {
    name: "Playstation 5",
    image: "/img/playstation.png",
    features: [
      "Приставка Playstation 5",
      "Геймпад Dualsense Edge",
      "Телевизор Samsung 4k OLED 120Hz",
    ],
    minPrice: 200,
  }
];
</script>

<style scoped>
.game-halls {
  padding: var(--spacing-xl) 0;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-x: hidden;
}

.container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-halls__title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  margin: 0 0 var(--spacing-xl) 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  line-height: 1.2;
}

.game-halls__title::after {
  content: "";
  display: block;
  width: clamp(60px, 10vw, 100px);
  height: 3px;
  background: var(--c-accent);
  margin: 20px auto 0;
  border-radius: 2px;
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .game-halls {
    padding: calc(var(--spacing-xl) * 1.2) 0;
  }

  .game-halls__title {
    font-size: clamp(36px, 5vw, 52px);
  }

  .game-halls__title::after {
    width: 100px;
  }
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .game-halls {
    padding: var(--spacing-lg) 0;
  }

  .game-halls__title {
    font-size: clamp(28px, 4vw, 34px);
    margin-bottom: var(--spacing-md);
  }

  .game-halls__title::after {
    width: 80px;
    margin: 18px auto 0;
  }

  .game-halls__list {
    gap: var(--spacing-md);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .game-halls {
    padding: var(--spacing-md) 0;
  }

  .game-halls__title {
    font-size: clamp(22px, 5vw, 26px);
    margin-bottom: var(--spacing-sm);
    letter-spacing: 0.08em;
  }

  .game-halls__title::after {
    width: 60px;
    height: 2px;
    margin: 15px auto 0;
  }

  .game-halls__list {
    gap: var(--spacing-sm);
  }

  .container {
    max-width: 100%;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .game-halls {
    padding: var(--spacing-sm) 0;
  }

  .game-halls__title {
    font-size: clamp(20px, 4.5vw, 22px);
    margin-bottom: var(--spacing-xs);
  }

  .game-halls__title::after {
    width: 50px;
    height: 2px;
    margin: 12px auto 0;
  }

  .game-halls__list {
    gap: var(--spacing-xs);
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .game-halls {
    padding: var(--spacing-xs) 0;
  }

  .game-halls__title {
    font-size: clamp(18px, 4vw, 20px);
    letter-spacing: 0.06em;
  }

  .game-halls__title::after {
    width: 40px;
    height: 2px;
    margin: 10px auto 0;
  }
}
</style>
