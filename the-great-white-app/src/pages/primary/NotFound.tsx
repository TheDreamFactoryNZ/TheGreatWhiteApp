import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonText, IonButton, IonRouterLink } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './NotFound.css'

const NotFound: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Page Not Found :(</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-text-center">
                <div id="main">
                    <div id="notfound-container">
                        <IonText color="danger">
                            <h2>This page doesn't exist.</h2>
                        </IonText>
                        <IonText className='ion-padding-top'><p><em>Should it?</em></p> <IonRouterLink href="/help/bugReport" routerDirection='forward' color="tertiary">Please let us know!</IonRouterLink></IonText>
                        <IonButton className='ion-padding-top' color='secondary' expand="block" routerLink="/">Return Home</IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default NotFound;
