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
import { ellipse, newspaper, helpBuoyOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import TheLatest from './pages/TheLatest';
import SharkMap from './pages/SharkMap';
import Help from './pages/Help';

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

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/thelatest">
            <TheLatest />
          </Route>
          <Route exact path="/sharkmap">
            <SharkMap />
          </Route>
          <Route path="/help">
            <Help />
          </Route>
          <Route exact path="/">
            <Redirect to="/sharkmap" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="thelatest" href="/thelatest">
            <IonIcon aria-label="The Latest" icon={newspaper} />
            <IonLabel>The Latest</IonLabel>
          </IonTabButton>
          <IonTabButton tab="sharkmap" href="/sharkmap">
            <IonIcon aria-label="See Great Whites" icon={ellipse} />
            <IonLabel>Great Whites</IonLabel>
          </IonTabButton>
          <IonTabButton tab="help" href="/help">
            <IonIcon aria-label="Help" icon={helpBuoyOutline} />
            <IonLabel>Help</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
