import { useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { FAB, P5Wrapper } from '~/components';

export const HomePage = () => {
  useEffect(() => {
    console.log('Home page mount');
    return () => {
      console.log('Home page unmount');
    };
  }, []);
  return (
    <IonPage>
      <IonContent>
        <FAB />
        <P5Wrapper />
      </IonContent>
    </IonPage>
  );
};
