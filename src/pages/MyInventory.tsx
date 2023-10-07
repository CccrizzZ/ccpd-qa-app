import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './MyInventory.css';
import { useState } from 'react';

const MyInventory: React.FC = () => {
  const [inventoryArr, setInventoryArr] = useState<Array<string>>()


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Inventory</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My inventory</IonTitle>
            <p>all history inventory will be here</p>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default MyInventory;
