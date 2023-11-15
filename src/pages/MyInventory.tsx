import './MyInventory.css';
import axios from 'axios';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { DonutChart, Legend, Card } from "@tremor/react";
import {
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { QARecord, UserInfo, PieData } from '../utils/Types';
import InventoryTable from '../components/InventoryTable'
import { RiRefreshLine, RiLogoutBoxRLine } from "react-icons/ri";
import { server, getChartData } from '../utils/utils'

// chart stuff
const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()} Items`;

// props from App.tsx
type MyInvProps = {
  userInfo: UserInfo,
  isLogin: boolean,
  setIsLogin: (login: boolean) => void,
  refresh: () => void,
  userInventoryArr: QARecord[],
  // pieChartData: PieData[]
}

// Personal profile and dashboard
const MyInventory: React.FC<MyInvProps> = (prop: MyInvProps) => {
  const [pieData, setPieData] = useState<PieData[]>([])

  // refresh on construct
  useEffect(() => {
    prop.refresh()
    setPieData(getChartData(prop.userInventoryArr))
  }, [])

  // logout current user delete http-only cookie
  const logout = async () => {
    await axios({
      method: 'post',
      url: server + '/userController/logout',
      responseType: 'text',
      withCredentials: true
    }).then((res) => {
      alert('Logout Success!!!')
      prop.setIsLogin(false)
    }).catch((err) => {
      prop.setIsLogin(false)
      throw err
    })
  }

  const renderUserPage = () => {
    return (
      <div>
        <Row>
          <Col><h2>{prop.userInfo.name}</h2></Col>
          <Col style={{ textAlign: 'right' }}>
            <Button className='mt-3' variant="dark" onClick={logout} style={{ margin: 'auto' }}><RiLogoutBoxRLine /></Button>
          </Col>
        </Row>
        <Card decoration="top" decorationColor="amber" style={{ padding: 0 }}>
          <DonutChart
            className="mt-4"
            data={getChartData(prop.userInventoryArr)}
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
        <Button className='gap-2 mb-4' variant="primary" onClick={prop.refresh}><RiRefreshLine /></Button>
        <InventoryTable inventoryArr={prop.userInventoryArr} />
      </div>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ display: 'flex' }}>
          <IonTitle>My Inventory</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {prop.isLogin ? renderUserPage() : undefined}
      </IonContent>
    </IonPage>
  );
};

export default MyInventory;
