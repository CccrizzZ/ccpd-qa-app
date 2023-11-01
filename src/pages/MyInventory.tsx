import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './MyInventory.css';
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
  token: string
  setIsLogin: (login: boolean) => void
}

// Personal profile and dashboard
const MyInventory: React.FC<MyInvProps> = ({ token, setIsLogin }) => {
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
    }).catch((err) => {
      console.log(err.data)
      throw err
    })

    setIsLogin(false)

  }


  const renderUser = () => {
    return (
      <>
        <h2>User Name</h2>
        <Card decoration="top" decorationColor="orange">
          <DonutChart
            className="mt-4"
            data={pieChartData}
            category="amount"
            index="name"
            valueFormatter={valueFormatter}
            colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
          />
          <Legend
            className="mt-4"
            categories={["New", "Used", "Used Like New", "Sealed", "Damaged", "As Is"]}
            colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
          />
        </Card>

        <Button onClick={logout}>Logout</Button>
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
        {token ? renderUser() : undefined}
      </IonContent>
    </IonPage>
  );
};

export default MyInventory;
