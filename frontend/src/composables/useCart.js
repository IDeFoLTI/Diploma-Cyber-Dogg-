import { ref, computed, watch } from 'vue';

const CART_KEY = 'cyberdogg_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

const items = ref(loadCart());

watch(items, (val) => saveCart(val), { deep: true });

export function useCart() {
  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + (item.quantity || 1), 0)
  );

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
  );

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function addProduct(product) {
    const existing = items.value.find(
      (i) => i.type === 'product' && i.productId === product.id
    );
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      items.value.push({
        id: generateId(),
        type: 'product',
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '',
        quantity: 1,
      });
    }
  }

  function addCertificate(data) {
    const price = computeCertificatePrice(data);
    items.value.push({
      id: generateId(),
      type: 'certificate',
      certId: data.certId,
      certTitle: data.certTitle,
      hall: data.certTitle,
      timeType: data.time || data.timeType || null,
      hours: data.hours || null,
      package: data.package || null,
      players: data.players || null,
      price,
      quantity: 1,
    });
  }

  function computeCertificatePrice(data) {
    const playstationPrices = {
      '7players': { '3hours': 1500, '5hours': 2500 },
      '5players': { '3hours': 1200, '5hours': 2000 },
    };

    if (data.type === 'playstation' && data.players && data.hours) {
      return playstationPrices[data.players]?.[data.hours] || 0;
    }

    if (data.package) {
      if (data.package === 'cyberday') return 1200;
      if (data.package === 'night') return 600;
    }

    const prices = {
      day: { '3hours': 350, '5hours': 550 },
      evening: { '3hours': 450, '5hours': 700 },
    };

    if (data.time && data.hours) {
      return prices[data.time]?.[data.hours] || 0;
    }
    if (data.timeType && data.hours) {
      return prices[data.timeType]?.[data.hours] || 0;
    }

    return 0;
  }

  function removeItem(id) {
    items.value = items.value.filter((i) => i.id !== id);
  }

  function updateQuantity(id, quantity) {
    const item = items.value.find((i) => i.id === id);
    if (!item) return;
    if (quantity <= 0) {
      removeItem(id);
    } else {
      item.quantity = quantity;
    }
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    totalCount,
    totalPrice,
    addProduct,
    addCertificate,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
