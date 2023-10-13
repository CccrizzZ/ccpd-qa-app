import { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Condition, Platform, QARecord } from '../utils/Types';
import { NumberInput } from "@tremor/react";
import axios from 'axios';
import {
  Form,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import './Home.css';

const server = import.meta.env.VITE_APP_SERVER
const defaultInfo = {
  sku: 10000,
  itemCondition: 'New',
  comment: '',
  link: '',
  platform: 'Amazon',
  shelfLocation: '',
  amount: 1
}
type HomeProp = {
  userName: string
}

const Home: React.FC<HomeProp> = (prop: HomeProp) => {
  const [Sku, setSku] = useState<number>(defaultInfo.sku)
  const [itemCondition, setItemCondition] = useState<Condition>(defaultInfo.itemCondition as Condition)
  const [comment, setComment] = useState<string>(defaultInfo.comment as Condition)
  const [link, setLink] = useState<string>(defaultInfo.link)
  const [platform, setPlatform] = useState<Platform>(defaultInfo.platform as Platform)
  const [shelfLocation, setShelfLocation] = useState<string>(defaultInfo.shelfLocation)
  const [amount, setAmount] = useState<number>(defaultInfo.amount)


  const handleSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSku(Number(event.target.value))
  }

  const handleItemConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemCondition(event.target.value as Condition)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value)
  }

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value)
  }

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatform(event.target.value as Platform)
  }

  const handleShelfLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShelfLocation(event.target.value as Platform)
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 1) {
      setAmount(1)
    } else {
      setAmount(Number(event.target.value))
    }
  }

  // speed dial comment
  const appendToComment = (info: string) => {
    if (comment?.includes(info)) return
    const comma = comment ? ', ' : ''
    setComment(comment + comma + info.toUpperCase())
  }

  // clear all info, reset the form
  const resetForm = () => {
    setItemCondition(defaultInfo.itemCondition as Condition)
    setComment(defaultInfo.comment)
    setLink(defaultInfo.link)
    setPlatform(defaultInfo.platform as Platform)
    setShelfLocation(defaultInfo.shelfLocation)
    setAmount(defaultInfo.amount)

    // automatically increment the sku for next form
    if (Sku) setSku(Sku + 1)
  }

  // submit button onclick
  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // null checks
    if (!Sku) return alert('SKU Missing!')
    if (!itemCondition) return alert('Please Select Condition!')
    if (!link) return alert('Link Missing!')
    if (!shelfLocation) return alert('Shelf Location Missing!')

    // construct data
    const data: QARecord = {
      sku: Sku,
      itemCondition: itemCondition,
      comment: comment ?? '',
      link: link,
      platform: platform,
      shelfLocation: shelfLocation,
      amount: amount,
      owner: prop.userName
    }

    // send to mongo db

    axios({
      method: 'put',
      url: server + '/inventoryController/createInventory',
      responseType: 'text',
      data: JSON.stringify(data)
    }).then((res) => {
      alert('Upload Success!!!')
      // display pop up
    }).catch((err) => {
      throw err
    })

    // reset form
    resetForm()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <Form data-bs-theme="dark">
          <Form.Group>
            <Form.Label>SKU</Form.Label>
            <Form.Control type="number" value={Sku} onChange={handleSkuChange} />
          </Form.Group>
          <hr color='white' />
          <Form.Group id='formgroup'>
            <Form.Label>Item Condition</Form.Label>
            <Form.Select value={itemCondition} aria-label="Item Condition" onChange={handleItemConditionChange}>
              <option value="New">New</option>
              <option value="Sealed">Sealed</option>
              <option value="Used">Used</option>
              <option value="Used Like New">Used Like New</option>
              <option value="Damaged">Damaged</option>
              <option value="As Is">As Is</option>
            </Form.Select>
          </Form.Group>
          <hr color='white' />

          <Form.Group id='formgroup'>
            <Form.Label>Comment</Form.Label>
            <Form.Control type="text" as="textarea" style={{ resize: 'none' }} value={comment} onChange={handleCommentChange} />
          </Form.Group>
          <ButtonGroup size='sm' className="mb-2">
            <Button onClick={() => appendToComment('All Parts In')} variant="success">All Parts In</Button>
            <Button onClick={() => appendToComment('Missing Accessory')} variant="success">Missing Accessory</Button>
            <Button onClick={() => appendToComment('Missing Main Parts')} variant="success">Missing Main Parts</Button>
            <Button onClick={() => appendToComment('Black Color')} variant="success">Black Color</Button>
          </ButtonGroup>
          <Form.Group id='formgroup'>
            <Form.Label>Link</Form.Label>
            <Form.Control type="text" as='textarea' style={{ resize: 'none' }} rows={3} value={link} onChange={handleLinkChange} />
          </Form.Group>
          <hr color='white' />
          <Form.Group id='formgroup'>
            <Form.Label>Platform</Form.Label>
            <Form.Select value={platform} aria-label="Item Condition" onChange={handlePlatformChange}>
              <option value="Amazon">Amazon</option>
              <option value="eBay">eBay</option>
              <option value="Official Website">Official Website</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group id='formgroup'>
            <Form.Label>Shelf Location</Form.Label>
            <Form.Control type="text" value={shelfLocation} onChange={handleShelfLocationChange} />
          </Form.Group>
          <Form.Group id='formgroup'>
            <Form.Label>Amount</Form.Label>
            <NumberInput value={amount} placeholder="Amount..." onChange={handleAmountChange} />
            {/* <Form.Control type="number" value={amount} onChange={handleAmountChange} /> */}
          </Form.Group>
          <hr color='white' />
          <div className="d-grid gap-2">
            <Button variant="success" onClick={handleSubmit} size='lg'>Submit</Button>
          </div>
        </Form>
      </IonContent>
    </IonPage>
  );
};

export default Home;
