import React from 'react';
import './Partners.css';

import extreme from '../assets/images/partners/extreme-boats.webp';
import gfab from '../assets/images/partners/gfab-trailers.webp';
import mazda from '../assets/images/partners/mazda.webp';
import yamaha from '../assets/images/partners/powered-by-yamaha.webp';
import raymarine from '../assets/images/partners/raymarine.webp';
import seadek from '../assets/images/partners/seadek.webp';
import theDreamFactory from '../assets/images/partners/the-dream-factory-logo-standard.svg';

const Partners = () => {
  return (
    <div id='powered-by-container'>
      <div id='powered-by-heading'>
        <h3>POWERED BY:</h3>
      </div>
      <div id='powered-by-container--inner'>
        <div id='powered-by-partners'>
          <div className='powered-by-partners--container'>
            <div className='powered-by-logo-container'>
              <a className='powered-by-logo partner-1' href='https://www.yamaha-motor.co.nz/' target='_blank' rel='noreferrer'>
                <img src={yamaha} alt='Powered by Yamaha Logo' />
              </a>
            </div>
            <div className='powered-by-logo-container'>
              <a className='powered-by-logo partner-2' href='https://www.extremeboats.co.nz/' target='_blank' rel='noreferrer'>
                <img className='partner-logo' src={extreme} alt='Extreme Boats Logo' />
              </a>
            </div>
            <div className='powered-by-logo-container'>
              <a className='powered-by-logo partner-3' href='https://gfab.co.nz/' target='_blank' rel='noreferrer'>
                <img className='partner-logo' src={gfab} alt='GFAB Trailers Logo' />
              </a>
            </div>
            <div className='powered-by-logo-container'>
              <a className='powered-by-logo partner-4' href='https://www.mazda.co.nz/' target='_blank' rel='noreferrer'>
                <img className='partner-logo' src={mazda} alt='Mazda Logo' />
              </a>
            </div>
            <div className='powered-by-logo-container'>
              <a className='powered-by-logo partner-5' href='https://www.raymarine.com/en-au' target='_blank' rel='noreferrer'>
                <img className='partner-logo' src={raymarine} alt='Raymarine Logo' />
              </a>
            </div>
            <div className='powered-by-logo-container'>
              <a className='powered-by-logo partner-6' href='https://www.seadek.com/' target='_blank' rel='noreferrer'>
                <img className='partner-logo' src={seadek} alt='Seadek logo' />
              </a>
            </div>
            <div className='powered-by-logo-container'>
              <a className='powered-by-logo partner-6' href='https://www.thedreamfactory.nz/' target='_blank' rel='noreferrer'>
                <img className='partner-logo' src={theDreamFactory} alt='The Dream Factory NZ logo' />
              </a>
            </div>
            <div className='powered-by-logo-container powered-by-logo-container--public'>
              <p className='partner-logo public'>...and the public for sponsoring sharks or purchasing the mobile app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
