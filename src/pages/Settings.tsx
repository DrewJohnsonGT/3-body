import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Settings } from '~/components/Settings';

export const SettingsPage = () => {
  return (
    <IonPage
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle
            style={{
              textAlign: 'center',
            }}>
            Settings
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <Settings />
    </IonPage>
  );
};
