import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect } from 'react';

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
      <IonContent>Settings List</IonContent>
    </IonPage>
  );
};
