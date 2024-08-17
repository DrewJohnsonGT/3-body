/* eslint-disable max-lines */
import { RgbColorPicker } from 'react-colorful';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonRange,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToggle,
} from '@ionic/react';
import {
  MAX_CUSTOM_BODY_MASS,
  MAX_GRAVITY_MULTIPLIER,
  MAX_TRAIL_LENGTH,
  MIN_CUSTOM_BODY_MASS,
  MIN_GRAVITY_MULTIPLIER,
  MIN_TRAIL_LENGTH,
} from '~/constants';
import {
  ActionType,
  NewBodyColorType,
  NewBodyType,
  useAppContext,
} from '~/Context';
import {
  COLOR_PALETTES,
  ColorPaletteColor,
  getBackgroundColor,
  rgbColorToString,
} from '~/utils/color';

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
          onIonInput={({ detail }) => {
            onIonChange(detail.value as number);
          }}
          {...rangeProps}
          value={value}
        />
      </IonRow>
    </IonGrid>
  </IonItem>
);

export const Settings = () => {
  const {
    dispatch,
    state: {
      gravityMultiplier,
      newBodyColor,
      newBodyColorPalette,
      newBodyColorType,
      newBodyCustomMass,
      newBodyMassType,
      showStars,
      showTrails,
      starCount,
      starSize,
      tapToCreate,
      trailLength,
    },
  } = useAppContext();

  return (
    <IonContent>
      <IonList lines="full">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Display</IonLabel>
          </IonItemDivider>
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
                max: MAX_TRAIL_LENGTH,
                min: MIN_TRAIL_LENGTH,
              }}
            />
          )}
          <IonItem>
            <IonToggle
              enableOnOffLabels={true}
              labelPlacement="start"
              checked={showStars}
              onIonChange={() => {
                dispatch({
                  payload: !showStars,
                  type: ActionType.SetShowStars,
                });
              }}>
              <IonLabel>
                <IonText>Show stars</IonText>
                <br />
                <IonNote color="medium" className="ion-text-wrap">
                  Stars will be visible in the background
                </IonNote>
              </IonLabel>
            </IonToggle>
          </IonItem>
          {showStars && (
            <RangeSettingsItem
              label="Star count"
              value={starCount}
              onIonChange={(value) => {
                dispatch({
                  payload: value,
                  type: ActionType.SetStarCount,
                });
              }}
              rangeProps={{
                max: 1000,
                min: 0,
              }}
            />
          )}
          {showStars && (
            <RangeSettingsItem
              label="Star size"
              value={starSize}
              onIonChange={(value) => {
                dispatch({
                  payload: value,
                  type: ActionType.SetStarSize,
                });
              }}
              rangeProps={{
                max: 10,
                min: 1,
              }}
            />
          )}
        </IonItemGroup>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Physics</IonLabel>
          </IonItemDivider>
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
              max: MAX_GRAVITY_MULTIPLIER,
              min: MIN_GRAVITY_MULTIPLIER,
            }}
          />
        </IonItemGroup>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>New Body</IonLabel>
          </IonItemDivider>
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
            <IonGrid>
              <IonRow class="ion-margin-bottom">
                <IonLabel>
                  <IonText>New Body Mass</IonText>
                </IonLabel>
              </IonRow>
              <IonRow>
                <IonSegment
                  value={newBodyMassType}
                  onIonChange={({ detail }) => {
                    detail.value &&
                      dispatch({
                        payload: detail.value as NewBodyType,
                        type: ActionType.SetNewBodyMassType,
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
          {newBodyMassType === 'custom' && (
            <RangeSettingsItem
              label="Mass"
              value={newBodyCustomMass}
              onIonChange={(value) => {
                dispatch({
                  payload: value,
                  type: ActionType.SetNewBodyMass,
                });
              }}
              rangeProps={{
                max: MAX_CUSTOM_BODY_MASS,
                min: MIN_CUSTOM_BODY_MASS,
              }}
            />
          )}
          <IonItem>
            <IonGrid>
              <IonRow class="ion-margin-bottom">
                <IonLabel>
                  <IonText>New Body Color</IonText>
                </IonLabel>
              </IonRow>
              <IonRow class="ion-padding-bottom">
                <IonSegment
                  value={newBodyColorType}
                  onIonChange={({ detail }) => {
                    detail.value &&
                      dispatch({
                        payload: detail.value as NewBodyColorType,
                        type: ActionType.SetNewBodyColorType,
                      });
                  }}>
                  <IonSegmentButton value="random">
                    <IonLabel>Random</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="theme">
                    <IonLabel>Theme</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="custom">
                    <IonLabel>Custom</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonRow>
              {newBodyColorType === 'random' && (
                <IonRow class="ion-justify-content-center">
                  <IonLabel>
                    <IonNote
                      color="medium"
                      className="ion-text-wrap ion-text-center">
                      New bodies will have a random color
                    </IonNote>
                  </IonLabel>
                </IonRow>
              )}
              {newBodyColorType === 'custom' && (
                <>
                  <IonRow class="ion-justify-content-center">
                    <IonLabel>
                      <IonNote
                        color="medium"
                        className="ion-text-wrap ion-text-center">
                        New bodies will all have this color
                      </IonNote>
                    </IonLabel>
                  </IonRow>
                  <IonRow class="ion-padding ion-justify-content-center ion-align-items-center">
                    <RgbColorPicker
                      color={newBodyColor}
                      onChange={(color) => {
                        dispatch({
                          payload: color,
                          type: ActionType.SetNewBodyColor,
                        });
                      }}
                    />
                  </IonRow>
                  <IonRow className="ion-justify-content-center ion-align-items-center">
                    <div
                      style={{
                        backgroundColor: rgbColorToString(newBodyColor),
                        border: `2px solid ${getBackgroundColor(newBodyColor)}`,
                        borderRadius: '50%',
                        height: '4rem',
                        width: '4rem',
                      }}
                    />
                  </IonRow>
                </>
              )}
              {newBodyColorType === 'theme' && (
                <>
                  <IonRow>
                    <IonSelect
                      aria-label="New Body Theme Color"
                      interface="popover"
                      onIonChange={(e) => {
                        e.detail.value &&
                          dispatch({
                            payload: e.detail.value as ColorPaletteColor,
                            type: ActionType.SetNewBodyColorPalette,
                          });
                      }}
                      value={newBodyColorPalette}>
                      {Object.keys(COLOR_PALETTES).map((paletteColor) => (
                        <IonSelectOption
                          key={paletteColor}
                          value={paletteColor}>
                          {paletteColor.charAt(0).toUpperCase() +
                            paletteColor.slice(1).toLocaleLowerCase()}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonRow>
                  <IonRow class="ion-full-width ion-text-center">
                    <IonLabel>
                      <IonNote
                        color="medium"
                        className="ion-text-wrap ion-text-center">
                        New bodies will have one of these colors
                      </IonNote>
                    </IonLabel>
                  </IonRow>
                  <IonRow class="ion-justify-content-center">
                    {COLOR_PALETTES[newBodyColorPalette].map((color) => (
                      <div
                        key={color}
                        style={{
                          backgroundColor: color,
                          borderRadius: '50%',
                          height: '2rem',
                          margin: '0.5rem',
                          width: '2rem',
                        }}
                      />
                    ))}
                  </IonRow>
                </>
              )}
            </IonGrid>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </IonContent>
  );
};
