export const shuffle = <T>(list: T[]) => {
  const mutableList = [...list]
  const shuffledList: T[] = []

  while (mutableList.length) {
    shuffledList.push(
      ...mutableList.splice(Math.floor(Math.random() * mutableList.length), 1)
    )
  }

  return shuffledList
}
