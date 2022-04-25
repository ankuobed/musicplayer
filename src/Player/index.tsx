import React, { useState, ChangeEvent, useMemo } from 'react';
import './style.css';
import { 
  PlayArrowRounded, 
  PauseRounded, 
  SkipPreviousRounded, 
  SkipNextRounded, 
  MusicNote
} from '@material-ui/icons'
import { Howl } from 'howler'
import { IconButton, Slider } from '@material-ui/core'
import { formatTime } from '../utils'

interface Props {
  sources: string[];
}

const Player: React.FC<Props> = ({ sources }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [currentIndex, setCurrentIndex] = useState(0)

  const audio = useMemo(() => {
    return new Howl({
      src: sources[currentIndex],
      volume: 0.4,
      format: 'mp3',
      onplay: () => {
        setIsPlaying(true)
        setTime(audio.seek())
        setInterval(() => {
          setTime(audio.seek())
        }, 1000)
      },
      onpause: () => {
        setIsPlaying(false)
      },
      onend: () => {
        handleNext()
      },
      onseek: () => {
        setTime(audio.seek())
      },
      onload: () => {
        setDuration(audio.duration())
        if(isPlaying) {
          audio.play()
        }
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, sources])

  const handleSeek = (_: ChangeEvent<{}>, value: number | number[]) => {
    if(!Array.isArray(value)) {
      audio.seek(value)
    }
  }

  const handlePrevious = () => {
    if(currentIndex > 0) {
      audio.unload()
      setCurrentIndex(index => index - 1)
    } else {
      audio.seek(0)
    }
  }

  const handleNext = () => {
    if(currentIndex < sources.length - 1) {
      audio.unload()
      setCurrentIndex(index => index + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  return (
    <div className="container">
      <div className={`image ${isPlaying && 'scale'}`}>
        <MusicNote />
      </div>

      <p className='title'>Title</p>
      <p className='author'>Artiste</p>

      <Slider
        color='secondary'
        value={time}
        min={0}
        step={1}
        max={duration}
        onChange={handleSeek}
      />

      <div className='time'>
        <span>{formatTime(time as number)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className='controls'>
        <IconButton onClick={handlePrevious}>
          <SkipPreviousRounded />
        </IconButton>

        <div className='play'>
          {
            isPlaying? 
            <IconButton onClick={() => audio.pause()}>
              <PauseRounded />
            </IconButton> :
            <IconButton onClick={() => audio.play()}>
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

export default Player;
