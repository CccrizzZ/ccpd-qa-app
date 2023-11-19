import { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Condition, Platform, QARecord, UserInfo } from '../utils/Types';
import { Clipboard } from '@capacitor/clipboard';
import { NumberInput } from "@tremor/react";
import axios from 'axios';
import {
  Form,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import { FaTrashCan } from 'react-icons/fa6'
import './Home.css';
import LoadingSpiner from '../components/LoadingSpiner';

const server = import.meta.env.VITE_APP_SERVER
const defaultInfo = {
  sku: '10000',
  itemCondition: 'New',
  comment: '',
  link: '',
  platform: 'Amazon',
  shelfLocation: '',
  amount: 1
}
type HomeProp = {
  userInfo: UserInfo,
  // refresh: () => void
}

const Home: React.FC<HomeProp> = (prop: HomeProp) => {
  const [Sku, setSku] = useState<string>(defaultInfo.sku)
  const [itemCondition, setItemCondition] = useState<Condition>(defaultInfo.itemCondition as Condition)
  const [comment, setComment] = useState<string>(defaultInfo.comment)
  const [link, setLink] = useState<string>(defaultInfo.link)
  const [platform, setPlatform] = useState<Platform>(defaultInfo.platform as Platform)
  const [shelfLocation, setShelfLocation] = useState<string>(defaultInfo.shelfLocation)
  const [amount, setAmount] = useState<number>(defaultInfo.amount)
  // loading flag
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number(event.target.value)) return
    setSku((event.target.value))
  }

  const handleItemConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemCondition(event.target.value as Condition)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment((event.target.value).toUpperCase())
  }

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value)
  }

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatform(event.target.value as Platform)
  }

  const handleShelfLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShelfLocation(event.target.value)
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
    const UpperInfo = info.toUpperCase()
    if (comment.includes(UpperInfo)) return
    const comma = comment ? ', ' : ''
    return () => setComment(comment + comma + UpperInfo)
  }

  // paste txt from clipboard to link
  const pasteLink = async () => {
    const clip = await Clipboard.read();
    setLink(clip.value)
  }

  // clear input section
  const clearComment = () => setComment(defaultInfo.comment)
  const clearLink = () => setLink(defaultInfo.link)

  // clear form and increment sku by 1
  const resetForm = () => {
    setItemCondition(defaultInfo.itemCondition as Condition)
    clearComment()
    clearLink()
    setPlatform(defaultInfo.platform as Platform)
    setShelfLocation(defaultInfo.shelfLocation)
    setAmount(defaultInfo.amount)

    // automatically increment the sku for next form
    if (Sku) setSku(String(Number(Sku) + 1))
  }

  // submit button onclick
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // null checks
    if (!Sku) return alert('SKU Missing!')
    if (!itemCondition) return alert('Please Select Condition!')
    if (!link) return alert('Link Missing!')
    if (!shelfLocation) return alert('Shelf Location Missing!')

    // construct data
    const data: QARecord = {
      sku: Number(Sku),
      time: new Date().toLocaleTimeString(),
      itemCondition: itemCondition,
      comment: comment ?? '',
      link: link,
      platform: platform,
      shelfLocation: shelfLocation,
      amount: amount,
      owner: prop.userInfo.id
    }

    setIsLoading(true)
    // send to mongo db
    await axios({
      method: 'put',
      url: server + '/inventoryController/createInventory',
      responseType: 'text',
      data: JSON.stringify(data),
      withCredentials: true
    }).then((res) => {
      alert('Upload Success')
      // display pop up
      setIsLoading(false)
    }).catch((err) => {
      alert('Upload Failed')
      setIsLoading(false)
      throw err
    })

    // reset form
    resetForm()
  }

  return (
    <IonPage>
      <LoadingSpiner show={isLoading} />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <Form>
          <Form.Group>
            <Form.Label style={{ color: '#FFA500', fontWeight: 'bold' }}>SKU</Form.Label>
            <Form.Control style={{ color: '#FFA500', fontWeight: 'bold', fontSize: '140%' }} type="text" value={Sku} onChange={handleSkuChange} />
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
            <Form.Label style={{ padding: '10px' }}>
              Comment
              <Button variant='danger' style={{ right: '30px', position: 'absolute' }} onClick={clearComment}>
                <FaTrashCan />
              </Button>
            </Form.Label>
            <Form.Control type="text" as="textarea" style={{ resize: 'none' }} value={comment} onChange={handleCommentChange} />
          </Form.Group>
          <ButtonGroup size='sm' className="mb-2">
            <Button onClick={appendToComment('All Parts In')} variant="primary">All Parts In</Button>
            <Button onClick={appendToComment('Missing Accessory')} variant="primary">Missing Accessory</Button>
            <Button onClick={appendToComment('Missing Main Parts')} variant="primary">Missing Main Part</Button>
            <Button onClick={appendToComment('Black Color')} variant="primary">Black Color</Button>
          </ButtonGroup>
          <ButtonGroup size='sm' className="mb-2">
            <Button onClick={appendToComment('Power Tested')} variant="primary">Power Tested</Button>
            <Button onClick={appendToComment('Function Tested')} variant="primary">Function Tested</Button>
            <Button onClick={appendToComment('Untested')} variant="primary">Untested</Button>
            <Button onClick={appendToComment('Item Different From Link')} variant="primary"> Item Different From Link</Button>
          </ButtonGroup>
          <hr color='white' />
          <Form.Group id='formgroup'>
            <Form.Label style={{ padding: '10px' }}>
              Link
              <Button variant='danger' style={{ right: '30px', position: 'absolute' }} onClick={clearLink}>
                <FaTrashCan />
              </Button>
            </Form.Label>
            <Form.Control className="mb-3" type="text" as='textarea' style={{ resize: 'none' }} rows={3} value={link} onChange={handleLinkChange} />
            <div className="d-grid">
              <Button onClick={pasteLink}>Paste</Button>
            </div>
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
          </Form.Group>
          <hr color='white' />
          <div className="d-grid gap-2">
            <Button variant="warning" onClick={handleSubmit} size='lg'>Submit</Button>
          </div>
        </Form>
      </IonContent>
    </IonPage>
  )
}

export default Home;
