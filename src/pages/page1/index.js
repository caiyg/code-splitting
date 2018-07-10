import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor() {
    super()
    this.state = {
      text: 'page 1 here.'
    }
  }
  render () {
    return (
      <div>page 2.</div>
    )
  }
}
ReactDOM.render(<App/>,document.getElementById('app'));