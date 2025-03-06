import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './SharkMap.css';
import '../../../../core/assets/mapstyle.css';
import React, { StrictMode } from 'react';
import MainApp from '../../../../core/App';

const SharkMap: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <StrictMode>
          <div id="map-image-container">
          <img id="map-image" src="https://api.mapbox.com/styles/v1/izaakwicks/cm695163r00h001spfqn33x5h/static/173.4961,-40.0444,5,0/1280x1280?access_token=pk.eyJ1IjoidmpvZWxtIiwiYSI6ImNra2hiZXNpMzA1bTcybnA3OXlycnN2ZjcifQ.gH6Nls61WTMVutUH57jMJQ" />
          </div>
          <div id='map-page'>
            <MainApp configFile='https://map.sustainableoceansociety.co.nz/public/config/config.json' />
          </div>
        </StrictMode>
      </IonContent>
    </IonPage>
  );
};

export default SharkMap;
