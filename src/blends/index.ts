import leadingBlendsJSON from './leading-blends.json'
import endingBlendsJSON from './ending-blends.json'
import middleBlendsJSON from './middle-blends.json'
import vowelCombosJSON from './vowel-combos.json'

export interface Blend {
  blend: string
  frequency: number
}

const leadingBlends: Blend[] = Object.keys(leadingBlendsJSON)
  .map((key) => ({ blend: key, frequency: leadingBlendsJSON[key] }))
  .sort((a, b) => b.frequency - a.frequency)
const endingBlends: Blend[] = Object.keys(endingBlendsJSON)
  .map((key) => ({
    blend: key,
    frequency: endingBlendsJSON[key],
  }))
  .sort((a, b) => b.frequency - a.frequency)
const middleBlends: Blend[] = Object.keys(middleBlendsJSON)
  .map((key) => ({
    blend: key,
    frequency: middleBlendsJSON[key],
  }))
  .sort((a, b) => b.frequency - a.frequency)
const vowelBlends: Blend[] = Object.keys(vowelCombosJSON)
  .map((key) => ({
    blend: key,
    frequency: vowelCombosJSON[key],
  }))
  .sort((a, b) => b.frequency - a.frequency)

export const leading2 = leadingBlends.filter(({ blend }) => blend.length === 2)
export const leading3 = leadingBlends.filter(({ blend }) => blend.length === 3)
export const leading4plus = leadingBlends.filter(({ blend }) => blend.length > 3)

export const ending2 = endingBlends.filter(({ blend }) => blend.length === 2)
export const ending3 = endingBlends.filter(({ blend }) => blend.length === 3)
export const ending4plus = endingBlends.filter(({ blend }) => blend.length > 3)

export const middle2 = middleBlends.filter(({ blend }) => blend.length === 2)
export const middle3 = middleBlends.filter(({ blend }) => blend.length === 3)
export const middle4plus = middleBlends.filter(({ blend }) => blend.length > 3)

export const vowel2 = vowelBlends.filter(({ blend }) => blend.length === 2)
export const vowel3 = vowelBlends.filter(({ blend }) => blend.length === 3)
export const vowel4plus = vowelBlends.filter(({ blend }) => blend.length > 3)
