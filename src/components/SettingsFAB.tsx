import { useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import {
  add,
  arrowBack,
  arrowDown,
  arrowForward,
  arrowUndo,
  arrowUp,
  fingerPrint,
  helpCircleOutline,
  locate,
  menu,
  pause,
  planetOutline,
  play,
  refresh,
  remove,
  resize,
  settingsOutline,
} from 'ionicons/icons';
import { ActionType, useAppContext } from '~/Context';

const iconDescriptions = [
  { description: 'Open settings modal', icon: settingsOutline },
  { description: 'Open help modal', icon: helpCircleOutline },
  { description: 'Play/Pause simulation', icon: [pause, play] },
  { description: 'Restart simulation', icon: refresh },
  { description: 'Remove last body created', icon: arrowUndo },
  { description: 'Pan', icon: [arrowUp, arrowDown, arrowBack, arrowForward] },
  { description: 'Zoom', icon: [add, remove] },
  { description: 'Reset pan to origin', icon: locate },
  { description: 'Reset zoom', icon: resize },
];

export const SettingsFAB = () => {
  const {
    dispatch,
    state: { bodies, isRunning, selectedSystem },
  } = useAppContext();
  const [isActive, setIsActive] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>
      <IonFab
        activated={isActive}
        slot="fixed"
        vertical="top"
        horizontal="end"
        onClick={() => {
          setIsActive(!isActive);
        }}
      >
        <IonFabButton size="small">
          <IonIcon icon={menu} />
        </IonFabButton>
        <IonFabList side="bottom">
          <IonFabButton
            color="primary"
            id="play-pause"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({
                payload: !isRunning,
                type: ActionType.SetIsRunning,
              });
            }}
          >
            <IonIcon icon={isRunning ? pause : play} />
          </IonFabButton>
          <IonFabButton
            color="primary"
            id="restart"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: ActionType.Restart });
            }}
          >
            <IonIcon icon={refresh} />
          </IonFabButton>
          <IonFabButton color="primary" id="open-modal">
            <IonIcon icon={settingsOutline} />
          </IonFabButton>
          <IonFabButton
            color="primary"
            onClick={() => {
              setIsHelpModalOpen(true);
            }}
          >
            <IonIcon icon={helpCircleOutline} />
          </IonFabButton>
        </IonFabList>
        <IonFabList side="start">
          <IonFabButton
            id="undo"
            color={bodies.length === 0 ? 'medium' : 'primary'}
            disabled={bodies.length === 0}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: ActionType.Undo });
            }}
          >
            <IonIcon icon={arrowUndo} />
          </IonFabButton>
        </IonFabList>
        <IonToast
          trigger="play-pause"
          position="bottom"
          positionAnchor="footer-tabs"
          icon={isRunning ? play : pause}
          duration={isRunning ? 2000 : 1000}
          message={`${!isRunning ? 'Paused ' : 'Running '} ${String(bodies.length)} bodies`}
        />
        <IonToast
          trigger="restart"
          position="bottom"
          positionAnchor="footer-tabs"
          duration={1000}
          message={`Restarted ${selectedSystem} system`}
          icon={refresh}
        />
        <IonToast
          trigger="undo"
          position="bottom"
          positionAnchor="footer-tabs"
          duration={1000}
          message="Removed last body"
          icon={arrowUndo}
        />
      </IonFab>
      <IonModal
        isOpen={isHelpModalOpen}
        onDidDismiss={() => {
          setIsHelpModalOpen(false);
        }}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>How to use</IonTitle>
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  setIsHelpModalOpen(false);
                }}
              >
                Close
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent scrollY={true}>
          <IonList
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
            }}
          >
            {[
              {
                icon: add,
                text: 'Tap to create bodies (if enabled in settings).',
              },
              {
                icon: planetOutline,
                text: 'Select default systems from the systems page.',
              },
              {
                icon: fingerPrint,
                text: 'Use one finger to pan across the space.',
              },
              { icon: resize, text: 'Use two fingers to zoom in and out.' },
            ].map(({ icon, text }, index) => (
              <IonItem key={index} lines="full">
                <IonIcon icon={icon} slot="start" />
                <IonText className="ion-text-wrap ion-text-center">{text}</IonText>
              </IonItem>
            ))}
          </IonList>
          <IonText
            className="ion-text-wrap ion-padding ion-text-center"
            style={{
              display: 'block',
            }}
          >
            Use the buttons below to control the simulation.
          </IonText>
          <IonList style={{ listStyleType: 'none', padding: 0 }}>
            {iconDescriptions.map(({ description, icon }, index) => {
              const icons = Array.isArray(icon) ? icon : [icon];
              return (
                <IonItem
                  key={index}
                  lines="none"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <span style={{ marginRight: 'auto' }}>{description}</span>
                  {icons.map((icon) => (
                    <IonFabButton size="small" color="primary" key={icon}>
                      <IonIcon icon={icon} />
                    </IonFabButton>
                  ))}
                </IonItem>
              );
            })}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};
