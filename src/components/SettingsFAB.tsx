import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  useIonToast,
} from '@ionic/react';
import { menu, pause, play, refresh, settingsOutline } from 'ionicons/icons';
import { ActionType, useAppContext } from '~/Context';

export const SettingsFAB = () => {
  const [present] = useIonToast();
  const {
    dispatch,
    state: { bodies, isRunning },
  } = useAppContext();
  return (
    <IonFab
      slot="fixed"
      vertical="top"
      horizontal="end"
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <IonFabButton size="small">
        <IonIcon icon={menu} />
      </IonFabButton>
      <IonFabList
        side="start"
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <IonFabButton
          color="primary"
          onClick={() => {
            dispatch({
              payload: !isRunning,
              type: ActionType.SetIsRunning,
            });
            present({
              duration: isRunning ? 2000 : 1000,
              message: isRunning
                ? `Paused ${String(bodies.length)} bodies`
                : 'Running',
              position: 'middle',
            }).catch((e: unknown) => {
              console.error('Error presenting toast', e);
            });
          }}>
          <IonIcon icon={isRunning ? pause : play}></IonIcon>
        </IonFabButton>
        <IonFabButton
          color="primary"
          onClick={() => {
            dispatch({ type: ActionType.Restart });
          }}>
          <IonIcon icon={refresh}></IonIcon>
        </IonFabButton>
      </IonFabList>
      <IonFabList side="bottom">
        <IonFabButton color="primary" id="open-modal">
          <IonIcon icon={settingsOutline}></IonIcon>
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );
};
