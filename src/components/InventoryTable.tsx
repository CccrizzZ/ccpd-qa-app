import React, { InvalidEvent } from 'react'
import { QARecord } from '../utils/Types'
import {
  Button,
  ButtonGroup,
  Card,
  ListGroup,
  Badge,
  Row,
  Col
} from 'react-bootstrap'
import { getVariant } from '../utils/utils'

type InvTableProp = {
  InventoryArr: QARecord[]
}

const InventoryTable: React.FC<InvTableProp> = (prop: InvTableProp) => {
  // render a single inventory card
  const renderCard = (inventory: QARecord, index: number) => {
    return (
      <Card className="bg-dark text-white mb-3" border={getVariant(inventory.itemCondition)} style={{ margin: 'auto' }} key={index}>
        <Card.Header>{inventory.sku}</Card.Header>
        <Card.Body>

          <ListGroup className="list-group-flush" data-bs-theme="dark">
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

            </ListGroup.Item>
          </ListGroup>


        </Card.Body>
        <Card.Body>
          <Card.Link href={inventory.link}>{inventory.link}</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Last updated {inventory.time}</small>
        </Card.Footer>
      </Card>
    )
  }

  // render table from inventory array
  const renderTable = () => {
    return (
      <div style={{ padding: '15px' }}>
        {prop.InventoryArr.map((value, index) => {
          return renderCard(value, index)
        })}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '200px', backgroundColor: '#333', borderRadius: '1em', textAlign: 'center' }}>
      <ButtonGroup>
        <Button>Sort Order</Button>
        <Button>Select</Button>
        <Button>Edit</Button>
      </ButtonGroup>
      {renderTable()}
    </div>
  )
}

export default InventoryTable
