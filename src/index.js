import React from 'react'
import ReactDOM from 'react-dom'
const words = [
  ['S', 'T', 'A', 'Y'],
  ['H', 'E', 'L', 'P'],
  ['S', 'T', 'O', 'P'],
  ['H', 'A', 'R', 'D'],
  ['F', 'L', 'A', 'T'],
  ['L', 'A', 'T', 'E'],
  ['L', 'I', 'O', 'N'],
  ['P', 'O', 'S', 'T']
]

function ChooseRandomWord() {
  let index;
  index = Math.floor((Math.random() *8) + 1);
  return words[index];
}

class UI extends React.Component  {
  render()  {
    return (
      <div>
	<div>
	  <h1>HANGMAN</h1>
	  <p class="tagline">The classic word guessing game</p>
	  <p class="info">Try to guess the randomly selected four letter word character by character
	    . If you guess a letter that is in the secret word we have selected, then that letter 
	    and its position in the word will be show below. <br/> You have 5 chances to win...
	  </p>
	</div>
        <div>
          <label class="char-box">{this.props.dispWord[0]}</label>
          <label class="char-box">{this.props.dispWord[1]}</label>
          <label class="char-box">{this.props.dispWord[2]}</label>
          <label class="char-box">{this.props.dispWord[3]}</label>
        </div>
      
        <div class="status-box">
          <p id="status">
            {this.props.status}
          </p>
	  <p id="numChances">
	    Chances remaining :{this.props.numChances}
	  </p>
        </div>
        
        <div>
	  <div>
            <input type="text" id="input" onInput={this.props.onInput}/>
	  </div>
        </div>
      </div>
    )
  }
}

class NewGameButton extends React.Component {
  render()  {
    return(
      <button onClick={this.props.onNewGame} id="playAgain">New Game</button>
    );
  }
}


class Game extends React.Component  {
  constructor(props)  {
    super(props);
    this.state ={ 
      status  : "Try guessing different characters in the input box...",
      word    : ChooseRandomWord(),
      dispWord: ['_', '_', '_', '_'],
      numChances: 10
    };
  }
  
  newGame() {
    this.setState ({ 
      status  : "Try guessing different characters in the input box...",
      word    : ChooseRandomWord(),
      dispWord: ['_', '_', '_', '_'],
      numChances: 10
    });
  }
  
  checkMatch(character)  {
    if(typeof this.state.word === 'undefined')	{
	return [false, -1];
    }
    let i;
    let match = false;
    for(i=0; i<4; i++)  {
      if(character === this.state.word[i]) {
        match = true;
        break;
      }
    }
    
    return( [match, i]);
  }
  
  // this function checks the game state to see whether the player has
  // won the game... or is left out of chances(max 5) to try...
  checkGameState()  {
    if(typeof this.state.word === 'undefined')	{
	return;
    }

    let gameWon = true;
    for(let i = 0; i< 4; i++) {
      if(this.state.dispWord[i] !== this.state.word[i])
        gameWon = false;
    }
    
    if(gameWon)
      return 1;
    if(this.state.numChances === 0)
      return -1;
    
    return 0;
  }
  
  handleInput() {
    if(this.checkGameState() === 1 ||
      this.checkGameState() === -1)  {
      document.getElementById('input').value = '';
      return;
    }
    
    
      let element = document.getElementById('input');
      let character = element.value;
      character = character.toUpperCase();
      element.value ='';

      let match,index;
      [match, index] = this.checkMatch(character);

      if(match) {
        let dispWord = this.state.dispWord;
        dispWord[index] = character;

        this.setState({
          status   : "Good guess!",
          word     : this.state.word,
          dispWord : dispWord,
          numChances: this.state.numChances
        });
      }
      else  {
        let ch = this.state.numChances - 1;
        this.setState({
          status   : "Wrong guess",
          word     : this.state.word,
          dispWord : this.state.dispWord,
          numChances: ch
        });
      }
    
    
  }
  
  render()  {
    let status = this.state.status;    
    let gState = this.checkGameState();
    if(gState === 1)
      status = "Congrats! You are the winner!!!";
    else if(gState === -1) 
      status = "Alas! You lose!!! Click new game button to start again. The correct \
	letter sequence was: " + this.state.word;
    
    
    return (
      <div>
        <UI dispWord={this.state.dispWord} 
          onInput={()=>this.handleInput()}
          status={status}
	  numChances = {this.state.numChances}
	/>
        <div>
          <NewGameButton onNewGame={() => this.newGame()}/>
        </div>
       </div>
    )
  }
}
////////////////////////////////////////////////////////////
ReactDOM.render( <Game/>, document.getElementById('root'));
