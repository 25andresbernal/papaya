// This file holds Papaya's story books. A story book is a short comic
// with a few pages. Each page has one Spanish sentence, the English
// sentence under it, and a picture. At the end there is one question
// with four answers, just like a mini lesson.
//
// The BIG rule: every Spanish word in every sentence has to be a word
// the kid already learned in the curriculum (src/data/curriculum.ts),
// a tiny "glue" word like "el" or "y", or the kid's name / a
// character's name. We are not allowed to sneak in brand-new words.
//
// Two things ARE allowed even though they are not an exact match for
// a curriculum word, because Spanish grammar needs them:
//   1. Simple present-tense verb forms, like "come" from "comer".
//   2. Matching a describing word (or a plural) to its noun, like
//      turning "amarillo" into "amarilla" for "la estrella".
// These are NOT new vocabulary — they are the same taught word wearing
// a different grammar "outfit". Every one used below is listed here so
// it is easy to check, and a copy of this list lives in the checker
// script that tests this file.
//
// Derived verb forms used (root curriculum word -> form used):
//   comer -> come, contar -> cuentan
// Derived agreement forms used (root curriculum word -> form used):
//   amarillo -> amarilla, rojo -> rojos, azul -> azules, verde -> verdes,
//   feliz -> felices, todo -> toda, cuántos (from cuantos-hay) -> cuántas
// Derived plural nouns used (root curriculum word -> form used):
//   la estrella -> estrellas, el corazón -> corazones,
//   el círculo -> círculos, el triángulo -> triángulos
//
// No book below needed any other "extra" word beyond names (Sofía,
// Mateo, Tico) and the small glue-word list in the checker script.

import type { Story } from '../types'

