import {
  IonBackButton,
  IonButtons,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/react';
import './Thanks.css';

const Thanks: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar><IonButtons slot="start">
          <IonBackButton></IonBackButton>
        </IonButtons>
          <IonTitle>Development Credits</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      </IonContent>
    </IonPage>
  );
};

export default Thanks;
