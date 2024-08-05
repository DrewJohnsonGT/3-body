import { IonContent, IonPage } from '@ionic/react';
import { P5Wrapper } from '~/components/P5Wrapper';
import { SettingsFAB } from '~/components/SettingsFAB';

export const HomePage = () => {
  return (
    <IonPage>
      <IonContent>
        <SettingsFAB />
        <P5Wrapper />
      </IonContent>
    </IonPage>
  );
};
