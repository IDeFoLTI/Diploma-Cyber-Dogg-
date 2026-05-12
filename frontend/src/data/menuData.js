export const menuCategories = [
  {
    id: 'burgers',
    name: 'Бургеры',
    items: [
      {
        name: 'Классика',
        description: 'Булочка, котлета говяжья, айсберг, томат, красный лук, чеддер',
        weight: '320гр',
        price: '450р',
        popular: true
      },
      {
        name: 'ГАмбургер',
        description: 'Булочка, котлета говяжья, айсберг, классический соус, корнишон',
        weight: '145гр',
        price: '200р'
      },
      {
        name: 'Чизбургер',
        description: 'Булочка, котлета говяжья, кетчуп, горчица, корнишон, чеддер',
        weight: '150гр',
        price: '230р'
      },
      {
        name: 'Дракон',
        description: 'Булочка, котлета говяжья, айсберг, томаты, бекон, сырный соус, шрирача',
        weight: '255гр',
        price: '410р',
        popular: true
      },
      {
        name: 'Мачете',
        description: 'Булочка, котлета говяжья, айсберг, огурец свежий, соленый огурец, лук маринованный, соус макси бургер',
        weight: '265гр',
        price: '390р'
      },
      {
        name: 'Пеперони фьюжн',
        description: 'Булочка, котлета говяжья, айсберг, пеперони, томаты чили, соус медово-горчичный, соус чеддер',
        weight: '275гр',
        price: '430р'
      },
      {
        name: 'Сырный вулкан',
        description: 'Булочка, камамбер, чеддер, томат, моцарелла, сырный соус',
        weight: '220гр',
        price: '360р',
        vegetarian: true
      },
      {
        name: 'Ронни',
        description: 'Булочка, котлета говяжья, бекон, яйцо, коу слоу, соус чизбургер, чеддер',
        weight: '275гр',
        price: '430р'
      },
      {
        name: 'Тетя мили',
        description: 'Булочка, котлета говяжья, фета, томаты, красный лук, рукола, маслины, томатный соус',
        weight: '275гр',
        price: '470р'
      },
      {
        name: 'Мери джейн',
        description: 'Булочка, котлета говяжья, моцарелла, вишневый соус, шпинат, бекон',
        weight: '255гр',
        price: '470р'
      }
    ]
  },
  {
    id: 'snacks',
    name: 'Закуски',
    items: [
      {
        name: 'Комбо №1',
        description: 'Пельмени, луковые кольца, гренки',
        weight: '355гр',
        price: '450р'
      },
      {
        name: 'Комбо №2',
        description: 'Сырные шарики чеддер, наггетсы, картофель фри',
        weight: '285гр',
        price: '490р',
        popular: true
      },
      {
        name: 'Комбо №3',
        description: 'Чипсы, арахис, сухарики',
        weight: '130гр',
        price: '350р'
      },
      {
        name: 'Картофель фри',
        description: '',
        weight: '150гр',
        price: '200р'
      },
      {
        name: 'Картофель по-деревенски',
        description: '',
        weight: '150гр',
        price: '210р'
      },
      {
        name: 'Луковые кольца',
        description: '',
        weight: '6шт',
        price: '170р'
      },
      {
        name: 'Наггетсы',
        description: '',
        weight: '6шт/9шт/12шт',
        price: '200р/260р/320р'
      },
      {
        name: 'Сырные шарики',
        description: '',
        weight: '6шт/9шт/12шт',
        price: '270р/370р/470р'
      },
      {
        name: 'Гренки',
        description: '',
        weight: '150гр',
        price: '150р'
      }
    ]
  },
  {
    id: 'sauces',
    name: 'Соусы',
    items: [
      {
        name: 'В ассортименте',
        description: '',
        weight: '',
        price: '60р'
      }
    ]
  },
  {
    id: 'salads',
    name: 'Салаты',
    items: [
      {
        name: 'Цезарь с курицей',
        description: 'Айсберг, черри, соус цезарь, курица, пармезан, сухари',
        weight: '205гр',
        price: '390р',
        popular: true
      }
    ]
  },
  {
    id: 'pizza',
    name: 'Пицца',
    items: [
      {
        name: 'Гавайская',
        description: 'Тесто, куриное филе, шампиньоны, чесночный соус, моцарелла',
        weight: '400гр',
        price: '650р'
      },
      {
        name: 'Морская',
        description: 'Тесто, морепродукты (креветки, мидии, ракушки, кальмары, осьминоги), лимонный тартар, маслины, моцарелла',
        weight: '360гр',
        price: '650р'
      },
      {
        name: 'Пепперони',
        description: 'Тесто, пепперони, томатный соус, моцарелла',
        weight: '300гр',
        price: '650р',
        popular: true
      }
    ]
  },
  {
    id: 'pasta',
    name: 'Паста',
    items: [
      {
        name: 'Карбонара',
        description: 'Паста, бекон, перец, сливки, пармезан, яичный желток',
        weight: '205гр',
        price: '420р'
      },
      {
        name: 'Паста с курицей и грибами',
        description: 'Паста, курица, белые грибы, сливки, пармезан',
        weight: '245гр',
        price: '420р'
      },
      {
        name: 'Мак энд чиз',
        description: 'Паста, соус сырный, чипос сырный',
        weight: '280гр',
        price: '250р',
        vegetarian: true
      }
    ]
  },
  {
    id: 'hot-dishes',
    name: 'Горячие блюда',
    items: [
      {
        name: 'Кесадилья',
        description: 'Тортилья, яйцо, курица, лук, айсберг, томат, гауда, чесночный соус',
        weight: '295гр',
        price: '330р'
      },
      {
        name: 'Митболы',
        description: 'Фарш говяжий, соус лимонный, тартар',
        weight: '185гр',
        price: '330р'
      },
      {
        name: 'Пельмени жаренные',
        description: '',
        weight: '210гр',
        price: '330р'
      }
    ]
  },
  {
    id: 'sandwiches',
    name: 'Сэндвичи и хот-доги',
    items: [
      {
        name: 'Сэндвич цезарь',
        description: 'Фокачча, курица, айсберг, томат, пармезан, соус цезарь',
        weight: '210гр',
        price: '300р'
      },
      {
        name: 'Сэндвич с окороком',
        description: 'Фокачча, окорок, яйцо, томат, айсберг, макси соус',
        weight: '255гр',
        price: '300р'
      },
      {
        name: 'Хот дог №1',
        description: 'Булка, сосиска, чеддер, кетчуп, горчица',
        weight: '210гр',
        price: '300р'
      },
      {
        name: 'Хот дог барбекю',
        description: 'Булка, сосиска куриная, бекон, чесночный соус, барбекю соус, жареный лук, корнишон, укроп',
        weight: '210гр',
        price: '300р',
        popular: true
      },
      {
        name: 'Хот дог Гриль',
        description: 'Булка, сосиска куриная, гриль соус, огурец свежий, томат, яйцо, укроп, зеленый лук',
        weight: '200гр',
        price: '300р'
      },
      {
        name: 'Хот дог классика',
        description: 'Булка, сосиска куриная, релиш, кетчуп, горчица, лук маринованный, лук жареный, лук зеленый',
        weight: '205гр',
        price: '300р'
      }
    ]
  },
  {
    id: 'drinks',
    name: 'Напитки',
    items: [
      {
        name: 'Кокос-лайм',
        description: '',
        weight: '500мл',
        price: '250р'
      },
      {
        name: 'Клубника-киви',
        description: '',
        weight: '500мл',
        price: '250р'
      },
      {
        name: 'Малина-лайм',
        description: '',
        weight: '500мл',
        price: '250р'
      },
      {
        name: 'Мохито',
        description: '',
        weight: '500мл',
        price: '250р'
      },
      {
        name: 'Сок',
        description: 'В ассортименте',
        weight: '200мл',
        price: '100р'
      }
    ]
  },
  {
    id: 'tea',
    name: 'Чай авторский',
    items: [
      {
        name: 'Малина-мята',
        description: '',
        weight: '',
        price: '370р'
      },
      {
        name: 'Киви-лайм',
        description: '',
        weight: '',
        price: '370р'
      },
      {
        name: 'Облепиха-имбирь',
        description: '',
        weight: '',
        price: '370р'
      },
      {
        name: 'Вишня-корица',
        description: '',
        weight: '',
        price: '370р'
      }
    ]
  },
  {
    id: 'classic-tea',
    name: 'Чай классический',
    items: [
      {
        name: 'Ассам',
        description: '',
        weight: '',
        price: '250р'
      },
      {
        name: 'С чабрецом',
        description: '',
        weight: '',
        price: '250р'
      },
      {
        name: 'Каркаде',
        description: '',
        weight: '',
        price: '250р'
      },
      {
        name: 'Сенча',
        description: '',
        weight: '',
        price: '250р'
      },
      {
        name: 'Эрл Грей',
        description: '',
        weight: '',
        price: '250р'
      },
      {
        name: 'Лимон',
        description: '',
        weight: '',
        price: '250р'
      }
    ]
  },
  {
    id: 'coffee',
    name: 'Кофе',
    items: [
      {
        name: 'Американо',
        description: '',
        weight: '',
        price: '140р'
      },
      {
        name: 'Эспрессо',
        description: '',
        weight: '',
        price: '120р'
      },
      {
        name: 'Капучино',
        description: '',
        weight: '',
        price: '180р'
      },
      {
        name: 'Латте',
        description: '',
        weight: '',
        price: '190р'
      },
      {
        name: 'Айс кофе',
        description: '',
        weight: '',
        price: '250р'
      },
      {
        name: 'Сироп',
        description: 'В ассортименте',
        weight: '',
        price: '40р'
      }
    ]
  }
]
