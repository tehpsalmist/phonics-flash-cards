import React, { ComponentProps, useState } from 'react'

export interface PickFromBlendListsProps<T> extends ComponentProps<'div'> {
  options: T[]
  onPick(t: T): void
  heading: string
}

export const PickFromBlendLists = <T extends { label: string }>({
  className = '',
  options,
  onPick,
  heading,
  ...props
}: PickFromBlendListsProps<T>) => {
  const [selected, setSelected] = useState('')

  return (
    <div className={`${className} flex flex-col items-start p-2`} {...props}>
      <h3 className="text-2xl text-indigo-500 mb-4">{heading}</h3>
      <ul className="flex flex-col items-start space-y-2">
        {options.map((l) => (
          <button
            className={`flex justify-between items-center py-2 px-4 bg-indigo-50 w-full text-left rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-800`}
            onClick={(e) => {
              onPick(l)
              setSelected(l.label)
            }}
          >
            {l.label}
            {
              <span
                className={`ml-2 ${
                  selected === l.label ? 'visible' : 'invisible'
                }`}
              >
                ✅
              </span>
            }
          </button>
        ))}
      </ul>
    </div>
  )
}
