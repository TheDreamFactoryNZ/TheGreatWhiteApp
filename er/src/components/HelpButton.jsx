import React from 'react';
import './Legend.css';

import tipsOn from '../../public/images/button_icons/help.svg';
import close from '../../public/images/button_icons/close.svg';
import zoom from '../../public/images/button_icons/help-zoom.svg';
import reset from '../../public/images/button_icons/help-pitch-reset.svg';
import control from '../../public/images/button_icons/control-key.svg';
import pin from '../../public/images/button_icons/map-pin.svg';
import tracks from '../../public/images/button_icons/subject-tracks.svg';
import story from '../../public/images/button_icons/story-f.png'; // Unused at this stage?
import refresh from '../../public/images/button_icons/refresh.svg';

/* eslint-disable react/prop-types */
const HelpButton = () => {
  const storyStyle = { paddingLeft: '9px', paddingRight: '8px', marginTop: '5px' };
  const ctrlStyle = { marginTop: '6px' };
  const zoomStyle = { paddingLeft: '2px' };
  const viewStyle = { marginBottom: '2px', marginTop: '0px' };
  const zoomPStyle = { marginTop: '10px' };
  const orientStyle = { marginTop: '8px' };
  const refreshStyle = { marginTop: '8px' };

  return (
    <div id='tips-container'>
      <div
        id='tips-button-container'
        className='hover'
        onClick={() => {
          const tips = document.getElementById('tips');
          const helpButtonContainer = document.getElementById('tips-button-container');
          tips.classList.toggle('hidden');
          helpButtonContainer.classList.toggle('tips-active');
        }}
      >
        <img id='help-button' src={tipsOn} />
      </div>
      <div id='tips' className='hidden'>
        <div>
          <h2>Interacting With the Map:</h2>
          <img
            id='close-icon'
            src={close}
            onClick={() => {
              const helpButtonContainer = document.getElementById('tips-button-container');
              helpButtonContainer.classList.remove('tips-active');
              const tips = document.getElementById('tips');
              tips.classList.add('hidden');
            }}
          />
        </div>
        <div id='actual-tips'>
          <div>
            <img width='20' height='40' style={zoomStyle} src={zoom} />
            <p style={zoomPStyle}>Zoom in and out with the + and - buttons.</p>
          </div>
          <div>
            <img width='24' style={orientStyle} height='24' src={reset} />
            <p style={viewStyle}>Press to reset map orientation, hold and drag to adjust pitch.</p>
          </div>
          <div>
            <img width='24' height='24' style={ctrlStyle} src={control} />
            <p style={viewStyle}>
              Hold Ctrl / control key and drag left to right with mouse to rotate view, up and down
              to adjust pitch.
            </p>
          </div>
          <div>
            <img width='24' height='24' src={pin} />
            <p>Jump to a subject's location</p>
          </div>
          <div>
            <img width='24' height='24' src={tracks} />
            <p>Display a subject's track</p>
          </div>
          <div>
            <img width='24' height='24' style={refreshStyle} src={refresh} />
            <p>Refresh and update locations (internet connection required)</p>
          </div>
          <div>
            <img width='7' height='10' style={storyStyle} src={story} />
            <p>Display a subject's story</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpButton;
