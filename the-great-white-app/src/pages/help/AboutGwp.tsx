import {
    IonBackButton,
    IonButtons,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
} from '@ionic/react';

const AboutGwp: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar><IonButtons slot="start">
                    <IonBackButton></IonBackButton>
                </IonButtons>
                    <IonTitle>About the Great White Project</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
            </IonContent>
        </IonPage>
    );
};

export default AboutGwp;
