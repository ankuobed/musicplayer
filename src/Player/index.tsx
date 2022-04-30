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
import { Song } from '../types';

interface Props {
  song: Song;
  onPrevious: () => void;
  onNext: () => void;
}

let interval: NodeJS.Timeout
let audio: Howl

const Player: React.FC<Props> = ({ song, onPrevious, onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  audio = useMemo(() => {
    // remove the currrently playing audio before loading a new one
    audio?.unload()
    clearInterval(interval)

    return new Howl({
      src: song.src,
      volume: 0.4,
      format: 'mp3',
      onplay: () => {
        setIsPlaying(true)
        setTime(audio.seek())
        interval = setInterval(() => {
          setTime(audio.seek())
        }, 1000)
      },
      onpause: () => {
        setIsPlaying(false)
      },
      onend: () => {
        onNext()
      },
      onseek: () => {
        setTime(audio.seek())
      },
      onload: () => {
        setDuration(audio.duration())
        if(isPlaying) {
          audio.play()
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song])

  const handleSeek = (_: ChangeEvent<{}>, value: number | number[]) => {
    if(!Array.isArray(value)) {
      audio.seek(value)
    }
  }

  return (
    <div className="container">
      <div className={`cover ${isPlaying && 'scale'}`}>
        {
          song.image ?
          <img src={song.image} alt={song.title} /> :
          <MusicNote />
        }
      </div>

      <p className='title'>{ song.title }</p>
      <p className='artist'>{ song.artist }</p>

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
        <IconButton onClick={() => onPrevious()}>
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

        <IconButton onClick={() => onNext()}>
          <SkipNextRounded />
        </IconButton>
      </div>
    </div>
  );
}

export default Player;
