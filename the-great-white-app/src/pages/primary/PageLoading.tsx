import {
    IonBackButton,
    IonButtons,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner,
} from '@ionic/react';
import './PageLoading.css';


const PageLoading: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Loading...</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div id="main">
                    <div id="notfound-container">
                        <IonSpinner name="bubbles" color="tertiary"></IonSpinner>
                    </div></div>
            </IonContent>
        </IonPage >
    )
};

export default PageLoading;
