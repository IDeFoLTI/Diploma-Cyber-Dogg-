<template>
  <div class="gift-content">
    <!-- Левая колонка с картинкой -->
    <div :class="['left-column', { 'order-first': !cert.isReversed, 'order-last': cert.isReversed }]">
      <div class="page-header">
        <h2 class="page-subtitle">{{ cert.title }}</h2>
      </div>
      
      <!-- Картинка -->
      <div class="certificate-image-wrapper">
        <img :src="cert.image" alt="Подарочный сертификат" class="certificate-image" />
      </div>
    </div>

    <!-- Правая часть: Переключатели -->
    <div :class="['certificate-options', { 'order-first': cert.isReversed, 'order-last': !cert.isReversed }]">
      <CertificateOptions 
        v-if="cert.type === 'standard'"
        v-model:time="selectedTime"
        v-model:hours="selectedHours"
        v-model:package="selectedPackage"
        :unique-id="cert.id"
        @submit="handleStandardSubmit"
      />
      <PlaystationOptions 
        v-else
        v-model:players="selectedPlayers"
        v-model:hours="selectedHours"
        :unique-id="cert.id"
        @submit="handlePlaystationSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CertificateOptions from './CertificateOptions.vue';
import PlaystationOptions from './PlaystationOptions.vue';

const props = defineProps({
  cert: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit']);

const selectedTime = ref(null);
const selectedHours = ref(null);
const selectedPackage = ref(null);
const selectedPlayers = ref(null);

const handleStandardSubmit = (data) => {
  emit('submit', {
    certId: props.cert.id,
    certTitle: props.cert.title,
    type: 'standard',
    ...data
  });
};

const handlePlaystationSubmit = (data) => {
  emit('submit', {
    certId: props.cert.id,
    certTitle: props.cert.title,
    type: 'playstation',
    ...data
  });
};
</script>

<style scoped>
.gift-content {
  display: flex;
  gap: var(--spacing-xl);
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;
}

.left-column {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.left-column.order-first {
  order: -1;
}

.left-column.order-last {
  order: 1;
}

.certificate-options {
  flex: 1;
  min-width: 350px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.certificate-options.order-first {
  order: -1;
}

.certificate-options.order-last {
  order: 1;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.page-subtitle {
  font-family: "Kingslay", sans-serif;
  font-size: clamp(26px, 2.5vw, 30px);
  font-weight: 400;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  text-align: left;
}

.certificate-image-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.certificate-image {
  max-width: 100%;
  height: auto;
  width: 100%;
}

.certificate-options {
  flex: 1;
  min-width: 350px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Адаптивность */
@media (max-width: 900px) {
  .gift-content {
    flex-direction: column;
    align-items: center;
  }

  .left-column,
  .left-column.order-first,
  .left-column.order-last {
    order: 1;
  }

  .certificate-options,
  .certificate-options.order-first,
  .certificate-options.order-last {
    order: 2;
  }

  .certificate-image-wrapper {
    max-width: 100%;
  }

  .certificate-options {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 600px) {
  .radio-row {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .radio-item {
    width: 100%;
  }
}
</style>