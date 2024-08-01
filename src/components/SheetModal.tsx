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
    state: { showTrails },
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
          <IonItem>
            <IonRange
              onIonChange={({ detail }) => {
                console.log('ionChange emitted value: ' + detail.value);
              }}
              labelPlacement="start"
              label="Trail length"
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};
