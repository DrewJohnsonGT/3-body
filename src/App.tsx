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
import { help, home, planet, settings } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import { FAB } from '~/components';
import { AppContextProvider } from '~/Context';
import { ExamplesPage, HelpPage, HomePage, SettingsPage } from '~/pages';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/palettes/dark.always.css';
import '@ionic/react/css/palettes/dark.class.css';
import '@ionic/react/css/structure.css';
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
    label: 'Examples',
    page: ExamplesPage,
  },
  {
    icon: settings,
    label: 'Settings',
    page: SettingsPage,
  },
  {
    icon: help,
    label: 'Help',
    page: HelpPage,
  },
];

export const App = () => {
  return (
    <IonApp>
      <AppContextProvider>
        <FAB />
        <IonReactRouter forceRefresh>
          <IonTabs>
            <IonRouterOutlet>
              <Redirect exact path="/" to="/home" />
              {TABS.map((tab, index) => (
                <Route key={index} path={`/${tab.label.toLowerCase()}`} exact>
                  <tab.page />
                </Route>
              ))}
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
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
