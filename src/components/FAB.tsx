import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
import {
  colorPalette,
  globe,
  pauseCircle,
  playCircle,
  refreshCircle,
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
        <IonIcon icon={settings} />
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
      </IonFabList>
      <IonFabList side="bottom">
        <IonFabButton color="primary" onClick={() => [
          dispatch({ type: ActionType.Restart }),
        ]}>
          <IonIcon icon={refreshCircle}></IonIcon>
        </IonFabButton>
        <IonFabButton color="primary">
          <IonIcon icon={colorPalette}></IonIcon>
        </IonFabButton>
        <IonFabButton color="primary">
          <IonIcon icon={globe}></IonIcon>
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );
};
