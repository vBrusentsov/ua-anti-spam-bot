import type { DeleteMessageAtomProperties } from '../message';
import { getDeleteUserAtomMessage } from '../message';
import { getRandomItem } from '../utils';

export const warnObsceneMessages = [
  '🧾 Будь ласка, утримайтеся від використання нецензурної лексики. Ми сподіваємося на вашу уважність до вибору слів.',
  '🧾 Звертаємо вашу увагу на неприпустимі вислови в вашому повідомленні. Будьте обережнішими у майбутньому.',
  '🧾 Ваше останнє повідомлення містило образливий вміст. Прохання уникати подібних слів в майбутньому.',
  '🧾 Вибачте, але використання ненормативної лексики не відповідає правилам чату. Просимо бути більш ввічливими.',
  '🧾 Важливе повідомлення: зверніть увагу на вміст вашого повідомлення та уникайте некоректних слів.',
  "🧾 Ваше повідомлення містило слова, які можуть образити інших учасників. Пам'ятайте про культурне спілкування.",
  '🧾 Прохання не використовувати образливі вислови у чаті. Ми цінуємо позитивну атмосферу серед учасників.',
  '🧾 Згідно з правилами, недоречна лексика в чаті не допускається. Будьте уважні до своїх слів.',
  '🧾 Ви використали слова, які можуть завдати образи іншим. Прохання бути обережнішими у майбутньому.',
  '🧾 Ми просимо утриматися від використання ненормативної лексики та образливих слів. Дякуємо за розуміння.',
  '🧾 Вітаємо! Ми б хотіли нагадати вам, що використання ненормативної лексики не відповідає стандартам цього чату. Будь ласка, утримуйтеся від таких слів. Дякуємо за розуміння! 🙏',
  '🧾 Важливе звернення до вас! Ми стежимо за вмістом чату і хотіли б зазначити, що деякі слова з вашого останнього повідомлення можуть образити інших користувачів. Просимо бути обережнішими у виборі слів. Дякуємо! 🌟',
  '🧾 Доброго дня! Звертаємо вашу увагу на те, що використання нецензурної лексики призводить до негативної атмосфери в чаті. Ми б дуже цінили, якщо ви утримуватиметесь від таких слів у майбутньому. Дякуємо за співпрацю! 🚯',
  '🧾 Ваша увага, будь ласка! Ваше попереднє повідомлення містило деякі некоректні вислови. Ми закликаємо вас бути обізнаними у виборі слів, щоб спілкування залишалося приємним для всіх учасників. Дякуємо! 🤝',
  '🧾 Привіт! Ми хотіли б попередити вас, що використання образливих слів не є відповідним в цьому чаті. Просимо дотримуватися правил ввічливого спілкування. Дякуємо за розуміння! 🙅‍♂️',
  '🧾 Важлива інформація для вас! Недавнє повідомлення містило деякі неприпустимі слова. Ми попереджаємо вас, щоб у майбутньому уникати використання такої лексики. Дякуємо за співпрацю! 🗒️',
  '🧾 Добрий день! Бажаємо нагадати, що використання ненормативної лексики може впливати на загальний тон спілкування. Ми сподіваємося на вашу уважність та звернення до культурного спілкування. Дякуємо! 🌷',
  '🧾 Звертаємо вашу увагу на те, що образливі слова можуть створювати напруженість у чаті. Просимо вас бути толерантними та вибирати адекватну лексику. Дякуємо за розуміння! 🚮',
  '🧾 Ваше повідомлення було помічене через використання нецензурної лексики. Ми закликаємо вас вибирати більш ввічливі слова, щоб зберегти позитивну атмосферу в чаті. Дякуємо за співпрацю! 🌈',
  "🧾 Будь ласка, пам'ятайте про правила чату та уникайте використання нецензурної лексики. Дякуємо за розуміння! 😊",
  '🧾 Важливе повідомлення: нам важливо зберегти приємну атмосферу в чаті. Прохання утримуватися від образливих слів. 👍',
  '🧾 Згідно зі стандартами спілкування в чаті, просимо уникаєте використання ненормативної лексики та негідних висловів. Дякуємо! 🌻',
  '🧾 Ваші слова можуть вплинути на загальний тон спілкування. Будь ласка, бережіть позитивну атмосферу, уникаючи неприпустимих висловів. 🌈',
  '🧾 Ми цінуємо культурне спілкування. Просимо вас бути обережнішими з вибором слів, щоб уникнути образ та негативу. 🙏',
  '🧾 Прохання не використовувати лайки та ненормативну лексику в чаті. Ми прагнемо до позитивної та ввічливої взаємодії. 🌟',
  '🧾 Звертаємо вашу увагу на важливість збереження гідності в спілкуванні. Просимо вас уникати ненормативних слів та образливого контенту. 🌷',
  "🧾 Ми вдячні за вашу активність у чаті! Пам'ятайте, що використання образливих слів може негативно вплинути на інших учасників. Дякуємо за розуміння. 🤗",
  '🧾 Бажаємо нагадати, що використання негідних слів не відповідає нашій меті створення позитивного співтовариства. Будьте толерантними та ввічливими. 🚯',
  '🧾 Згідно з політикою чату, нам важливо підтримувати відповідну атмосферу. Прохання утримуватися від неприпустимих слів у спілкуванні. Дякуємо! 🌞',
  '🧾 Поважаймо інших учасників чату та уникаймо використання нецензурної лексики. Давайте створимо приємну атмосферу разом! 🌼',
  '🧾 Згідно з правилами, ми просимо вас обходитися без образливих слів та висловів. Дякуємо за розуміння і співпрацю! 👏',
  '🧾 Прошу звернути увагу на важливість дотримання норм чату. Будь ласка, уникайте ненормативної лексики в повідомленнях. 🚫',
  '🧾 Ваше спілкування важливе для нас! Вас просять уникати використання слів, які можуть образити інших учасників. Дякуємо за розуміння! 😇',
  '🧾 Завжди приємно спілкуватися в ввічливій атмосфері. Будьте обережні зі словами та уникайте ненормативної лексики. 🌸',
  '🧾 Дорогі учасники чату, нагадуємо, що слова мають силу. Будь ласка, вибирайте слова, які сприяють позитивному спілкуванню. 🌞',
  "🧾 Пам'ятаймо, що культурне спілкування важливе для збереження гармонії в чаті. Будьте уважні до своїх висловлювань. 👍",
  '🧾 Надмірна лайка, супроводжена нецензурними словами, не є прийнятною формою взаємодії. Заохочуємо до ввічливого спілкування. 🤝',
  '🧾 Дружня нагадування: будь ласка, уникайте ненормативних слів та образ. Разом ми можемо зробити чат приємнішим для всіх. 🌷',
  '🧾 Шановні учасники, давайте дотримуватимемося високих стандартів спілкування. Вибираймо вічливі слова та уникаймо негідних висловів. 🌟',
  '🧾 "Слова - то зброя в руках мудрого, а нецензурні - позначка на низькому духовному рівні." - Тарас Шевченко наголошує на виборі висловлювань.',
  '🧾 "Словами гріх говорити, як не доведеться." - Іван Франко попереджає про можливі наслідки невідповідної мови.',
  '🧾 "Не гордись лайкою, несиленною мовою,\nХай ліпшими словами душу вдостою ти відзначиш." - Ліна Костенко надихає вибрати гідні слова.',
  '🧾 "Заплутане слово, наче образ грубий,\nМоже зруйнувати дружбу, як гарний дім вогонь." - Василь Симоненко попереджає про небезпеку образ.',
  '🧾 "Слово - мов той стрілець, в якого сага є злою,\nБудьмо ж мудріші, обережніші у виборі слова." - Богдан-Ігор Антонич наголошує на обачності.',
  '🧾 "Лайка не врятує від проблем та бід,\nА слова вишукані - це справжній багатир у спілкуванні." - Іван Драч радить обирати мову мудрості.',
  '🧾 "Слово має крила, але слово грубе\nПороджує рану, що довго не загоюється." - Олесь Гончар попереджає про вплив слів.',
  '🧾 "Лайкою ранять слова нечемні, сухі,\nА мовою чистою красиві будемо ми." - Василь Стус підкреслює важливість етики в мовленні.',
  '🧾 "Слово розумне замість грубого слова\nТак само, як сонце, гріє, але не пече." - Марія Башкирцева заохочує до розумного вибору слів.',
  '🧾 "Образливі слова - недолугі стрільці,\nА добре обрані слова - магія душі." - Олена Теліга вірить у силу культурного спілкування.',
  '🧾 "Мовчіть, розуміючи, що брудні слова\nЯк гній моральний, знищують душевний цвіт." - Лесі Українки вчить уникати грубощів.',
  '🧾 "Слова, які ганьблять, уникайте завжди,\nБо краще ніж словами ганьбити - словами людей вдягти." - Тарас Шевченко запрошує вибрати слова мудрості.',
];

