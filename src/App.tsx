import { Redirect, Route } from 'react-router-dom';
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
import { home, informationCircle, planet, settings } from 'ionicons/icons';
import { AppContextProvider } from '~/Context';
import { AboutPage, HomePage, SettingsPage, SystemsPage } from '~/pages';
import '@ionic/react/css/core.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/palettes/dark.always.css';
import '@ionic/react/css/palettes/dark.class.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

const TABS = [
  {
    icon: home,
    label: 'Home',
    page: HomePage,
  },
  {
    icon: planet,
    label: 'Systems',
    page: SystemsPage,
  },
  {
    icon: settings,
    label: 'Settings',
    page: SettingsPage,
  },
  {
    icon: informationCircle,
    label: 'About',
    page: AboutPage,
  },
];

export const App = () => {
  return (
    <IonApp>
      <AppContextProvider>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Redirect exact path="/" to="/home" />
              {TABS.map((tab, index) => (
                <Route key={index} path={`/${tab.label.toLowerCase()}`} exact>
                  <tab.page />
                </Route>
              ))}
            </IonRouterOutlet>
            <IonTabBar
              id="footer-tabs"
              slot="bottom"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              {TABS.map((tab, index) => (
                <IonTabButton
                  key={index}
                  tab={tab.label.toLowerCase()}
                  href={`/${tab.label.toLowerCase()}`}>
                  <IonIcon icon={tab.icon} />
                  <IonLabel>{tab.label}</IonLabel>
                </IonTabButton>
              ))}
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </AppContextProvider>
    </IonApp>
  );
};
