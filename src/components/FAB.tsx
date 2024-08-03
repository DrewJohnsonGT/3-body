import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
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

export const FAB = () => {
  const {
    dispatch,
    state: { isRunning },
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
      <IonFabList side="start">
        <IonFabButton
          color="primary"
          onClick={() => {
            dispatch({
              payload: !isRunning,
              type: ActionType.SetIsRunning,
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
