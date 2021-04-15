import './App.css';

import { useState } from 'react';

import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import AdapterMoment from '@material-ui/lab/AdapterMoment';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { DateTimePicker } from '@material-ui/lab';

function App() {

  // check the url for a utc timestamp
  let urlPath = window.location.pathname.slice(1);
  let utcTimeString = `${urlPath.slice(1)}+00`
  if(urlPath.length<=1) {
    utcTimeString = null;
  }

  // create a time object from the url timestamp
  const [raidTime, setRaidTime] = useState(moment(utcTimeString));

  // if the url timestamp is invalid, set the time to 8pm today
  if(!raidTime.isValid()) {
    // placeholder for invalid raid time
    setRaidTime(moment().startOf('day').clone().add(20, 'hours'));
  }

  // create formatted time strings
  let timeRemaining = raidTime.fromNow();
  let startTime = raidTime.local().format('MMMM Do YYYY, h:mm a')

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Raid starts {timeRemaining}</h1>
          <h2>On {startTime}</h2> 
        </div>

        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="Set a new time"
            value={raidTime}
            onChange={(newTime) => {
              // change the url
              setRaidTime(newTime.utc());
              let newUrl = `/${generateUrlTimeString(newTime)}`
              window.history.pushState({}, 'title', newUrl);
            }}
            renderInput={(params) => <TextField {...params}/>}
          />
        </LocalizationProvider>

      </header>
    </div>
  );
}

function generateUrlTimeString(time) {
  if(!time.isValid()) {
    return '';
  }
  let dateFormat = time.utc().format('YYYYMMDD')
  let timeFormat = time.utc().format('HHmmss')
  let urlUTCTimeFormat = `${dateFormat}T${timeFormat}`;

  return urlUTCTimeFormat;
}

export default App;
