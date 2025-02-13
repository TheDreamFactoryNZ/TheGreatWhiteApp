import { IonContent, IonHeader, IonItem, IonLabel, IonPage, IonText, IonGrid, IonCol, IonRow, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
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
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>About the Great White Project</IonCardTitle>
                  <IonCardSubtitle>Learn about our mission to better understand Great Whites around New Zealand</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Using the Great White App</IonCardTitle>
                  <IonCardSubtitle>Information on interacting with the map and sharks.</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Frequently Asked Questions</IonCardTitle>
                  <IonCardSubtitle>Common questions about the project, app and sharks.</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Report an Issue</IonCardTitle>
                  <IonCardSubtitle>Something not working? Let us know.</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <a href="https://www.sustainableoceansociety.co.nz/" target="_blank">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>About Sustainable Oceans Society</IonCardTitle>
                    <IonCardSubtitle>Visit our website and learn more about us.</IonCardSubtitle>
                  </IonCardHeader>
                </IonCard>
              </a>
            </IonCol>
            <IonCol>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Help;
