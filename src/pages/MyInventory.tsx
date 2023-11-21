import './MyInventory.css'
import axios from 'axios'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, ScrollCustomEvent } from '@ionic/react'
import { SyntheticEvent, useEffect, useState } from 'react'
import { DonutChart, Legend, Card } from "@tremor/react"
import {
  Button,
  Row,
  Col
} from 'react-bootstrap'
import { QARecord, UserInfo, PieData } from '../utils/Types'
import InventoryTable from '../components/InventoryTable'
import { RiRefreshLine, RiLogoutBoxRLine } from "react-icons/ri"
import { server, getChartData } from '../utils/utils'
import LoadingSpiner from '../components/LoadingSpiner'

// chart formatter
const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()} Items`;

// props from App.tsx
type MyInvProps = {
  userInfo: UserInfo,
  isLogin: boolean,
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
}

// Personal profile and dashboard
const MyInventory: React.FC<MyInvProps> = (prop: MyInvProps) => {
  const [userInventoryArr, setUserInventoryArr] = useState<QARecord[]>([]) // array of user owned inventory
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)

  // refresh user inventory array on construct
  useEffect(() => {
    refreshUserInventoryArr()
  }, [])

  const refreshUserInventoryArr = async () => {
    setIsLoading(true)
    setPage(0)
    setUserInventoryArr([])
    alert(page)
    // send to mongo db
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInventoryByOwnerId/' + page,
      withCredentials: true,
      responseType: 'text',
      data: JSON.stringify({ 'id': String(prop.userInfo.id) })
    }).then((res): void => {
      const invArr = JSON.parse(res.data)
      if (invArr.length < 1) {
        setUserInventoryArr([])
        return alert('No Inventory Found')
      }
      setUserInventoryArr(invArr)
    }).catch((err) => {
      setIsLoading(false)
      alert('Cannot Load User Inventory')
      throw err
    })
    setIsLoading(false)
  }

  const loadNextPage = async () => {
    // increment page
    const nextPage = page + 1
    setPage(nextPage)
    alert(page)

    // grab next page and put it into user inventory array
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInventoryByOwnerId/' + nextPage,
      withCredentials: true,
      responseType: 'text',
      data: JSON.stringify({ 'id': String(prop.userInfo.id) })
    }).then((res): void => {
      // parse inventory json data
      const invArr = JSON.parse(res.data)
      // set user inventory array
      setUserInventoryArr(userInventoryArr.concat(invArr))
    }).catch((err) => {
      alert('Cannot Load User Inventory')
      throw err
    })

  }

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
        <h2 style={{ position: 'fixed' }}>{page}</h2>
        <Row>
          <Col><h2>{prop.userInfo.name}</h2></Col>
          <Col style={{ textAlign: 'right' }}>
            <Button className='mt-3' variant="dark" onClick={logout} style={{ margin: 'auto' }}><RiLogoutBoxRLine /></Button>
          </Col>
        </Row>
        <Card decoration="top" decorationColor="amber" style={{ padding: 0 }}>
          <DonutChart
            className="mt-4"
            data={getChartData(userInventoryArr)}
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
        <Button className='gap-2 mb-4' variant="primary" onClick={() => refreshUserInventoryArr()}><RiRefreshLine /></Button>
        <InventoryTable inventoryArr={userInventoryArr} refresh={() => refreshUserInventoryArr()} setLoading={setIsLoading} />
        <div className="d-grid gap-2 mt-3">
          <Button variant='success' onClick={loadNextPage}>Load More...</Button>
        </div>
      </div>
    )
  }

  return (
    <IonPage>
      <LoadingSpiner show={isLoading} />
      <IonHeader>
        <IonToolbar style={{ display: 'flex' }}>
          <IonTitle>My Inventory</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {prop.isLogin ? renderUserPage() : undefined}
      </IonContent>
    </IonPage>
  )
}

export default MyInventory
