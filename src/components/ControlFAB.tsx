import { useState } from 'react';
import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonToast,
} from '@ionic/react';
import { add, expandOutline, remove } from 'ionicons/icons';
import { ActionType, useAppContext } from '~/Context';

export const ControlFAB = () => {
  const {
    dispatch,
    state: { zoom },
  } = useAppContext();

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
        }}
      />
      <IonFabList side="bottom">
        <IonFabButton
          id="zoom-in"
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              type: ActionType.ZoomIn,
            });
          }}>
          <IonIcon icon={add} />
        </IonFabButton>
        <IonFabButton
          id="zoom-out"
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              type: ActionType.ZoomOut,
            });
          }}>
          <IonIcon icon={remove} />
        </IonFabButton>
      </IonFabList>
      <IonToast
        trigger="zoom-in"
        position="bottom"
        positionAnchor="footer-tabs"
        duration={2000}
        icon={add}
        message={`Zoom: ${String(zoom.toFixed(3))}`}
      />
      <IonToast
        trigger="zoom-out"
        position="bottom"
        positionAnchor="footer-tabs"
        duration={2000}
        icon={remove}
        message={`Zoom: ${String(zoom.toFixed(3))}`}
      />
    </IonFab>
  );
};
