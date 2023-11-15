import React, { InvalidEvent, useState } from 'react'
import { QARecord } from '../utils/Types'
import { server } from '../utils/utils'
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
import { Switch } from "@tremor/react";
import { Clipboard } from '@capacitor/clipboard'
import { getVariant } from '../utils/utils'
import { FaWarehouse } from 'react-icons/fa6'
import axios from 'axios'

type InvTableProp = {
  inventoryArr: QARecord[]
}

// QA personal can only delete or update records created within 24h
const InventoryTable: React.FC<InvTableProp> = (prop: InvTableProp) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [editRecord, setEditRecord] = useState<QARecord>({} as QARecord)

  const toggleEditMode = () => setEditMode(!editMode)
  const editInventory = (inventory: QARecord) => {
    // populate editRecord with inventory info
    setEditRecord(inventory)
    // show form
    setShowEditForm(true)
  }

  const deleteInventory = async (inventory: QARecord) => {
    await axios({
      method: 'delete',
      url: server + '/inventoryController/deleteInventoryBySku',
      responseType: 'text',
      data: JSON.stringify({ sku: inventory.sku }),
      withCredentials: true
    }).then((res) => {
      alert('Delete Success')
    }).catch((err) => {
      alert('Delete Failed')
      throw err
    })
  }

  // button on each card
  const renderCardButton = (inventory: QARecord) => {
    if (editMode) {
      return (
        <div style={{ position: 'absolute', right: '20px' }}>
          <Button variant='warning' onClick={() => editInventory(inventory)}>Edit</Button>
          <Button className='ml-2' variant='danger' onClick={() => deleteInventory(inventory)}>Delete</Button>
        </div>
      )
    }
  }

  // render a single inventory card
  const renderCard = (inventory: QARecord) => {
    return (
      <Card className="text-white mb-3" border={getVariant(inventory.itemCondition)} style={{ margin: 'auto', borderRadius: '1em', textAlign: 'left' }} key={inventory.time}>
        <Card.Header style={{ display: 'flex' }}>
          <h2 className='mt-2 mb-0' style={{ left: '10px' }}>{inventory.sku}</h2>
          {renderCardButton(inventory)}
        </Card.Header>
        <Card.Body style={{ backgroundColor: '#333333', padding: 0 }}>
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
                </Col>
                <Col>
                  <Card.Link href={inventory.link} target='blank'>{inventory.link.substring(0, 50)}</Card.Link>
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

  // render table of inventory card
  const renderTable = () => {
    return (
      <div className='mt-2' style={{ padding: '15px', minHeight: '200px', backgroundColor: '#252525', borderRadius: '1em', textAlign: 'center' }}>
        {prop.inventoryArr.map((value) => {
          return renderCard(value)
        })}
      </div>
    )
  }



  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', backgroundColor: '#252525', borderRadius: '1em', padding: '15px' }}>
        <ButtonGroup>
          <DropdownButton as={ButtonGroup} title="Sort By" id="bg-nested-dropdown">
            <Dropdown.Item eventKey="1">SKU</Dropdown.Item>
            <Dropdown.Item eventKey="2">Time</Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
        <div className="mr-4" style={{ right: '20px', position: 'absolute', textAlign: 'center' }}>
          <Switch className="ml-4" name="switch" checked={editMode} onChange={toggleEditMode} />
          <label htmlFor="switch" className="text-sm text-gray-500">Edit Mode</label>
        </div>
      </div>
      {renderTable()}
    </div>
  )
}

export default InventoryTable
