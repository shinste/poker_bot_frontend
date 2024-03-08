import React from 'react'
import './App.css';
import StartComponent from './components/StartComponent';
import {useState} from 'react';
// @ts-ignore
import cards from './icons/Cards.png';
import Game from './components/Game';


function App() {
  document.body.style.backgroundColor = "#d9d9e3cc"

  const [initial, setInitial] = useState(true);
  const [settings, setSettings] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<string>('');


  return (
    <div style={{fontFamily:'sans-serif'}}>

      <div className='vertical-flex' style={{textAlign:'center'}}>
        <div style={{marginTop:10}}>
          <img src={cards}/>
        </div>
        <div style={{marginBottom: 40}}>
          <p style={{margin:0, color: 'gray'}}>POKERBOT</p>
        </div>
        {/* #0066cc */}
        {initial ? (
          <div style={{ height: '100vh' }}>
            <StartComponent setInitial={setInitial} setSettings={setSettings} setSessionId={setSessionId} />
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