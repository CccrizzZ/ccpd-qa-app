import './MyInventory.css'
import axios from 'axios'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { useEffect, useState } from 'react'
import {
  DonutChart,
  Legend,
  Card,
  Subtitle
} from "@tremor/react"
import {
  Button,
  Row,
  Col
} from 'react-bootstrap'
import { QARecord, UserInfo, PieData } from '../utils/Types'
import InventoryTable from '../components/InventoryTable'
import { RiRefreshLine, RiLogoutBoxRLine } from "react-icons/ri"
import { server, convertChartData, ChartData } from '../utils/utils'
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
  const [chartData, setChartData] = useState<ChartData[]>([])

  // refresh user inventory array on construct
  useEffect(() => {
    refreshUserInventoryArr()
  }, [])

  // refresh and reset inventory array
  const refreshUserInventoryArr = async () => {
    setIsLoading(true)
    // react state are set asynchronously state will be set after this block executes
    const startPage = 0
    setPage(startPage)

    // clear user inventory array and fetch user inventory stats
    setUserInventoryArr([])
    fetchUserInvInfo()

    // fetch page 0 from server (sku desc)
    await axios({
      method: 'post',
      url: server + `/inventoryController/getInventoryByOwnerId/${startPage}`,
      withCredentials: true,
      responseType: 'text',
      data: JSON.stringify({ 'id': String(prop.userInfo.id) })
    }).then((res): void => {
      const invArr = JSON.parse(res.data)
      // if no inventory clear the inventory array
      if (invArr.length < 1) {
        setUserInventoryArr([])
      } else {
        setUserInventoryArr(invArr)
      }
    }).catch((err) => {
      setIsLoading(false)
      alert('Cannot Load User Inventory')
      throw err
    })
    setIsLoading(false)
  }

  // fetch the next page increment the page
  const loadNextPage = async () => {
    const nextPage = page + 1
    // grab next page and put it into user inventory array
    await axios({
      method: 'post',
      url: server + `/inventoryController/getInventoryByOwnerId/${nextPage}`,
      withCredentials: true,
      responseType: 'text',
      data: JSON.stringify({ 'id': String(prop.userInfo.id) })
    }).then((res): void => {
      // parse inventory json data
      const invArr = JSON.parse(res.data)
      // if there is something in next page, increment page, else do nothing
      if (invArr.length > 0) {
        setUserInventoryArr(userInventoryArr.concat(invArr))
        setPage(nextPage)
      }
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

  // fetch user inventory stat (get amount by condition)
  const fetchUserInvInfo = async () => {
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInventoryInfoByOwnerId',
      withCredentials: true,
      responseType: 'text',
      data: JSON.stringify({ 'id': String(prop.userInfo.id) })
    }).then((res): void => {
      const invInfoArr = JSON.parse(res.data)
      setChartData(convertChartData(invInfoArr))
    }).catch((err) => {
      alert('Cannot Load User Inventory Info')
      throw err
    })
  }

  const renderUserPage = () => {
    return (
      <div>
        <Row>
          <Col>
            <h2>{prop.userInfo.name}</h2>
            <Subtitle>{prop.userInfo.id}</Subtitle>
          </Col>
          <Col style={{ textAlign: 'right' }}>
            <Button className='mt-3' variant="dark" onClick={logout} style={{ margin: 'auto' }}><RiLogoutBoxRLine /></Button>
          </Col>
        </Row>
        <Card decoration="top" decorationColor="amber" style={{ padding: 0 }}>
          <DonutChart
            className="mt-4"
            data={chartData}
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
