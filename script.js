const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const lastRaceData = {
  winner: {
    name: "Кими Антонелли",
    team: "Мерседес",
    number: 12,
    time: "1:27:33.841",
    bestLap: "1:28.6",
    overtakes: 2,
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/antonelli.png.transform/2col/image.png",
    faceFallbackSrc: "./assets/driver-antonelli-face-new.webp"
  },
  stats: {
    totalLaps: "57 / 57",
    avgSpeed: "223 км/ч",
    temperature: "27°C / 35°C",
    pitStops: 38
  },
  podium: [
    "Антонелли",
    "Норрис",
    "Пиастри"
  ],
  highlights: [
    { time: "Круг 1", desc: "Ферстаппен развёрнут после контакта с Леклером" },
    { time: "Круг 8", desc: "Антонелли выходит в лидеры после обгона Леклера" },
    { time: "Круг 10", desc: "Гасли перевернулся после контакта с Лоусоном — сейфти-кар" },
    { time: "Круг 57", desc: "Леклер штраф 20 сек — падение на 8-е место" }
  ]
};

const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const state = {
  driverIndex: 0,
  timer: null,
  lastSwitchTs: 0,
  parallaxPaused: false,
  newsModalFont: 1,
};

const drivers = [
  {
    name: "Кими Антонелли",
    team: "Mercedes",
    number: 12,
    home: true,
    desc: "Три победы подряд с поула — новичок, который переписывает историю Формулы 1.",
    pos: "1-е",
    pts: 100,
    best: "1:28.6",
    accent: "#00d2be",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/antonelli.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/mercedes.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-antonelli-face-new.webp",
    carFallbackSrc: "./assets/car-mercedes.png",
        newsAbout: [
      "Антонелли — первый в истории, кто выиграл первые три Гран-при с поула.",
      "Wolff: обновление для Канады «обязано сработать» — Mercedes усиливает преимущество.",
    ],
  },
  {
    name: "Джордж Расселл",
    team: "Mercedes",
    number: 63,
    home: true,
    desc: "Чистая техника, стабильность и грамотное управление шинами на длинных дистанциях.",
    pos: "2-е",
    pts: 80,
    best: "1:29.1",
    accent: "#27d4c0",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/russell.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/mercedes.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-russell-face.png",
    carFallbackSrc: "./assets/car-mercedes.png",
    newsAbout: [
      "Рассел признаёт: изменения настроек Антонелли оказали большее влияние, чем ожидалось.",
      "Британец финишировал 4-м в Майами после столкновений с Леклером и Ферстаппеном.",
    ],
  },
  {
    name: "Шарль Леклер",
    team: "Ferrari",
    number: 16,
    home: true,
    desc: "Идеальная траектория, хладнокровие и агрессивные обгоны с поздним торможением.",
    pos: "3-е",
    pts: 59,
    best: "1:29.3",
    accent: "#ff2d2d",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/leclerc.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/ferrari.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-leclerc-face.png",
    carFallbackSrc: "./assets/car-ferrari.png",
        newsAbout: [
      "Леклер оштрафован на 20 сек в Майами: многократный выезд за трассу и небезопасное вождение.",
      "Ferrari теряет второе место в кубке конструкторов после штрафов в Майами.",
    ],
  },
  {
    name: "Ландо Норрис",
    team: "McLaren",
    number: 4,
    home: true,
    desc: "Скорость входа в поворот и точные траектории — лазерная точность.",
    pos: "4-е",
    pts: 51,
    best: "1:29.4",
    accent: "#ff8000",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/norris.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/mclaren.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-norris-face.png",
    carFallbackSrc: "./assets/car-mclaren.png",
    highlights: {
      videoId: "mK8YxF8xLtM",
      title: "Norris chases Antonelli in Miami thriller",
      description: "McLaren driver finishes 3.2s behind the leader",
      localVideo: "./assets/v24044gl0000d29m0pnog65o2brkj4q0.MP4"
    },
    newsAbout: [
      "Норрис: «Мы были близки к победе, но Mercedes сильнее на длинных сериях».",
      "McLaren сокращает отставание от Ferrari в кубке конструкторов.",
    ],
  },
  {
    name: "Льюис Хэмилтон",
    team: "Ferrari",
    number: 44,
    home: false,
    desc: "Семикратный чемпион в красном — опыт, мотивация и новый вызов в Скудерии.",
    pos: "5-е",
    pts: 51,
    best: "1:29.5",
    accent: "#e8002d",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/hamilton.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/ferrari.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-hamilton-face.png",
    carFallbackSrc: "./assets/car-ferrari.png",
    placeholderHue: 0,
    newsAbout: [
      "Хэмилтон поднялся на 6-е место в Майами после штрафа Леклера.",
      "Британец получил повреждения в контакте с Колапинто на первом круге.",
    ],
  },
  {
    name: "Оскар Пиастри",
    team: "McLaren",
    number: 81,
    home: false,
    desc: "Быстрая адаптация, холодный расчет и точные круги в квалификации.",
    pos: "6-е",
    pts: 43,
    best: "1:29.6",
    accent: "#ff9500",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/piastri.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/mclaren.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-norris-face.png",
    carFallbackSrc: "./assets/car-mclaren.png",
    placeholderHue: 30,
    newsAbout: [
      "Пиастри на подиуме в Майами — третий результат для McLaren.",
      "Австралиец пожаловался на опасные действия Рассела в борьбе за позицию.",
    ],
  },
  {
    name: "Макс Ферстаппен",
    team: "Red Bull Racing",
    number: 1,
    home: false,
    desc: "Максимальная атака: позднее торможение, минимальные потери и давление круг за кругом.",
    pos: "7-е",
    pts: 26,
    best: "1:29.8",
    accent: "#3671C6",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/verstappen.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/redbullracing.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-verstappen-face.png",
    carFallbackSrc: "./assets/car-redbull.png",
    placeholderHue: 220,
    newsAbout: [
      "Ферстаппен развёрнут на 1-м круге Майами после контакта с Леклером — прорыв на 5-е.",
      "Штраф 5 сек за пересечение линии выезда с пит-лейна, но сохранил позицию.",
    ],
  },
  {
    name: "Оливер Бирман",
    team: "Haas",
    number: 38,
    home: false,
    desc: "Молодой талант, уверенные выступления и быстрый прогресс в первом полном сезоне.",
    pos: "8-е",
    pts: 17,
    best: "1:30.1",
    accent: "#b6babd",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/bearman.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/haas.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-bearman-face-new.png",
    carFallbackSrc: "./assets/car-bearman-new.jpg",
    placeholderHue: 0,
    newsAbout: [
      "Бирман — лучший из средних команд: 17 очков после четырёх этапов.",
      "Британец стабильно набирает очки и помогает Haas опережать Racing Bulls.",
    ],
  },
  {
    name: "Пьер Гасли",
    team: "Alpine",
    number: 10,
    home: false,
    desc: "Агрессия на одном круге и борьба за очки в плотной группе.",
    pos: "9-е",
    pts: 16,
    best: "1:30.2",
    accent: "#0090ff",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/gasly.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/alpine.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-gasly-face.png",
    carFallbackSrc: "./assets/car-gasly-new.jpg",
    placeholderHue: 210,
    newsAbout: [
      "Гасли перевернулся в Майами после контакта с Лоусоном — сход с гонки.",
      "Alpine расследует инцидент: француз мог набрать очки без столкновения.",
    ],
  },
  {
    name: "Лиам Лоусон",
    team: "Racing Bulls",
    number: 30,
    home: false,
    desc: "Агрессивный новичок, быстрый на одном круге и готов к жёсткой борьбе.",
    pos: "10-е",
    pts: 10,
    best: "1:30.3",
    accent: "#6692ff",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/lawson.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/rb.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-lawson-face-new.png",
    carFallbackSrc: "./assets/car-lawson-new.jpeg",
    placeholderHue: 230,
    newsAbout: [
      "Лоусон избежал штрафа за переворот Гасли — стюарды не нашли нарушений.",
      "Новозеландец набрал 10 очков в первых четырёх гонках сезона.",
    ],
  },
  {
    name: "Франко Колапинто",
    team: "Alpine",
    number: 43,
    home: false,
    desc: "Аргентинский талант, дебютирующий в Ф1 с уверенными выступлениями.",
    pos: "11-е",
    pts: 7,
    best: "1:30.4",
    accent: "#41b6ff",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/colapinto.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/alpine.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-colapinto-face-new.webp",
    carFallbackSrc: "./assets/car-colapinto-new.jpeg",
    placeholderHue: 200,
    newsAbout: [
      "Колапинто — лучший результат карьеры: 7-е место в Майами после штрафа Леклера.",
      "Аргентинец попал в контакт с Хэмилтоном на первом круге — стюарды не наказали.",
    ],
  },
  {
    name: "Арвид Линдблад",
    team: "Racing Bulls",
    number: 48,
    home: false,
    desc: "Британский юниор с быстрым прогрессом и хладнокровием в гонках.",
    pos: "12-е",
    pts: 4,
    best: "1:30.5",
    accent: "#7ba3ff",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/lindblad.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/rb.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-lindblad-face-new.jpeg",
    carFallbackSrc: "./assets/car-lindblad-new.jpeg",
    placeholderHue: 240,
    newsAbout: [
      "Линдблад набирает первые очки в Ф1 — 4 очка после четырёх этапов.",
      "Британец учится у Лоусона в Racing Bulls и прогрессирует от гонки к гонке.",
    ],
  },
  {
    name: "Исак Хаджар",
    team: "Red Bull Racing",
    number: 21,
    home: false,
    desc: "Французский новичок в Red Bull — скорость и потенциал на длинных сериях.",
    pos: "13-е",
    pts: 4,
    best: "1:30.6",
    accent: "#4a90d9",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/hadjar.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/redbullracing.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-hadjar-face-new.png",
    carFallbackSrc: "./assets/car-hadjar-new.jpeg",
    placeholderHue: 215,
    newsAbout: [
      "Хаджар дисквалифицирован из квалификации Майами и стартовал с пит-лейна.",
      "Француз разбил болид в Майами — сход с гонки на 9-м круге.",
    ],
  },
  {
    name: "Карлос Сайнс",
    team: "Williams",
    number: 55,
    home: false,
    desc: "Опыт и агрессия — испанец приносит стабильность в Williams.",
    pos: "14-е",
    pts: 4,
    best: "1:30.7",
    accent: "#005aff",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/sainz.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/williams.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-sainz-face.png",
    carFallbackSrc: "./assets/car-sainz-new.jpg",
    placeholderHue: 265,
    newsAbout: [
      "Сайнс набирает лишь 4 очка за Williams — команда далека от конкуренции.",
      "Испанец работает с инженерами над улучшением прижимной силы FW48.",
    ],
  },
  {
    name: "Габриэль Бортолето",
    team: "Audi",
    number: 5,
    home: false,
    desc: "Бразильский новичок, первый сезон в Ф1 с Audi.",
    pos: "15-е",
    pts: 2,
    best: "1:30.8",
    accent: "#ff0000",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/bortoleto.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/audi.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-bortoleto-face-new.jpg",
    carFallbackSrc: "./assets/car-bortoleto-new.jpg",
    placeholderHue: 0,
    newsAbout: [
      "Бортолето набрал первые очки для Audi в сезоне 2026.",
      "Бразилец адаптируется к новой машине — прогресс от гонки к гонке.",
    ],
  },
  {
    name: "Эстебан Окон",
    team: "Haas",
    number: 31,
    home: false,
    desc: "Дисциплина гонки и точная обратная связь для инженеров.",
    pos: "16-е",
    pts: 1,
    best: "1:30.9",
    accent: "#c4c8cb",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/ocon.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/haas.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-ocon-face.png",
    carFallbackSrc: "./assets/car-ocon-new.jpeg",
    placeholderHue: 25,
    newsAbout: [
      "Окон набрал первое очко для Haas в сезоне 2026.",
      "Француз работает над улучшением квалификационного темпа.",
    ],
  },
  {
    name: "Александр Альбон",
    team: "Williams",
    number: 23,
    home: false,
    desc: "Извлекает максимум из машины и часто доходит до Q2.",
    pos: "17-е",
    pts: 1,
    best: "1:31.0",
    accent: "#3d7dff",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/albon.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/williams.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-albon-face.png",
    carFallbackSrc: "./assets/car-albon-new.jpeg",
    placeholderHue: 270,
    newsAbout: [
      "Альбон набрал лишь 1 очко — Williams борется за скорость.",
      "Тайский гонщик работает с симулятором над улучшением темпа на длинных сериях.",
    ],
  },
  {
    name: "Нико Хюлькенберг",
    team: "Audi",
    number: 27,
    home: false,
    desc: "Опытный немец, стабильность и работа на длинных дистанциях.",
    pos: "18-е",
    pts: 0,
    best: "1:31.1",
    accent: "#c4c8cb",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/hulkenberg.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/audi.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-hulkenberg-face.png",
    carFallbackSrc: "./assets/car-hulkenberg-new.jpeg",
    placeholderHue: 25,
    newsAbout: [
      "Хюлькенберг ищет первые очки для Audi — команда борется за надёжность.",
      "Немец фокусируется на стабильности и помощи в развитии машины.",
    ],
  },
  {
    name: "Валттери Боттас",
    team: "Cadillac",
    number: 77,
    home: false,
    desc: "Ветеран Ф1 в новой команде Cadillac — опыт и стабильность.",
    pos: "19-е",
    pts: 0,
    best: "1:31.3",
    accent: "#1a1a1a",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/bottas.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/cadillac.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-placeholder.png",
    carFallbackSrc: "./assets/botas bolid.jpeg",
    placeholderHue: 0,
    newsAbout: [
      "Cadillac пока без очков — новый конструктор борется за скорость.",
      "Боттас помогает команде развиваться, делясь опытом топ-команд.",
    ],
  },
  {
    name: "Серхио Перес",
    team: "Cadillac",
    number: 11,
    home: false,
    desc: "Мексиканский ветеран в Cadillac — гоночная стратегия и работа с шинами.",
    pos: "20-е",
    pts: 0,
    best: "1:31.4",
    accent: "#333333",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/perez.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/cadillac.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-perez-face.png",
    carFallbackSrc: "./assets/car-perez-new.jpeg",
    placeholderHue: 0,
    newsAbout: [
      "Перес перешёл в Cadillac — новый вызов для мексиканского ветерана.",
      "Пока без очков, но Перес помогает команде набираться опыта.",
    ],
  },
  {
    name: "Фернандо Алонсо",
    team: "Aston Martin",
    number: 14,
    home: false,
    desc: "Максимум из машины, опыт гонок и жёсткая конкуренция — даже без очков.",
    pos: "21-е",
    pts: 0,
    best: "1:31.5",
    accent: "#006f62",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/alonso.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/astonmartin.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-alonso-face.png",
    carFallbackSrc: "./assets/car-alonso-new.jpeg",
    placeholderHue: 160,
    newsAbout: [
      "Aston Martin без очков после четырёх этапов — кризис команды.",
      "Алонсо требует от команды шагов по прижимной силе: AMR теряет на прямых.",
    ],
  },
  {
    name: "Лэнс Стролл",
    team: "Aston Martin",
    number: 18,
    home: false,
    desc: "Атака на старте и работа над развитием машины.",
    pos: "22-е",
    pts: 0,
    best: "1:31.6",
    accent: "#0d7a6f",
    faceSrc: "https://www.formula1.com/content/dam/fom-website/drivers/2023drivers/stroll.png.transform/2col/image.png",
    carSrc: "https://www.formula1.com/content/dam/fom-website/teams/2023/astonmartin.png.transform/2col/retina.png",
    faceFallbackSrc: "./assets/driver-stroll-face.png",
    carFallbackSrc: "./assets/car-stroll-new.jpeg",
    placeholderHue: 155,
    newsAbout: [
      "Стролл без очков — Aston Martin переживает сложный сезон.",
      "Канадец фокусируется на развитии машины и обратной связи для инженеров.",
    ],
  },
];

