import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  useIonToast,
} from '@ionic/react';
import {
  addCircle,
  menu,
  pauseCircle,
  playCircle,
  refreshCircle,
  removeCircle,
  settings,
} from 'ionicons/icons';
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
      <IonFabButton>
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
          <IonIcon icon={isRunning ? pauseCircle : playCircle}></IonIcon>
        </IonFabButton>
        <IonFabButton
          color="primary"
          onClick={() => {
            dispatch({ type: ActionType.Restart });
          }}>
          <IonIcon icon={refreshCircle}></IonIcon>
        </IonFabButton>
        <IonFabButton
          color="primary"
          onClick={() => {
            dispatch({
              type: ActionType.ZoomIn,
            });
          }}>
          <IonIcon icon={addCircle}></IonIcon>
        </IonFabButton>
        <IonFabButton
          color="primary"
          onClick={() => {
            dispatch({
              type: ActionType.ZoomOut,
            });
          }}>
          <IonIcon icon={removeCircle}></IonIcon>
        </IonFabButton>
      </IonFabList>
      <IonFabList side="bottom">
        <IonFabButton color="primary" id="open-modal">
          <IonIcon icon={settings}></IonIcon>
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );
};
