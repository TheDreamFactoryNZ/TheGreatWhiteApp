import React from 'react';
import './HelpButton.css';

import tipsOn from '../assets/images/button_icons/help.svg';
import close from '../assets/images/button_icons/close.svg';
import zoom from '../assets/images/button_icons/help-zoom.svg';
import reset from '../assets/images/button_icons/help-pitch-reset.svg';
import control from '../assets/images/button_icons/control-key.svg';
import pin from '../assets/images/button_icons/map-pin.svg';
import tracks from '../assets/images/button_icons/subject-tracks.svg';
import story from '../assets/images/button_icons/story-f.png'; // Unused at this stage?
import refresh from '../assets/images/button_icons/refresh.svg';

/* eslint-disable react/prop-types */
const HelpButton = () => {

  return (
    <div id='tips-container'>
      <div
        id='tips-icon'
        className='hover'
        onClick={() => {
          const tips = document.getElementById('tips-content-container');
          const helpButtonContainer = document.getElementById('tips-icon');
          tips.classList.toggle('hidden');
          helpButtonContainer.classList.toggle('tips-active');
        }}
        src={tipsOn}
      >
      </div>
      <div id='tips-content-container' className='hidden popup-container'>
        <div id="tips-header">
          <h2>Interacting With the Map</h2>
          <img
            id='close-icon'
            draggable='false'
            src={close}
            onClick={() => {
              const helpButtonContainer = document.getElementById('tips-icon');
              helpButtonContainer.classList.remove('tips-active');
              const tips = document.getElementById('tips-content-container');
              tips.classList.add('hidden');
            }}
          />
        </div>
        <div id='tip-items-container'>
          <div className="tip-item">
            <div className='tip-icon-container tip-icon--vertical'><img className='tip-icon' width='20' height='40' src={zoom} /></div>
            <p>Zoom in and out with the + and - buttons.</p>
          </div>
          <div className="tip-item">
            <div className='tip-icon-container'><img className='tip-icon' width='24' height='24' src={reset} /></div>
            <p>Press to reset map orientation, hold and drag to adjust pitch.</p>
          </div>
          <div className="tip-item">
            <div className='tip-icon-container'><img className='tip-icon' width='24' height='24' src={control} /></div>
            <p>
              Hold Ctrl / control key and drag left to right with mouse to rotate view, up and down
              to adjust pitch.
            </p>
          </div>
          <div className="tip-item">
            <div className='tip-icon-container'><img className='tip-icon' width='24' height='24' src={pin} /></div>
            <p>Jump to a subject's location</p>
          </div>
          <div className="tip-item">
            <div className='tip-icon-container'><img className='tip-icon' width='24' height='24' src={tracks} /></div>
            <p>Display a subject's track</p>
          </div>
          <div className="tip-item" style={{display: 'none'}}>
            <div className='tip-icon-container'><img className='tip-icon' width='24' height='24' src={refresh} /></div>
            <p>Refresh and update locations (internet connection required)</p>
          </div>
          <div className="tip-item">
            <div className='tip-icon-container'><img className='tip-icon' width='7' height='10' src={story} /></div>
            <p>Display a subject's story</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpButton;
