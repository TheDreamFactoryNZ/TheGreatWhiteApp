import { IonContent, IonPage } from '@ionic/react';
import './SharkMap.css';
import '../../../../core/assets/mapstyle.css';
import React, { StrictMode } from 'react';
import MainApp from '../../../../core/App';

const SharkMap: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <StrictMode>
          <div id='map-page'>
            <MainApp configFile='https://map.sustainableoceansociety.co.nz/public/config/config.json' />
          </div>
        </StrictMode>
      </IonContent>
    </IonPage>
  );
};

export default SharkMap;
