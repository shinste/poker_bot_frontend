import React from 'react'
import './App.css';
import StartComponent from './components/StartComponent';
import {useState} from 'react';
// @ts-ignore
import cards from './icons/Cards.png';
import Game from './components/Game';


function App() {
  document.body.style.backgroundColor = "#3F3F3F"

  const [initial, setInitial] = useState(true);
  const [settings, setSettings] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<string>('');


  return (
    <div style={{fontFamily:'sans-serif'}}>

      <div className='vertical-flex' style={{textAlign:'center'}}>
        <div style={{marginTop:8}}>
          <img src={cards}/>
        </div>
        <div>
          <p style={{margin:0, color: 'white'}}>POKERBOT</p>
        </div>
        {/* #0066cc */}
        {initial ? (
          <div style={{ height: '100vh' }}>
            <StartComponent setInitial={setInitial} setSettings={setSettings}/>
          </div>
        ) : (
          <div>
            <Game settings={settings}/>
          </div>
        )}
        
        

      </div>
    </div>
  );
}

export default App;