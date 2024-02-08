import React, { useState } from 'react'
import { render } from 'react-dom'
import { PickFromBlendLists } from './components/PickFromBlendLists'
import {
  ending2,
  ending3,
  ending4plus,
  leading2,
  leading3,
  leading4plus,
  middle2,
  middle3,
  middle4plus,
  vowel2,
  vowel3,
  vowel4plus,
} from './blends'
import { FlashCardGame } from './components/FlashCardGame'
import { QualifyBlendList } from './components/QualifyBlendList'
import { Button, TextInput, Toggle, useRememberedState } from '@8thday/react'

interface Competitor {
  name: string
  color: string
}

const MAX_PLAYERS = 4

const listOptions = [
  { label: '2-Letter Leading Blends', list: leading2 },
  { label: '3-Letter Leading Blends', list: leading3 },
  { label: '4+-Letter Leading Blends', list: leading4plus },
  { label: '2-Letter Ending Blends', list: ending2 },
  { label: '3-Letter Ending Blends', list: ending3 },
  { label: '4+-Letter Ending Blends', list: ending4plus },
  { label: '2-Letter Middle Blends', list: middle2 },
  { label: '3-Letter Middle Blends', list: middle3 },
  { label: '4+-Letter Middle Blends', list: middle4plus },
  { label: '2-Letter Vowel Combos', list: vowel2 },
  { label: '3-Letter Vowel Combos', list: vowel3 },
  { label: '4+-Letter Vowel Combos', list: vowel4plus },
]

export const App = () => {
  const [blends, setBlends] = useState<(typeof listOptions)[number] | null>(null)
  const [blendsToPlay, setBlendsToPlay] = useRememberedState('pfc-blends-to-play', blends)
  const [singlePlayer, setSinglePlayer] = useRememberedState('pfc-single-player-mode', true)
  const [competitors, setCompetitors] = useRememberedState<Competitor[]>('pfc-competitors', [])

  return (
    <main className="flex flex-wrap">
      {blendsToPlay ? (
        <FlashCardGame
          competitors={singlePlayer ? undefined : competitors}
          list={blendsToPlay.list}
          label={blendsToPlay.label}
          onExit={() => setBlendsToPlay(null)}
        />
      ) : (
        <>
          <Toggle
            rightLabel="Single Player Mode"
            leftLabel="Multiplayer Mode"
            className="w-full my-6"
            checked={singlePlayer}
            setChecked={setSinglePlayer}
          />
          <PickFromBlendLists heading="Choose a blend list" options={listOptions} onPick={(o) => setBlends(o)} />
          <div className="p-4 flex flex-nowrap justify-around">
            {blends && (
              <QualifyBlendList blends={blends} onConfirm={(list) => setBlendsToPlay({ label: blends.label, list })} />
            )}
          </div>
          {!singlePlayer && (
            <div className="p-4 flex flex-col gap-2">
              {competitors.map((competitor, i) => (
                <div className="border border-primary-200 p-2 rounded-md">
                  <TextInput
                    label="Name"
                    collapseDescriptionArea
                    value={competitor.name}
                    onChange={(e) =>
                      setCompetitors((cs) =>
                        cs.map((c, idx) => (i === idx ? { name: e.target.value, color: c.color } : c))
                      )
                    }
                  />
                  <label>
                    Color
                    <input
                      className="block mb-2"
                      type="color"
                      value={competitor.color}
                      onChange={(e) =>
                        setCompetitors((cs) =>
                          cs.map((c, idx) => (i === idx ? { name: c.name, color: e.target.value } : c))
                        )
                      }
                    />
                  </label>
                  <Button
                    variant="destructive"
                    onClick={() => setCompetitors((cmps) => cmps.filter((_, ix) => i !== ix))}
                  >
                    Remove Competitor
                  </Button>
                </div>
              ))}
              {competitors.length < MAX_PLAYERS && (
                <Button
                  onClick={() =>
                    setCompetitors((cpts) =>
                      cpts.concat([
                        {
                          name: '',
                          color: '#ffffff',
                        },
                      ])
                    )
                  }
                >
                  Add Competitor
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}

render(<App />, document.getElementById('app'))