export const deleteObsceneMessages = [
  '🧼 На жаль, ваше повідомлення не відповідає стандартам чату та містить недоречний вміст. 🚫',
  '🧼 Ми створюємо позитивне співтовариство, тому повідомлення з нецензурною лексикою було видалено. 🌟',
  '🧼 Ваше повідомлення містило слова, які порушують правила поведінки в чаті. 🤐',
  '🧼 Відповідно до правил чату, ми видаляємо повідомлення з образливим вмістом, як у вашому випадку. 🗑️',
  '🧼 Ваше повідомлення містило некоректні вислови, через що ми були змушені його видалити. 😕',
  '🧼 Порушення норм чату з ненормативною лексикою призвело до видалення вашого повідомлення. 🙅‍♀️',
  '🧼 Ваше повідомлення було видалено через негідний вміст, що порушує наші правила. 🛑',
  '🧼 Ми прагнемо забезпечити відповідне спілкування, тому були змушені видалити ваше повідомлення. 🚯',
  '🧼 Вибачте, але ваше повідомлення містило неприпустимі слова, через що воно було видалено. ❌',
  '🧼 Ваше повідомлення порушило правила чату та містило некоректний вміст, тому його було видалено. 🧹',
  '🧼 Ваше повідомлення містило некоректний вміст та було видалено з метою збереження чистоти діалогу.',
  '🧼 Нажаль, ми були змушені видалити ваше повідомлення, оскільки воно не відповідає стандартам ввічливості та поваги до інших користувачів.',
  '🧼 Ваше повідомлення було позначене як неприйнятне у змісті, тому воно було видалено з чату.',
  '🧼 З метою підтримання позитивної атмосфери, було вирішено видалити ваше повідомлення через його нецензурний характер.',
  '🧼 Вибачте, але ваше повідомлення містило неприпустимі вислови, тому ми видалили його.',
  '🧼 Повідомлення було видалено через образливий вміст, який не відповідає нормам поведінки у чаті.',
  '🧼 Ваше останнє повідомлення містило слова, які несуть негативне навантаження, тому воно було видалено.',
  '🧼 Згідно з правилами чату, ми не допускаємо використання образливих слів та нецензурної лексики. Ваше повідомлення було видалено.',
  '🧼 Вибачте за незручності, але ми вирішили видалити ваше повідомлення через його неприйнятний вміст.',
  '🧼 Ваше повідомлення містило слова, які можуть образити інших користувачів. Ми видалили його для забезпечення ввічливого спілкування.',
  '🧼 Ваше повідомлення містило ненормативну лексику, тому ми змушені були його видалити.',
  '🧼 Вибачте, але ваше повідомлення містило вислови, які не відповідають культурним стандартам. Воно було видалено.',
  '🧼 Ваш коментар було видалено через образливий характер. Прохання дотримуватися ввічливості у спілкуванні.',
  '🧼 Нажаль, ваше повідомлення порушило правила чату та було видалено з метою підтримки адекватної атмосфери.',
  '🧼 Вибачте за незручності, але ми видалили ваше повідомлення через його неприйнятний вміст.',
  '🧼 Ваше повідомлення містило нецензурні вислови, що не відповідає нашим стандартам. Воно було видалено.',
  '🧼 Повідомлення було видалено, оскільки воно містило слова, які можуть завдати образи іншим учасникам чату.',
  '🧼 Ми прагнемо до спілкування в атмосфері поваги та толерантності. Тому ваше повідомлення було видалено через його негідний характер.',
  '🧼 Наш чат відкритий для всіх, і ми прагнемо до позитивного спілкування. Ваше повідомлення було видалено через некоректний вміст.',
  '🧼 Вибачте за втручання, але ми видалили ваше повідомлення, оскільки воно містило ненормативні слова, які можуть образити інших.',
  '🧼 Ваше повідомлення було видалено, адже, як казав Тарас Шевченко: "Слова - наче стрілець, а язик - наче лук".',
  '🧼 Вибачте, ваше повідомлення містило нецензурні вислови, і, як казав Леся Українка: "Мовою своєю людина визначається".',
  '🧼 "Не варто вимовляти слова груба, як мудрий Тарас Шевченко казав. Давайте підтримувати культурний спілкування", - тому ваше повідомлення було видалено.',
  '🧼 "Слово образливе - наче багнюкаючий меч", - писав Іван Франко. Ваше повідомлення містило образи, тому воно було видалено.',
  '🧼 Як казала Ліна Костенко: "Все те, що зле сказано, не говорімо", тому ваше повідомлення було видалено через його неприйнятний характер.',
  '🧼 "Вибачте, але нам важливо підтримувати культурне спілкування в чаті. Ваше повідомлення було видалено", - повідомили вам з віршем Василя Симоненка.',
  '🧼 "Слова, наче перли на нитці, зберігаймо чистими", - наголошував Іван Драч. Ваше повідомлення містило образи, тому воно було видалено.',
  '🧼 "Мовчання мовчанню різні образи", - писав Павло Тичина. Ваше повідомлення було видалено, адже воно містило негативні слова.',
  '🧼 "Зачинати гармонію треба зі слів", - казав Володимир Сосюра. Ваше повідомлення було видалено через його неприйнятний характер.',
  '🧼 "В слові моєму воля та воля мого слова", - писав Іван Франко. Ваше повідомлення містило слова, що не відповідають культурним нормам, тому воно було видалено.',
];

export interface DeleteObsceneMessageProperties extends DeleteMessageAtomProperties {
  word: string;
}

export const getWarnObsceneMessage = () => getRandomItem(warnObsceneMessages);

export const getDeleteObsceneMessage = ({ writeUsername, userId, word }: DeleteObsceneMessageProperties) => `
${getDeleteUserAtomMessage({ writeUsername, userId })} по слову "${word}"

${getRandomItem(deleteObsceneMessages)}
`;