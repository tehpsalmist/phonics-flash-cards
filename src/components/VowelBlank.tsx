import React, { ComponentProps, useState } from 'react'

const vowels = ['', 'a', 'e', 'i', 'o', 'u']
const vowelsExtended = ['', 'a', 'e', 'i', 'o', 'u', 'y', 'w']

export interface VowelBlankProps extends ComponentProps<'span'> {
  extendedVowels?: boolean
}

export const VowelBlank = ({
  className = '',
  extendedVowels = false,
  ...props
}: VowelBlankProps) => {
  const [vowel, setVowel] = useState('')

  const advanceVowel = () => {
    const list = extendedVowels ? vowelsExtended : vowels

    setVowel(list[(list.findIndex((v) => v === vowel) + 1) % list.length])
  }

  return (
    <span
      className={`${className} relative focus:outline-none border border-dashed border-transparent focus:border-gray-200 rounded-md select-none`}
      {...props}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        advanceVowel()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          return advanceVowel()
        }

        if ('abcdefghijklmnopqrstuvwxyz'.includes(e.key)) {
          return setVowel(e.key)
        }
      }}
    >
      <span className="absolute inset-x-0 text-gray-400">{vowel}</span>_
    </span>
  )
}
