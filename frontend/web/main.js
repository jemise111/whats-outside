import React, {
  Component,
} from 'react';

import ReactDOM from 'react-dom';
import 'whatwg-fetch'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const imgSrcs = [
'http://en.es-static.us/upl/2014/11/andromeda-galaxy-Navaneeth-Unnikrishnan-11-9-2014-Kerala-India--e1416172553643.jpg',
'http://en.es-static.us/upl/2014/11/andromeda-galaxy-Navaneeth-Unnikrishnan-11-9-2014-Kerala-India--e1416172553643.jpg',
'http://en.es-static.us/upl/2014/11/andromeda-galaxy-Navaneeth-Unnikrishnan-11-9-2014-Kerala-India--e1416172553643.jpg',
'http://en.es-static.us/upl/2014/11/andromeda-galaxy-Navaneeth-Unnikrishnan-11-9-2014-Kerala-India--e1416172553643.jpg',
'http://en.es-static.us/upl/2014/11/andromeda-galaxy-Navaneeth-Unnikrishnan-11-9-2014-Kerala-India--e1416172553643.jpg',
'http://en.es-static.us/upl/2014/11/andromeda-galaxy-Navaneeth-Unnikrishnan-11-9-2014-Kerala-India--e1416172553643.jpg'
];

class App extends Component {

  constructor(props) {
    super(props);
    const today = new Date();
    this.todayString = `${months[today.getMonth()]} ${today.getDate()}`;
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    fetch('http://localhost:3000')
    .then((response) => response.json())
    .then((json) => {
      this.setState({data: json});
    })
    .catch((error) => {
      console.log('There was an error', error);
    });
  }

  render() {
    if (!this.state.data) {
      return (
        <div className='no-data-container'>
          <img clalssName='loader' src='ripple.gif' />
        </div>
      );
    }
    return (
      <div>
        <h1 className='header'>
          Star Gazer
          {this.todayString}
        </h1>
        {
          this.state.data.map( (d, i) => (
            <div key={i} className={`content-container ${Object.keys(d)[0]}`}>
              <img src={imgSrcs[i]} className='image' />
              <div className='right'>
                <div className='row'>
                  <div className='number-container'>
                    <p className='number'>{i+1}</p>
                  </div>
                  <p className='content-header'>{Object.keys(d)[0]} Report</p>
                </div>
                <div className='body-container'>
                  {d[Object.keys(d)[0]].split('\n\n').map((t, i) => (
                    <div key={i}><p className='body'>{t}</p><br/></div>
                  ))}
                </div>
              </div>
            </div>
          ))
        }
      </div>

    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
);