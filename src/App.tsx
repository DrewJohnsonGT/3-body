import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonModal,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { help, home, planet, settings } from 'ionicons/icons';
import { Settings } from '~/components';
import { AppContextProvider } from '~/Context';
import { HelpPage, HomePage, SettingsPage, SystemsPage } from '~/pages';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/palettes/dark.always.css';
import '@ionic/react/css/palettes/dark.class.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/padding.css';

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
    icon: help,
    label: 'Help',
    page: HelpPage,
  },
];

export const App = () => {
  return (
    <IonApp>
      <AppContextProvider>
        <IonModal
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          trigger="open-modal"
          initialBreakpoint={0.5}
          breakpoints={[0, 0.25, 0.5, 0.95]}>
          <Settings />
        </IonModal>
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