const featuredDriverPool = (() => {
  const h = drivers.filter((d) => d.home);
  return h.length ? h : drivers.slice(0, Math.min(4, drivers.length));
})();

const achievements = [
  {
    title: "Витрина достижений",
    items: [
      { name: "Победы в гонках", value: "Драйверы топ-уровня" },
      { name: "Поул-позиции", value: "Квалификационная мощь" },
      { name: "Лучшие круги", value: "Чистая скорость" },
      { name: "Надёжность", value: "Техника и контроль" },
    ],
  },
  {
    title: "Драйверы",
    items: [
      { name: "Макс Ферстаппен", value: "Контроль темпа и атака" },
      { name: "Шарль Леклер", value: "Поздние торможения и геометрия" },
      { name: "Ландо Норрис", value: "Точность на входе" },
      { name: "Джордж Рассел", value: "Стабильность на длинных сериях" },
    ],
  },
];

const news = [
  {
    tag: "Гонка",
    hot: true,
    time: "3 мая 2026",
    title: "Антонелли выигрывает Майами — третья победа подряд с поула",
    text: "Мерседес-новичок удержал Норриса и Пиастри в хаотичной гонке с ранним стартом из-за грозы.",
    fullText: [
      "Гран-при Майами стартовал на три часа раньше из-за прогноза грозы. Антонелли ушёл с поула, но на первом круге Ферстаппен развернулся после контакта с Леклером, а Хэмилтон столкнулся с Колапинто.",
      "Леклер лидировал после хаоса, но Антонелли вернул позицию на 8-м круге. После сейфти-кар из-за аварий Гасли и Хаджара McLaren бросил вызов — Норрис вышел вперёд, но андеркат Mercedes вернул лидерство.",
      "На последнем круге Леклер развернулся и ударился в стену — штраф 20 сек отбросил его с подиума на 8-е место. Антонелли выиграл с отрывом 3.264 сек от Норриса.",
    ],
    media: [
      { type: "youtube", id: "IiaVcT3SZv0", caption: "Обзор Гран-при Майами 2026" },
      {
        type: "image",
        src: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Miami_International_Autodrome_-_Track_Map.svg",
        alt: "Схема трассы Miami International Autodrome",
        caption: "Трасса Майами — хаотичная гонка с ранним стартом из-за грозы.",
      },
    ],
  },
  {
    tag: "Штрафы",
    hot: true,
    time: "4 мая 2026",
    title: "Леклер оштрафован на 20 секунд — падение с подиума на 8-е место",
    text: "Стюарды наказали монегаска за многократный выезд за трассу и небезопасное вождение после последнего круга.",
    fullText: [
      "Леклер был вызван к стюарам по трём эпизодам: столкновение с Расселлом, многократный выезд за пределы трассы с получением преимущества, и небезопасное вождение после контакта со стеной.",
      "Штраф в виде проезда через пит-лейн был конвертирован в 20 секунд к времени гонки. Это отбросило Леклера с 6-го на 8-е место, а Хэмилтон и Колапинто поднялись на позиции выше.",
      "Ферстаппен также получил штраф 5 сек за пересечение линии выезда с пит-лейна, но сохранил 5-е место благодаря достаточному отрыву.",
    ],
    media: {
      type: "image",
      src: "https://upload.wikimedia.org/wikipedia/commons/9/99/SF-24_at_the_Japanese_GP.jpg",
      alt: "Болид Ferrari на трассе",
      caption: "Тяжёлый уик-энд для Ferrari: штрафы отбросили команду в кубке конструкторов.",
    },
  },
  {
    tag: "Мерседес",
    hot: false,
    time: "4 мая 2026",
    title: "Wolff: обновление для Канады «обязано сработать»",
    text: "Босс Mercedes требует, чтобы пакет обновлений для Монреаля усилил преимущество команды.",
    fullText: [
      "Тото Вольф подчёркивает, что команда не может почивать на лаврах: McLaren и Ferrari сократили отставание в Майами. Пакет для Circuit Gilles-Villeneuve фокусируется на прижимной силе и эффективности DRS.",
      "Mercedes лидирует в кубке конструкторов с 180 очками — 68 очков преимущества над Ferrari. Но Вольф предупреждает: «Одна плохая гонка — и отрыв растает».",
    ],
    media: {
      type: "image",
      src: "https://upload.wikimedia.org/wikipedia/commons/7/70/W15_%2854322512052%29.jpg",
      alt: "Болид Mercedes Формулы 1",
      caption: "Mercedes готовит обновление к Гран-при Канады.",
    },
  },
  {
    tag: "Инциденты",
    hot: false,
    time: "4 мая 2026",
    title: "Гасли перевернулся после контакта с Лоусоном — стюарды без штрафа",
    text: "Alpine перевернулся на 9-м круге после столкновения с Racing Bulls — Лоусон избежал наказания.",
    fullText: [
      "На 9-м круге Гасли и Лоусон боролись за позицию: контакт отправил Alpine в переворот, машина приземлилась на колёса. Гасли выбыл из гонки, Лоусон также сошёл позже.",
      "Стюарды расследовали инцидент, но не нашли нарушений со стороны новозеландца — контакт признан гоночным. Alpine теряет потенциальные очки.",
    ],
    media: {
      type: "image",
      src: "https://upload.wikimedia.org/wikipedia/commons/1/12/2023_McLaren_MCL60.jpg",
      alt: "Болид Формулы 1 в гонке",
      caption: "Драматичный инцидент в Майами: переворот Гасли после контакта с Лоусоном.",
    },
  },
  {
    tag: "Red Bull",
    hot: false,
    time: "5 мая 2026",
    title: "Хаджар: дисквалификация, пит-лейн, сход — кошмар в Майами",
    text: "Французский новичок Red Bull пережил худший уик-энд: от дисквалификации до аварии.",
    fullText: [
      "Хаджар был дисквалифицирован из квалификации за техническое нарушение, а затем получил штраф за изменения в машине в режиме парка ферме — старт с пит-лейна.",
      "На 9-м круге француз ударился в стену в 14-м повороте и выбыл из гонки. Red Bull набрал лишь 26 очков за сезон — худший старт команды за годы.",
    ],
    media: {
      type: "image",
      src: "https://upload.wikimedia.org/wikipedia/commons/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg",
      alt: "Трасса Формулы 1",
      caption: "Кошмарный уик-энд для Хаджара и Red Bull в Майами.",
    },
  },
  {
    tag: "Канада",
    hot: false,
    time: "5 мая 2026",
    title: "Гран-при Канады: спринт-уик-энд в Монреале 22–24 мая",
    text: "Следующий этап — Circuit Gilles-Villeneuve, 70 кругов на трассе длиной 4,361 км.",
    fullText: [
      "Гран-при Канады станет пятым этапом сезона и вторым спринт-уик-эндом. Гонка пройдёт 24 мая, спринт — 23 мая. Трасса в Монреале известна длинными прямыми и «Стеной чемпионов».",
      "Mercedes привозит обновление, McLaren надеется сократить отставание, а Ferrari ищет возвращение в борьбу после штрафов в Майами.",
    ],
    media: {
      type: "image",
      src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Circuit_gilles_villeneuve.svg",
      alt: "Схема трассы Circuit Gilles-Villeneuve в Монреале",
      caption: "Circuit Gilles-Villeneuve — следующая остановка Формулы 1.",
    },
  },
];

