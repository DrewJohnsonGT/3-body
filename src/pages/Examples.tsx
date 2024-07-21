import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

export const ExamplesPage = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Examples</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>Examples List</IonContent>
    </IonPage>
  );
};
