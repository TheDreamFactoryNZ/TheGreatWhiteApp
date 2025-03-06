import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { newspaper, helpBuoyOutline, trophyOutline } from 'ionicons/icons';

import SharkMap from './pages/primary/SharkMap';
import Help from './pages/primary/Help';
import NotFound from './pages/primary/NotFound';

import DynamicPages from './pages/DynamicPages';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Custom Stylesheet */
import './theme/main.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import PageLoading from './pages/primary/PageLoading';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/">
            <Redirect to="/sharkmap" />
          </Route>

          <Route exact path="/sharkmap" component={SharkMap} />

          <Route exact path="/help" component={Help} />
          <Route exact path="/help/:pageKey" component={DynamicPages} />

          <Route exact path="/main/:pageKey" component={DynamicPages} />
          <Route exact path="/loadingtest" component={PageLoading} />

          <Route component={NotFound} />

        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="thelatest" href="/main/TheLatest">
            <IonIcon size="medium" aria-label="The Latest" icon={newspaper} />
            <IonLabel>The Latest</IonLabel>
          </IonTabButton>
          <IonTabButton tab="sharkmap" href="/sharkmap">
            <IonIcon size="medium" id='great-whites-icon' aria-label="See Great Whites" src="./assets/icons/greatwhites.svg" />
            <IonLabel>Great Whites</IonLabel>
          </IonTabButton>
          <IonTabButton tab="help" href="/help">
            <IonIcon size="medium" aria-label="Help" icon={helpBuoyOutline} />
            <IonLabel>Help</IonLabel>
          </IonTabButton>
          <IonTabButton tab="thanks" href="/main/Thanks">
            <IonIcon size="medium" aria-label="Thanks" icon={trophyOutline} />
            <IonLabel>Special Thanks</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
