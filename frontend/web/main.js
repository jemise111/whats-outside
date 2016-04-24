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
  'http://space-facts.com/wp-content/uploads/andromeda-galaxy.jpg',
  'http://space-facts.com/wp-content/uploads/andromeda-galaxy.jpg',
  'http://space-facts.com/wp-content/uploads/andromeda-galaxy.jpg',
  'http://space-facts.com/wp-content/uploads/andromeda-galaxy.jpg',
  'http://space-facts.com/wp-content/uploads/andromeda-galaxy.jpg',
  'http://cdn.slashgear.com/wp-content/uploads/2014/04/Galaxy-820x420.jpg',
];

class App extends Component {

  constructor(props) {
    super(props);
    const today = new Date();
    this.todayString = `${months[today.getMonth()]} ${today.getDate()}`;
    this.state = {
      data: null,
      text: '',

    };
  }

  componentDidMount() {
    fetch('http://whatsoutsidetonightapi.azurewebsites.net/')
    .then((response) => response.json())
    .then((json) => {
      this.setState({data: json});
    })
    .catch((error) => {
      console.log('There was an error', error);
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.target.value = '';
      e.target.blur();
      this.setState({success: true, text: ''});
    }
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
        </h1>
        <h2 className='sub-header'>
          {this.todayString}
        </h2>
        {
          this.state.data.map( (d, i) => (
            <div key={i} className={`content-container ${Object.keys(d)[0]}`}>
              <div className={'img-container'}>
                <img src={imgSrcs[i]}/>
              </div>
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
        <div className='input-container'>
          <h2 className='input-header'>
            Enter your number for daily text reports
          </h2>
          <input
            type='tel'
            className='input'
            onChange={ e => this.setState({value: event.target.value}) }
            onKeyPress={ e => this.handleKeyPress(e) }
          />
          {
            this.state.success &&
            <p className='success'>Success!</p>
          }
          {
            this.state.error &&
            <p className='error'>Oops something went wrong  </p>
          }
        </div>
      </div>

    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
);