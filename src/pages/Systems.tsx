import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
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

export const SystemsPage = () => {
  const {
    dispatch,
    state: { selectedSystem },
  } = useAppContext();
  return (
    <IonPage
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Systems</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {Object.entries(SYSTEMS_MAP).map(([key, value]) => {
          const isSelected = selectedSystem === (key as System);
          return (
            <IonCard
              key={key}
              style={{
                border: `1px solid ${isSelected ? 'var(--ion-color-primary)' : 'transparent'}`,
              }}>
              <img alt={key} src={`/images/${key.toLowerCase()}.webp`} />
              <IonCardHeader>
                <IonCardTitle>{value.title}</IonCardTitle>
                <IonCardSubtitle>{value.bodies} bodies</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>{value.description}</IonText>
                <br />
                <br />
                <IonRow class="ion-justify-content-between">
                  <IonButton
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
                    }}>
                    View
                  </IonButton>
                  <IonButton
                    fill={isSelected ? 'clear' : 'outline'}
                    disabled={isSelected}
                    onClick={() => {
                      dispatch({
                        payload: key as System,
                        type: ActionType.SetSelectedSystem,
                      });
                    }}>
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
