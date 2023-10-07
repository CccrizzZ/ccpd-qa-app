import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import { useState } from 'react';
import { Condition, Platform } from '../utils/Types';
import {
  Form,
  Button
} from 'react-bootstrap';

const Home: React.FC = () => {
  const [Sku, setSku] = useState<number>()
  const [itemCondition, setItemCondition] = useState<Condition>()

  // need fast pre-defined add info button
  // (all parts in) (missing accessory) 
  const [comment, setComment] = useState<string>()
  const [link, setLink] = useState<string>()

  // selection dropdown
  const [platform, setPlatform] = useState<Platform>()
  const [shelfLocation, setShelfLocation] = useState<string>()
  const [amount, setAmount] = useState<number>()

  const handleSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSku(Number(event.target.value))
  }

  const handleItemConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemCondition(event.target.value as Condition)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value)
  }

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value)
  }

  const handlePlatformChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlatform(event.target.value as Platform)
  }

  const handleShelfLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShelfLocation(event.target.value as Platform)
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value))
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // const 
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <Form>
          <Form.Group>
            <Form.Label>SKU</Form.Label>
            <Form.Control type="number" onChange={handleSkuChange} />
          </Form.Group>


          <hr color='white' />

          <Form.Group id='formgroup'>
            <Form.Label>Item Condition</Form.Label>
            <Form.Select aria-label="Item Condition">
              <option value="New">New</option>
              <option value="">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>
          </Form.Group>
          <Form.Group id='formgroup'>
            <Form.Label>Comment</Form.Label>
            <Form.Control type="text" onChange={handleCommentChange} />
          </Form.Group>
          <Button>All Parts In</Button>
          <Button>Missing Accessory</Button>
          <Button>Missing Parts</Button>
          <Form.Group id='formgroup'>
            <Form.Label>Link</Form.Label>
            <Form.Control type="text" onChange={handleLinkChange} />
          </Form.Group>
          <Form.Group id='formgroup'>
            <Form.Label>Platform</Form.Label>
            <Form.Control type="text" onChange={handlePlatformChange} />
          </Form.Group>
          <Form.Group id='formgroup'>
            <Form.Label>Shelf Location</Form.Label>
            <Form.Control type="text" onChange={handleShelfLocationChange} />
          </Form.Group>
          <Form.Group id='formgroup'>
            <Form.Label>Amount</Form.Label>
            <Form.Control type="text" onChange={handleAmountChange} />
          </Form.Group>
          <hr color='white' />
          <Button variant="success" onClick={handleSubmit} size='lg'>Submit</Button>
        </Form>
      </IonContent>
    </IonPage>
  );
};

export default Home;
