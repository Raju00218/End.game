import { useState,useEffect, useRef } from "react";
import{languages} from './language.js'
import clsx from "clsx";
import { getFarewellText, randomWords } from "./utility.js";
import Confetti from 'react-confetti'




function GameApp() {
  const [currentWord, setCurrentWord] = useState(()=>String(randomWords()).toUpperCase())
  const [guess, setGuess]= useState([])
  const [farwell , setFarwell] = useState()


const wrongGuessCount = guess.filter(letter => !currentWord.includes(letter)).length
const isGameWon = currentWord.split('').every(letter => guess.includes(letter))
  const gameLost = wrongGuessCount >= languages.length - 1;
  const gameOver = isGameWon || gameLost


  function newGame() {
    setCurrentWord(String(randomWords()).toUpperCase());
    setGuess([]);  
    setFarwell('')                         
  }
  

  
  function addGuessedLetter(letter){
    setGuess(prevLetter =>{ 
      const alphabetSet = new Set(prevLetter)
      alphabetSet.add(letter)
      return Array.from(alphabetSet)
    })  
  };
  // if(gameLost){
  //   const word = currentWord.split("").map((letter, index) => letter)
  //   const nonGuessdWord = word.filter(item => !guess.includes(item))
  //   const display =nonGuessdWord.map((item,index)=> <h3 key={index}>{item}</h3>)
    
  // }
 
  // useEffect(() => {
  //   const updatedHidden = currentWord.map((char, index) =>
  //     guess.includes(char) ? char : hidden[index]
  //   );
  //   setHidden(updatedHidden);
  // }, [guess]);
  const prevGuessCount = useRef(0);  
  const values = languages.map(obj => Object.values(obj)[0]);
 
  useEffect(()=>{
    if(wrongGuessCount > prevGuessCount.current){
      
      const nextItem = values[wrongGuessCount-1];
       const msg = getFarewellText(nextItem);
      setFarwell(msg)
    }

    prevGuessCount.current = wrongGuessCount;

  },[wrongGuessCount])


  const Planguage = languages.map((lang,index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }   
    const isLost = index < wrongGuessCount;
    const className =clsx("chips",{
      lost : isLost
    })
   
    return (
      <span 
      className={className}
      style={styles} 
      key={lang.name}
    
    
      >
        {lang.name}
      </span>
    )
  })


  // const display = hidden.map((char, index) => (
  //   <h3 className="find-letters" key={index}>{char}</h3>
  // ));

  const Allletters = currentWord.split("").map((letter, index) => {
    const nonGuessdWord = gameLost || guess.includes(letter)
    const letterClassName= clsx(
      gameLost && !guess.includes(letter) && "missed-letter"
    )
  return(
    <span className={letterClassName}key={index}>
    {nonGuessdWord ? letter.toUpperCase():''}
    </span>
  
  )})
  
//  creating alphabets
  const alphabets=[]
  for(let i = 65 ; i < 90; i++ ){
    alphabets.push(String.fromCharCode(i))
  }
  
  // creating Keyboard
  const keyBoard = alphabets.map(letter =>{
    const isGuessed = guess.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct : isCorrect,
      wrong : isWrong
    })

  return(
  <button onClick={()=>addGuessedLetter(letter)}  
  className={className}
  key={letter}
  disabled={gameOver}
  aria-disabled={guess.includes(letter)}
  aria-label={`Letter ${letter}`}
  >
    {letter}
  </button>
  )
  
})
  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: gameLost,
    start:wrongGuessCount
  })

  function renderGameStatus() {
    if (!gameOver) {
      return(
        <>
          <h3>{farwell}</h3>

        </>
      )
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    } else{
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }
  }
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);
  

  return (
    <main>
      {isGameWon && <Confetti
        recycle={false}
        numberOfPieces={1000}
      />}
      <header className="header">
      <div className="headInfo">
          <h3>Assembly: Endgame</h3>
          <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </div>
        <div 
        aria-live="polite"
        role="status" 
        className={gameStatusClass}>
          {!isFirstRender.current && renderGameStatus()}
        </div>
      </header>
      <div className="language-container">
        {Planguage}
      </div>
      <div className="letters">
        {Allletters}
      </div>
      <div className="keyboard-container">
      {keyBoard}
      </div>
      {gameOver && <section><button className="newGame" onClick={newGame}>New Game</button></section>}
    </main>
  );
}

export default GameApp;
