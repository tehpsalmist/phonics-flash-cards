import React, { useState } from 'react'
import { render } from 'react-dom'
import { PickFromBlendLists } from './components/PickFromBlendLists'
import {
  Blend,
  ending2,
  ending3,
  ending4plus,
  leading2,
  leading3,
  leading4plus,
  middle2,
  middle3,
  middle4plus,
} from './blends'
import { FlashCardGame } from './components/FlashCardGame'
import { QualifyBlendList } from './components/QualifyBlendList'

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
]

export const App = () => {
  const [blends, setBlends] = useState<typeof listOptions[number] | null>(null)
  const [blendsToPlay, setBlendsToPlay] = useState(blends)

  return (
    <main className="flex flex-nowrap">
      {blendsToPlay ? (
        <FlashCardGame
          list={blendsToPlay.list}
          label={blendsToPlay.label}
          onExit={() => setBlendsToPlay(null)}
        />
      ) : (
        <>
          <PickFromBlendLists
            heading="Choose a blend list"
            options={listOptions}
            onPick={(o) => setBlends(o)}
          />
          <div className="p-4 flex flex-nowrap justify-around">
            {blends && (
              <QualifyBlendList
                blends={blends}
                onConfirm={(list) =>
                  setBlendsToPlay({ label: blends.label, list })
                }
              />
            )}
          </div>
        </>
      )}
    </main>
  )
}

render(<App />, document.getElementById('app'))
