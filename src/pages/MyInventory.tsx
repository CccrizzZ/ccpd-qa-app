import './MyInventory.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { DonutChart, Legend, Card } from "@tremor/react";
import { Button } from 'react-bootstrap';
import axios from 'axios';

const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()} Items`;
type PieData = {
  name: string,
  amount: number
}

const server = import.meta.env.VITE_APP_SERVER

type MyInvProps = {
  isLogin: boolean,
  setIsLogin: (login: boolean) => void,
  refresh: () => void
}

// Personal profile and dashboard
const MyInventory: React.FC<MyInvProps> = ({ isLogin, setIsLogin, refresh }) => {
  const [inventoryArr, setInventoryArr] = useState<Array<string>>()
  const [pieChartData] = useState<PieData[]>([
    {
      name: "New",
      amount: 57,
    },
    {
      name: "Used",
      amount: 5,
    },
    {
      name: "Used Like New",
      amount: 4,
    },
    {
      name: "Sealed",
      amount: 15,
    },
    {
      name: "Damaged",
      amount: 1,
    },
    {
      name: "As Is",
      amount: 4,
    },
  ])

  const logout = async () => {
    await axios({
      method: 'post',
      url: server + '/userController/logout',
      responseType: 'text',
      withCredentials: true
    }).then((res) => {
      const data = JSON.parse(res.data)
      alert('Logout Success!!! ' + data)
      setIsLogin(false)
    }).catch((err) => {
      console.log(err.data)
      setIsLogin(false)
      throw err
    })
  }

  const renderUser = () => {
    return (
      <>
        <h2>User Name</h2>
        <Card decoration="top" decorationColor="amber" style={{ padding: 0 }}>
          <DonutChart
            className="mt-4"
            data={pieChartData}
            category="amount"
            index="name"
            valueFormatter={valueFormatter}
            colors={["green", "violet", "sky", "rose", "slate", "orange"]}
          />
          <Legend
            className="mt-3"
            categories={["New", "Used", "Used Like New", "Sealed", "Damaged", "As Is"]}
            colors={["green", "violet", "sky", "rose", "slate", "orange"]}
          />
        </Card>


        <div className="d-grid gap-2">
          <Button variant="danger" onClick={logout}>Logout</Button>
        </div>
      </>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Inventory</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {isLogin ? renderUser() : undefined}
      </IonContent>
    </IonPage>
  );
};

export default MyInventory;
