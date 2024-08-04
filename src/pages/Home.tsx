import { IonContent, IonPage } from '@ionic/react';
import { FAB, P5Wrapper } from '~/components';

export const HomePage = () => {
  return (
    <IonPage>
      <IonContent>
        <FAB />
        <P5Wrapper />
      </IonContent>
    </IonPage>
  );
};
