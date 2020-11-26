import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { PlayArrowRounded, PauseRounded, SkipPreviousRounded, SkipNextRounded, MusicNote} from '@material-ui/icons'
import songs from './songs'
import { IconButton, Slider } from '@material-ui/core'
import { formatTime } from './utils'

 let currentIndex = 0

function App() {
  const audioRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState(songs[currentIndex])
  const [time, setTime] = useState(null)
  const [duration, setDuration] = useState(0)
  const [slideValue, setSlideValue] = useState(null)

  useEffect(() => {
    audioRef.current.volume = 0.5
  }, [])

  useEffect(() => {
    if(isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }

 

    setInterval(() => {
      // bad practice but can't think of any other way
      setSlideValue(audioRef.current.currentTime)
      setTime(Math.round(audioRef.current.currentTime))
      setDuration(Math.round(audioRef.current.duration))

      if(audioRef.current.ended) {
        handleNext()
      }
    }, 100)
  })
      

  function handleNext() {
    if(currentIndex < songs.length - 1) {
      ++currentIndex
      setCurrentSong(songs[currentIndex])
    }
  }

  function handlePrevious() {
    if(currentIndex > 0) {
      --currentIndex
      setCurrentSong(songs[currentIndex])
    }
  }

  function handleSlideChange(e, newValue) {
    audioRef.current.currentTime = newValue
  }

  return (
    <div className="App container">

      <audio ref={audioRef} src={currentSong.file}></audio>

      <div className={`image ${isPlaying&& 'scale'}`}>
        <MusicNote />
      </div>

      <p className='title'>{currentSong.title}</p>
      <p className='author'>{currentSong.author}</p>

      <Slider
        color='secondary'
        value={slideValue}
        min={0}
        step={1}
        max={duration}
        onChange={handleSlideChange}
      />

      <div className='time'>
        <span>{formatTime(time)}</span>
        <span>{duration&& formatTime(duration)}</span>
      </div>

      <div className='controls'>
        <IconButton onClick={handlePrevious}>
          <SkipPreviousRounded />
        </IconButton>

        <div className='play'>
          {
            isPlaying? 
            <IconButton onClick={() => setIsPlaying(false)}>
              <PauseRounded />
            </IconButton> :
            <IconButton onClick={() => setIsPlaying(true)}>
              <PlayArrowRounded />
            </IconButton>
          }
        </div>

        <IconButton onClick={handleNext}>
          <SkipNextRounded />
        </IconButton>
      </div>
    </div>
  );
}

export default App;
