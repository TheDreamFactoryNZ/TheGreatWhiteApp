import {
    IonBackButton,
    IonButtons,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    IonText
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { pages } from './content'; // Import the shared content

const DynamicPage: React.FC = () => {
    const { pageKey } = useParams<{ pageKey: string }>(); // Get page name from URL
    const page = pages[pageKey]; // Fetch the correct page content

    if (!page) {
        return <IonText><p>Page not found.</p></IonText>;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>{page.title}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <IonText>
                    <h2>{page.heading}</h2>
                </IonText>

                {page.sections.map((section, index) => {
                    switch (section.type) {
                        case "text":
                            return (
                                <IonText key={index}>
                                    <p>{section.content}</p>
                                </IonText>
                            );

                        case "image":
                            return (
                                <IonImg key={index} src={section.src} alt={section.alt} />
                            );

                        case "ordered-list":
                            return (
                                <IonText key={index}>
                                    <ol>
                                        {section.items.map((item, itemIndex) => (
                                            <li key={itemIndex}>{item}</li>
                                        ))}
                                    </ol>
                                </IonText>
                            );

                            case "unordered-list":
                                return (
                                    <IonText key={index}>
                                        <ul>
                                            {section.items.map((item, itemIndex) => (
                                                <li key={itemIndex}>{item}</li>
                                            ))}
                                        </ul>
                                    </IonText>
                                );

                        default:
                            return null;
                    }
                })}
            </IonContent>
        </IonPage>
    );
};

export default DynamicPage;
