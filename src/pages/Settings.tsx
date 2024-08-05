import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Settings } from '~/components/Settings';

export const SettingsPage = () => {
  return (
    <IonPage
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Settings />
    </IonPage>
  );
};
