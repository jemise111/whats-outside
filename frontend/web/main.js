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
  'http://space-facts.com/wp-content/uploads/moon.png',
  'http://spaceaim.com/wp-content/uploads/2015/07/Saturn.png',
  'http://o.aolcdn.com/dims-shared/dims3/GLOB/crop/8000x4583+0+726/resize/960x550!/format/jpg/quality/85/http://hss-prod.hss.aol.com/hss/storage/adam/f466b710a198866365971b042e159946/157506243.jpeg',
  'http://static1.squarespace.com/static/56eddde762cd9413e151ac92/t/570cb8aa5bd33022b93a2441/1460466816134/asteroidmining.jpg',
  'http://www.jpost.com/HttpHandlers/ShowImage.ashx?ID=277701',
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
    var event = e;
    if (e.key === 'Enter') {
      fetch('http://localhost:8082/enternumber', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: e.target.value
        })
      })
      .then((json) => {
        this.setState({success: true, text: ''});
      })
      .catch((error) => {
        this.setState({error: true})
      });
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
            Enter your number for daily text reports!
          </h2>
          <input
            type='tel'
            className='input'
            onChange={ e => this.setState({value: event.target.value}) }
            onKeyPress={ e => this.handleKeyPress(e) }
          />
          {
            this.state.success &&
            <p className='success'>Success! Expect your first report tomorrow.</p>
          }
          {
            this.state.error &&
            <p className='error'>Oops something went wrong.</p>
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