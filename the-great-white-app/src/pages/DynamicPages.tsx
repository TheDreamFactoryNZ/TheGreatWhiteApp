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
    id?: string;
    class?: string;
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
        if (["aboutGwp", "usingGwa", "commonQuestions", "bugReport"].includes(pageKey)) return "https://map.sustainableoceansociety.co.nz/public/content/help-pages.json";
        if (["TheLatest", "Thanks"].includes(pageKey)) return "https://map.sustainableoceansociety.co.nz/public/content/main-pages.json";
        return "https://map.sustainableoceansociety.co.nz/public/content/main-pages.json"; // Default fallback
    };
    
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const file = getPageFile(pageKey);
                const response = await fetch(file);
                const data = await response.json();
                setPage(data[pageKey]); // Get the correct page content
                
                // Scroll to top when page changes
                if (contentRef.current) {
                    contentRef.current.scrollToTop(0);
                }
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
                    <h1 className='ion-text-center'>{page.heading}</h1>
                </IonText>

                {page.sections.map((section: Section, index: number) => {
                    switch (section.type) {
                        case "h1-heading":
                            return (
                                <IonText color="primary" key={index}>
                                    <h1 id={section.id} className={section.class}>{section.content}</h1>
                                </IonText>
                            );

                        case "h2-heading":
                            return (
                                <IonText color="secondary" key={index}>
                                    <h2 id={section.id} className={section.class}>{section.content}</h2>
                                </IonText>
                            );

                        case "h3-heading":
                            return (
                                <IonText color="secondary" key={index}>
                                    <h3 id={section.id} className={section.class}>{section.content}</h3>
                                </IonText>
                            );

                        case "text":
                            return (
                                <IonText key={index}>
                                    <p id={section.id} className={section.class}>{section.content}</p>
                                </IonText>
                            );

                        case "image":
                            return (
                                <IonImg id={section.id} className={section.class} key={index} src={section.src} alt={section.alt} />
                            );

                        case "ordered-list":
                            return (
                                <IonText key={index}>
                                    <ol id={section.id} className={section.class}>
                                        {section.items?.map((item: string, itemIndex: number) => (
                                            <li id={section.id} className={section.class} key={itemIndex}>{item}</li>
                                        ))}
                                    </ol>
                                </IonText>
                            );

                        case "unordered-list":
                            return (
                                <IonText key={index}>
                                    <ul id={section.id} className={section.class}>
                                        {section.items?.map((item: string, itemIndex: number) => (
                                            <li id={section.id} className={section.class} key={itemIndex}>{item}</li>
                                        ))}
                                    </ul>
                                </IonText>
                            );

                        case "button":
                            return (
                                <IonButton id={section.id} className={section.class} key={index} expand="block" href={section.buttonUrl} target={section.buttonUrlTarget} onClick={section.onClick ? buttonActions[section.onClick] : undefined}>
                                    {section.buttonText}
                                    <IonRippleEffect></IonRippleEffect>
                                </IonButton>
                            );

                        case "accordion-group":
                            return (
                                <IonAccordionGroup id={section.id} className={section.class} key={index}>
                                    {section.accordions?.map((accordion, accIndex) => (
                                        <IonAccordion id={section.id} className={section.class} value={`acc-${index}-${accIndex}`} key={accIndex}>
                                            <IonItem id={section.id} className={section.class} slot="header">
                                                <IonLabel id={section.id} className={section.class}>{accordion.header}</IonLabel>
                                            </IonItem>
                                            <div id={section.id} className={`ion-padding ${section.class || ""}`} slot="content">
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
