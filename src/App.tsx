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
import { images, apps, home } from 'ionicons/icons';
import Home from './pages/Home';
import MyInventory from './pages/MyInventory';
import ImageUploader from './pages/ImageUploader';
// Tremor charts
import './theme/tremor.css';
// React bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
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
/* Theme variables */
import './theme/variables.css';
import { useState } from 'react';
import Login from './pages/Login';

setupIonicReact();

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('Michael')
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [userToken, setUserToken] = useState<string>('')

  const renderHome = () => {
    if (isLogin) {
      return (
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/Home">
                  <Home userName={userName} />
                </Route>
                <Route exact path="/MyInventory">
                  <MyInventory token={userToken} />
                </Route>
                <Route path="/ImageUploader">
                  <ImageUploader />
                </Route>
                <Route exact path="/">
                  <Redirect to="/Home" />
                </Route>
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="Home" href="/Home">
                  <IonIcon aria-hidden="true" icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="MyInventory" href="/MyInventory">
                  <IonIcon aria-hidden="true" icon={apps} />
                  <IonLabel>My Inventory</IonLabel>
                </IonTabButton>
                <IonTabButton tab="ImageUploader" href="/ImageUploader">
                  <IonIcon aria-hidden="true" icon={images} />
                  <IonLabel>ImageUploader</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </IonApp>
      )
    } else {
      return <Login
        setLogin={() => setIsLogin(true)}
        setToken={(token: string) => setUserToken(token)}
      />
    }
  }

  return (
    <>
      {renderHome()}
    </>
  )
}

export default App;
