import { Route, Redirect } from 'react-router-dom';

/* Theme variables */
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';

/* import '@ionic/react/css/palettes/dark.always.css'; */

/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import { P5Wrapper } from '~/components/P5Wrapper';
import { simulation } from '~/utils/simulation';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

setupIonicReact();

export const App = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <P5Wrapper sketch={simulation} />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};
