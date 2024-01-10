import React, { useState } from 'react'
import { Condition, Marketplace, Platform, QARecord } from '../utils/Types'
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
  Dropdown,
  Form,
  InputGroup,
  Modal
} from 'react-bootstrap'
import { Switch } from "@tremor/react";
import { getVariant, copy, openInBrowser } from '../utils/utils'
import PopupModal from './PopupModal'
import { FaWarehouse } from 'react-icons/fa6'
import axios from 'axios'

type InvTableProps = {
  inventoryArr: QARecord[],
  refresh: () => void,
  setLoading: (loading: boolean) => void
}

// QA personal can only delete or update records created within 24h
const InventoryTable: React.FC<InvTableProps> = (props: InvTableProps) => {
  const [editMode, setEditMode] = useState<boolean>(false)

  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [record4Edit, setRecord4Edit] = useState<QARecord>({} as QARecord)

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false)
  const [sku4Delete, setSku4Delete] = useState<number>(0)

  const toggleEditMode = () => setEditMode(!editMode)
  const showEditInventoryForm = (inventory: QARecord) => {
    setRecord4Edit(inventory)
    setShowEditForm(true)
  }

  const showDeleteModal = (inventory: QARecord) => {
    setSku4Delete(inventory.sku)
    setShowDeleteConfirmModal(true)
  }

  const deleteInventory = async (sku: number) => {
    setShowDeleteConfirmModal(false)
    // call server to delete
    await axios({
      method: 'delete',
      url: `${server}/inventoryController/deleteInventoryBySku`,
      responseType: 'text',
      data: JSON.stringify({ sku: sku }),
      withCredentials: true
    }).then((res) => {
      alert('Delete Success')
      props.refresh()
    }).catch((err) => {
      alert('Delete Failed, Inventory Cannot be Deleted After 24H')
      throw err
    })
  }

  const updateInventory = async (sku: number, newInventoryInfo: QARecord) => {
    setShowEditForm(false)
    props.setLoading(true)
    await axios({
      method: 'put',
      url: `${server}/inventoryController/updateInventoryBySku/${sku}`,
      responseType: 'text',
      data: JSON.stringify({ newInventoryInfo: newInventoryInfo }),
      withCredentials: true
    }).then((res) => {
      alert('Update Success')
      props.setLoading(false)
      props.refresh()
    }).catch((err) => {
      alert('Update Failed')
      props.setLoading(false)
      throw err
    })
  }

  // button on each card
  const renderCardButton = (inventory: QARecord) => {
    if (editMode) {
      return (
        <div style={{ position: 'absolute', right: '20px' }}>
          <Button variant='warning' onClick={() => showEditInventoryForm(inventory)}>Edit</Button>
          <Button className='ml-2' variant='danger' onClick={() => showDeleteModal(inventory)}>Delete</Button>
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
                <Col>Marketplace: </Col>
                <Col>{inventory.marketplace}</Col>
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
                  <Card.Link onClick={() => { openInBrowser(inventory.link) }}>{inventory.link.substring(0, 50)}</Card.Link>
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
        {props.inventoryArr.map((value) => {
          return renderCard(value)
        })}
      </div>
    )
  }

  const handleItemConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRecord4Edit({ ...record4Edit, itemCondition: event.target.value as Condition })
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecord4Edit({ ...record4Edit, comment: (event.target.value).toUpperCase() })
  }

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecord4Edit({ ...record4Edit, link: event.target.value })
  }

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRecord4Edit({ ...record4Edit, platform: event.target.value as Platform })
  }

  const handleShelfLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecord4Edit({ ...record4Edit, shelfLocation: event.target.value })
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecord4Edit({ ...record4Edit, amount: Number(event.target.value) })
  }

  const handleMarketplaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRecord4Edit({ ...record4Edit, marketplace: event.target.value as Marketplace })
  }

  // update form wont pickup selected inventory information if placed in child component
  const renderUpdateForm = () => {
    return (
      <Modal style={{ color: '#adb5bd', width: '90%', margin: 'auto' }} show={showEditForm} size="lg" centered>
        <Modal.Header className='bg-dark'>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit {record4Edit.sku}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark' data-bs-theme="dark">
          <InputGroup className="mb-3" >
            <InputGroup.Text id="Amount">Amount</InputGroup.Text>
            <Form.Control
              onChange={handleAmountChange}
              placeholder={'Amount'}
              aria-label="Amount"
              aria-describedby="Amount"
              value={record4Edit.amount}
            />
          </InputGroup>
          <Form.Select className="mb-3" value={record4Edit.itemCondition} aria-label="Item Condition" onChange={handleItemConditionChange}>
            <option value="New">New</option>
            <option value="Sealed">Sealed</option>
            <option value="Used">Used</option>
            <option value="Used Like New">Used Like New</option>
            <option value="Damaged">Damaged</option>
            <option value="As Is">As Is</option>
          </Form.Select>
          <InputGroup className="mb-3">
            <InputGroup.Text id="Platform">Platform</InputGroup.Text>
            <Form.Select value={record4Edit.platform} aria-label="Item Condition" onChange={handlePlatformChange}>
              <option value="Amazon">Amazon</option>
              <option value="eBay">eBay</option>
              <option value="Official Website">Official Website</option>
              <option value="Other">Other</option>
            </Form.Select>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="Marketplace">Marketplace</InputGroup.Text>
            <Form.Select value={record4Edit.marketplace} aria-label="Marketplace" onChange={handleMarketplaceChange}>
              <option value="Hibid">Hibid</option>
              <option value="Retail">Retail</option>
              <option value="eBay">eBay</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Other">Other</option>
            </Form.Select>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="ShelfLocation">Shelf Location</InputGroup.Text>
            <Form.Control
              placeholder={'ShelfLocation'}
              aria-label="ShelfLocation"
              aria-describedby="ShelfLocation"
              value={record4Edit.shelfLocation}
              onChange={handleShelfLocationChange}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="Comment">Comment</InputGroup.Text>
            <Form.Control
              placeholder={'Comment'}
              style={{ resize: 'none' }}
              rows={3}
              as="textarea"
              value={record4Edit.comment}
              onChange={handleCommentChange}
              aria-label="Comment"
              aria-describedby="Comment"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="Link">Link</InputGroup.Text>
            <Form.Control
              placeholder={'Link'}
              style={{ resize: 'none' }}
              rows={3}
              as="textarea"
              value={record4Edit.link}
              onChange={handleLinkChange}
              aria-label="Link"
              aria-describedby="Link"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer className='bg-dark'>
          <Button variant='success' onClick={() => updateInventory(record4Edit.sku, record4Edit)}>Confirm Changes</Button>
          <Button variant='secondary' onClick={() => setShowEditForm(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <PopupModal
        title={`Delete ${sku4Delete}?`}
        content="Record Will Be Permanently Deleted!"
        show={showDeleteConfirmModal}
        confirmAction={() => deleteInventory(sku4Delete)}
        cancelAction={() => setShowDeleteConfirmModal(false)}
      />
      <div style={{ textAlign: 'center' }}>
        {renderUpdateForm()}
      </div>
      <div style={{ display: 'flex', backgroundColor: '#252525', borderRadius: '1em', padding: '15px' }}>
        <ButtonGroup>
          <DropdownButton as={ButtonGroup} title="Sort By" id="bg-nested-dropdown">
            <Dropdown.Item eventKey="1">SKU</Dropdown.Item>
            <Dropdown.Item eventKey="2">Time</Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
        <div className="mr-4" style={{ right: '30px', position: 'absolute' }}>
          <Switch className="ml-4" name="switch" checked={editMode} onChange={toggleEditMode} />
          <label className="text-sm text-gray-500">Edit Mode</label>
        </div>
      </div>
      {renderTable()}
    </div>
  )
}

export default InventoryTable
