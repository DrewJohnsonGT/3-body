import { useRef } from 'react';
import {
  IonAvatar,
  IonContent,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
} from '@ionic/react';

export const SheetModal = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal
      ref={modal}
      trigger="open-modal"
      initialBreakpoint={0.25}
      breakpoints={[0, 0.25, 0.5, 0.75]}>
      <IonContent className="ion-padding">
        <IonSearchbar
          onClick={() => {
            modal.current?.setCurrentBreakpoint(0.75).catch(() => {
              console.log('error setting breakpoint');
            });
          }}
          placeholder="Search"></IonSearchbar>
        <IonList>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=b" />
            </IonAvatar>
            <IonLabel>
              <h2>Connor Smith</h2>
              <p>Sales Rep</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=a" />
            </IonAvatar>
            <IonLabel>
              <h2>Daniel Smith</h2>
              <p>Product Designer</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=d" />
            </IonAvatar>
            <IonLabel>
              <h2>Greg Smith</h2>
              <p>Director of Operations</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src="https://i.pravatar.cc/300?u=e" />
            </IonAvatar>
            <IonLabel>
              <h2>Zoey Smith</h2>
              <p>CEO</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};
