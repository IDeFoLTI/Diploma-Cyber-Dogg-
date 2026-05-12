export const products = [
  {
    id: 1,
    name: 'Игровые перчатки Pro',
    description: 'Профессиональные перчатки для точного контроля. Дышащий материал с усиленным сцеплением на пальцах для максимальной производительности.',
    price: 990,
    category: 'gloves',
    categoryName: 'Перчатки',
    image: '/img/gloves.png',
    features: [
      'Дышащий материал',
      'Усиленное сцепление',
      'Анатомический дизайн',
      'Универсальный размер'
    ]
  },
  {
    id: 2,
    name: 'Мышь Logitech G Pro',
    description: 'Высокоточный сенсор HERO 25K DPI, вес всего 80г. Идеальный выбор для профессионального киберспорта и длительных игровых сессий.',
    price: 12490,
    category: 'mice',
    categoryName: 'Мышки',
    image: '/img/mouse-logitech.png',
    features: [
      'Сенсор HERO 25K',
      'Вес 80г',
      'Беспроводная связь LIGHTSPEED',
      '6 программируемых кнопок'
    ]
  },
  {
    id: 3,
    name: 'Мышь Razer DeathAdder',
    description: 'Легендарная эргономичная мышь для правой руки. Сенсор Focus+ 20K DPI и фирменная подсветка Chroma RGB.',
    price: 8990,
    category: 'mice',
    categoryName: 'Мышки',
    image: '/img/mouse-razer.png',
    features: [
      'Сенсор Focus+ 20K DPI',
      'Эргономичный дизайн',
      '8 программируемых кнопок',
      'Подсветка Chroma RGB'
    ]
  },
  {
    id: 4,
    name: 'Коврик SteelSeries QcK',
    description: 'Классический игровой коврик размером 450x400мм. Оптимальное скольжение для всех типов сенсов и стилей игры.',
    price: 1990,
    category: 'mats',
    categoryName: 'Коврики',
    image: '/img/mat-steelseries.png',
    features: [
      'Размер: 450x400x2мм',
      'Тканевая поверхность',
      'Резиновое основание',
      'Водоотталкивающая пропитка'
    ]
  },
  {
    id: 5,
    name: 'Коврик HyperX Fury S XL',
    description: 'Крупный игровой коврик XL размера 900x400мм. Мягкая тканевая поверхность для максимального комфорта.',
    price: 2490,
    category: 'mats',
    categoryName: 'Коврики',
    image: '/img/mat-hyperx.png',
    features: [
      'Размер: 900x400x4мм',
      'Мягкая тканевая поверхность',
      'Противоскользящее основание',
      'Окантовка по краям'
    ]
  },
  {
    id: 6,
    name: 'Наушники HyperX Cloud II',
    description: 'Игровая гарнитура с объёмным звуком 7.1. Невероятный комфорт на долгих игровых сессиях благодаря памяти с эффектом формы.',
    price: 11990,
    category: 'headphones',
    categoryName: 'Наушники',
    image: '/img/headphones-hyperx.png',
    features: [
      'Объёмный звук 7.1',
      'Память с эффектом формы',
      'Отсоединяемый микрофон',
      'Вес 320г'
    ]
  },
  {
    id: 7,
    name: 'Наушники Razer BlackShark V2',
    description: 'Продвинутая игровая гарнитура с THX 7.1 Spatial Audio. Лёгкая конструкция всего 260г и превосходная звуковая изоляция.',
    price: 13490,
    category: 'headphones',
    categoryName: 'Наушники',
    image: '/img/headphones-razer.png',
    features: [
      'THX 7.1 Spatial Audio',
      'Драйверы 50мм Tritanium',
      'Микрофон с шумоподавлением',
      'Вес 260г'
    ]
  },
  {
    id: 8,
    name: 'Перчатки Corsair Gaming GL80',
    description: 'Премиальные игровые перчатки с дышащим материалом и силиконовыми вставками. Максимальный комфорт и контроль.',
    price: 1490,
    category: 'gloves',
    categoryName: 'Перчатки',
    image: '/img/gloves-corsair.png',
    features: [
      'Дышащий материал',
      'Силиконовые вставки',
      'Вентилируемая ладонь',
      'Логотип Corsair RGB'
    ]
  }
];

export const categories = [
  { value: 'all', label: 'Все категории' },
  { value: 'gloves', label: 'Перчатки' },
  { value: 'mice', label: 'Мышки' },
  { value: 'mats', label: 'Коврики' },
  { value: 'headphones', label: 'Наушники' }
];
