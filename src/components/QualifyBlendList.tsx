import React, { ComponentProps } from 'react'
import { Blend } from '../blends'
import { useRememberedState } from '../hooks'

export interface QualifyBlendListProps extends ComponentProps<'div'> {
  blends: { label: string; list: Blend[] }
  onConfirm(blends: Blend[]): void
}

export const QualifyBlendList = ({
  className = '',
  blends,
  onConfirm,
  ...props
}: QualifyBlendListProps) => {
  const [selected, setSelected] = useRememberedState(
    `blend-list-${blends.label}`,
    () =>
      blends.list.reduce(
        (map, bl) => ({ ...map, [bl.blend]: { selected: true, ...bl } }),
        {}
      )
  )

  return (
    <div className={`${className}`} {...props}>
      <h2>{blends.label}</h2>
      <button
        className="bg-emerald-200 text-emerald-700 px-4 py-2 rounded hover:opacity-80 focus:ring-emerald-500 focus:ring-2 focus:outline-none"
        onClick={() => {
          const selectedBlends = Object.keys(selected)
            .filter((k) => selected[k].selected)
            .map((k) => ({
              blend: selected[k].blend,
              frequency: selected[k].frequency,
            }))
          onConfirm(selectedBlends)
        }}
      >
        Play This List
      </button>
      <ul>
        {Object.keys(selected).map((k) => {
          const { blend, frequency, selected: isSelected } = selected[k]

          return (
            <li key={blend}>
              <label htmlFor={blend} className="text-xl">
                <input
                  id={blend}
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) =>
                    setSelected((s) => ({
                      ...s,
                      [blend]: {
                        blend,
                        frequency,
                        selected: e.target.checked,
                      },
                    }))
                  }
                />
                <span className="mx-2">{blend}</span>
                <span className="italic text-[.7em] text-gray-600">
                  ({frequency})
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
