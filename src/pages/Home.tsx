import { IonContent, IonPage } from '@ionic/react';
import { useEffect } from 'react';
import { P5Wrapper } from '~/components';
import { simulation } from '~/utils/simulation';

export const HomePage = () => {
  useEffect(() => {
    console.log('Home page mount');
    return () => {
      console.log('Home page unmount');
    };
  }, []);
  return (
    <IonPage>
      <IonContent>
        <P5Wrapper sketch={simulation} />
      </IonContent>
    </IonPage>
  );
};
