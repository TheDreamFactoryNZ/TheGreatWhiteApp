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
import { aboutGwpContent } from './content/AboutGwpContent'; // Import content

const AboutGwp: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>{aboutGwpContent.title}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                {/* Heading */}
                <IonText>
                    <h2>{aboutGwpContent.heading}</h2>
                </IonText>

                {/* Loop through content sections */}
                {aboutGwpContent.sections.map((section, index) => {
                    if (section.type === "text") {
                        return (
                            <IonText key={index}>
                                <p>{section.content}</p>
                            </IonText>
                        );
                    } else if (section.type ==="list") {
                        return (
                            <IonText key={index}>
                                <ul>{section.content}</ul>
                            </IonText>
                        );
                    } else if (section.type === "image") {
                        return (
                            <IonImg key={index} src={section.src} alt={section.alt} />
                        );
                    } else if (section.type === "grid-images") {
                        return (
                            <IonGrid key={index}>
                                <IonRow>
                                    {section.images.map((img, imgIndex) => (
                                        <IonCol key={imgIndex} size="6">
                                            <IonImg src={img.src} alt={img.alt} />
                                        </IonCol>
                                    ))}
                                </IonRow>
                            </IonGrid>
                        );
                    } else if (section.type === "ordered-list" && section.items?.length) { // ✅ Ensure items exist
                        return (
                            <IonText key={index}>
                                <ul>
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>{item}</li>
                                    ))}
                                </ul>
                            </IonText>
                        );
                    } else if (section.type === "unordered-list" && section.items?.length) { // ✅ Ensure items exist
                        return (
                            <IonText key={index}>
                                <ul>
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>{item}</li>
                                    ))}
                                </ul>
                            </IonText>
                        );
                    }
                    return null;
                })}
            </IonContent>
        </IonPage>
    );
};

export default AboutGwp;