import { IonContent, IonHeader, IonPage, IonGrid, IonCol, IonRow, IonTitle, IonToolbar, IonCard, IonIcon, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { informationCircleOutline, happyOutline, helpCircleOutline, bugOutline, fishOutline, arrowForwardCircleOutline } from 'ionicons/icons'
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
                <IonCard routerLink="aboutgwp" className='help-card'>
                  <IonIcon aria-hidden="true" className='help-icon' icon={informationCircleOutline} color="primary"></IonIcon>
                  <IonCardHeader className='help-card-content'>
                    <IonCardTitle>About the Great White Project</IonCardTitle>
                    <IonCardSubtitle>About our mission to understand Great Whites around NZ.</IonCardSubtitle>
                    <IonIcon size="large" className='help-card-arrow' aria-label="Open information" icon={arrowForwardCircleOutline}></IonIcon>
                  </IonCardHeader>
                </IonCard>
            </IonCol>
            <IonCol size="12" size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
              <IonCard className='help-card'>
                <IonIcon aria-hidden="true" className='help-icon' icon={happyOutline} color="primary"></IonIcon>
                <IonCardHeader className='help-card-content'>
                  <IonCardTitle>Using the Great White App</IonCardTitle>
                  <IonCardSubtitle>Information on interacting with the map and sharks.</IonCardSubtitle>
                  <IonIcon size="large" className='help-card-arrow' aria-label="Open information" icon={arrowForwardCircleOutline}></IonIcon>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
              <IonCard className='help-card'>
                <IonIcon aria-hidden="true" className='help-icon' icon={helpCircleOutline} color="primary"></IonIcon>
                <IonCardHeader className='help-card-content'>
                  <IonCardTitle>Common Questions</IonCardTitle>
                  <IonCardSubtitle>FAQ about the project, app and sharks.</IonCardSubtitle>
                  <IonIcon size="large" className='help-card-arrow' aria-label="Open information" icon={arrowForwardCircleOutline}></IonIcon>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
              <IonCard className='help-card'>
                <IonIcon aria-hidden="true" className='help-icon' icon={bugOutline} color="primary"></IonIcon>
                <IonCardHeader className='help-card-content'>
                  <IonCardTitle>Report an Issue</IonCardTitle>
                  <IonCardSubtitle>Found a bug? Something not working? Let us know.</IonCardSubtitle>
                  <IonIcon size="large" className='help-card-arrow' aria-label="Open information" icon={arrowForwardCircleOutline}></IonIcon>
                </IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol size="12" size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
              <a className='help-card-link' href="https://www.sustainableoceansociety.co.nz/" target="_blank">
                <IonCard className='help-card'>
                  <IonIcon aria-hidden="true" className='help-icon' icon={fishOutline} color="primary"></IonIcon>
                  <IonCardHeader className='help-card-content'>
                    <IonCardTitle>About Sustainable Oceans Society</IonCardTitle>
                    <IonCardSubtitle>Learn more about us and visit our website</IonCardSubtitle>
                    <IonIcon size="large" className='help-card-arrow' aria-label="Open link to website" icon={arrowForwardCircleOutline}></IonIcon>
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
