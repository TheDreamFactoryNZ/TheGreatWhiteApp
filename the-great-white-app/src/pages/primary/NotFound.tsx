import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButton, IonRouterLink } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const NotFound: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Page Not Found</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding ion-text-center">
                <IonText color="danger">
                    <h2>This page doesn't exist.</h2>
                </IonText>
                <IonText><p><em>Should it?</em></p> <IonRouterLink href="/help/bugReport" routerDirection='forward' color="tertiary">Please let us know!</IonRouterLink></IonText>
                <IonButton color='primary' expand="block" onClick={() => history.goBack()}>Go Back</IonButton>
                <IonButton color='secondary' expand="block" routerLink="/">Return Home</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default NotFound;
