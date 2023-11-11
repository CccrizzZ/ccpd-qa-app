import React, { InvalidEvent } from 'react'
import { QARecord } from '../utils/Types'
import {
  Button,
  ButtonGroup,
  Card,
  ListGroup,
  Badge,
  Row,
  Col,
  DropdownButton,
  Dropdown
} from 'react-bootstrap'
import { Clipboard } from '@capacitor/clipboard';
import { getVariant } from '../utils/utils'
import { FaWarehouse } from 'react-icons/fa6'

type InvTableProp = {
  inventoryArr: QARecord[]
}

const InventoryTable: React.FC<InvTableProp> = (prop: InvTableProp) => {

  // copy to clipboard
  const copy = async (txt: string) => {
    await Clipboard.write({
      string: txt
    })
  }

  // render a single inventory card
  const renderCard = (inventory: QARecord) => {
    return (
      <Card className="text-white mb-3" border={getVariant(inventory.itemCondition)} style={{ margin: 'auto', borderRadius: '1em', textAlign: 'left' }} key={inventory.time}>
        <Card.Header style={{ textAlign: 'center' }}>
          <h2 className='ml-2 mt-0 mb-0' style={{ margin: 'auto' }}>{inventory.sku}</h2>
        </Card.Header>
        <Card.Body style={{ backgroundColor: '#333333' }}>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>
              <Row>
                <Col>Amount: </Col>
                <Col>{inventory.amount}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Platform: </Col>
                <Col>{inventory.platform}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Condition: </Col>
                <Col><Badge pill bg={getVariant(inventory.itemCondition)}>{inventory.itemCondition}</Badge></Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shelf Location: </Col>
                <Col><Badge pill bg={getVariant(inventory.itemCondition)}>{inventory.shelfLocation}</Badge></Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Comment: </Col>
              </Row>
              <Row style={{ backgroundColor: 'black', borderRadius: '0.5em', margin: '2px' }}>
                <Col>{inventory.comment}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  Link:
                  <Button size='sm' variant='success' onClick={() => { copy(inventory.link) }}>Copy Link</Button>
                </Col>
                <Col>
                  <Card.Link href={inventory.link}>{inventory.link.substring(0, 50)}</Card.Link>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Created at {inventory.time}</small>
        </Card.Footer>
      </Card >
    )
  }

  // render table from inventory array
  const renderTable = () => {
    return (
      <div className='mt-2' style={{ padding: '15px', minHeight: '200px', backgroundColor: '#222', borderRadius: '1em', textAlign: 'center' }}>
        {prop.inventoryArr.map((value) => {
          return renderCard(value)
        })}
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <ButtonGroup>
        <DropdownButton as={ButtonGroup} title="Sort By" id="bg-nested-dropdown">
          <Dropdown.Item eventKey="1">SKU</Dropdown.Item>
          <Dropdown.Item eventKey="2">Time</Dropdown.Item>
        </DropdownButton>
        <Button>Select</Button>
        <Button>Edit</Button>
      </ButtonGroup>
      {renderTable()}
    </div>
  )
}

export default InventoryTable