const driverStandings = [
  { name: "Кими Антонелли", team: "Мерседес", pts: 100 },
  { name: "Джордж Расселл", team: "Мерседес", pts: 80 },
  { name: "Шарль Леклер", team: "Феррари", pts: 59 },
  { name: "Ландо Норрис", team: "Макларен", pts: 51 },
  { name: "Льюис Хэмилтон", team: "Феррари", pts: 51 },
  { name: "Оскар Пиастри", team: "Макларен", pts: 43 },
];

const teams = [
  { 
    name: "Мерседес", 
    logoSrc: "./assets/mercedes logo.png"
  },
  { 
    name: "Феррари", 
    logoSrc: "./assets/ferrari logo.png"
  },
  { 
    name: "Макларен", 
    logoSrc: "./assets/mclaren logo.jpg"
  },
  { 
    name: "Ред Булл Рейсинг", 
    logoSrc: "./assets/Red_Bull_Racing_logo.svg.png"
  },
  { 
    name: "Alpine", 
    logoSrc: "./assets/alpine logo.png"
  },
  { 
    name: "Haas", 
    logoSrc: "./assets/haas logo.png"
  }
];

const teamStandings = [
  { team: "Мерседес", drivers: "Антонелли • Расселл", pts: 180 },
  { team: "Феррари", drivers: "Леклер • Хэмилтон", pts: 110 },
  { team: "Макларен", drivers: "Норрис • Пиастри", pts: 94 },
  { team: "Ред Булл Рейсинг", drivers: "Ферстаппен • Хаджар", pts: 30 },
  { team: "Alpine", drivers: "Гасли • Колапинто", pts: 23 },
  { team: "Haas", drivers: "Бирман • Окон", pts: 18 },
];

