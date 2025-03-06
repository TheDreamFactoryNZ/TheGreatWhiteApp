import {
    IonBackButton,
    IonButtons,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonLoading,
    IonContent,
    IonImg,
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

import NotFound from './primary/NotFound';

const DynamicPage: React.FC = () => {

    interface Section {
        type: "section-group" | "text" | "image" | "ordered-list" | "unordered-list" | "button" | "accordion-group" | "h1-heading" | "h2-heading" | "h3-heading";
        id?: string;
        class?: string;
        sections?: Section[];
        content?: string;
        src?: string;
        alt?: string;
        items?: string[];
        buttonText?: string;
        buttonUrl?: string;
        buttonUrlTarget?: string;
        accordions?: { header: string; content: string }[];
        onClick?: keyof typeof buttonActions;
    }

    interface Page {
        title: string;
        heading: string;
        sections: Section[];
    }

    const { pageKey } = useParams<{ pageKey: string }>();
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const contentRef = useRef<HTMLIonContentElement | null>(null);

//    const [present, dismiss] = useIonLoading();

    const scrollToTop = () => {
        if (contentRef.current) {
            contentRef.current.scrollToTop(500);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };


    const buttonActions: Record<string, () => void> = {
        scrollToTop
    };

    const componentMap: Record<string, (section: Section, index: number) => JSX.Element | null> = {
        "text": (section, index) => (
            <IonText className={`para-text ${section.class || ""}`} key={index}>
                <p id={section.id}>{section.content}</p>
            </IonText>
        ),
        "image": (section, index) => (
            <IonImg id={section.id} className={`block-image ${section.class || ""}`} key={index} src={section.src} alt={section.alt} />
        ),
        "ordered-list": (section, index) => (
            <IonText key={index}>
                <ol id={section.id} className={`para-list olist ${section.class || ""}`}>
                    {section.items?.map((item, itemIndex) => (
                        <li className={`list-item ${section.class || ""}`} key={itemIndex}>{item}</li>
                    ))}
                </ol>
            </IonText>
        ),
        "unordered-list": (section, index) => (
            <IonText key={index}>
                <ul id={section.id} className={`para-list ulist ${section.class || ""}`}>
                    {section.items?.map((item, itemIndex) => (
                        <li className={`list-item ${section.class || ""}`} key={itemIndex}>{item}</li>
                    ))}
                </ul>
            </IonText>
        ),
        "button": (section, index) => {
            return (
                <IonButton
                    id={section.id}
                    className={`custombutt ${section.class || ""}`}
                    key={index}
                    expand="block"
                    href={section.buttonUrl}
                    target={section.buttonUrlTarget}
                    onClick={() => {
                        if (section.onClick && buttonActions[section.onClick]) {
                            buttonActions[section.onClick]();
                        }
                    }}
                >
                    {section.buttonText}
                    <IonRippleEffect />
                </IonButton>
            );
        },
        "accordion-group": (section, index) => (
            <IonAccordionGroup id={section.id} className={section.class} key={index}>
                {section.accordions?.map((accordion, accIndex) => (
                    <IonAccordion id={section.id} className={section.class} value={`acc-${index}-${accIndex}`} key={accIndex}>
                        <IonItem id={section.id} className={section.class} slot="header">
                            <IonLabel>{accordion.header}</IonLabel>
                        </IonItem>
                        <div id={section.id} className={`ion-padding ${section.class || ""}`} slot="content">
                            {accordion.content}
                        </div>
                    </IonAccordion>
                ))}
            </IonAccordionGroup>
        ),
        "h1-heading": (section, index) => (
            <IonText color="primary" key={index}>
                <h1 id={section.id} className={section.class}>{section.content}</h1>
            </IonText>
        ),
        "h2-heading": (section, index) => (
            <IonText color="secondary" key={index}>
                <h2 id={section.id} className={section.class}>{section.content}</h2>
            </IonText>
        ),
        "h3-heading": (section, index) => (
            <IonText color="secondary" key={index}>
                <h3 id={section.id} className={section.class}>{section.content}</h3>
            </IonText>
        ),
        "section-group": (section, index) => (
            <div key={index} className={`section-group ${section.class || ""}`} id={section.id}>
                {section.sections?.map((subSection, subIndex) => (
                    componentMap[subSection.type]?.(subSection, subIndex) ?? null
                ))}

            </div>
        ),
    };

    const getPageFile = () => {
        if (window.location.pathname.startsWith("/help")) {
            return "https://map.sustainableoceansociety.co.nz/public/content/help-pages.json";
        }
        if (window.location.pathname.startsWith("/main")) {
            return "https://map.sustainableoceansociety.co.nz/public/content/main-pages.json";
        }
        return null;
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);

                const file = getPageFile();

                if (!file) {
                    setError("Page Not Found");
                    setLoading(false);
                    return;
                }

                const response = await fetch(file);
                const data = await response.json();

                if (!data[pageKey]) {
                    setError("Page Not Found");
                } else {
                    setPage(data[pageKey]);
                }

                if (contentRef.current) {
                    contentRef.current.scrollToTop(0);
                }
            } catch (err) {
                setError("Failed to load content.");
            } finally {
                setHasLoaded(true);
            }
        };

        fetchContent();
    }, [pageKey]);

    useEffect(() => {
        if (hasLoaded) {
            const timer = setTimeout(() => setLoading(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [hasLoaded]);
    
    if (loading) {
        return <IonLoading isOpen={loading} message="Loading..." />;
    }

    if (error || !page) {
        return <NotFound />;
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

                {page.sections
                    .map((section: Section, index: number) => componentMap[section.type]?.(section, index))
                    .filter(Boolean)}

            </IonContent>
        </IonPage>
    );
};

export default DynamicPage;
