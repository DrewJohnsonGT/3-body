import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
import {
  chevronDownCircle,
  chevronUpCircle,
  colorPalette,
  document,
  globe,
  pauseCircle,
} from 'ionicons/icons';
import { ActionType, useAppContext } from '~/Context';

export const FAB = () => {
  const {
    dispatch,
    state: { isRunning },
  } = useAppContext();
  return (
    <>
      <IonFab slot="fixed" vertical="top" horizontal="start">
        <IonFabButton>
          <IonIcon
            icon={pauseCircle}
            onClick={() => {
              dispatch({
                payload: !isRunning,
                type: ActionType.SetIsRunning,
              });
            }}></IonIcon>
        </IonFabButton>
        <IonFabList side="end">
          <IonFabButton>
            <IonIcon icon={document}></IonIcon>
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={colorPalette}></IonIcon>
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={globe}></IonIcon>
          </IonFabButton>
        </IonFabList>
      </IonFab>

      <IonFab slot="fixed" vertical="top" horizontal="end" edge={true}>
        <IonFabButton>
          <IonIcon icon={chevronDownCircle}></IonIcon>
        </IonFabButton>
        <IonFabList side="bottom">
          <IonFabButton>
            <IonIcon icon={document}></IonIcon>
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={colorPalette}></IonIcon>
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={globe}></IonIcon>
          </IonFabButton>
        </IonFabList>
      </IonFab>

      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonIcon icon={chevronUpCircle}></IonIcon>
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton>
            <IonIcon icon={document}></IonIcon>
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={colorPalette}></IonIcon>
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={globe}></IonIcon>
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </>
  );
};
