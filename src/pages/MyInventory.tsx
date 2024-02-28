import './MyInventory.css'
import axios, { Axios, AxiosError, AxiosResponse } from 'axios'
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
  Col,
  Table,
  Form
} from 'react-bootstrap'
import { QARecord, UserInfo, PieData } from '../utils/Types'
import InventoryTable from '../components/InventoryTable'
import { RiRefreshLine, RiLogoutBoxRLine } from "react-icons/ri"
import { server, convertChartData, ChartData } from '../utils/utils'
import LoadingSpiner from '../components/LoadingSpiner'
import PopupModal from '../components/PopupModal'
import moment from 'moment'

// chart formatter
const valueFormatter = (number: number) => `${new Intl.NumberFormat("us").format(number).toString()} Items`;

// props from App.tsx
type MyInvProps = {
  userInfo: UserInfo,
  isLogin: boolean,
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
}

type QAItemShelfData = {
  time: string,
  sku: number,
  amount: number,
  shelfLocation: string,
  ownerName: string
}

// Personal profile and dashboard
const MyInventory: React.FC<MyInvProps> = (prop: MyInvProps) => {
  const [userInventoryArr, setUserInventoryArr] = useState<QARecord[]>([]) // array of user owned inventory
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [showTable, setShowTable] = useState<boolean>(false)
  const chartColors = [
    "green",
    "violet",
    "sky",
    "rose",
    "orange"
  ]
  const [qaDataToday, setQaDataToday] = useState<QAItemShelfData[]>([])

  // refresh user inventory array on construct
  useEffect(() => {
    refreshUserInventoryArr()
    fetchTodayQAInfo()
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
    fetchTodayQAInfo()
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
    }).then((res: AxiosResponse) => {
      setChartData(convertChartData(JSON.parse(res.data)))
    }).catch((err: AxiosError) => {
      alert('Cannot Load User Inventory Info: ' + err.message)
    })
  }

  const fetchTodayQAInfo = async () => {
    await axios({
      method: 'post',
      url: server + '/inventoryController/getShelfSheetByUser',
      withCredentials: true,
      responseType: 'text',
      timeout: 8000,
      data: JSON.stringify({ 'ownerName': prop.userInfo.name })
    }).then((res: AxiosResponse) => {
      setQaDataToday(JSON.parse(res.data))
    }).catch((err: AxiosError) => {
      alert('Cannot Load User Inventory Info: ' + err.message)
    })
  }

  const renderTable = () => {
    const renderTB = () => {
      if (qaDataToday.map) {
        return qaDataToday.map((val, i) => (
          <tr key={i}>
            {/* <td>{moment(val.time).toLocaleString()}</td> */}
            <td>{val.sku}</td>
            <td>{val.shelfLocation}</td>
            <td>{val.amount}</td>
            <td className='w-[140px]'>{val.ownerName}</td>
            <td>
              <Form.Check
                type='checkbox'
              // className='absolute'
              />
            </td>
          </tr>
        ))
      }
    }

    return (
      <Table striped bordered variant='dark'>
        <thead>
          <tr>
            {/* <th>Time</th> */}
            <th>SKU</th>
            <th>Shelf Location</th>
            <th>Amt</th>
            <th>Owner</th>
            <th>In</th>
          </tr>
        </thead>
        <tbody>
          {renderTB()}
        </tbody>
      </Table>
    )
  }

  const displayTable = () => {
    setShowTable(true)
  }

  const renderUserPage = () => {
    return (
      <div>
        <PopupModal
          title={`Q&A Shelf Sheet ${moment().format('LL')} `}
          content={undefined}
          dom={renderTable()}
          show={showTable}
          confirmAction={() => setShowTable(false)}
          cancelAction={() => setShowTable(false)}
          showConfirmButton={false}
          showCloseButton={true}
        />
        <Row>
          <Col>
            <h2>{prop.userInfo.name}</h2>
            <Subtitle>{prop.userInfo.id}</Subtitle>
          </Col>
          <Col style={{ textAlign: 'right' }}>
            <Button className='mt-3 m-auto' variant="dark" onClick={logout}><RiLogoutBoxRLine /></Button>
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
        <Button className='absolute mb-4 right-6' variant="success" onClick={displayTable}>Get Shelf Sheet (Today)</Button>
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
