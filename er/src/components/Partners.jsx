import React, { StrictMode } from 'react';
import './Partners.css';

import extreme from '../../public/images/partners/extreme-boats.jpg';
import gfab from '../../public/images/partners/gfab-trailers.jpg';
import mazda from '../../public/images/partners/mazda.jpg';
import yamaha from '../../public/images/partners/powered-by-yamaha.jpg';
import raymarine from '../../public/images/partners/raymarine.jpg';
import seadek from '../../public/images/partners/seadek.jpg';
import theDreamFactory from '../../public/images/partners/the-dream-factory.jpg';

const Partners = () => {
  return (
      <div id='powered-by-container'>
          <div id='powered-by-container--inner'>
              <div id='powered-by-heading'>
                  <h3>POWERED BY:</h3>
              </div>
              <div id='powered-by-partners'>
                  <div class='powered-by-logo-container'>
                      <a class='powered-by-logo partner-1' href='https://www.yamaha-motor.co.nz/' target='_blank'>
                          <img src={yamaha} alt='Powered by Yamaha Logo' />
                      </a>
                  </div>
                  <div class='powered-by-logo-container'>
                      <a class='powered-by-logo partner-2' href='https://www.extremeboats.co.nz/' target='_blank'>
                          <img class='partner-logo' src={extreme} alt='Extreme Boats Logo' />
                      </a>
                  </div>
                  <div class='powered-by-logo-container'>
                      <a class='powered-by-logo partner-3' href='https://gfab.co.nz/' target='_blank'>
                          <img class='partner-logo' src={gfab} alt='GFAB Trailers Logo' />
                      </a>
                  </div>
                  <div class='powered-by-logo-container'>
                      <a class='powered-by-logo partner-4' href='https://www.mazda.co.nz/' target='_blank'>
                          <img class='partner-logo' src={mazda} alt='Mazda Logo' />
                      </a>
                  </div>
                  <div class='powered-by-logo-container'>
                      <a class='powered-by-logo partner-5' href='https://www.raymarine.com/en-au' target='_blank'>
                          <img class='partner-logo' src={raymarine} alt='Raymarine Logo' />
                      </a>
                  </div>
                  <div class='powered-by-logo-container'>
                      <a class='powered-by-logo partner-6' href='https://www.seadek.com/' target='_blank'>
                          <img class='partner-logo' src={seadek} alt='Seadek logo' />
                      </a>
                  </div>
                  <div class='powered-by-logo-container'>
                      <a class='powered-by-logo partner-6' href='https://www.thedreamfactory.nz/' target='_blank'>
                          <img class='partner-logo' src={theDreamFactory} alt='The Dream Factory NZ logo' />
                      </a>
                  </div>
                  <div class='powered-by-logo-container powered-by-logo-container--public'>
                      <p class='partner-logo public'>...and members of the general public who have sponsored sharks</p>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default Partners