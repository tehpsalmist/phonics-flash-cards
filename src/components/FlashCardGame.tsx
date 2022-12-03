import React, { ComponentProps, useMemo, useState } from 'react'
import { Blend } from '../blends'
import { shuffle } from '../utils'

export interface FlashCardGameProps extends ComponentProps<'div'> {
  list: Blend[]
  label: string
  onExit(): void
}

export const FlashCardGame = ({
  className = '',
  list,
  label,
  onExit,
  ...props
}: FlashCardGameProps) => {
  const shuffledList = useMemo(() => shuffle(list), [list])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState({})

  const { correctCount, wrongCount } = Object.keys(results).reduce(
    (t, k) => {
      if (results[k]) {
        t.correctCount++
      } else {
        t.wrongCount++
      }
      return t
    },
    { correctCount: 0, wrongCount: 0 }
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
            {shuffledList[index].blend}
          </div>
          <div className="flex">
            <button
              className="relative w-1/2 h-60 bg-emerald-500 text-white text-6xl"
              onClick={() => {
                setIndex((i) => i + 1)
                setResults((r) => ({ ...r, [shuffledList[index].blend]: true }))
              }}
            >
              Correct
              <span className="absolute bottom-4 right-4">{correctCount}</span>
            </button>
            <button
              className="relative w-1/2 h-60 bg-red-500 text-white text-6xl"
              onClick={() => {
                setIndex((i) => i + 1)
                setResults((r) => ({
                  ...r,
                  [shuffledList[index].blend]: false,
                }))
              }}
            >
              Wrong
              <span className="absolute bottom-4 left-4">{wrongCount}</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="my-auto text-3xl text-center">
            {resultMessage(correctCount, shuffledList.length)}
          </div>
          <div className="flex justify-evenly items-center h-60 text-6xl">
            <span className="text-emerald-500">Correct: {correctCount}</span>
            <span>
              {Math.floor((correctCount / shuffledList.length) * 100)}%
            </span>
            <span className="text-red-500">Wrong: {wrongCount}</span>
          </div>
        </>
      )}
    </div>
  )
}

const resultMessage = (correct: number, total: number) => {
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
