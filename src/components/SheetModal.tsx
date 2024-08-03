import { useRef } from 'react';
import {
  IonContent,
  IonItem,
  IonList,
  IonModal,
  IonRange,
  IonToggle,
} from '@ionic/react';
import { ActionType, useAppContext } from '~/Context';

export const SheetModal = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const {
    dispatch,
    state: { gravityMultiplier, showTrails, trailLength },
  } = useAppContext();

  return (
    <IonModal
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      ref={modal}
      trigger="open-modal"
      initialBreakpoint={0.25}
      breakpoints={[0, 0.25, 0.5, 0.75]}>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonToggle
              enableOnOffLabels={true}
              labelPlacement="start"
              checked={showTrails}
              onIonChange={() => {
                dispatch({
                  payload: !showTrails,
                  type: ActionType.SetShowTrails,
                });
              }}>
              Show Trails
            </IonToggle>
          </IonItem>
          {showTrails && (
            <IonItem>
              <IonRange
                onIonChange={({ detail }) => {
                  dispatch({
                    payload: detail.value as number,
                    type: ActionType.SetTrailLength,
                  });
                }}
                max={2500}
                min={1}
                value={trailLength}
                labelPlacement="start"
                label="Trail length"
              />
            </IonItem>
          )}
          <IonItem>
            <IonRange
              onIonChange={({ detail }) => {
                dispatch({
                  payload: detail.value as number,
                  type: ActionType.SetGravityMultiplier,
                });
              }}
              max={10}
              min={1}
              value={gravityMultiplier}
              labelPlacement="start"
              label="Gravity Multiplier"
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};
