import Player from './Player';
import './App.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { isEmpty } from './utils';
import { fromFile } from 'id3js';
import { Song } from './types'

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [musicData, setMusicData] = useState<Song[]>([])
 
  useEffect(() => {
      const f = Promise.all(files.map(async file => {
        const data = await fromFile(file);
        const imageButter = (data?.images as any[])[0].data;
        const blob = new Blob([imageButter])
        const imageSrc = URL.createObjectURL(blob);

        return {
          src: URL.createObjectURL(file),
          title: data?.title || '',
          artist: data?.artist || '',
          image: imageSrc
        }
      }))

      f.then(data => setMusicData(data))
  }, [files])

  const handleFilesSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setFiles(Array.from(files as ArrayLike<File>))
  }

  const handlePrevious = () => {
    if(currentIndex > 0) {
      setCurrentIndex(index => index - 1)
    }
  }

  const handleNext = () => {
    if(currentIndex < files.length - 1) {
      setCurrentIndex(index => index + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  return (
    <div className="App">
      {
        isEmpty(musicData) ?
        <input 
          type="file" 
          multiple 
          onChange={handleFilesSelect} 
        /> :
        <Player 
          song={musicData[currentIndex]}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      }
    </div>
  );
}

export default App;
