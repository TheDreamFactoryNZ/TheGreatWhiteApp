import { IonContent, IonHeader, IonItem, IonLabel, IonPage, IonText, IonGrid, IonCol, IonRow, IonTitle, IonToolbar, IonCard, IonIcon, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { informationCircleOutline, happyOutline, helpCircleOutline, bugOutline, fishOutline } from 'ionicons/icons'
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
        <IonGrid fixed={true}>
          <IonRow>
            <IonCol size="12" size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
              <IonCard>
                <IonIcon aria-hidden="true" className='help-icon' icon={informationCircleOutline} color="primary"></IonIcon>
                <IonCardHeader>
                  <IonCardTitle>About the Great White Project</IonCardTitle>
                  <IonCardSubtitle>About our mission to understand Great Whites around NZ.</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
              <IonCard>
                <IonIcon aria-hidden="true" className='help-icon' icon={happyOutline} color="primary"></IonIcon>
                <IonCardHeader>
                  <IonCardTitle>Using the Great White App</IonCardTitle>
                  <IonCardSubtitle>Information on interacting with the map and sharks.</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
              <IonCard>
                <IonIcon aria-hidden="true" className='help-icon' icon={helpCircleOutline} color="primary"></IonIcon>
                <IonCardHeader>
                  <IonCardTitle>Common Questions</IonCardTitle>
                  <IonCardSubtitle>FAQ about the project, app and sharks.</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
              <IonCard>
                <IonIcon aria-hidden="true" className='help-icon' icon={bugOutline} color="primary"></IonIcon>
                <IonCardHeader>
                  <IonCardTitle>Report an Issue</IonCardTitle>
                  <IonCardSubtitle>Found a bug? Something not working? Let us know.</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
              <a href="https://www.sustainableoceansociety.co.nz/" target="_blank">
                <IonCard>
                  <IonIcon aria-hidden="true" className='help-icon' icon={fishOutline} color="primary"></IonIcon>
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
