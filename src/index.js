import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Navbar extends Component{
  render(){
      return(
          <div className="nav-bar">
             XO Game 
          </div>
      );
  }
}
function Winner(props){
  return(
    <div className="winner">{props.winner}</div>
  )
}
function Square(props) {
    return (
      <button className="square" style={{backgroundColor:(props.styles==="green"?props.styles:"rgba(100,100,100,0.1)")}}
      onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          styles={this.props.styles[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div className="board">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            history:[{
                squares:Array(9).fill(null),
            }],
            styles:Array(9).fill('white'),
            xIsNext:true,
            stepNumber:0,
        }

    }
    handleClick(i){
        console.log(this.state.styles);
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current=history[history.length-1];
        const squares= current.squares.slice();
        const styles =this.state.styles.slice();
        if(calculateWinner(squares).winner|| squares[i]){
            return;
        }
        squares[i]=this.state.xIsNext ? "X":"O";
        this.setState({
            history:history.concat([{
                squares:squares,
            }]),
            stepNumber:history.length,
            xIsNext:!this.state.xIsNext
        })
    }
    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step%2)===0,
            styles:Array(9).fill('white')
        });
    }
    render() {
        const history=this.state.history;
        const styles=this.state.styles.slice();
        const current =history[this.state.stepNumber];
        const winner=calculateWinner(current.squares);
        const moves = history.map((step,move)=>{
            const desc=move?"Go to move #"+move:
            "Go to game start";
            return(
                <li key={move} className="jumpList">
                    <button  className="jumpButton" onClick={()=>this.jumpTo(move)}>{desc}</button>
                </li>
            );
        }) 
        let status;
        if(winner.winner){
            status="Winner:" +winner.winner;
            let [a,b,c]=winner.lines;
            this.state.styles[a]="green";
            this.state.styles[b]="green";
            this.state.styles[c]="green";
        }
        else{
            status="Next player:"+(this.state.xIsNext?"X":"O");
        }
      return (
        <div className="game">
          <div className="content">
          <div className="game-board">
            <Board 
            squares={current.squares}
            styles={this.state.styles}
            onClick={(i)=>this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className={winner.winner?"statusOff":"status"}>{status}</div>
            <ol className="moves">{moves}</ol>
          </div>
          </div>
          {(winner.winner?<Winner winner={status}/>:null)}
        </div>
      );
    }
  }

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {winner:squares[a],lines:[a,b,c]};
      }
    }
    return {winner:null,lines:null};
  }
class App extends Component{
    render(){
        return(
            <div className="app">
                <Navbar/>
                <Game/>
                
            </div>
        );
    }
}
ReactDOM.render(<App/>,document.getElementById('root'));