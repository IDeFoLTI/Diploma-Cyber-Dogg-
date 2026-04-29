<template>
  <section id="promotions" class="sale-section">
    <div class="sale-container">
      <h2 class="sale-title">Акции</h2>

      <div class="sale-blocks">
        <!-- Первый блок - 20% -->
        <div class="sale-block">
          <div class="sale-top-row">
            <div class="sale-percent-column">
              <div class="sale-percent">20%</div>
              <p class="sale-conditions-small">*подробности уточняйте у администратора</p>
            </div>
            <p class="sale-title-text">скидка в день рождения на все пакеты</p>
          </div>
        </div>

        <!-- Второй блок - 10% -->
        <div class="sale-block">
          <div class="sale-top-row">
            <div class="sale-percent-column">
              <div class="sale-percent">10%</div>
              <p class="sale-conditions-small">*при предъявлении действующего студенческого билета</p>
            </div>
            <p class="sale-title-text">скидка студентам</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sale-section {
  padding: var(--spacing-xl) 0;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow-x: hidden;
}

.sale-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--spacing-md);
}

.sale-title {
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

.sale-title::after {
  content: "";
  display: block;
  width: clamp(60px, 10vw, 100px);
  height: 3px;
  background: var(--c-accent);
  margin: 20px auto 0;
  border-radius: 2px;
}

.sale-blocks {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
  width: 100%;
  margin: 0 auto;
}

/* Адаптивность для экранов 400-600px */
@media (min-width: 400px) and (max-width: 600px) {
  .sale-blocks {
    flex-direction: column;
    align-items: center;
  }

  .sale-block {
    min-width: 100%;
    max-width: 100%;
  }
}

.sale-block {
  width: 100%;
  min-width: 280px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: var(--spacing-lg);
}

.sale-top-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.sale-percent-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sale-percent {
  font-family: "Bowler", sans-serif;
  font-size: clamp(80px, 15vw, 115px);
  font-weight: 400;
  color: var(--c-accent);
  line-height: 1;
  margin: 0;
}

.sale-conditions-small {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-white-50);
  line-height: 1.4;
  margin: 0;
  text-align: left;
  padding-top: 5px;
}

.sale-title-text {
  font-family: "Bowler", sans-serif;
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 400;
  color: var(--c-white);
  line-height: 1.2;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  padding-top: 10px;
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .sale-section {
    padding: calc(var(--spacing-xl) * 1.2) 0;
  }

  .sale-title {
    font-size: clamp(36px, 5vw, 52px);
  }
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .sale-section {
    padding: var(--spacing-lg) 0;
  }

  .sale-title {
    font-size: clamp(28px, 4vw, 34px);
    margin-bottom: var(--spacing-lg);
  }

  .sale-blocks {
    gap: var(--spacing-lg);
  }

  .sale-block {
    min-width: 240px;
    padding: var(--spacing-md);
  }

  .sale-percent {
    font-size: clamp(60px, 12vw, 90px);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .sale-section {
    padding: var(--spacing-md) 0;
  }

  .sale-title {
    font-size: clamp(22px, 5vw, 26px);
    margin-bottom: var(--spacing-md);
  }

  .sale-blocks {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  .sale-block {
    width: 100%;
    max-width: 100%;
    min-width: auto;
    padding: var(--spacing-md);
  }

  .sale-percent {
    font-size: clamp(50px, 15vw, 70px);
  }

  .sale-conditions {
    font-size: var(--font-xs);
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 360px) {
  .sale-section {
    padding: var(--spacing-sm) 0;
  }

  .sale-container {
    padding: 0 var(--spacing-sm);
  }

  .sale-title {
    font-size: clamp(20px, 5vw, 22px);
    margin-bottom: var(--spacing-sm);
  }

  .sale-title::after {
    margin: 15px auto 0;
  }

  .sale-blocks {
    gap: var(--spacing-sm);
  }

  .sale-block {
    padding: var(--spacing-sm);
  }

  .sale-percent {
    font-size: clamp(35px, 12vw, 45px);
  }

  .sale-conditions-small {
    font-size: 11px;
    padding-top: 3px;
  }

  .sale-title-text {
    font-size: clamp(14px, 3.5vw, 18px);
    padding-top: 8px;
  }

  .sale-top-row {
    gap: var(--spacing-sm);
  }
}
</style>
