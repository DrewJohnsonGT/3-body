import { HexColorPicker } from 'react-colorful';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonRange,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonToggle,
} from '@ionic/react';
import { ActionType, NewBodyType, useAppContext } from '~/Context';
import { getBackgroundColor } from '~/utils/color';

const RangeSettingsItem = ({
  label,
  onIonChange,
  rangeProps,
  value,
}: {
  label: string;
  value: number;
  onIonChange: (value: number) => void;
  rangeProps: {
    max: number;
    min: number;
  };
}) => (
  <IonItem>
    <IonGrid>
      <IonRow class="ion-justify-content-between">
        <IonCol size="6">
          <IonLabel>{label}</IonLabel>
        </IonCol>
        <IonCol size="2">
          <IonLabel>{value}</IonLabel>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonRange
          onIonChange={({ detail }) => {
            onIonChange(detail.value as number);
          }}
          {...rangeProps}
          value={value}
        />
      </IonRow>
    </IonGrid>
  </IonItem>
);

export const SheetModal = () => {
  const {
    dispatch,
    state: {
      gravityMultiplier,
      newBodyColor,
      newBodyMass,
      newBodyType,
      showTrails,
      tapToCreate,
      trailLength,
    },
  } = useAppContext();

  return (
    <IonModal
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      trigger="open-modal"
      initialBreakpoint={0.5}
      breakpoints={[0, 0.25, 0.5, 0.95]}>
      <IonContent>
        <IonList lines="full">
          <IonItem>
            <IonToggle
              enableOnOffLabels={true}
              labelPlacement="start"
              checked={tapToCreate}
              onIonChange={() => {
                dispatch({
                  type: ActionType.ToggleTapToCreate,
                });
              }}>
              <IonLabel>
                <IonText>Tap to create body</IonText>
                <br />
                <IonNote color="medium" className="ion-text-wrap">
                  Tapping on the screen will create a new body at that location
                </IonNote>
              </IonLabel>
            </IonToggle>
          </IonItem>
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
              <IonLabel>
                <IonText>Show trails</IonText>
                <br />
                <IonNote color="medium" className="ion-text-wrap">
                  Bodies will leave a trail behind them
                </IonNote>
              </IonLabel>
            </IonToggle>
          </IonItem>
          {showTrails && (
            <RangeSettingsItem
              label="Trail length"
              value={trailLength}
              onIonChange={(value) => {
                dispatch({
                  payload: value,
                  type: ActionType.SetTrailLength,
                });
              }}
              rangeProps={{
                max: 500,
                min: 1,
              }}
            />
          )}
          <RangeSettingsItem
            label="Gravity multiplier"
            value={gravityMultiplier}
            onIonChange={(value) => {
              dispatch({
                payload: value,
                type: ActionType.SetGravityMultiplier,
              });
            }}
            rangeProps={{
              max: 10,
              min: 0,
            }}
          />
          <IonItem>
            <IonGrid>
              <IonRow class="ion-margin-bottom">
                <IonLabel>
                  <IonText>New Body</IonText>
                  <br />
                  <IonNote color="medium" className="ion-text-wrap">
                    New bodies will be created with random or custom properties
                    - mass and color
                  </IonNote>
                </IonLabel>
              </IonRow>
              <IonRow>
                <IonSegment
                  value={newBodyType}
                  onIonChange={({ detail }) => {
                    detail.value &&
                      dispatch({
                        payload: detail.value as NewBodyType,
                        type: ActionType.SetNewBodyType,
                      });
                  }}>
                  <IonSegmentButton value="random">
                    <IonLabel>Random</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="custom">
                    <IonLabel>Custom</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonRow>
            </IonGrid>
          </IonItem>
          {newBodyType === 'custom' && (
            <RangeSettingsItem
              label="Mass"
              value={newBodyMass}
              onIonChange={(value) => {
                dispatch({
                  payload: value,
                  type: ActionType.SetNewBodyMass,
                });
              }}
              rangeProps={{
                max: 100,
                min: 1,
              }}
            />
          )}
          {newBodyType === 'custom' && (
            <IonItem>
              <IonGrid>
                <IonRow>
                  <IonLabel>
                    <IonText>Color</IonText>
                    <br />
                    <IonNote color="medium" className="ion-text-wrap">
                      Select the color of newly created bodies
                    </IonNote>
                  </IonLabel>
                </IonRow>
                <IonRow class="ion-padding">
                  <HexColorPicker
                    color={newBodyColor}
                    onChange={(color) => {
                      dispatch({
                        payload: color,
                        type: ActionType.SetNewBodyColor,
                      });
                    }}
                  />
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    <IonLabel>
                      <IonText
                        style={{
                          backgroundColor: getBackgroundColor(newBodyColor),
                          color: newBodyColor,
                          padding: '0.5rem',
                        }}>
                        {newBodyColor}
                      </IonText>
                    </IonLabel>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonModal>
  );
};
