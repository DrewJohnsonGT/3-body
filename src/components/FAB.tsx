import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  chevronDownCircle,
  chevronUpCircle,
  colorPalette,
  document,
  globe,
  pauseCircle,
} from 'ionicons/icons';
import { useAppContext, ActionType } from '~/Context';

export const FAB = () => {
  const {
    state: { isRunning },
    dispatch,
  } = useAppContext();
  return (
    <>
      <IonFab slot="fixed" vertical="top" horizontal="start">
        <IonFabButton>
          <IonIcon
            icon={pauseCircle}
            onClick={() =>
              dispatch({
                type: ActionType.SetIsRunning,
                payload: !isRunning,
              })
            }></IonIcon>
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
