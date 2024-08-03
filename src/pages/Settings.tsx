import { useEffect } from 'react';
import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Settings } from '~/components';

export const SettingsPage = () => {
  useEffect(() => {
    console.log('Settings page mount');
    return () => {
      console.log('Settings page unmount');
    };
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Settings />
    </IonPage>
  );
};
