import React from 'react'
import './App.css';
import StartComponent from './components/StartComponent';
import {useState} from 'react';
// @ts-ignore
import cards from './icons/Cards.png';


function App() {
  document.body.style.backgroundColor = "#807C7C";

  const [initial, setInitial] = useState(true);

  return (
    <div style={{fontFamily:'sans-serif'}}>

      <div className='vertical-flex' style={{textAlign:'center'}}>
        <div style={{marginTop:10}}>
          <img src={cards}/>
        </div>
        <div style={{marginBottom: 40}}>
          <p style={{margin:0, color: 'white'}}>POKERBOT</p>
        </div>

        <div style={{height: '100vh'}}>
          <StartComponent setInitial={setInitial} />
        </div>

      </div>
    </div>
  );
}

export default App;