const calendar = [
  { round: 5, title: "Гран-при Канады", place: "Монреаль", date: "24 мая 2026 • 21:00" },
  { round: 6, title: "Гран-при Монако", place: "Монте-Карло", date: "7 июня 2026 • 16:00" },
  { round: 7, title: "Гран-при Испании", place: "Барселона", date: "14 июня 2026 • 15:00" },
  { round: 8, title: "Гран-при Австрии", place: "Шпильберг", date: "28 июня 2026 • 15:00" },
];

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function setAccentColor(color) {
  const root = document.documentElement;
  root.style.setProperty("--red", color);
  // keep a slightly lighter second tone
  root.style.setProperty("--red2", color);
}

function setImageWithFallback(img, src, fallbackSrc) {
  if (!img) return;
  if (!src) {
    // Если нет основного источника, используем плейсхолдер
    img.src = fallbackSrc || './assets/driver-placeholder.png';
    return;
  }
  
  // Сбрасываем обработчик ошибок перед установкой нового src
  img.onerror = null;
  
  img.onerror = () => {
    console.warn(`Failed to load image: ${src}`);
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.onerror = () => {
        console.warn(`Failed to load fallback image: ${fallbackSrc}`);
        // Финальный плейсхолдер
        img.src = './assets/driver-placeholder.png';
      };
      img.src = fallbackSrc;
    } else {
      // Финальный плейсхолдер
      img.src = './assets/driver-placeholder.png';
    }
  };
  
  img.src = src;
}

function renderDriver(i, { animate = true } = {}) {
  const d = featuredDriverPool[i];
  if (!d) return;

  const card = $("#driverCard");
  if (!card) return;

  if (animate && !prefersReducedMotion) {
    card.classList.remove("is-fading");
    // force reflow for reliable fade
    void card.offsetWidth;
    card.classList.add("is-fading");
    state.parallaxPaused = true;
    window.setTimeout(() => {
      card.classList.remove("is-fading");
      state.parallaxPaused = false;
    }, 190);
  }

  $("#driverTeam").textContent = d.team;
  $("#driverNumber").textContent = `#${d.number}`;
  $("#driverName").textContent = d.name;
  $("#driverDesc").textContent = d.desc;
  $("#driverPos").textContent = d.pos;
  $("#driverPts").textContent = String(d.pts);
  $("#driverBest").textContent = d.best;

  setAccentColor(d.accent);

  const face = $("#driverFace");
  const car = $("#driverCar");
  if (face) {
    face.alt = `Портрет: ${d.name}`;
    setImageWithFallback(face, d.faceSrc, d.faceFallbackSrc);
  }
  if (car) {
    car.alt = `Болид команды: ${d.team}`;
    setImageWithFallback(car, d.carSrc, d.carFallbackSrc);
  }
}

