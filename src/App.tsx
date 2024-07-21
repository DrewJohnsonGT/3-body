import { Redirect, Route } from 'react-router-dom';

import { P5Wrapper } from '~/components/P5Wrapper';
import { simulation } from '~/utils/simulation';

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/palettes/dark.always.css';
import '@ionic/react/css/palettes/dark.class.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import { library, playCircle, radio } from 'ionicons/icons';

setupIonicReact();

export const App = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <P5Wrapper sketch={simulation} />
            </Route>
            <Route exact path="/examples">
              <P5Wrapper sketch={simulation} />
            </Route>
            <Route exact path="/settings">
              <P5Wrapper sketch={simulation} />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={playCircle} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="radio" href="/examples">
              <IonIcon icon={radio} />
              <IonLabel>Examples</IonLabel>
            </IonTabButton>

            <IonTabButton tab="library" href="/settings">
              <IonIcon icon={library} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};
