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

import './dynamicpages.css'; // Default styles

const DynamicPage: React.FC = () => {

    interface Section {
        type: "section-item" | "text" | "image" | "ordered-list" | "unordered-list" | "button" | "accordion-group" | "h1-heading" | "h2-heading" | "h3-heading";
        id?: string;
        class?: string;
        "section-content"?: Section[];
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
        backButtonHref?: string;
        title: string;
        heading: string;
        stylesheet?: string; // This is currently inactive
        sections: Section[];
    }

    const { pageKey } = useParams<{ pageKey: string }>();
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const contentRef = useRef<HTMLIonContentElement | null>(null);

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

    const componentMap: Record<string, (section: Section, index: number) => any> = {
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
        "section-item": (section, index) => (
            <section key={index} className={`section-item ${section.class || ""}`} id={section.id}>
                {section["section-content"]?.map((subSection, subIndex) => (
                    componentMap[subSection.type]?.(subSection, subIndex) ?? null
                ))}
            </section>
        ),
    };

    const getPageFile = () => {
        if (window.location.pathname.startsWith("/help")) {
            return "https://map.sustainableoceansociety.co.nz/public/app-content/help-pages.json";
        }
        if (window.location.pathname.startsWith("/main")) {
            return "https://map.sustainableoceansociety.co.nz/public/app-content/main-pages.json";
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

                    if (data[pageKey].stylesheet) {
                        loadStylesheet(`https://map.sustainableoceansociety.co.nz/public/app-stylesheets/${data[pageKey].stylesheet}`);
                    }
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

    // Dynamic stylesheets **INACTIVE**

    // A custom stylesheet can be specified for pages in the json files.
    // If a stylesheet is specified, it will be loaded for that particular page
    // This feature is currently inactive because there is a bug where the stylesheet for one page will then apply to all pages.
    // More investigation required!

    const loadStylesheet = (url: string) => {
        const stylesheetId = `dynamic-css-${pageKey}`;
    
        const existingLink = document.getElementById(stylesheetId);
        if (existingLink) {
            existingLink.remove();
        }
    
        const link = document.createElement("link");
        link.id = stylesheetId;  // Use a unique ID for each page
        link.rel = "stylesheet";
        link.href = url;
    
        // Append the new stylesheet to the <head>
        document.head.appendChild(link);
    };
    

    useEffect(() => {
        if (hasLoaded) {
            const timer = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(timer);
        }
    }, [hasLoaded]);

    if (loading) {
        return <IonLoading spinner={'bubbles'} cssClass={`page-loader ${loading ? '' : 'page-loader--hidden'}`} isOpen={loading} message="Loading..." />;
    }

    if (error || !page) {
        return <NotFound />;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        {page?.backButtonHref ? (
                            <IonBackButton defaultHref={page.backButtonHref} />
                        ) : (
                            <IonBackButton />
                        )}
                    </IonButtons>
                    <IonTitle>{page.title}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent ref={contentRef} className="ion-padding">
                <IonText>
                    <h1 className='ion-text-center'>{page.heading}</h1>
                </IonText>

                {(page.sections
                    .map((section: Section, index: number) => componentMap[section.type]?.(section, index)) as any)}

            </IonContent>
        </IonPage>
    );
};

export default DynamicPage;
