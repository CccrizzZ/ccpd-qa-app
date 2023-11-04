import React, { InvalidEvent, useState } from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {
  Card,
  Button,
  Form,
  ListGroup,
  Row,
  Col,
  Badge
} from 'react-bootstrap'
import axios from 'axios'
import { QARecord } from '../utils/Types';
import { getVariant, server } from '../utils/utils'

type SkuQueryProp = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SkuQuery: React.FC<SkuQueryProp> = (prop: SkuQueryProp) => {
  const [sku, setSku] = useState<string>('')
  const [inventoryRecord, setinventoryRecord] = useState<QARecord>({} as QARecord)

  const Query = async () => {
    prop.setLoading(true)
    // axios request for single inventory info
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInventoryBySku',
      responseType: 'text',
      withCredentials: true,
      data: JSON.stringify({ 'sku': Number(sku) })
    }).then((res) => {
      // console.log(JSON.parse(res.data))
      console.log(res.data)
    }).catch((err) => {
      alert(`Error: Inventory ${sku} Not Found`)
      throw err
    })
    prop.setLoading(false)
  }

  const renderResultCard = (inventory: QARecord) => {
    return (
      <Card className="bg-dark text-white mb-3" border={getVariant(inventory.itemCondition)} style={{ margin: 'auto' }}>
        <Card.Header style={{ fontWeight: 'bold' }}>{inventory.sku}</Card.Header>
        <Card.Body>
          <ListGroup className="list-group-flush" data-bs-theme="dark">
            <ListGroup.Item variant='dark'>
              <Row>
                <Col>Shelf Location: </Col>
                <Col>{inventory.platform}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item variant='dark'>
              <Row>
                <Col>Platform: </Col>
                <Col>{inventory.platform}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item variant='dark'>
              <Row>
                <Col>Condition: </Col>
                <Col><Badge pill bg={getVariant(inventory.itemCondition)}>{inventory.itemCondition}</Badge></Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item variant='dark'>
              <Row>
                <Col>Comment: </Col>
                <Col>{inventory.comment}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item variant='dark'>
              <Row>
                <Col>Time Created: </Col>
                <Col>{inventory.platform}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        {/* <Card.Body>
          <Card.Link href={inventory.link}>{inventory.link}</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body> */}
        <Card.Footer>
          <small className="text-muted">Last updated {inventory.time}</small>
        </Card.Footer>
      </Card>
    )
  }

  const handleSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSku(String(event.target.value))
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ display: 'flex' }}>
          <IonTitle>SKU Query</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <Form data-bs-theme="dark">
          <Form.Group>
            <Form.Label>SKU</Form.Label>
            <Form.Control type="number" value={sku} onChange={handleSkuChange} />
          </Form.Group>
        </Form>
        <div className="d-grid gap-2 mt-3">
          <Button variant='success' onClick={Query}>Search</Button>
        </div>

        {inventoryRecord === {} as QARecord ? renderResultCard(inventoryRecord) : undefined}
      </IonContent>
    </IonPage>
  )
}

export default SkuQuery