function nextDriver(dir = 1) {
  const now = Date.now();
  if (now - state.lastSwitchTs < 320) return;
  state.lastSwitchTs = now;

  const len = featuredDriverPool.length;
  state.driverIndex = (state.driverIndex + dir + len) % len;
  renderDriver(state.driverIndex, { animate: true });
}

function startAutoRotate() {
  stopAutoRotate();
  state.timer = window.setInterval(() => nextDriver(1), 5000);
}

function stopAutoRotate() {
  if (state.timer) window.clearInterval(state.timer);
  state.timer = null;
}

function setupParallax() {
  const stage = $("#parallaxStage");
  const card = $("#driverCard");
  if (!stage || !card) return;

  const finePointer = window.matchMedia?.("(pointer: fine)")?.matches ?? true;
  if (!finePointer || prefersReducedMotion) return;

  let raf = 0;
  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;

  const tick = () => {
    if (state.parallaxPaused) return;
    raf = 0;
    curX += (targetX - curX) * 0.12;
    curY += (targetY - curY) * 0.12;
    const rx = (curY * 9).toFixed(2);
    const ry = (curX * 12).toFixed(2);
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };

  const onMove = (e) => {
    if (state.parallaxPaused) return;
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    targetX = clamp((px - 0.5) * 2, -1, 1);
    targetY = clamp((py - 0.5) * 2, -1, 1);
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onLeave = () => {
    targetX = 0;
    targetY = 0;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  stage.addEventListener("mousemove", onMove);
  stage.addEventListener("mouseleave", onLeave);
}

function setupReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
}

function newsFullParagraphsHtml(n) {
  const parts = Array.isArray(n.fullText)
    ? n.fullText
    : n.fullText
      ? String(n.fullText).split(/\n\n+/)
      : [];
  if (!parts.length) return `<p class="newsArticle__p">${escHtml(n.text)}</p>`;
  return parts.map((p) => `<p class="newsArticle__p">${escHtml(String(p).trim())}</p>`).join("");
}

function newsMediaSingleHtml(m) {
  if (!m) return "";
  if (m.type === "youtube" && m.id) {
    const safeId = String(m.id).replace(/[^a-zA-Z0-9_-]/g, "");
    if (!safeId) return "";
    const embedUrl = `https://www.youtube-nocookie.com/embed/${safeId}?rel=0`;
    return `<div class="newsMedia newsMedia--video">
      <iframe
        class="newsMedia__iframe"
        src="${embedUrl}"
        title="${escHtml(m.caption || "Видео по теме материала")}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>`;
  }
  if (m.type === "image" && m.src) {
    return `<figure class="newsMedia newsMedia--photo">
      <img class="newsMedia__img" src="${escHtml(m.src)}" alt="${escHtml(m.alt || "")}" loading="lazy" />
      ${m.caption ? `<figcaption class="newsMedia__cap">${escHtml(m.caption)}</figcaption>` : ""}
    </figure>`;
  }
  return "";
}

function newsMediaBlockHtml(n) {
  const raw = n.media;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.map((m) => newsMediaSingleHtml(m)).join("");
}

function openNewsModal(index) {
  const n = news[index];
  if (!n) return;
  const modal = $("#newsModal");
  const body = $("#newsModalBody");
  if (!modal || !body) return;

  state.newsModalFont = 1;
  body.style.fontSize = "";

  const badgeClass = n.hot ? "badge badge--hot" : "badge";
  body.innerHTML = `
    <header class="newsModal__head">
      <p class="newsModal__meta">
        <span class="${badgeClass}">${escHtml(n.tag ?? "Новости")}</span>
        <span class="mono newsModal__time">${escHtml(n.time)}</span>
      </p>
      <h2 id="newsModalTitle" class="newsModal__title">${escHtml(n.title)}</h2>
      <p class="newsModal__lead">${escHtml(n.text)}</p>
    </header>
    ${newsMediaBlockHtml(n)}
    <div class="newsArticle">${newsFullParagraphsHtml(n)}</div>
  `;

  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-news-modal-open");

  window.requestAnimationFrame(() => {
    $("#newsModalClose")?.focus();
  });
}

function closeNewsModal() {
  const modal = $("#newsModal");
  const body = $("#newsModalBody");
  if (!modal) return;

  if (body) {
    body.querySelectorAll("iframe.newsMedia__iframe").forEach((fr) => {
      if (fr instanceof HTMLIFrameElement) fr.removeAttribute("src");
    });
    body.innerHTML = "";
  }

  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-news-modal-open");
}

function applyNewsModalFont(delta) {
  state.newsModalFont = clamp((state.newsModalFont || 1) + delta, 0.85, 1.35);
  const body = $("#newsModalBody");
  if (body) body.style.fontSize = `${state.newsModalFont * 100}%`;
}

function setupNewsModal() {
  if (document.documentElement.dataset.newsModalBound === "1") return;
  if (!$("#newsModal")) return;
  document.documentElement.dataset.newsModalBound = "1";

  document.body.addEventListener("click", (e) => {
    const open = e.target.closest?.(".newsModalOpen");
    if (open) {
      e.preventDefault();
      const idx = Number(open.getAttribute("data-news-index"));
      if (Number.isFinite(idx)) openNewsModal(idx);
      return;
    }
    if (e.target.closest?.("[data-news-modal-close]")) closeNewsModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const modal = $("#newsModal");
    if (!modal || modal.hidden) return;
    closeNewsModal();
  });

  $("#newsModalClose")?.addEventListener("click", closeNewsModal);
  $("#newsFontInc")?.addEventListener("click", () => applyNewsModalFont(0.08));
  $("#newsFontDec")?.addEventListener("click", () => applyNewsModalFont(-0.08));
}

function renderNews() {
  const grid = $("#newsGrid");
  if (!grid) return;

  const limitAttr = grid.getAttribute("data-limit");
  const limit = limitAttr ? Number(limitAttr) : 0;
  const list = limit > 0 ? news.slice(0, limit) : news;

  const onNewsPage = /(^|\/)news\.html$/i.test(window.location.pathname);
  const detailHref = onNewsPage ? "index.html#standings" : "news.html";
  const detailLabel = onNewsPage ? "К таблице" : "Все новости";

  grid.innerHTML = list
    .map((n, i) => {
      const badgeClass = n.hot ? "badge badge--hot" : "badge";
      const safeTag = escHtml(n.tag ?? "Новости");
      const readBtn = onNewsPage
        ? `<button type="button" class="newsModalOpen card__readmore" data-news-index="${i}"><span>Читать полностью</span><span class="card__readmoreHint" aria-hidden="true">↗</span></button>`
        : "";

      return `
        <article class="card reveal">
          <div class="card__inner">
            <div class="card__kicker">
              <span class="${badgeClass}">${safeTag}</span>
              <span class="card__time">${escHtml(n.time)}</span>
            </div>
            <h3 class="card__title">${escHtml(n.title)}</h3>
            <p class="card__text">${escHtml(n.text)}</p>
            ${readBtn}
            <div class="card__footer">
              <a class="card__link" href="${detailHref}">
                <span>${detailLabel}</span>
                <span aria-hidden="true">→</span>
              </a>
              <span class="sub">Лента F1</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function getTeamPhoto(teamName) {
  const team = teams.find(t => t.name === teamName);
  if (team && team.logoSrc) {
    return team.logoSrc;
  }
  
  // Fallback options if team not found or logoSrc is missing
  const fallbacks = [
    'https://liquipedia.net/commons/images/3/39/RB_allmode.png',
    'https://liquipedia.net/commons/images/thumb/0/0d/Ferrari_allmode.png/600px-Ferrari_allmode.png',
    'https://liquipedia.net/commons/images/thumb/1/1f/McLaren_allmode.png/600px-McLaren_allmode.png',
    'https://liquipedia.net/commons/images/thumb/6/6b/Mercedes_allmode.png/600px-Mercedes_allmode.png',
    './assets/team-placeholder.png'
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function getDriverPhoto(driverName) {
  const driver = drivers.find(d => d.name === driverName);
  console.log('Looking for driver:', driverName, 'Found:', driver ? driver.faceFallbackSrc : 'Not found');
  return driver ? driver.faceFallbackSrc : './assets/driver-placeholder.png';
}

function renderTables() {
  const dt = $("#driversTable");
  const tt = $("#teamsTable");
  if (!dt || !tt) return;

  dt.innerHTML = driverStandings
    .slice(0, 6)
    .map(
      (d, idx) => `
      <tr class="row">
        <td>${idx + 1}</td>
        <td>
          <div class="row__name">
            <span class="bar" aria-hidden="true"></span>
            <div class="row__name-content">
              <div class="row__name-text">
                <img src="${getDriverPhoto(d.name)}" alt="${d.name}" class="row__driver-photo" onerror="this.src='./assets/driver-placeholder.png'">
                <div class="row__name-info">
                  <div>${d.name}</div>
                  <div class="sub">${d.team}</div>
                </div>
              </div>
            </div>
          </div>
        </td>
        <td>${d.team}</td>
        <td class="table__right">${d.pts}</td>
      </tr>
    `
    )
    .join("") + 
    (driverStandings.length >= 6 ? `
      <tr class="view-all-row">
        <td colspan="4">
          <button class="btn btn--ghost view-all-btn" onclick="window.location.href='drivers.html'">
            <span>Посмотреть весь</span>
            <span class="btn__icon" aria-hidden="true">→</span>
          </button>
        </td>
      </tr>
    ` : '');

  tt.innerHTML = teamStandings
    .slice(0, 6)
    .map(
      (t, idx) => `
      <tr class="row">
        <td>${idx + 1}</td>
        <td>
          <div class="row__name">
            <span class="bar" aria-hidden="true"></span>
            <div class="row__name-content">
              <a href="https://www.google.com/search?q=${encodeURIComponent(t.team + ' Formula 1 logo')}&tbm=isch" target="_blank" class="row__team-link" title="Search ${t.team} logo on Google">
                <img src="${getTeamPhoto(t.team)}" alt="${t.team}" class="row__team-photo" onerror="this.src='./assets/team-placeholder.png'">
                <div class="row__name-info">
                  <div>${t.team}</div>
                  <div class="sub">Constructor</div>
                </div>
              </a>
            </div>
          </div>
        </td>
        <td>${t.drivers}</td>
        <td class="table__right">${t.pts}</td>
      </tr>
    `
    )
    .join("") + 
    (teamStandings.length >= 6 ? `
      <tr class="view-all-row">
        <td colspan="4">
          <button class="btn btn--ghost view-all-btn" onclick="window.location.href='drivers.html'">
            <span>Посмотреть весь</span>
            <span class="btn__icon" aria-hidden="true">-></span>
          </button>
        </td>
      </tr>
    ` : '');
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function driverInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function driverPageFaceMarkup(d) {
  if (d.faceSrc) {
    return `<div class="driverPageMedia__face">
              <img class="driverPageMedia__img" data-fallback-src="${d.faceFallbackSrc || ""}" src="${d.faceSrc}" alt="Портрет: ${escHtml(d.name)}" loading="lazy" />
            </div>`;
  }
  const hue = d.placeholderHue ?? 210;
  return `<div class="driverPageMedia__face driverPageMedia__face--placeholder" style="--driver-ph:${hue}">
              <span class="driverPageMedia__initials" aria-hidden="true">${escHtml(driverInitials(d.name))}</span>
              <span class="sr-only">Портрет: ${escHtml(d.name)}</span>
            </div>`;
}

function driverPageCarMarkup(d) {
  if (d.carSrc) {
    return `<div class="driverPageMedia__car">
              <img
                class="driverPageMedia__img driverPageMedia__img--car"
                data-fallback-src="${d.carFallbackSrc || ""}"
                src="${d.carSrc}"
                alt="Болид команды: ${escHtml(d.team)}"
                loading="lazy"
              />
            </div>`;
  }
  const hue = d.placeholderHue ?? 210;
  return `<div class="driverPageMedia__car driverPageMedia__car--placeholder" style="--driver-ph:${hue}">
              <span class="driverPageMedia__carLabel">Болид</span>
              <span class="sr-only">Команда: ${escHtml(d.team)}</span>
            </div>`;
}

function driverNewsMarkup(d) {
  const items = d.newsAbout || [];
  if (!items.length) return "";
  return `<div class="driverPageNews">
            <div class="sub driverPageNews__title">Новости о гонщике</div>
            <ul class="driverPageNews__list">
              ${items.map((t) => `<li class="driverPageNews__item">${escHtml(t)}</li>`).join("")}
            </ul>
          </div>`;
}

function getHighlightVideoMarkup(driver) {
  if (!driver.highlights) return '';
  
  const isLocalVideo = driver.highlights.localVideo;
  
  return `
    <div class="driverHighlightVideo" data-driver="${driver.name}">
      ${isLocalVideo ? `
        <video class="highlightVideo__video" 
               src="${driver.highlights.localVideo}" 
               muted 
               loop 
               playsinline
               poster="${driver.faceFallbackSrc}">
          Your browser does not support the video tag.
        </video>
      ` : ''}
      ${!isLocalVideo ? `
        <div class="highlightVideo__overlay">
          <div class="highlightVideo__play"></div>
          <div class="highlightVideo__info">
            <h4>${driver.highlights.title}</h4>
            <p>${driver.highlights.description}</p>
            <div class="highlightVideo__fallback">
              <div class="video-unavailable">
                <div class="unavailable-icon"></div>
                <div class="unavailable-text">
                  <p>Video in processing</p>
                  <small>Highlights will be available soon</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="highlightVideo__loading">
          <div class="loading-spinner"></div>
          <p>Loading video...</p>
        </div>
      ` : ''}
    </div>
  `;
}

function getTopPositionClass(position) {
  const pos = parseInt(position);
  if (pos === 1) return 'card--first-place';
  if (pos === 2) return 'card--second-place';
  if (pos === 3) return 'card--third-place';
  return '';
}

function renderDriversPage() {
  const grid = $("#driversGrid");
  if (!grid) return;

  grid.innerHTML = drivers
    .map(
      (d) => `
      <article class="card reveal ${getTopPositionClass(d.pos)}">
        <div class="card__inner">
          <div class="card__kicker">
            <span class="badge">${d.team}</span>
            <span class="card__time">#${d.number}</span>
          </div>
          <h3 class="card__title">${d.name}</h3>
          <p class="card__text">${d.desc}</p>

          <div class="driverPageMedia">
            ${driverPageFaceMarkup(d)}
            ${driverPageCarMarkup(d)}
          </div>

          <div class="driverPageMeta">
            <div class="driverPageMeta__row">
              <span class="sub">Позиция</span>
              <span class="mono">${d.pos}</span>
            </div>
            <div class="driverPageMeta__row">
              <span class="sub">Очки</span>
              <span class="mono">${d.pts}</span>
            </div>
            <div class="driverPageMeta__row">
              <span class="sub">Лучший круг</span>
              <span class="mono">${d.best}</span>
            </div>
          </div>
          ${getHighlightVideoMarkup(d)}
          ${driverNewsMarkup(d)}
        </div>
      </article>
    `
    )
    .join("");

  // fallback on broken remote images
  const imgs = $$("img[data-fallback-src]", grid).filter((x) => x instanceof HTMLImageElement);
  imgs.forEach((img) => {
    const fallback = img.getAttribute("data-fallback-src");
    img.onerror = () => {
      if (!fallback) return;
      if (img.src === fallback) return;
      img.src = fallback;
    };
  });

  // Setup highlight video interactions
  const highlightVideos = $$(".driverHighlightVideo");
  highlightVideos.forEach(video => {
    const card = video.closest('.card');
    const overlay = video.querySelector('.highlightVideo__overlay');
    const playBtn = video.querySelector('.highlightVideo__play');
    const iframe = video.querySelector('.highlightVideo__iframe');
    const localVideo = video.querySelector('.highlightVideo__video');
    const fallback = video.querySelector('.highlightVideo__fallback');
    const loading = video.querySelector('.highlightVideo__loading');
    
    // For local videos, hide loading and fallback immediately
    if (localVideo) {
      if (loading) loading.style.display = 'none';
      if (fallback) fallback.style.display = 'none';
    } else {
      // Show loading state initially for iframe videos
      if (loading) {
        setTimeout(() => {
          loading.style.display = 'block';
          overlay.style.display = 'none';
          fallback.style.display = 'none';
        }, 500);
      }
      
      // Play video when clicking play button (only for iframe videos)
      playBtn?.addEventListener('click', () => {
        if (iframe) {
          iframe.src = iframe.src; // Reload iframe to start video
        }
      });
    }
    
    // Show/hide video on card hover
    card.addEventListener('mouseenter', () => {
      video.style.opacity = '1';
      video.style.visibility = 'visible';
      
      if (localVideo) {
        // Play local video on hover
        localVideo.play().catch(e => console.log('Video play failed:', e));
      } else if (iframe && iframe.style.display !== 'none') {
        if (loading) loading.style.display = 'none';
        if (fallback) fallback.style.display = 'none';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      video.style.opacity = '0';
      video.style.visibility = 'hidden';
      
      // Pause video when hovering out
      if (localVideo) {
        localVideo.pause();
        localVideo.currentTime = 0;
      } else if (iframe) {
        const tempSrc = iframe.src;
        iframe.src = '';
        setTimeout(() => {
          iframe.src = tempSrc;
        }, 100);
      }
    });
  });
}

function renderAchievementsPage() {
  const grid = $("#achievementsGrid");
  if (!grid) return;

  grid.innerHTML = achievements
    .map(
      (block) => `
      <article class="panel reveal achievementsPanel">
        <div class="panel__top">
          <div class="panel__title">${block.title}</div>
          <div class="panel__badge panel__badge--ghost"><span class="mono">F1</span></div>
        </div>
        <div class="achievementsPanel__body">
          ${block.items
            .map(
              (it) => `
              <div class="achievementRow">
                <span class="achievementRow__name">${it.name}</span>
                <span class="achievementRow__value">${it.value}</span>
              </div>
            `
            )
            .join("")}
        </div>
      </article>
    `
    )
    .join("");
}

function renderCalendar() {
  const grid = $("#calendarGrid");
  if (!grid) return;

  grid.innerHTML = calendar
    .map(
      (c) => `
      <article class="calendarCard reveal">
        <div class="calendarCard__inner">
          <div class="calendarCard__round">
            <span class="badge">Этап ${c.round}</span>
            <span class="mono">ФИА</span>
          </div>
          <h3 class="calendarCard__title">${c.title}</h3>
          <div class="calendarCard__meta">${c.place}</div>
          <div class="calendarCard__date">${c.date}</div>
        </div>
      </article>
    `
    )
    .join("");
}

function setupNav() {
  const toggle = $(".nav__toggle");
  const list = $("#navList");
  if (!toggle || !list) return;

  const close = () => {
    list.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    list.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = list.classList.contains("is-open");
    if (isOpen) close();
    else open();
  });

  // close on link tap
  list.addEventListener("click", (e) => {
    const a = e.target?.closest?.("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";

    // Закрываем меню при любом клике по ссылке.
    close();

    // Если это якорь — плавная прокрутка.
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // click outside
  document.addEventListener("click", (e) => {
    if (!list.classList.contains("is-open")) return;
    if (e.target === toggle || toggle.contains(e.target)) return;
    if (e.target === list || list.contains(e.target)) return;
    close();
  });

  // active state on scroll (simple + cheap)
  const sections = ["main", "news", "drivers", "teams", "calendar"].map((id) => ({
    id,
    el: document.getElementById(id),
    link: $(`.nav__link[href="#${id}"]`),
  }));

  const setActive = (id) => {
    const item = sections.find((s) => s.id === id);
    if (!item?.link) return;
    $$(".nav__link").forEach((l) => l.classList.remove("is-active"));
    item.link.classList.add("is-active");
  };

  // visual feedback on clicking "Команды" / etc.
  $$(".nav__link[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      target.classList.remove("is-pulse");
      void target.offsetWidth;
      target.classList.add("is-pulse");
      setActive(id);
      window.setTimeout(() => target.classList.remove("is-pulse"), 1250);
    });
  });

  if (!prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((x) => x.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v?.target?.id) setActive(v.target.id);
      },
      { threshold: [0.25, 0.4, 0.6] }
    );
    sections.forEach((s) => s.el && io.observe(s.el));
  }
}

function setupControls() {
  $("#prevDriver")?.addEventListener("click", () => {
    nextDriver(-1);
    startAutoRotate();
  });
  $("#nextDriver")?.addEventListener("click", () => {
    nextDriver(1);
    startAutoRotate();
  });

  const telemetryBtn = $("#toggleTelemetry");
  telemetryBtn?.addEventListener("click", () => {
    document.body.classList.toggle("is-telemetry");
  });
}

function setupCountdown() {
  // Canadian Grand Prix - May 24, 2026 at 21:00 local time (UTC-4)
  const race = new Date(Date.UTC(2026, 4, 25, 1, 0, 0)); // May 25, 2026 01:00 UTC

  const el = $("#raceCountdown");
  if (!el) return;

  const pad = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const t = race.getTime() - Date.now();
    if (t <= 0) {
      el.textContent = "В ЭФИРЕ";
      return;
    }
    const total = Math.floor(t / 1000);
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    el.textContent = `Т-${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  tick();
  window.setInterval(tick, 1000);
}

function setupMicroStats() {
  const lap = $("#statLap");
  const drs = $("#statDrs");
  const pace = $("#statPace");
  if (!lap || !drs || !pace) return;

  let l = 12;
  let drsOn = true;
  let base = 91800; // 1:31.800 in ms

  window.setInterval(() => {
    l = l >= 58 ? 1 : l + 1;
    drsOn = Math.random() > 0.35;
    base += Math.round((Math.random() - 0.5) * 240);
    base = clamp(base, 90600, 93000);

    lap.textContent = String(l);
    drs.textContent = drsOn ? "ВКЛ" : "ВЫКЛ";

    const mm = Math.floor(base / 60000);
    const ss = Math.floor((base % 60000) / 1000);
    const ms = Math.floor((base % 1000) / 10);
    pace.textContent = `${mm}:${String(ss).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  }, 1400);
}

function setupStreamModal() {
  const streamBtn = $("#streamBtn");
  const streamModal = $("#streamModal");
  const streamClose = $("#streamClose");
  const streamOverlay = $("#streamOverlay");

  if (!streamBtn || !streamModal) return;

  const openStream = (e) => {
    e.preventDefault();
    streamModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    
    // Обновляем статус трансляции
    const streamStatus = $("#streamStatus");
    if (streamStatus) {
      streamStatus.textContent = "В эфире";
      streamStatus.classList.add("online");
    }
  };

  const closeStream = () => {
    streamModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    
    // Сбрасываем статус
    const streamStatus = $("#streamStatus");
    if (streamStatus) {
      streamStatus.textContent = "Офлайн";
      streamStatus.classList.remove("online");
    }
  };

  streamBtn.addEventListener("click", openStream);
  streamClose.addEventListener("click", closeStream);
  streamOverlay.addEventListener("click", closeStream);

  // Закрытие по ESC
  const handleKeydown = (e) => {
    if (e.key === "Escape" && streamModal.getAttribute("aria-hidden") === "false") {
      closeStream();
    }
  };
  document.addEventListener("keydown", handleKeydown);
}

function renderLastRace() {
  const winner = lastRaceData.winner;
  const stats = lastRaceData.stats;
  const podium = lastRaceData.podium;
  const highlights = lastRaceData.highlights;

  // Обновляем информацию о победителе
  const winnerFace = $("#winnerFace");
  const winnerName = $("#winnerName");
  const winnerTeam = $("#winnerTeam");
  const winnerNumber = $("#winnerNumber");
  const winnerTime = $("#winnerTime");
  const winnerBest = $("#winnerBest");
  const winnerOvertakes = $("#winnerOvertakes");

  if (winnerFace) {
    winnerFace.src = winner.faceSrc;
    winnerFace.onerror = () => {
      winnerFace.src = winner.faceFallbackSrc;
    };
  }
  if (winnerName) winnerName.textContent = winner.name;
  if (winnerTeam) winnerTeam.textContent = winner.team;
  if (winnerNumber) winnerNumber.textContent = `#${winner.number}`;
  if (winnerTime) winnerTime.textContent = winner.time;
  if (winnerBest) winnerBest.textContent = winner.bestLap;
  if (winnerOvertakes) winnerOvertakes.textContent = winner.overtakes;

  // Обновляем статистику гонки
  const totalLaps = $("#totalLaps");
  const avgSpeed = $("#avgSpeed");
  const temperature = $("#temperature");
  const pitStops = $("#pitStops");

  if (totalLaps) totalLaps.textContent = stats.totalLaps;
  if (avgSpeed) avgSpeed.textContent = stats.avgSpeed;
  if (temperature) temperature.textContent = stats.temperature;
  if (pitStops) pitStops.textContent = stats.pitStops;

  // Обновляем подиум
  const podium1 = $("#podium1");
  const podium2 = $("#podium2");
  const podium3 = $("#podium3");

  if (podium1) podium1.textContent = podium[0];
  if (podium2) podium2.textContent = podium[1];
  if (podium3) podium3.textContent = podium[2];

  // Обновляем хайлайты
  const highlightsInfo = $(".highlights-info");
  if (highlightsInfo) {
    highlightsInfo.innerHTML = highlights
      .map(
        (highlight) => `
      <div class="highlight-moment">
        <span class="highlight-moment__time">${highlight.time}</span>
        <span class="highlight-moment__desc">${highlight.desc}</span>
      </div>
    `
      )
      .join("");
  }
}

function init() {
  $("#year").textContent = String(new Date().getFullYear());

  setupNav();

  const driverCard = $("#driverCard");
  if (driverCard) {
    renderDriver(state.driverIndex, { animate: false });
    setupParallax();
    setupControls();
    startAutoRotate();
  }

  if ($("#newsGrid")) renderNews();
  setupNewsModal();
  if ($("#driversTable") && $("#teamsTable")) renderTables();
  if ($("#calendarGrid")) renderCalendar();
  if ($("#driversGrid")) renderDriversPage();
  if ($("#achievementsGrid")) renderAchievementsPage();

  if ($("#raceCountdown")) setupCountdown();
  if ($("#statLap") && $("#statDrs") && $("#statPace")) setupMicroStats();

  setupReveal();
  setupStreamModal();
  renderLastRace();
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") stopAutoRotate();
  else startAutoRotate();
});

document.addEventListener("DOMContentLoaded", init);

