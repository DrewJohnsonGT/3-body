import { useState } from 'react';
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
import { add, expandOutline, remove } from 'ionicons/icons';
import { ActionType, useAppContext } from '~/Context';

export const ControlFAB = () => {
  const { dispatch } = useAppContext();

  const [isActivated, setIsActivated] = useState(false);
  return (
    <IonFab
      activated={isActivated}
      slot="fixed"
      vertical="top"
      horizontal="start"
      onClick={() => {
        setIsActivated(!isActivated);
      }}>
      <IonFabButton size="small">
        <IonIcon icon={expandOutline} />
      </IonFabButton>
      <IonFabList
        side="end"
        onClick={(e) => {
          e.stopPropagation();
        }}></IonFabList>
      <IonFabList side="bottom">
        <IonFabButton
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              type: ActionType.ZoomIn,
            });
          }}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
        <IonFabButton
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              type: ActionType.ZoomOut,
            });
          }}>
          <IonIcon icon={remove}></IonIcon>
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );
};
