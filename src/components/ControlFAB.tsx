import { useState } from 'react';
import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonToast,
} from '@ionic/react';
import {
  add,
  arrowBack,
  arrowDown,
  arrowForward,
  arrowUp,
  contract,
  expandOutline,
  locate,
  refresh,
  remove,
  resize,
} from 'ionicons/icons';
import { ActionType, useAppContext } from '~/Context';

const PAN_DELTA = 100;

export const ControlFAB = () => {
  const {
    dispatch,
    state: { centerOffset, zoom },
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
        }}>
        <IonFabButton
          id="pan-up"
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              payload: { deltaX: 0, deltaY: PAN_DELTA },
              type: ActionType.Pan,
            });
          }}>
          <IonIcon icon={arrowUp} />
        </IonFabButton>
        <IonFabButton
          id="pan-down"
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              payload: { deltaX: 0, deltaY: -PAN_DELTA },
              type: ActionType.Pan,
            });
          }}>
          <IonIcon icon={arrowDown} />
        </IonFabButton>
        <IonFabButton
          id="pan-left"
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              payload: { deltaX: PAN_DELTA, deltaY: 0 },
              type: ActionType.Pan,
            });
          }}>
          <IonIcon icon={arrowBack} />
        </IonFabButton>
        <IonFabButton
          id="pan-right"
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              payload: { deltaX: -PAN_DELTA, deltaY: 0 },
              type: ActionType.Pan,
            });
          }}>
          <IonIcon icon={arrowForward} />
        </IonFabButton>
      </IonFabList>
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
        <IonFabButton
          id="reset-pan"
          size="small"
          color={
            centerOffset.x !== 0 || centerOffset.y !== 0
              ? 'primary'
              : 'secondary'
          }
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              type: ActionType.ResetPan,
            });
          }}>
          <IonIcon icon={locate} />
        </IonFabButton>
        <IonFabButton
          id="reset-zoom"
          size="small"
          color={zoom !== 1 ? 'primary' : 'secondary'}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              payload: 1,
              type: ActionType.SetZoom,
            });
          }}>
          <IonIcon icon={zoom > 1 ? resize : contract} />
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
      <IonToast
        trigger="reset-pan"
        position="bottom"
        positionAnchor="footer-tabs"
        duration={1000}
        message="Reset to origin"
        icon={locate}
      />
      <IonToast
        trigger="reset-zoom"
        position="bottom"
        positionAnchor="footer-tabs"
        duration={1000}
        message="Reset zoom"
        icon={refresh}
      />
    </IonFab>
  );
};
