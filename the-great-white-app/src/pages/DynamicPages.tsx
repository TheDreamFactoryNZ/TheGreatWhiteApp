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
    IonButton,
    IonAccordionGroup,
    IonAccordion,
    IonText,
    IonItem,
    IonLabel,
    IonRippleEffect
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

interface Section {
    type: "text" | "image" | "ordered-list" | "unordered-list" | "button" | "accordion-group" | "h1-heading" | "h2-heading" | "h3-heading";
    content?: string;
    src?: string;
    alt?: string;
    items?: string[];
    buttonText?: string;
    buttonUrl?: string;
    buttonUrlTarget?: string;
    accordions?: { header: string; content: string }[];
    onClick?: string;
}


interface Page {
    title: string;
    heading: string;
    sections: Section[];
}

const DynamicPage: React.FC = () => {
    const { pageKey } = useParams<{ pageKey: string }>();
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const contentRef = useRef<HTMLIonContentElement | null>(null);

    const scrollToTop = () => {
        if (contentRef.current) {
            contentRef.current.scrollToTop(500);
        }
    };

    const buttonActions: Record<string, () => void> = {
        scrollToTop
    };

    const getPageFile = (pageKey: string) => {
        if (["aboutGwp", "usingGwa", "commonQuestions", "bugReport"].includes(pageKey)) return "/content/help-pages.json";
        if (["TheLatest", "Thanks"].includes(pageKey)) return "/content/main-pages.json";
        return "/content/main-pages.json"; // Default fallback
    };
    
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const file = getPageFile(pageKey);
                const response = await fetch(file);
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

            <IonContent ref={contentRef} className="ion-padding">
                <IonText>
                    <h2>{page.heading}</h2>
                </IonText>

                {page.sections.map((section: Section, index: number) => {
                    switch (section.type) {
                        case "h1-heading":
                            return (
                                <IonText color="primary" key={index}>
                                    <h1>{section.content}</h1>
                                </IonText>
                            );

                        case "h2-heading":
                            return (
                                <IonText color="secondary" key={index}>
                                    <h2>{section.content}</h2>
                                </IonText>
                            );

                        case "h3-heading":
                            return (
                                <IonText color="secondary" key={index}>
                                    <h3>{section.content}</h3>
                                </IonText>
                            );

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
                                        {section.items?.map((item: string, itemIndex: number) => (
                                            <li key={itemIndex}>{item}</li>
                                        ))}
                                    </ol>
                                </IonText>
                            );

                        case "unordered-list":
                            return (
                                <IonText key={index}>
                                    <ul>
                                        {section.items?.map((item: string, itemIndex: number) => (
                                            <li key={itemIndex}>{item}</li>
                                        ))}
                                    </ul>
                                </IonText>
                            );

                        case "button":
                            return (
                                <IonButton key={index} expand="block" href={section.buttonUrl} target={section.buttonUrlTarget} onClick={section.onClick ? buttonActions[section.onClick] : undefined}>
                                    {section.buttonText}
                                    <IonRippleEffect></IonRippleEffect>
                                </IonButton>
                            );

                        case "accordion-group":
                            return (
                                <IonAccordionGroup key={index}>
                                    {section.accordions?.map((accordion, accIndex) => (
                                        <IonAccordion value={`acc-${index}-${accIndex}`} key={accIndex}>
                                            <IonItem slot="header">
                                                <IonLabel>{accordion.header}</IonLabel>
                                            </IonItem>
                                            <div className="ion-padding" slot="content">
                                                {accordion.content}
                                            </div>
                                        </IonAccordion>
                                    ))}
                                </IonAccordionGroup>
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
