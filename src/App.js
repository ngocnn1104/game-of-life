import React, { Component } from 'react';
import './App.css';

var cellArr; var bgcolor = "red";

class CreateCell extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (document.getElementById(this.props.id).style.backgroundColor === bgcolor) {
      document.getElementById(this.props.id).style.backgroundColor = "white";
    } else if (document.getElementById(this.props.id).style.backgroundColor === "white") {
      document.getElementById(this.props.id).style.backgroundColor = bgcolor;
    }
  }

  render() {
    if (this.props.val === 0) {
      if (Math.round(Math.random())) {
        this.style = {backgroundColor: bgcolor};
      } else {
        this.style = {backgroundColor: "white"};
      }
    } else {
      if (!this.props.dead) {
        this.style = {backgroundColor: bgcolor};
      } else {
        this.style = {backgroundColor: "white"};
      }
    }

    return(
      <td onClick={this.handleClick} id={this.props.id} style={this.style} ></td>
    );
  }
}

class CreateRow extends Component {
  render() {
    return(
      <tr>{this.props.value}</tr>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { play: false, row: 30, col: 50, generation: 0, speed: 100, button: "Pause" };
    this.pauseBtn = this.pauseBtn.bind(this);
    this.resetBtn = this.resetBtn.bind(this);
    this.smallBoard = this.smallBoard.bind(this);
    this.mediumBoard = this.mediumBoard.bind(this);
    this.largeBoard = this.largeBoard.bind(this);
    this.slowSpeed = this.slowSpeed.bind(this);
    this.normalSpeed = this.normalSpeed.bind(this);
    this.fastSpeed = this.fastSpeed.bind(this);
    this.toggleBtn = this.toggleBtn.bind(this);
  }

  pauseBtn() {
    if (this.state.button === "Pause") {
      clearTimeout(this.timeout);
      this.setState({button: "Continue"});
    } else {
      let count = this.state.generation;
      this.timeout = setTimeout(()=>{this.setState({generation: count+1, button: "Pause"})}, this.state.speed);
    }
  }

  resetBtn() {
    clearTimeout(this.timeout);
    this.setState({ play: false, generation: 0, button: "Pause" });
  }

  toggleBtn(val) {
    if (val === "small") {
      document.getElementById("small").style.border = "inset";
      document.getElementById("medium").style.border = "outset";
      document.getElementById("large").style.border = "outset";
    } else if (val === "medium") {
      document.getElementById("small").style.border = "outset";
      document.getElementById("medium").style.border = "inset";
      document.getElementById("large").style.border = "outset";
    } else if (val === "large") {
      document.getElementById("small").style.border = "outset";
      document.getElementById("medium").style.border = "outset";
      document.getElementById("large").style.border = "inset";
    } else if (val === "slow") {
      document.getElementById("slow").style.border = "inset";
      document.getElementById("normal").style.border = "outset";
      document.getElementById("fast").style.border = "outset";
    } else if (val === "normal") {
      document.getElementById("slow").style.border = "outset";
      document.getElementById("normal").style.border = "inset";
      document.getElementById("fast").style.border = "outset";
    } else if (val === "fast") {
      document.getElementById("slow").style.border = "outset";
      document.getElementById("normal").style.border = "outset";
      document.getElementById("fast").style.border = "inset";
    }
  }

  smallBoard() {
    this.setState({ play: false, generation: 0, button: "Pause", row: 10, col: 20 });
    this.toggleBtn("small");
  }

  mediumBoard() {
    this.setState({ play: false, generation: 0, button: "Pause", row: 20, col: 30 });
    this.toggleBtn("medium");
  }

  largeBoard() {
    this.setState({ play: false, generation: 0, button: "Pause", row: 30, col: 50 });
    this.toggleBtn("large");
  }

  slowSpeed() {
    clearTimeout(this.timeout);
    this.setState({ speed: 1000 });
    this.toggleBtn("slow");
  }

  normalSpeed() {
    clearTimeout(this.timeout);
    this.setState({ speed: 500 });
    this.toggleBtn("normal");
  }

  fastSpeed() {
    clearTimeout(this.timeout);
    this.setState({ speed: 100 });
    this.toggleBtn("fast");
  }

  render() {
    let count = this.state.generation; this.rows = [];
    // create a new table
    if (!this.state.play) {
      cellArr = [];
      for (let i = 1; i <= this.state.row; i++) {
        let thisRow = [];
        for (let j = 1; j <= this.state.col; j++) {
          thisRow.push(<CreateCell key={i.toString()+"-"+j.toString()} id={"cell-"+i+"-"+j} val={this.state.generation}/>);
          cellArr.push("cell-"+i+"-"+j);
        }
        this.rows.push(<CreateRow value={thisRow} key={i.toString()} />);
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(()=>{this.setState({play:true, generation: count+1})}, this.state.speed);
    }
    //

    if (this.state.play) {
      // make an array of all neighbour cells
      let thisRow = [];
      for (let i = 0; i < cellArr.length; i++) {
        let neighbours = [];
        let thisCell = cellArr[i].split("-");
        let row = Number(thisCell[1]); let col = Number(thisCell[2]);
        if (row-1>0) {
          neighbours.push("cell-"+String(row-1)+"-"+String(col));
          if (col-1>0) {
            neighbours.push("cell-"+String(row-1)+"-"+String(col-1));
          }
          if (col+1<=this.state.col) {
            neighbours.push("cell-"+String(row-1)+"-"+String(col+1));
          }
        }

        if (col-1>0) {
          neighbours.push("cell-"+String(row)+"-"+String(col-1));
        }

        if (col+1<=this.state.col) {
          neighbours.push("cell-"+String(row)+"-"+String(col+1));
        }

        if (row+1<=this.state.row) {
          neighbours.push("cell-"+String(row+1)+"-"+String(col));
          if (col-1>0) {
            neighbours.push("cell-"+String(row+1)+"-"+String(col-1));
          }
          if (col+1<=this.state.col) {
            neighbours.push("cell-"+String(row+1)+"-"+String(col+1));
          }
        }

        // counting living neighbor cells
        let alive = 0;
        for (let i=0; i < neighbours.length; i++) {
          let cell = document.getElementById(neighbours[i]);
          if (cell.style.backgroundColor === bgcolor) {
            alive++;
          }
        }

        // check if current cell should be dead or alive next generation
        if (document.getElementById(cellArr[i]).style.backgroundColor === bgcolor) {
          if (alive < 2 || alive > 3) {
            thisRow.push(<CreateCell key={row.toString()+"-"+col.toString()} id={cellArr[i]} val={this.state.generation} dead={Boolean(1)} />);
          } else {
            thisRow.push(<CreateCell key={row.toString()+"-"+col.toString()} id={cellArr[i]} val={this.state.generation} dead={Boolean(0)} />);
          }
        } else {
          if (alive === 3) {
            thisRow.push(<CreateCell key={row.toString()+"-"+col.toString()} id={cellArr[i]} val={this.state.generation} dead={Boolean(0)} />);
          } else {
            thisRow.push(<CreateCell key={row.toString()+"-"+col.toString()} id={cellArr[i]} val={this.state.generation} dead={Boolean(1)} />);
          }
        }
        if (col === this.state.col) {
          this.rows.push(<CreateRow value={thisRow} key={row.toString()} />);
          thisRow = [];
        }

        // move to next generation
        clearTimeout(this.timeout);
        if (this.state.button === "Pause") {
          this.timeout = setTimeout(()=>{this.setState({generation: count+1})}, this.state.speed);
        }
      }
    }

    return (
      <div className="App">
        <h1>GAME OF LIFE</h1>
        <h5>- Click on any cells to activate/deactivate them -</h5>
        <h6>(Don&apos;t know how this game works? Read <a href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life' target='blank'>here</a>.)</h6>
        <button onClick={this.pauseBtn}>{this.state.button}</button>
        <button onClick={this.resetBtn}>Reset</button>
        <p>Generations: {this.state.generation}</p>
        <table id="game-table">
          <tbody>
            {this.rows}
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <td className="white">Board Size:</td>
              <td><button onClick={this.smallBoard} id="small">20 x 10</button></td>
              <td><button onClick={this.mediumBoard} id="medium">30 x 20</button></td>
              <td><button onClick={this.largeBoard} id="large" style={{border: "inset"}}>50 x 30</button></td>
            </tr>
            <tr>
              <td className="white">Speed:</td>
              <td><button onClick={this.slowSpeed} id="slow">Slow</button></td>
              <td><button onClick={this.normalSpeed} id="normal">Normal</button></td>
              <td><button onClick={this.fastSpeed} id="fast" style={{border: "inset"}}>Fast</button></td>
            </tr>
          </tbody>
        </table>
        <footer>Coded by Ngoc Nguyen &copy; 2018</footer>
      </div>
    );
  }
}

export default App;
