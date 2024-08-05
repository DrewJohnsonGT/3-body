import { IonContent, IonPage } from '@ionic/react';
import { ControlFAB } from '~/components/ControlFAB';
import { P5Wrapper } from '~/components/P5Wrapper';
import { SettingsFAB } from '~/components/SettingsFAB';

export const HomePage = () => {
  return (
    <IonPage>
      <IonContent>
        <SettingsFAB />
        <ControlFAB />
        <P5Wrapper />
      </IonContent>
    </IonPage>
  );
};
