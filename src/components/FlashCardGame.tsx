import React, { ComponentProps, useMemo, useState } from 'react'
import { Blend } from '../blends'
import { shuffle } from '../utils'
import { VowelBlank } from './VowelBlank'

export interface FlashCardGameProps extends ComponentProps<'div'> {
  list: Blend[]
  label: string
  competitors?: { name: string; color: string }[]
  onExit(): void
}

const backgrounds = {
  emerald: 'bg-emerald-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
}

const texts = {
  emerald: 'text-emerald-500',
  red: 'text-red-500',
  orange: 'text-orange-500',
  teal: 'text-teal-500',
}

const singlePlayerCompetition = [
  { name: 'Correct', color: 'emerald' },
  { name: 'Wrong', color: 'red' },
]

export const FlashCardGame = ({
  className = '',
  list,
  label,
  competitors,
  onExit,
  ...props
}: FlashCardGameProps) => {
  const competitorList = competitors ?? singlePlayerCompetition
  const lowerLabel = label.toLowerCase()
  const isLeadingBlend = lowerLabel.includes('leading')
  const isMiddleBlend = lowerLabel.includes('middle')
  const isEndingBlend = lowerLabel.includes('ending')
  const shuffledList = useMemo(() => shuffle(list), [list])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState(() =>
    competitorList.reduce<Record<string, string[]>>(
      (r, competitor) => ({ ...r, [competitor.name]: [] }),
      {}
    )
  )

  return (
    <div
      className={`${className} h-screen w-screen flex flex-col items-stretch justify-between relative`}
      {...props}
    >
      <button className="absolute top-4 left-4" onClick={(e) => onExit()}>
        ⬅ {label}
      </button>
      {index < shuffledList.length ? (
        <>
          <div className="text-[15vw] text-center my-auto">
            {(isEndingBlend || isMiddleBlend) && (
              <VowelBlank key={shuffledList[index].blend} />
            )}
            {shuffledList[index].blend}
            {(isLeadingBlend || isMiddleBlend) && (
              <VowelBlank key={shuffledList[index].blend} />
            )}
          </div>
          <div className="flex min-h-60">
            {competitorList.map((competitor) => (
              <button
                className={`relative w-1/2 h-60 text-white text-6xl flex-center flex-col ${
                  backgrounds[competitor.color]
                }`}
                onClick={() => {
                  setIndex((i) => i + 1)
                  setResults((r) => ({
                    ...r,
                    [competitor.name]: r[competitor.name].concat([
                      shuffledList[index].blend,
                    ]),
                  }))
                }}
              >
                <span>{competitor.name}</span>
                <span className="mt-4">{results[competitor.name].length}</span>
              </button>
            ))}
          </div>
        </>
      ) : competitors ? (
        <>
          <div className="my-auto text-3xl text-center">
            {multiPlayerMessage(results)}
          </div>
          <div className="flex justify-evenly items-center h-60 text-6xl">
            {competitorList.map((competitor) => (
              <span className={texts[competitor.color]}>
                {[competitor.name]}: {results[competitor.name].length}
              </span>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="my-auto text-3xl text-center">
            {singlePlayerMessage(results.Correct.length, shuffledList.length)}
          </div>
          <div className="flex justify-evenly items-center h-60 text-6xl">
            <span className="text-emerald-500">
              Correct: {results.Correct.length}
            </span>
            <span>
              {Math.floor((results.Correct.length / shuffledList.length) * 100)}
              %
            </span>
            <span className="text-red-500">Wrong: {results.Wrong.length}</span>
          </div>
        </>
      )}
    </div>
  )
}

const singlePlayerMessage = (correct: number, total: number) => {
  const percentage = correct / total

  switch (true) {
    case percentage === 1:
      return 'Amazing! You were Perfect!'
    case percentage > 8.9:
      return 'Well Done!'
    case percentage > 7.9:
      return 'Study up!'
    default:
      return 'Yikes, needs some work!'
  }
}

const multiPlayerMessage = (results: Record<string, string[]>) => {
  const ordered = Object.keys(results)
    .map((name) => ({ name, total: results[name].length }))
    .sort((a, b) => b.total - a.total)

  const ties = ordered.filter(({ total }, i, arr) => total === arr[0].total)

  if (ties.length > 1) {
    return `${ties
      .map(({ name }) => name)
      .slice(0, -1)
      .join(', ')} and ${ties.at(-1)?.name} tie with ${ties.at(0)}`
  }

  const winner = ordered[0]

  return `${winner.name} wins with ${winner.total}`
}
