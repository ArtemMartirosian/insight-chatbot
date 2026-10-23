const yesNo = ['Да', 'Нет'];
const back = 'Назад';

export const defaultConfig = {
  brand: 'ИнСайт',
  assistantName: 'Ирина',
  privacyTitle: 'Перед началом',
  privacyText: 'Мы не передаём ваши данные третьим лицам. Вся информация используется только для подготовки предложения по вашему запросу.',
  privacyLink: 'Политика конфиденциальности',
  welcome: 'Здравствуйте! Чем можем помочь?',
  contactIntro: 'Если у вас остались вопросы — пишите или звоните. Мы на связи и с радостью поможем.',
  contacts: {
    telegram: '@11111',
    phone: '+7 999 999-99-99',
    email: 'site-it@mail.ru'
  },
  menu: [
    { key: 'newSite', label: 'Заказать новый сайт', icon: '✦' },
    { key: 'improve', label: 'Доработать текущий сайт', icon: '↗' },
    { key: 'promotion', label: 'Продвижение сайта', icon: '◎' },
    { key: 'portfolio', label: 'Примеры наших работ', icon: '▦' },
    { key: 'contact', label: 'Связаться с нами', icon: '✉' }
  ],
  commonFinal: [
    { id: 'name', type: 'text', question: 'Как к вам обращаться?', placeholder: 'Ваше имя', required: true },
    { id: 'phone', type: 'tel', question: 'Номер телефона для связи', description: 'Мы не будем названивать — только по делу.', placeholder: '+7 999 000-00-00', required: true },
    { id: 'messengers', type: 'multi', question: 'Удобный способ связи', options: ['WhatsApp', 'Telegram', 'Звонки'], required: true },
    { id: 'contactTime', type: 'single', question: 'Когда вам удобно связаться?', options: ['Утро (09:00–12:00)', 'День (12:00–17:00)', 'Вечер (после 17:00)', 'Без разницы — пишите в любое время'], required: true }
  ],
  flows: {
    newSite: {
      title: 'Новый сайт',
      intro: 'Отлично. Задам несколько вопросов и подготовлю понятный бриф для специалиста.',
      steps: [
        { id: 'content', type: 'single', question: 'Что вы хотите разместить на сайте?', options: ['Товары', 'Услуги', 'Товары и услуги', 'Иное'], required: true },
        { id: 'otherContent', type: 'text', question: 'Напишите, что хотите разместить', placeholder: 'Опишите задачу', when: { field: 'content', includes: 'Иное' }, required: true },
        { id: 'priority', type: 'single', question: 'Что будет приоритетом?', options: ['Каталог товаров', 'Каталог услуг', 'Примерно поровну', 'Не знаю — нужна помощь'], when: { field: 'content', includes: 'Товары и услуги' }, required: true },
        { id: 'industry', type: 'single', question: 'В какой сфере вы работаете?', options: ['Строительство / благоустройство', 'Ремонтные работы', 'Производство / промышленность', 'Автомобили', 'Специалисты / услуги', 'Еда / доставка / кулинария', 'Спорт / отдых / тренеры', 'Иное'], when: { field: 'content', oneOf: ['Услуги', 'Товары и услуги'] }, required: true },
        { id: 'siteStructure', type: 'single', question: 'Какую структуру сайта вы рассматриваете?', options: ['Одностраничный сайт', 'Многостраничный сайт', 'Зависит от бюджета', 'Нужна консультация'], when: { field: 'content', includes: 'Услуги' }, required: true },
        { id: 'materials', type: 'multi', question: 'Какое наполнение уже есть?', options: ['Есть все тексты и материалы', 'Есть частично, нужна помощь', 'Нужны уникальные тексты', 'Требуется подбор изображений', 'Нужно обсуждение'], when: { field: 'content', oneOf: ['Услуги', 'Товары и услуги'] }, required: true },
        { id: 'payment', type: 'single', question: 'Нужно ли подключать оплату на сайте?', description: 'Доступно для ИП и юридических лиц.', options: yesNo, when: { field: 'content', oneOf: ['Товары', 'Услуги', 'Товары и услуги'] }, required: true },
        { id: 'delivery', type: 'single', question: 'Нужен ли расчёт стоимости доставки?', description: 'СДЭК, ПЭК, BoxBerry, Почта России и другие.', options: yesNo, when: { field: 'content', oneOf: ['Товары', 'Товары и услуги'] }, required: true },
        { id: 'stock', type: 'single', question: 'Нужна интеграция с учётом остатков?', description: '1С, МойСклад и другие системы.', options: yesNo, when: { field: 'content', oneOf: ['Товары', 'Товары и услуги'] }, required: true },
        { id: 'integrations', type: 'single', question: 'Нужна интеграция с другими сервисами?', description: 'CRM, онлайн-чаты, формы и уведомления.', options: yesNo, required: true },
        { id: 'features', type: 'multi', question: 'Какой функционал нужен?', description: 'Можно выбрать несколько вариантов.', options: ['Подписка на рассылку', 'Купоны/промокоды', 'Личный кабинет', 'Купить в 1 клик', 'Поиск', 'Квиз', 'Онлайн-консультант', 'Калькулятор', 'Выбор города/языка', 'Другое'], required: true },
        { id: 'featuresOther', type: 'text', question: 'Какой ещё функционал нужен?', placeholder: 'Опишите функцию', when: { field: 'features', includes: 'Другое' }, required: true },
        { id: 'variations', type: 'multi', question: 'У товаров будут вариации?', options: ['Нет', 'Цвет', 'Размер', 'Вес', 'Объём', 'Материал', 'Иное'], when: { field: 'content', oneOf: ['Товары', 'Товары и услуги'] }, required: true },
        { id: 'variationsOther', type: 'text', question: 'Какие ещё нужны вариации?', placeholder: 'Укажите варианты', when: { field: 'variations', includes: 'Иное' }, required: true },
        { id: 'productCount', type: 'single', question: 'Сколько товаров планируется?', options: ['До 100', '100–1 000', '1 000–10 000', 'Более 10 000'], when: { field: 'content', oneOf: ['Товары', 'Товары и услуги'] }, required: true },
        { id: 'productData', type: 'single', question: 'Как передадите информацию о товарах?', options: ['Заполню Excel', 'Уже есть файл', 'Нужно парсить', 'Пока не знаю'], when: { field: 'content', oneOf: ['Товары', 'Товары и услуги'] }, required: true },
        { id: 'sections', type: 'multi', question: 'Какие разделы сайта понадобятся?', options: ['О компании / Обо мне', 'Контакты', 'Прайс / цены', 'Акции', 'Доставка и оплата', 'FAQ', 'Услуги', 'Товары', 'Сертификаты', 'Бренды / марки', 'Вакансии', 'Преимущества', 'Отзывы', 'Партнёры', 'Новости / статьи', 'Наши проекты', 'Фотогалерея', 'Политика конфиденциальности', 'Пользовательское соглашение', 'Договор-оферта'], required: true },
        { id: 'design', type: 'single', question: 'Пожелания по стилю и дизайну?', options: ['Полный индивидуальный дизайн + логотип', 'Только логотип, остальное предложите вы', 'Есть логотип, нужен дизайн под него', 'Современно и красиво', 'Шаблон подойдёт, бюджет ограничен', 'Нужна консультация'], required: true },
        { id: 'separateFlows', type: 'single', question: 'Нужны разные потоки «купить» и «заказать услугу»?', options: ['Две разные страницы', 'Всё в одной системе', 'Не уверен'], when: { field: 'content', includes: 'Товары и услуги' }, required: true },
        { id: 'reference', type: 'single', question: 'Есть пример сайта, который вам нравится?', options: ['Да, есть', 'Нет, нужна помощь с примерами', 'Есть подробное ТЗ', 'Иное'], required: true },
        { id: 'referenceDetails', type: 'textarea', question: 'Пришлите ссылку или опишите пример', placeholder: 'Ссылка и комментарий', when: { field: 'reference', oneOf: ['Да, есть', 'Иное'] }, required: true },
        { id: 'specFile', type: 'file', question: 'Загрузите файл с техническим заданием', when: { field: 'reference', includes: 'Есть подробное ТЗ' }, required: true }
      ]
    },
    promotion: {
      title: 'Продвижение сайта',
      intro: 'Настроим продвижение под ваши цели — от анализа до запуска и ведения кампаний.',
      steps: [
        { id: 'channels', type: 'multi', question: 'Что вы хотите продвигать?', options: ['Сайт', 'Соцсети', 'Профиль в 2ГИС', 'Яндекс Бизнес', 'Яндекс Карты', 'Яндекс Услуги', 'Пока нет каналов', 'Нужна рекомендация', 'Иное'], required: true },
        { id: 'channelLinks', type: 'textarea', question: 'Оставьте ссылки на площадки', placeholder: 'По одной ссылке на строку', when: { field: 'channels', oneOf: ['Сайт', 'Соцсети', 'Профиль в 2ГИС', 'Яндекс Бизнес', 'Яндекс Карты', 'Яндекс Услуги'] }, required: true },
        { id: 'promotionTypes', type: 'multi', question: 'Какие типы продвижения интересны?', options: ['Яндекс Директ', '2ГИС', 'Яндекс Бизнес', 'Яндекс Карты', 'Яндекс Услуги', 'Соцсети', 'SEO-продвижение', 'Нужна рекомендация', 'Иное'], required: true },
        { id: 'currentPromotion', type: 'multi', question: 'Сейчас вы уже что-то продвигаете?', options: ['Платная реклама', 'SEO-продвижение', 'Соцсети', 'Продвигали раньше', 'Никогда не продвигали', 'Затрудняюсь ответить'], required: true },
        { id: 'previousHelp', type: 'multi', question: 'Кто-то уже помогал с продвижением?', options: ['Нет, не обращались', 'Сотрудники Яндекс', 'Маркетологи / SEO-специалисты', 'Иное'], when: { field: 'currentPromotion', oneOf: ['Платная реклама', 'SEO-продвижение', 'Соцсети', 'Продвигали раньше'] }, required: true },
        { id: 'supportType', type: 'single', question: 'Разовая настройка или сопровождение?', options: ['Настройка и регулярное продвижение', 'Только разовая настройка', 'Нужна консультация', 'Иное'], required: true },
        { id: 'geography', type: 'single', question: 'География продвижения', options: ['Один город', 'Несколько регионов', 'Вся Россия', 'Международно'], required: true },
        { id: 'goals', type: 'multi', question: 'Какие цели у рекламы?', options: ['Заявки', 'Звонки', 'Продажи', 'Увеличение трафика', 'Всё вместе'], required: true },
        { id: 'website', type: 'url', question: 'Оставьте ссылку на сайт для анализа', placeholder: 'https://example.ru', required: true }
      ]
    },
    improve: {
      title: 'Доработать сайт',
      intro: 'Разберём текущий сайт и поймём, какие изменения дадут лучший результат.',
      steps: [
        { id: 'platform', type: 'single', question: 'На какой платформе сделан сайт?', options: ['WordPress', 'Tilda', 'OpenCart', 'Joomla', '1С-Битрикс', 'Иное', 'Не знаю, нужна консультация'], required: true },
        { id: 'platformOther', type: 'text', question: 'Уточните платформу', placeholder: 'Название платформы', when: { field: 'platform', includes: 'Иное' }, required: true },
        { id: 'changes', type: 'multi', question: 'Что именно хотите доработать?', options: ['Улучшить визуал или сделать редизайн', 'Исправить вёрстку, структуру, логику', 'Исправить баги и ошибки', 'Добавить или удалить страницы', 'Добавить новый функционал', 'Нужны рекомендации', 'Перенос сайта', 'Иное'], required: true },
        { id: 'changesOther', type: 'textarea', question: 'Опишите пожелания', placeholder: 'Что нужно изменить', when: { field: 'changes', includes: 'Иное' }, required: true },
        { id: 'website', type: 'url', question: 'Введите ссылку на сайт для анализа', placeholder: 'https://example.ru', required: true },
        { id: 'rebuild', type: 'single', question: 'Готовы рассмотреть полную пересборку сайта?', options: ['Да, можно предложить', 'Нет, только доработки', 'Нужна консультация'], required: true },
        { id: 'currentPromotion', type: 'multi', question: 'Сейчас сайт продвигается?', options: ['Яндекс Директ', 'Яндекс Бизнес', 'SEO-продвижение', 'Иное', 'Нет, пока не продвигаем'], required: true },
        { id: 'access', type: 'single', question: 'У вас есть доступы от сайта?', options: ['Есть все доступы', 'Только доступ к домену', 'Только доступ к хостингу', 'Доступы потеряны', 'Нет доступов', 'Иное'], required: true },
        { id: 'accessOther', type: 'textarea', question: 'Опишите ситуацию с доступами', placeholder: 'Что сейчас доступно', when: { field: 'access', includes: 'Иное' }, required: true }
      ]
    }
  },
  portfolio: {
    title: 'Примеры наших работ',
    prompt: 'В какой сфере хотите посмотреть примеры сайтов?',
    categories: [
      { name: 'Строительство / благоустройство', items: ['Дома под ключ', 'Укладка брусчатки', 'Утепление фасадов'] },
      { name: 'Ремонтные работы', items: ['Ремонт квартир', 'Натяжные потолки', 'Отделка балконов'] },
      { name: 'Производство / промышленность', items: ['Производство металлоконструкций', 'Инженерные системы'] },
      { name: 'Автомобили', items: ['Автосервис', 'Шиномонтаж и ТО'] },
      { name: 'Специалисты / услуги', items: ['Консультант-юрист', 'Бьюти-студия', 'Коуч / психолог'] },
      { name: 'Еда / доставка / кулинария', items: ['Кафе / меню', 'Доставка обедов'] },
      { name: 'Спорт / отдых / тренеры', items: ['Персональный тренер', 'Фитнес-клуб'] }
    ]
  },
  labels: {
    start: 'Начать',
    next: 'Продолжить',
    back,
    finish: 'Отправить заявку',
    selected: 'Выбрано',
    required: 'Выберите или заполните ответ',
    completedTitle: 'Заявка готова',
    completedText: 'Спасибо! Мы свяжемся с вами в удобное время и предложим оптимальный вариант.'
  }
};

export default defaultConfig;
