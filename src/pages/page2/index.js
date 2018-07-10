import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      text: 'hello world'
    }
  }
  sayHi () {
    alert(this.state.text);
  }
  render() {
    return (
      <div>
        <h2>this is page1.</h2>
        <button onClick={this.sayHi.bind(this)}>say hi</button>
      </div>
    )
  }
}
ReactDOM.render(<App/>,document.getElementById('app'));
