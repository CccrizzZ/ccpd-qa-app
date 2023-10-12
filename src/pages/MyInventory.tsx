import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './MyInventory.css';
import { useState } from 'react';
import { DonutChart, Legend, Card } from "@tremor/react";

const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()} Items`;
type PieData = {
  name: string,
  amount: number
}

// Personal profile and dashboard
const MyInventory: React.FC = () => {
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Inventory</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
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
      </IonContent>
    </IonPage>
  );
};

export default MyInventory;
