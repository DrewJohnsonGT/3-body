import { IonContent, IonModal, IonPage } from '@ionic/react';
import { ControlFAB } from '~/components/ControlFAB';
import { P5Wrapper } from '~/components/P5Wrapper';
import { Settings } from '~/components/Settings';
import { SettingsFAB } from '~/components/SettingsFAB';

export const HomePage = () => {
  return (
    <IonPage>
      <IonContent scrollY={false}>
        <IonModal
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          trigger="open-modal"
          initialBreakpoint={0.5}
          breakpoints={[0, 0.25, 0.5, 0.95]}>
          <Settings />
        </IonModal>
        <SettingsFAB />
        <ControlFAB />
        <P5Wrapper />
      </IonContent>
    </IonPage>
  );
};
