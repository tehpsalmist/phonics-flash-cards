import React, { useState, useEffect, useRef } from 'react'

// Thanks, Dan Abramov. https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback)
  savedCallback.current = callback

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay) {
      const id = setInterval(tick, delay)

      return () => clearInterval(id)
    }
  }, [delay])
}

export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback)
  savedCallback.current = callback

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay) {
      const id = setTimeout(tick, delay)

      return () => clearTimeout(id)
    }
  }, [delay])
}

export function useRememberedState<T>(
  key: string,
  initialValue: T | (() => T)
) {
  const currentKey = useRef(key)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)

      if (item == null) {
        const newValue =
          initialValue instanceof Function ? initialValue() : initialValue

        localStorage.setItem(key, JSON.stringify(newValue))

        return newValue
      }

      return item ? JSON.parse(item) : item
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    const valueToStore =
      typeof value === 'function' ? value(storedValue) : value

    setStoredValue(valueToStore)
    localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  useEffect(() => {
    if (key !== currentKey.current) {
      currentKey.current = key
      try {
        const item = localStorage.getItem(key)

        if (item == null) {
          const newValue =
            initialValue instanceof Function ? initialValue() : initialValue

          localStorage.setItem(key, JSON.stringify(newValue))

          setStoredValue(newValue)
        } else {
          setStoredValue(item ? JSON.parse(item) : item)
        }
      } catch (error) {
        setStoredValue(initialValue)
      }
    }
  }, [key])

  return [storedValue, setValue]
}

export const useOnlyOnce = (callback, condition = true) => {
  const hasRunOnce = useRef(false)

  if (!hasRunOnce.current && condition) {
    callback()
    hasRunOnce.current = true
  }
}

export const useEventListener = (event, callback) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const listener = (e) => callbackRef.current(e)

    window.addEventListener(event, listener)

    return () => window.removeEventListener(event, listener)
  }, [event])
}