export const STORIES: Story[] = [
  // ---------------------------------------------------------------
  // Book 1 — unlocks with Unit 1 (Hello & Family)
  // ---------------------------------------------------------------
  {
    id: 'story-hola-familia',
    title: 'Hola, familia',
    titleEn: 'Hi, Family',
    unitId: 'u1',
    coverWordId: 'familia',
    blurb: 'Sofía says hello to everyone she loves.',
    pages: [
      { es: 'Hola a mi familia.', en: 'Hi to my family.', artWordId: 'familia', color: 'papaya' },
      { es: 'Aquí está mamá.', en: 'Here is mom.', artWordId: 'mama', color: 'papaya' },
      { es: 'Aquí está papá.', en: 'Here is dad.', artWordId: 'papa', color: 'papaya' },
      { es: 'Aquí está abuela.', en: 'Here is grandma.', artWordId: 'abuela', color: 'papaya' },
      { es: 'Aquí está abuelo.', en: 'Here is grandpa.', artWordId: 'abuelo', color: 'papaya' },
      { es: 'Aquí está mi hermana.', en: 'Here is my sister.', artWordId: 'hermana', color: 'papaya' },
      { es: 'Aquí está el bebé.', en: 'Here is the baby.', artWordId: 'bebe', color: 'papaya' },
      {
        es: 'Te quiero, mi familia.',
        en: 'I love you, my family.',
        artWordId: 'te-quiero',
        artWordId2: 'familia',
        color: 'papaya',
      },
    ],
    question: {
      es: "¿Quién dice 'te quiero'?",
      en: "Who says 'I love you'?",
      choices: [
        { es: 'Sofía', en: 'Sofía' },
        { es: 'Papá', en: 'Dad', artWordId: 'papa' },
        { es: 'Abuelo', en: 'Grandpa', artWordId: 'abuelo' },
        { es: 'Amigo', en: 'Friend', artWordId: 'amigo' },
      ],
      correctIndex: 0,
    },
  },

  // ---------------------------------------------------------------
  // Book 2 — unlocks with Unit 2 (Body & Routine)
  // ---------------------------------------------------------------
  {
    id: 'story-buenas-noches',
    title: 'Buenas noches, mi amor',
    titleEn: 'Good Night, My Love',
    unitId: 'u2',
    coverWordId: 'la-cama',
    blurb: 'Follow Mateo through his cozy bedtime routine.',
    pages: [
      { es: 'Buenas noches, Mateo.', en: 'Good night, Mateo.', artWordId: 'buenas-noches', color: 'sky' },
      { es: 'Mateo va a bañarse.', en: 'Mateo is going to take a bath.', artWordId: 'banarse', color: 'sky' },
      {
        es: 'Mateo va a ponerse la pijama.',
        en: 'Mateo is going to put on pajamas.',
        artWordId: 'ponerse-la-pijama',
        color: 'sky',
      },
      {
        es: 'Mateo va a cepillarse los dientes.',
        en: 'Mateo is going to brush his teeth.',
        artWordId: 'cepillarse-los-dientes',
        color: 'sky',
      },
      { es: 'Un cuento con abuela.', en: 'A story with grandma.', artWordId: 'un-cuento', artWordId2: 'abuela', color: 'sky' },
      {
        es: 'Abuela va a apagar la luz.',
        en: 'Grandma is going to turn off the light.',
        artWordId: 'apagar-la-luz',
        color: 'sky',
      },
      {
        es: 'Un abrazo y buenas noches.',
        en: 'A hug and good night.',
        artWordId: 'un-abrazo',
        artWordId2: 'buenas-noches',
        color: 'sky',
      },
      { es: 'Buenas noches, mi amor.', en: 'Good night, my love.', artWordId: 'buenas-noches', artWordId2: 'mi-amor', color: 'sky' },
    ],
    question: {
      es: '¿Quién va a apagar la luz?',
      en: 'Who is going to turn off the light?',
      choices: [
        { es: 'Abuela', en: 'Grandma', artWordId: 'abuela' },
        { es: 'Mateo', en: 'Mateo' },
        { es: 'Papá', en: 'Dad', artWordId: 'papa' },
        { es: 'El bebé', en: 'The baby', artWordId: 'bebe' },
      ],
      correctIndex: 0,
    },
  },

  // ---------------------------------------------------------------
  // Book 3 — unlocks with Unit 2 (Body & Routine)
  // ---------------------------------------------------------------
  {
    id: 'story-lavate-las-manos',
    title: 'Lávate las manos',
    titleEn: 'Wash Your Hands',
    unitId: 'u2',
    coverWordId: 'lavate-las-manos',
    blurb: 'Sofía learns why clean hands make mealtime better.',
    pages: [
      {
        es: "Abuela dice: '¡Lávate las manos!'",
        en: "Grandma says: 'Wash your hands!'",
        artWordId: 'lavate-las-manos',
        artWordId2: 'abuela',
        color: 'sky',
      },
      { es: 'Sofía, mira tus manos.', en: 'Sofia, look at your hands.', artWordId: 'las-manos', color: 'sky' },
      {
        es: 'Sofía va a lavarse las manos.',
        en: 'Sofia is going to wash her hands.',
        artWordId: 'lavate-las-manos',
        color: 'sky',
      },
      {
        es: 'Sofía va a lavarse la cara.',
        en: 'Sofia is going to wash her face.',
        artWordId: 'lavarse-la-cara',
        color: 'sky',
      },
      { es: 'Sofía está muy feliz.', en: 'Sofia is very happy.', artWordId: 'feliz', color: 'sky' },
      {
        es: 'Ahora Sofía va a desayunar.',
        en: 'Now Sofia is going to eat breakfast.',
        artWordId: 'desayunar',
        color: 'sky',
      },
      {
        es: 'La panza de Sofía está feliz.',
        en: "Sofia's tummy is happy.",
        artWordId: 'la-panza',
        artWordId2: 'feliz',
        color: 'sky',
      },
    ],
    question: {
      es: '¿Qué dice abuela?',
      en: 'What does grandma say?',
      choices: [
        { es: '¡Lávate las manos!', en: 'Wash your hands!', artWordId: 'lavate-las-manos' },
        { es: '¡Buenas noches!', en: 'Good night!', artWordId: 'buenas-noches' },
        { es: '¡Hola!', en: 'Hi!', artWordId: 'hola' },
        { es: 'Te quiero', en: 'I love you', artWordId: 'te-quiero' },
      ],
      correctIndex: 0,
    },
  },

  // ---------------------------------------------------------------
  // Book 4 — unlocks with Unit 3 (Colors & Shapes)
  // ---------------------------------------------------------------
  {
    id: 'story-de-que-color-es',
    title: '¿De qué color es?',
    titleEn: 'What Color Is It?',
    unitId: 'u3',
    coverWordId: 'la-estrella',
    blurb: 'Mateo and Tico the toucan spot colors and shapes all over the house.',
    pages: [
      {
        es: "Tico dice: '¿De qué color es?'",
        en: "Tico says: 'What color is it?'",
        artWordId: 'de-que-color-es',
        color: 'leaf',
      },
      { es: 'El círculo es rojo.', en: 'The circle is red.', artWordId: 'el-circulo', artWordId2: 'rojo', color: 'leaf' },
      { es: 'La estrella es amarilla.', en: 'The star is yellow.', artWordId: 'la-estrella', artWordId2: 'amarillo', color: 'leaf' },
      {
        es: 'El triángulo es verde.',
        en: 'The triangle is green.',
        artWordId: 'el-triangulo',
        artWordId2: 'verde',
        color: 'leaf',
      },
      {
        es: 'El corazón es rojo y grande.',
        en: 'The heart is red and big.',
        artWordId: 'el-corazon',
        artWordId2: 'grande',
        color: 'leaf',
      },
      { es: '¿Cuál prefieres, Tico?', en: 'Which do you prefer, Tico?', artWordId: 'cual-prefieres', color: 'leaf' },
      {
        es: "Mateo dice: 'Me gusta el azul.'",
        en: "Mateo says: 'I like blue.'",
        artWordId: 'me-gusta',
        artWordId2: 'azul',
        color: 'leaf',
      },
      {
        es: 'Azul es mi color favorito.',
        en: 'Blue is my favorite color.',
        artWordId: 'mi-favorito',
        artWordId2: 'el-color',
        color: 'leaf',
      },
    ],
    question: {
      es: '¿Cuál es el color favorito de Mateo?',
      en: "What is Mateo's favorite color?",
      choices: [
        { es: 'Azul', en: 'Blue', artWordId: 'azul' },
        { es: 'Rojo', en: 'Red', artWordId: 'rojo' },
        { es: 'Verde', en: 'Green', artWordId: 'verde' },
        { es: 'Amarillo', en: 'Yellow', artWordId: 'amarillo' },
      ],
      correctIndex: 0,
    },
  },

  // ---------------------------------------------------------------
  // Book 5 — unlocks with Unit 4 (Numbers & Counting)
  // ---------------------------------------------------------------
  {
    id: 'story-uno-dos-tres',
    title: 'Uno, dos, tres',
    titleEn: 'One, Two, Three',
    unitId: 'u4',
    coverWordId: 'contar',
    blurb: 'Count from one to ten with Sofía and abuela.',
    pages: [
      { es: "Abuela dice: '¿Cuántos hay?'", en: "Grandma says: 'How many are there?'", artWordId: 'cuantos-hay', color: 'sun' },
      { es: 'Uno, dos, tres estrellas.', en: 'One, two, three stars.', artWordId: 'la-estrella', artWordId2: 'tres', color: 'sun' },
      { es: 'Cuatro corazones rojos.', en: 'Four red hearts.', artWordId: 'el-corazon', artWordId2: 'cuatro', color: 'sun' },
      { es: 'Cinco círculos azules.', en: 'Five blue circles.', artWordId: 'el-circulo', artWordId2: 'cinco', color: 'sun' },
      { es: 'Seis triángulos verdes.', en: 'Six green triangles.', artWordId: 'el-triangulo', artWordId2: 'seis', color: 'sun' },
      { es: 'Nueve y diez, ¡ya está!', en: 'Nine and ten, all done!', artWordId: 'diez', artWordId2: 'nueve', color: 'sun' },
      {
        es: 'Abuela y Sofía cuentan todos los corazones.',
        en: 'Grandma and Sofía count all the hearts.',
        artWordId: 'contar',
        artWordId2: 'todos',
        color: 'sun',
      },
    ],
    question: {
      es: '¿Cuántas estrellas hay?',
      en: 'How many stars are there?',
      choices: [
        { es: 'Tres', en: 'Three', artWordId: 'tres' },
        { es: 'Cinco', en: 'Five', artWordId: 'cinco' },
        { es: 'Diez', en: 'Ten', artWordId: 'diez' },
        { es: 'Uno', en: 'One', artWordId: 'uno' },
      ],
      correctIndex: 0,
    },
  },

  // ---------------------------------------------------------------
  // Book 6 — unlocks with Unit 5 (Food Time)
  // ---------------------------------------------------------------
  {
    id: 'story-a-comer',
    title: 'A comer',
    titleEn: 'Time to Eat',
    unitId: 'u5',
    coverWordId: 'la-arepa',
    blurb: 'Mateo and his family sit down for arepas and juice — even the dog wants a bite.',
    pages: [
      { es: "Mamá dice: '¡A comer!'", en: "Mom says: 'Time to eat!'", artWordId: 'a-comer', color: 'coral' },
      { es: 'Mateo tiene hambre.', en: 'Mateo is hungry.', artWordId: 'tengo-hambre', color: 'coral' },
      {
        es: 'Mateo quiere arepa y jugo.',
        en: 'Mateo wants an arepa and juice.',
        artWordId: 'la-arepa',
        artWordId2: 'el-jugo',
        color: 'coral',
      },
      { es: '¡Qué rico está el jugo!', en: 'The juice is so yummy!', artWordId: 'el-jugo', artWordId2: 'rico', color: 'coral' },
      { es: 'Mateo come toda la arepa.', en: 'Mateo eats the whole arepa.', artWordId: 'la-arepa', color: 'coral' },
      {
        es: 'Toda la familia está feliz.',
        en: 'The whole family is happy.',
        artWordId: 'familia',
        artWordId2: 'el-perro',
        color: 'coral',
      },
      { es: "Mateo dice: '¡Ya terminé!'", en: "Mateo says: 'I'm done!'", artWordId: 'ya-termine', color: 'coral' },
      {
        es: '¡Buen provecho, familia!',
        en: 'Enjoy your meal, family!',
        artWordId: 'buen-provecho',
        artWordId2: 'familia',
        color: 'coral',
      },
    ],
    question: {
      es: '¿Qué quiere tomar Mateo?',
      en: 'What does Mateo want to drink?',
      choices: [
        { es: 'Jugo', en: 'Juice', artWordId: 'el-jugo' },
        { es: 'Leche', en: 'Milk', artWordId: 'la-leche' },
        { es: 'Agua', en: 'Water', artWordId: 'el-agua' },
        { es: 'Chocolate caliente', en: 'Hot chocolate', artWordId: 'el-chocolate-caliente' },
      ],
      correctIndex: 0,
    },
  },

  // ---------------------------------------------------------------
  // Book 7 — unlocks with Unit 8 (My Home). Uses animals from Unit 6
  // and rooms from Unit 8, so it needed to wait for Unit 8 to open.
  // ---------------------------------------------------------------
  {
    id: 'story-donde-esta-el-gato',
    title: '¿Dónde está el gato?',
    titleEn: 'Where Is the Cat?',
    unitId: 'u8',
    coverWordId: 'el-gato',
    blurb: 'Play hide-and-seek through the house to find a sneaky cat.',
    pages: [
      { es: '¿Dónde está el gato?', en: 'Where is the cat?', artWordId: 'el-gato', color: 'leaf' },
      { es: '¿Está en la cocina?', en: 'Is he in the kitchen?', artWordId: 'la-cocina', color: 'leaf' },
      {
        es: 'No, el perro está en la cocina.',
        en: 'No, the dog is in the kitchen.',
        artWordId: 'el-perro',
        artWordId2: 'la-cocina',
        color: 'leaf',
      },
      { es: '¿Está en la sala?', en: 'Is he in the living room?', artWordId: 'la-sala', color: 'leaf' },
      {
        es: 'No, el pájaro está en la sala.',
        en: 'No, the bird is in the living room.',
        artWordId: 'el-pajaro',
        artWordId2: 'la-sala',
        color: 'leaf',
      },
      { es: '¿Está en el cuarto?', en: 'Is he in the bedroom?', artWordId: 'el-cuarto', color: 'leaf' },
      {
        es: '¡Sí! El gato está en la cama.',
        en: 'Yes! The cat is on the bed.',
        artWordId: 'el-gato',
        artWordId2: 'la-cama',
        color: 'leaf',
      },
      {
        es: 'Sofía y el gato están felices.',
        en: 'Sofía and the cat are happy.',
        artWordId: 'el-gato',
        artWordId2: 'feliz',
        color: 'leaf',
      },
    ],
    question: {
      es: '¿Dónde está el gato?',
      en: 'Where is the cat?',
      choices: [
        { es: 'En la cama', en: 'On the bed', artWordId: 'la-cama' },
        { es: 'En la cocina', en: 'In the kitchen', artWordId: 'la-cocina' },
        { es: 'En la sala', en: 'In the living room', artWordId: 'la-sala' },
        { es: 'En el baño', en: 'In the bathroom', artWordId: 'el-bano' },
      ],
      correctIndex: 0,
    },
  },

  // ---------------------------------------------------------------
  // Book 8 — unlocks with Unit 7 (Clothes & Weather)
  // ---------------------------------------------------------------
  {
    id: 'story-hace-frio',
    title: 'Hace frío',
    titleEn: "It's Cold",
    unitId: 'u7',
    coverWordId: 'la-chaqueta',
    blurb: 'Mateo bundles up for a cold day until the sun comes out.',
    pages: [
      { es: 'Hace mucho frío.', en: "It's very cold.", artWordId: 'hace-frio', color: 'sky' },
      {
        es: 'Mateo va a ponerse la camisa.',
        en: 'Mateo is going to put on his shirt.',
        artWordId: 'la-camisa',
        color: 'sky',
      },
      {
        es: 'Mateo va a ponerse el suéter.',
        en: 'Mateo is going to put on his sweater.',
        artWordId: 'el-sueter',
        color: 'sky',
      },
      {
        es: 'Mateo va a ponerse la chaqueta.',
        en: 'Mateo is going to put on his jacket.',
        artWordId: 'la-chaqueta',
        color: 'sky',
      },
      {
        es: 'Mateo va a ponerse las botas.',
        en: 'Mateo is going to put on his boots.',
        artWordId: 'las-botas',
        color: 'sky',
      },
      {
        es: '¿Me queda bien la chaqueta?',
        en: 'Does the jacket fit me well?',
        artWordId: 'me-queda-bien',
        artWordId2: 'la-chaqueta',
        color: 'sky',
      },
      { es: '¡Sí, combina bien!', en: 'Yes, it matches well!', artWordId: 'combina-bien', color: 'sky' },
      {
        es: 'Ahora hace sol, no frío.',
        en: "Now it's sunny, not cold.",
        artWordId: 'hace-sol',
        artWordId2: 'hace-frio',
        color: 'sky',
      },
    ],
    question: {
      es: '¿Qué va a ponerse Mateo primero?',
      en: 'What does Mateo put on first?',
      choices: [
        { es: 'La camisa', en: 'The shirt', artWordId: 'la-camisa' },
        { es: 'El suéter', en: 'The sweater', artWordId: 'el-sueter' },
        { es: 'La chaqueta', en: 'The jacket', artWordId: 'la-chaqueta' },
        { es: 'Las botas', en: 'The boots', artWordId: 'las-botas' },
      ],
      correctIndex: 0,
    },
  },
]

/** Find one story by its id. Used by the story screen and unlock checks. */
export function getStory(id: string): Story | undefined {
  return STORIES.find((story) => story.id === id)
}
