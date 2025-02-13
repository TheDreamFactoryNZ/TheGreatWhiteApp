import { IonContent, IonHeader, IonItem, IonLabel, IonPage, IonText, IonGrid, IonCol, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Help.css';

const Help: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Help &amp; FAQ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonLabel>
            <h1>About the Great White Project and App</h1>
            <p>Some example text can go here.</p>
          </IonLabel>
        </IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              1
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Help;
