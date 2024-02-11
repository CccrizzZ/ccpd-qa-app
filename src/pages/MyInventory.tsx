import './MyInventory.css'
import axios, { Axios, AxiosError } from 'axios'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { useEffect, useState } from 'react'
import {
  DonutChart,
  Legend,
  Card,
  Subtitle,
  Grid
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
  const chartColors = [
    "green",
    "violet",
    "sky",
    "rose",
    "orange"
  ]

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
      url: server + `/inventoryController/getInventoryByOwnerName`,
      withCredentials: true,
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify({ 'ownerName': prop.userInfo.name, 'page': page })
    }).then((res): void => {
      const invArr = JSON.parse(res.data)
      if (invArr.length < 1) {
        setUserInventoryArr([])
      } else {
        setUserInventoryArr(invArr)
      }
    }).catch((err: AxiosError) => {
      setIsLoading(false)
      alert('Cannot Load User Inventory: ' + err.message)
    })
    setIsLoading(false)
  }

  // fetch the next page increment the page
  const loadNextPage = async () => {
    const nextPage = page + 1
    await axios({
      method: 'post',
      url: server + `/inventoryController/getInventoryByOwnerName`,
      withCredentials: true,
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify({ 'ownerName': prop.userInfo.name, 'page': nextPage })
    }).then((res): void => {
      const invArr = JSON.parse(res.data)
      // if there is something in next page, increment page, else do nothing
      if (invArr.length > 0) {
        setUserInventoryArr(userInventoryArr.concat(invArr))
        setPage(nextPage)
      }
    }).catch((err: AxiosError) => {
      alert('Cannot Load User Inventory ' + err.message)
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
      url: server + '/inventoryController/getQAConditionInfoByOwnerName',
      withCredentials: true,
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify({ 'ownerName': prop.userInfo.name })
    }).then((res): void => {
      setChartData(convertChartData(JSON.parse(res.data)))
    }).catch((err: AxiosError) => {
      console.log('Cannot Load User Inventory Info: ' + err.message)
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
        <Card className='mb-6' decoration="top" decorationColor="amber" style={{ padding: 0 }}>
          <Grid numItems={2}>
            <Col>
              <DonutChart
                className="ml-4 mt-9 mb-9"
                data={chartData}
                category="amount"
                index="name"
                valueFormatter={valueFormatter}
                colors={chartColors}
              />
            </Col>
            <Col>
              <Legend
                className="p-9 text-center mt-3 block max-w-36"
                categories={["New", "Used", "Used Like New", "Sealed", "As Is"]}
                colors={chartColors}
              />
            </Col>
          </Grid>
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
          <IonTitle>📦 My Inventory</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {prop.isLogin ? renderUserPage() : undefined}
      </IonContent>
    </IonPage>
  )
}

export default MyInventory
