import { useRef, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Condition, Marketplace, Platform, QARecord, UserInfo } from '../utils/Types';
import { Clipboard } from '@capacitor/clipboard';
import { NumberInput } from "@tremor/react";
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  Form,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  ListGroup,
  Row,
  Col,
} from 'react-bootstrap';
import {
  FaTrashCan,
  FaX
} from 'react-icons/fa6'
import './Home.css';
import LoadingSpiner from '../components/LoadingSpiner';
import { renderConditionOptions } from '../utils/utils';

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
  const [sku, setSku] = useState<string>(defaultInfo.sku)
  const [itemCondition, setItemCondition] = useState<Condition>(defaultInfo.itemCondition as Condition)
  const [comment, setComment] = useState<string>(defaultInfo.comment)
  const [link, setLink] = useState<string>(defaultInfo.link)
  const [platform, setPlatform] = useState<Platform>(defaultInfo.platform as Platform)
  const [shelfLocation, setShelfLocation] = useState<string>(defaultInfo.shelfLocation)
  const [amount, setAmount] = useState<number>(defaultInfo.amount)
  const [marketplace, setMarketplace] = useState<Marketplace>(defaultInfo.marketplace as Marketplace)
  const [fileFormData, setFileFormData] = useState<FormData>(new FormData())
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

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
    setFileFormData(new FormData())
    setSelectedFiles([])
    // automatically increment the sku for next form
    if (sku) setSku(String(Number(sku) + 1))
  }

  // submit button onclick
  const handleSubmit = async () => {
    // null checks
    if (!sku) return alert('SKU Missing!')
    if (!link) return alert('Link Missing!')
    if (!shelfLocation) return alert('Shelf Location Missing!')

    // construct data
    const data: QARecord = {
      sku: Number(sku),
      time: '',  // let server decide current time
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

    // append files to form data from selected file array
    for (const file of selectedFiles) {
      fileFormData.append(file.name, file)
    }

    setIsLoading(true)
    // send record
    await axios({
      method: 'put',
      url: `${server}/inventoryController/createInventory`,
      responseType: 'text',
      data: JSON.stringify(data),
      withCredentials: true
    }).then(async (res) => {
      // send photos
      if (selectedFiles.length > 0 && res.status <= 200) {
        await axios({
          method: 'post',
          url: `${server}/imageController/uploadImage/${prop.userInfo.id}/${prop.userInfo.name}/${sku}`,
          responseType: 'text',
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
          data: fileFormData
        }).then((res) => {
          if (res.status === 200) {
            alert('Upload Success')
            resetForm()
          }
        }).catch((err) => {
          alert(`Failed to Upload:  ${err.response.statusText}`)
          setIsLoading(false)
        })
      }
    }).catch((err: AxiosError) => {
      alert('Upload Failed: ' + err.message)
      setIsLoading(false)
    })
    setIsLoading(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length < 1) return
    setSelectedFiles([])
    for (const file of event.target.files) {
      setSelectedFiles((prevFiles) => [...prevFiles, file])
    }
  }

  const removeSelectedPhoto = (file: File) => {
    const newArr = selectedFiles.filter((val) => val !== file)
    setSelectedFiles(newArr)
  }

  const renderSelectedPhotos = () => {
    if (selectedFiles.length < 1) {
      return <small style={{ margin: 'auto' }}>Please Select Files</small>
    }
    return (
      <>
        {selectedFiles.map((file, index) => {
          const url = URL.createObjectURL(file)
          return (
            <div key={index}>
              <img src={url} width="120px" />
              <Button variant='secondary' size='sm' onClick={() => removeSelectedPhoto(file)}>
                <FaX />
              </Button>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <IonPage ref={topRef}>
      <LoadingSpiner show={isLoading} />
      <IonHeader>
        <IonToolbar>
          <IonTitle>🦕 Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={topRef} class="ion-padding">
        <Form>
          <Form.Group>
            <Form.Label style={{ color: '#FFA500', fontWeight: 'bold' }}>SKU</Form.Label>
            <Form.Control
              style={{ color: '#FFA500', fontWeight: 'bold', fontSize: '140%' }}
              type="number"
              value={sku}
              onChange={handleSkuChange}
            />
          </Form.Group>
          <hr color='white' />
          <Form.Group id='formgroup'>
            <Form.Label>Item Condition</Form.Label>
            <Form.Select value={itemCondition} aria-label="Item Condition" onChange={handleItemConditionChange}>
              {renderConditionOptions()}
            </Form.Select>
          </Form.Group>
          <hr color='white' />
          <Form.Group id='formgroup'>
            <Form.Label style={{ padding: '10px' }}>
              Comment
              <Button size='sm' className="absolute right-24" onClick={appendToComment('Scanned')}>Scanned by ASIN</Button>
              <Button variant='danger' className='absolute right-6' onClick={clearComment}>
                <FaTrashCan />
              </Button>
            </Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              className='resize-none'
              value={comment}
              rows={4}
              onChange={handleCommentChange}
            />
          </Form.Group>
          <ButtonGroup size='sm' className="mb-2 w-full">
            <Button onClick={appendToComment('All Parts In')} variant="success">All Parts In</Button>
            <Button onClick={appendToComment('Power Tested')} variant="success">Power Tested</Button>
            <Button onClick={appendToComment('Function Tested')} variant="success">Function Tested</Button>
            <Button onClick={appendToComment('All Main Parts In')} variant="success">All Main Parts In</Button>
          </ButtonGroup>
          <ButtonGroup size='sm' className="mb-2 w-full">
            <Button onClick={appendToComment('Missing Screws')} variant="danger">Missing Screws</Button>
            <Button onClick={appendToComment('No Manual')} variant="danger">No Manual</Button>
            <Button onClick={appendToComment('May Missing Parts or Accessories')} variant="danger">May Missing P&A</Button>
            <Button onClick={appendToComment('Unkown Brand')} variant="secondary">Unkown Brand</Button>
          </ButtonGroup>
          <ButtonGroup size='sm' className="mb-2 w-full">
            <Button onClick={appendToComment('Missing Accessory')} variant="danger">Missing Accessories</Button>
            <Button onClick={appendToComment('Missing Main Parts')} variant="danger">Missing Main Parts</Button>
            <Button onClick={appendToComment('Untest')} variant="secondary">Untest</Button>
            <Button onClick={appendToComment('Item Different From Link')} variant="secondary">Item Different From Link</Button>
          </ButtonGroup>
          <ButtonGroup size='sm' className="mb-2 w-full">
            <Button onClick={appendToComment('Uncountable')} variant="secondary">Uncountable</Button>
            <Button onClick={appendToComment('Same')} variant="secondary">Same</Button>
            <Button onClick={appendToComment('Similar Items')} variant="secondary">Similar Items</Button>
            <Button onClick={appendToComment('Different Color')} variant="secondary">Different Color</Button>
          </ButtonGroup>
          <DropdownButton className='w-full mb-2' variant='warning' as={ButtonGroup} title="Color">
            <Dropdown.Item onClick={appendToComment('Rustic Brown')}>Rustic Brown</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Espresso Color')}>Espresso Color</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Black Color')}>Black Color</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('White Color')}>White Color</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Green Color')}>Green Color</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Blue Color')}>Blue Color</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Red Color')}>Red Color</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Pink Color')}>Pink Color</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Purple Color')}>Purple Color</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Oak Color')}>Oak Color</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Maple Color')}>Maple Color</Dropdown.Item>
          </DropdownButton>
          <DropdownButton className='w-full mb-2' variant='danger' as={ButtonGroup} title="Damaged">
            <Dropdown.Item onClick={appendToComment('Damaged')}>Damaged (Ingeneral)</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Minor Scratch')}>Minor Scratch</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Surface Scratched')}>Surface Scratched</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Surface Dented')}>Surface Dented</Dropdown.Item>
            <Dropdown.Item onClick={appendToComment('Corner Cracked')}>Corner Cracked</Dropdown.Item>
          </DropdownButton>
          <hr color='white' />
          <Form.Group id='formgroup'>
            <Form.Label style={{ padding: '10px' }}>
              Link
              <Button variant='danger' className='absolute right-[30px]' onClick={clearLink}>
                <FaTrashCan />
              </Button>
              <Button className='absolute right-[100px]' onClick={() => setLink('No Link')} variant='secondary'>No Link</Button>
            </Form.Label>
            <Form.Control
              className="mb-3 resize-none mt-3"
              type="text"
              as='textarea'
              rows={12}
              value={link}
              onChange={handleLinkChange}
            />
            <div className="d-grid gap-2">
              <Button onClick={pasteLink}>Paste</Button>
            </div>
          </Form.Group>
          <hr color='white' />
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Photo Selection</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </Form.Group>
          <div className='grid grid-cols-4 gap-2'>
            {renderSelectedPhotos()}
          </div>
          <hr color='white' />
          <Form.Group id='Platform'>
            <Form.Label>Platform</Form.Label>
            <Form.Select className="mb-3" value={platform} aria-label="Item Condition" onChange={handlePlatformChange}>
              <option value="Amazon">Amazon</option>
              <option value="eBay">eBay</option>
              <option value="AliExpress">AliExpress</option>
              <option value="HomeDepot">HomeDepot</option>
              <option value="Walmart">Walmart</option>
              <option value="BestBuy">BestBuy</option>
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
              <option value="Kijiji">Kijiji</option>
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
            {/* <NumberInput value={amount} placeholder="Amount..." onChange={handleAmountChange} /> */}
            <Form.Control
              type="number"
              value={amount}
              step={1}
              onChange={handleAmountChange}
            />
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
