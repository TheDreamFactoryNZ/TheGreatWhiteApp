import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './SharkMap.css';
import React, { StrictMode } from 'react';
import MainApp from '../../../src/App';

const SharkMap: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <StrictMode>
          <MainApp configFile='../../config/config.json' />
        </StrictMode>
      </IonContent>
    </IonPage>
  );
};

export default SharkMap;
