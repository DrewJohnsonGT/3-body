import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { ActionType, useAppContext } from '~/Context';
import { System, SYSTEMS_MAP } from '~/utils/systems';

const getSystemPreviewFileName = (systemName: string) => {
  return `/images/${systemName.replace(/ /g, '-').toLowerCase()}.gif`;
};

export const SystemsPage = () => {
  const {
    dispatch,
    state: { selectedSystem },
  } = useAppContext();
  return (
    <IonPage
      onClick={(e) => {
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
    >
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle
            style={{
              textAlign: 'center',
            }}
          >
            Systems
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-text-center">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Systems</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonText color="medium" className="ion-text-wrap">
          Explore different predefined systems of bodies. <br />
          Some are stable and will run in a pattern forever, while others are
          chaotic and will behave in unpredictable ways!
        </IonText>
        {Object.entries(SYSTEMS_MAP).map(([key, value]) => {
          const isSelected = selectedSystem === (key as System);
          return (
            <IonCard
              key={key}
              style={{
                border: `2px solid ${isSelected ? 'var(--ion-color-primary)' : 'var(--ion-color-medium)'}`,
                margin: '1rem auto',
                maxWidth: '600px',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  backgroundColor: 'black',
                  display: 'flex',
                  justifyContent: 'center',
                  maxHeight: '150px',
                }}
              >
                <img
                  alt={key}
                  src={getSystemPreviewFileName(key)}
                  style={{
                    maxHeight: '150px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <IonCardHeader>
                <IonCardTitle
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  {value.title}
                  <IonChip color={value.stable ? 'success' : 'danger'}>
                    {value.stable ? 'Stable' : 'Chaotic'}
                  </IonChip>
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>{value.description}</IonText>
                <br />
                <br />
                <IonRow
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <IonButton
                    size="small"
                    fill="outline"
                    routerLink="/home"
                    onClick={() => {
                      dispatch({
                        payload: key as System,
                        type: ActionType.SetSelectedSystem,
                      });
                      dispatch({
                        type: ActionType.Restart,
                      });
                    }}
                  >
                    View
                  </IonButton>
                  <IonButton
                    size="small"
                    fill={isSelected ? 'clear' : 'outline'}
                    disabled={isSelected}
                    onClick={() => {
                      dispatch({
                        payload: key as System,
                        type: ActionType.SetSelectedSystem,
                      });
                    }}
                  >
                    {isSelected ? 'Default' : 'Set as default'}
                  </IonButton>
                </IonRow>
              </IonCardContent>
            </IonCard>
          );
        })}
      </IonContent>
    </IonPage>
  );
};
