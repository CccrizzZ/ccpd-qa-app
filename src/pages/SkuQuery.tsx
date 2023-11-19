import React, { InvalidEvent, useState } from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {
  Card,
  Button,
  Form,
  ListGroup,
  Row,
  Col,
  Badge,
} from 'react-bootstrap'
import axios from 'axios'
import { QARecord } from '../utils/Types';
import { getVariant, server, copy, openInBrowser } from '../utils/utils'
import LoadingSpiner from '../components/LoadingSpiner';

const SkuQuery: React.FC = () => {
  const [sku, setSku] = useState<string>('')
  const [inventoryRecord, setinventoryRecord] = useState<QARecord>({} as QARecord)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const query = async () => {
    if (sku === '') return alert('SKU Cannot be empty')
    if (sku.length > 6) return alert('Invalid SKU')
    setIsLoading(true)
    // axios request for single inventory info
    await axios({
      method: 'post',
      url: server + '/inventoryController/getInventoryBySku',
      responseType: 'text',
      withCredentials: true,
      data: JSON.stringify({ 'sku': Number(sku) })
    }).then((res) => {
      const data = JSON.parse(res.data)
      const resRecord: QARecord = {
        sku: data['sku'],
        time: data['time'],
        itemCondition: data['itemCondition'],
        comment: data['comment'],
        link: data['link'],
        platform: data['platform'],
        shelfLocation: data['shelfLocation'],
        amount: data['amount'],
        owner: data['owner']
      }
      setinventoryRecord(resRecord)
    }).catch((err) => {
      alert(`Error: Inventory ${sku} Not Found`)
      setIsLoading(false)
      throw err
    })
    setIsLoading(false)
  }

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') event.preventDefault()
  }

  const handleSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSku(String(event.target.value))
  }

  // copylink to clipboard
  const copyLink = async () => await copy(inventoryRecord.link)

  // render the result below
  const renderResultCard = (inventory: QARecord) => {
    if (inventoryRecord.sku) {
      return (
        <Card className="text-white mt-3" border={getVariant(inventory.itemCondition)} style={{ margin: 'auto' }}>
          <Card.Header style={{ fontWeight: 'bold' }}>{inventory.sku}</Card.Header>
          <Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                <Row>
                  <Col>Amount: </Col>
                  <Col>{inventory.amount}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shelf Location: </Col>
                  <Col>{inventory.shelfLocation}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Platform: </Col>
                  <Col>{inventory.platform}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item >
                <Row>
                  <Col>Condition: </Col>
                  <Col><Badge pill bg={getVariant(inventory.itemCondition)}>{inventory.itemCondition}</Badge></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Comment: </Col>
                  <Col>{inventory.comment}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <p>Link:</p>
                    <Button variant="success" onClick={copyLink}>Copy</Button>
                  </Col>
                  <Col><a onClick={() => openInBrowser(inventory.link)} style={{ fontStretch: 'condensed' }}>{inventory.link}</a></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Owner: </Col>
                  <Col>{inventory.owner.name}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>User Active: </Col>
                  <Col>{inventory.owner.userActive ? 'Active' : 'Inactive'}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated {inventory.time}</small>
          </Card.Footer>
        </Card>
      )
    }
    return (
      <div>
        <h1>No Result</h1>
      </div>
    )
  }

  return (
    <IonPage>
      <LoadingSpiner show={isLoading} />
      <IonHeader>
        <IonToolbar style={{ display: 'flex' }}>
          <IonTitle>SKU Query</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <Form data-bs-theme="dark">
          <Form.Group>
            <Form.Label>SKU</Form.Label>
            <Form.Control type="number" value={sku} onChange={handleSkuChange} onKeyDown={handleOnKeyDown} />
          </Form.Group>
        </Form>
        <div className="d-grid gap-2 mt-3">
          <Button variant='success' onClick={query}>Search</Button>
        </div>
        {renderResultCard(inventoryRecord)}
      </IonContent>
    </IonPage>
  )
}

export default SkuQuery