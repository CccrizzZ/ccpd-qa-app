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
import { images, apps, home, search } from 'ionicons/icons';
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
import './theme/font.css';
import axios, { AxiosError } from 'axios';
import { createContext, useEffect, useState } from 'react';
import Login from './pages/Login';
import LoadingSpiner from './components/LoadingSpiner';
import { UserInfo } from './utils/Types';
import SkuQuery from './pages/SkuQuery';
setupIonicReact();

// type for app context
type ContextType = {
  setLoading: (l: boolean) => void
  userInfo: UserInfo
}

export const AppContext = createContext({} as ContextType)
const App: React.FC = () => {
  // current user info
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    name: ''
  })
  const [isLogin, setIsLogin] = useState<boolean>(false) // login flag
  const [isLoading, setIsLoading] = useState<boolean>(false) // show the spinner component

  useEffect(() => {
    // add axios interceptor to catch user token expire error
    axios.interceptors.response.use((response) => {
      return response
    }, (error: AxiosError) => {
      if (String(error.response?.data).includes('Token has expired')) setIsLogin(false)
      return Promise.reject(error)
    })
  }, [])

  const renderApp = () => {
    if (isLogin) {
      return (
        <IonApp data-bs-theme="dark" data-theme="dark">
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/Home">
                  <Home userInfo={userInfo} />
                </Route>
                <Route exact path="/MyInventory">
                  <MyInventory
                    userInfo={userInfo}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                  />
                </Route>
                <Route exact path="/ImageUploader">
                  <ImageUploader userInfo={userInfo} />
                </Route>
                <Route exact path="/SkuQuery">
                  <SkuQuery />
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
                  <IonLabel>Image Uploader</IonLabel>
                </IonTabButton>
                <IonTabButton tab="SkuQuery" href="/SkuQuery">
                  <IonIcon aria-hidden="true" icon={search} />
                  <IonLabel>SKU Query</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </IonApp>
      )
    } else {
      return (
        <>
          <Login
            setLogin={() => setIsLogin(true)}
            setLoading={setIsLoading}
            setUserInfo={setUserInfo}
          />
        </>
      )
    }
  }

  return (
    <AppContext.Provider value={{ setLoading: setIsLoading, userInfo: userInfo }}>
      <LoadingSpiner show={isLoading} />
      {renderApp()}
    </AppContext.Provider>
  )
}

export default App