import { readFile, writeFile } from 'fs/promises'
import allWords from './words/all-words.json'

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]

const vowels = ['a', 'e', 'i', 'o', 'u']

const vowelMap = { a: true, e: true, i: true, o: true, u: true, y: true }

export const isVowel = (l: string): boolean => vowelMap[l]
export const isConsonant = (l: string) => !vowelMap[l]

const consonants = [
  'b',
  'c',
  'd',
  'f',
  'g',
  'h',
  'j',
  'k',
  'l',
  'm',
  'n',
  'p',
  'q',
  'r',
  's',
  't',
  'v',
  'w',
  'x',
  'y',
  'z',
]

const alphaMap = alphabet.reduce((map, letter) => ({ ...map, [letter]: true }), {})

const extract6of12 = async () => {
  const rawText = await readFile(`./raw-data/6of12.txt`, {
    encoding: 'utf-8',
  })

  const list = rawText
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t && t.split('').every((l) => alphaMap[l]))

  await writeFile(`./words/all-words.json`, JSON.stringify(list, null, 2))
}

const extractSimpleDictWords = async () => {
  for (const letter of alphabet) {
    const dictionary = require(`./raw-data/${letter}.json`)

    const list = Object.keys(dictionary)

    await writeFile(
      `./words/${letter}.json`,
      JSON.stringify(
        list.map((word) => word.toLowerCase()).filter((word) => !word.split('').some((l) => !alphaMap[l])),
        null,
        2
      )
    )
  }
}

const collateSimpleDictAllWords = async () => {
  const collatedWords = alphabet.flatMap((letter) => {
    const list: string[] = require(`./words/${letter}.json`)

    return list
  })

  await writeFile(`./words/all-words.json`, JSON.stringify(collatedWords, null, 2))
}

const leadingBlends = async () => {
  const blends = {}
  for (const word of allWords) {
    const cutoffIndex = word.split('').findIndex((l) => isVowel(l))
    const blend = word.slice(0, cutoffIndex)

    if (blend.length > 1 && cutoffIndex !== word.length - 1) {
      blends[blend] = (blends[blend] || 0) + 1
    }
  }

  await writeFile('./blends/leading-blends.json', JSON.stringify(blends, null, 2))
}

const endingBlends = async () => {
  const blends = {}
  for (const word of allWords) {
    const cutoffIndex = word
      .split('')
      .reverse()
      .findIndex((l) => isVowel(l) || l === 'w')

    if (!cutoffIndex || cutoffIndex === -1) {
      continue
    }

    const blend = word.slice(-cutoffIndex)

    if (blend.length > 1 && cutoffIndex !== word.length - 1) {
      blends[blend] = (blends[blend] || 0) + 1
    }
  }

  await writeFile('./blends/ending-blends.json', JSON.stringify(blends, null, 2))
}

const middleBlends = async () => {
  const blends = {}
  for (const word of allWords) {
    const mb = word.split(/[aeiouyw]/g).slice(1, -1)

    if (mb.length) {
      for (const blend of mb) {
        if (blend.length > 1) {
          blends[blend] = (blends[blend] || 0) + 1
        }
      }
    }
  }

  await writeFile('./blends/middle-blends.json', JSON.stringify(blends, null, 2))
}

const allVowelCombos = async () => {
  const vowelCombos = {}
  for (const word of allWords) {
    const mb = word.split(/[bcdfghjklmnpqrstvxz]/g).filter(Boolean)

    if (mb.length) {
      for (const combo of mb) {
        if (combo.length > 1) {
          vowelCombos[combo] = (vowelCombos[combo] || 0) + 1
        }
      }
    }
  }

  await writeFile('./blends/vowel-combos.json', JSON.stringify(vowelCombos, null, 2))
}

// extractSimpleDictWords().then(() => collateSimpleDictAllWords())
// leadingBlends()
// endingBlends()
// middleBlends()
// extract6of12()
// allVowelCombos()
