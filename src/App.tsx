import Player from './Player';
import './App.css';
import { ChangeEvent, useState } from 'react';
import { isEmpty } from './utils';

function App() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setFiles(Array.from(files as ArrayLike<File>))
  }

  return (
    <div className="App">
      {
        isEmpty(files) ?
        <input 
          type="file" 
          multiple 
          onChange={handleFilesSelect} 
        /> :
        <Player 
          sources={files.map(file => URL.createObjectURL(file))}
        />
      }
    </div>
  );
}

export default App;
