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
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import LoadingSpiner from './utils/LoadingSpiner';
import { QARecord, UserInfo } from './utils/Types'
import axios from 'axios';
setupIonicReact();

const server = import.meta.env.VITE_APP_SERVER
const App: React.FC = () => {
  // user information 
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    name: '',
  })
  // array of user owned inventory
  const [userInventoryArr, setUserInventoryArr] = useState<QARecord[]>([])
  // login flag
  const [isLogin, setIsLogin] = useState<boolean>(false)
  // show the spinner component
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const setUserId = (id: string) => setUserInfo({ ...userInfo, id: id })
  const setUserName = (name: string) => setUserInfo({ ...userInfo, name: name })
  const refreshUserInventoryArr = async () => {
    // send to mongo db
    await axios({
      method: 'get',
      url: server + '/inventoryController/get',
      responseType: 'text',
      withCredentials: true
    }).then((res) => {
      alert('Upload Success')
      // display pop up
    }).catch((err) => {
      alert('Upload Failed')
      throw err
    })
  }


  const renderHome = () => {
    if (isLogin) {
      return (
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/Home">
                  <Home userName={userInfo.name} setUserId={setUserId} />
                </Route>
                <Route exact path="/MyInventory">
                  <MyInventory isLogin={isLogin} setIsLogin={setIsLogin} refresh={refreshUserInventoryArr} />
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
      return (
        <>
          <Login
            setLogin={() => setIsLogin(true)}
            setLoading={setIsLoading}
            setUserId={setUserId}
          />
        </>
      )
    }
  }

  return (
    <>
      <LoadingSpiner show={isLoading} />
      {renderHome()}
    </>
  )
}

export default App;
