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
    IonSpinner,
    IonText
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PAGE_CONTENT = "/content.json";

const DynamicPage: React.FC = () => {
    const { pageKey } = useParams<{ pageKey: string }>();
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(PAGE_CONTENT);
                const data = await response.json();
                setPage(data[pageKey]); // Get the correct page content
            } catch (err) {
                setError("Failed to load content.");
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [pageKey]);

    if (loading) {
        return <IonContent className="ion-padding"><IonSpinner /></IonContent>;
    }

    if (error || !page) {
        return <IonContent className="ion-padding"><p>{error || "Page not found."}</p></IonContent>;
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
