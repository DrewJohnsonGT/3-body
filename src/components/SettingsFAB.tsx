import { useState } from 'react';
import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonToast,
} from '@ionic/react';
import { menu, pause, play, refresh, settingsOutline } from 'ionicons/icons';
import { ActionType, useAppContext } from '~/Context';

export const SettingsFAB = () => {
  const {
    dispatch,
    state: { bodies, isRunning },
  } = useAppContext();

  const [isActive, setIsActive] = useState(false);
  return (
    <IonFab
      activated={isActive}
      slot="fixed"
      vertical="top"
      horizontal="end"
      onClick={() => {
        setIsActive(!isActive);
      }}>
      <IonFabButton size="small">
        <IonIcon icon={menu} />
      </IonFabButton>
      <IonFabList side="start">
        <IonFabButton
          color="primary"
          id="play-pause"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              payload: !isRunning,
              type: ActionType.SetIsRunning,
            });
          }}>
          <IonIcon icon={isRunning ? pause : play}></IonIcon>
        </IonFabButton>
        <IonFabButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
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
      <IonToast
        trigger="play-pause"
        position="bottom"
        positionAnchor="footer-tabs"
        duration={isRunning ? 2000 : 1000}
        message={
          !isRunning ? `Paused ${String(bodies.length)} bodies` : 'Running'
        }
      />
    </IonFab>
  );
};
