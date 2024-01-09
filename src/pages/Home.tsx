import { createContext, useRef, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Condition, Marketplace, Platform, QARecord, UserInfo } from '../utils/Types';
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
import moment from 'moment';

const server = import.meta.env.VITE_APP_SERVER
const defaultInfo = {
  sku: '10000',
  itemCondition: 'New',
  comment: '',
  link: '',
  platform: 'Amazon',
  shelfLocation: '',
  amount: 1,
  marketplace: 'Hibid'
}

type HomeProp = {
  userInfo: UserInfo,
}

const Home: React.FC<HomeProp> = (prop: HomeProp) => {

  const topRef = useRef<HTMLIonContentElement>(null)
  const [Sku, setSku] = useState<string>(defaultInfo.sku)
  const [itemCondition, setItemCondition] = useState<Condition>(defaultInfo.itemCondition as Condition)
  const [comment, setComment] = useState<string>(defaultInfo.comment)
  const [link, setLink] = useState<string>(defaultInfo.link)
  const [platform, setPlatform] = useState<Platform>(defaultInfo.platform as Platform)
  const [shelfLocation, setShelfLocation] = useState<string>(defaultInfo.shelfLocation)
  const [amount, setAmount] = useState<number>(defaultInfo.amount)
  const [marketplace, setMarketplace] = useState<Marketplace>(defaultInfo.marketplace as Marketplace)

  // loading flag
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number(event.target.value) && event.target.value !== '') return
    if (String(event.target.value).length + 1 > 7) return
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
    if (event.target.value.length + 1 > 5) return
    setShelfLocation((event.target.value).toUpperCase())
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 1) {
      setAmount(1)
    } else {
      setAmount(Number(event.target.value))
    }
  }

  const handleMarketplaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMarketplace(event.target.value as Marketplace)
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
    // scroll to top
    if (topRef.current) topRef.current.scrollToTop(0)

    // reset hooks
    setItemCondition(defaultInfo.itemCondition as Condition)
    clearComment()
    clearLink()
    setPlatform(defaultInfo.platform as Platform)
    setShelfLocation(defaultInfo.shelfLocation)
    setAmount(defaultInfo.amount)
    setMarketplace(defaultInfo.marketplace as Marketplace)

    // automatically increment the sku for next form
    if (Sku) setSku(String(Number(Sku) + 1))
  }

  // submit button onclick
  const handleSubmit = async () => {
    // null checks
    if (!Sku) return alert('SKU Missing!')
    if (!link) return alert('Link Missing!')
    if (!shelfLocation) return alert('Shelf Location Missing!')

    // construct data
    const data: QARecord = {
      sku: Number(Sku),
      time: moment(new Date()).format('MMM DD YYYY HH:mm:ss'),
      itemCondition: itemCondition,
      comment: comment ?? '',
      link: link,
      platform: platform,
      shelfLocation: shelfLocation,
      amount: amount,
      owner: prop.userInfo.id,
      ownerName: prop.userInfo.name,
      marketplace: marketplace
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
      setIsLoading(false)
    }).catch((err) => {
      alert('Upload Failed: ' + err.response.data)
      setIsLoading(false)
      throw err
    })

    // reset form
    resetForm()
  }

  return (
    <IonPage ref={topRef}>
      <LoadingSpiner show={isLoading} />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={topRef} class="ion-padding">
        <Form>
          <Form.Group>
            <Form.Label style={{ color: '#FFA500', fontWeight: 'bold' }}>SKU</Form.Label>
            <Form.Control
              style={{ color: '#FFA500', fontWeight: 'bold', fontSize: '140%' }}
              type="number"
              value={Sku}
              onChange={handleSkuChange}
            />
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
            <Button onClick={appendToComment('All Parts In')} variant="success">All Parts In</Button>
            <Button onClick={appendToComment('Power Tested')} variant="success">Power Tested</Button>
            <Button onClick={appendToComment('Function Tested')} variant="success">Function Tested</Button>
            <Button onClick={appendToComment('Black Color')} variant="secondary">Black Color</Button>
          </ButtonGroup>
          <ButtonGroup size='sm' className="mb-2">
            <Button onClick={appendToComment('Missing Accessory')} variant="danger">Missing Accessories</Button>
            <Button onClick={appendToComment('Missing Main Parts')} variant="danger">Missing Main Parts</Button>
            <Button onClick={appendToComment('Untested')} variant="secondary">Untested</Button>
            <Button onClick={appendToComment('Item Different From Link')} variant="secondary"> Item Different From Link</Button>
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
          <Form.Group id='Platform'>
            <Form.Label>Platform</Form.Label>
            <Form.Select className="mb-3" value={platform} aria-label="Item Condition" onChange={handlePlatformChange}>
              <option value="Amazon">Amazon</option>
              <option value="eBay">eBay</option>
              <option value="Official Website">Official Website</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group id='Marketplace'>
            <Form.Label>Marketplace</Form.Label>
            <Form.Select className="mb-3" value={marketplace} aria-label="Marketplace" onChange={handleMarketplaceChange}>
              <option value="Hibid">Hibid</option>
              <option value="Retail">Retail</option>
              <option value="eBay">eBay</option>
              <option value="Wholesale">Wholesale</option>
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
