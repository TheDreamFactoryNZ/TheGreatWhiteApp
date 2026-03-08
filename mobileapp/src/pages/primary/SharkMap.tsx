import { IonContent, IonPage } from '@ionic/react';
import React, { StrictMode } from 'react';
import MainApp from '@core/App';
import { useBootstrapConfig } from '@hooks/useBootstrapConfig.js';
import './SharkMap.css';

const SharkMap: React.FC = () => {
  const configUrl = useBootstrapConfig();

  if (!configUrl) {
    return <div>Loading...</div>;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <StrictMode>
          <div id='map-page'>
            <MainApp configFile={configUrl} />
          </div>
        </StrictMode>
      </IonContent>
    </IonPage>
  );
};

export default SharkMap;
