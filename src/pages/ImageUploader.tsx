import { ChangeEventHandler, useState } from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { Button, Form, ListGroup } from 'react-bootstrap'
import './ImageUploader.css'

const ImageUploader: React.FC = () => {
  const [sku, setSku] = useState<number>()
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([])
  const [uploading, setUploading] = useState(false)

  const handleSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSku(Number(event.target.value))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    for (const file of event.target.files) {
      selectedFiles.push(file)
    }
  }

  // send async request to upload
  const handleUpload = async () => {
    if (!sku) alert('Please Enter SKU')
    if (selectedFiles.length < 1) alert('Please Select Photos')

    // clean up previous selection
    setSelectedFiles([])

    // push files into selection array
    for (const file of selectedFiles) {
      console.log(file.name)
    }

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bulk Upload Photos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <Form>
          <Form.Group>
            <Form.Label>SKU</Form.Label>
            <Form.Control type="number" onChange={handleSkuChange} maxLength={6} />
          </Form.Group>
          <hr color='white' />
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Select files</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>
          <ListGroup>
            {!selectedFiles ?
              'All Selected Photos Will Show Up Here...' :
              selectedFiles.map((item: File) => <ListGroup.Item key={item.name}>{item.name}</ListGroup.Item>)}
          </ListGroup>
          <hr color='white' />
          <Button variant="success" onClick={handleUpload} disabled={uploading} size='lg'>Upload</Button>
        </Form>
      </IonContent>
    </IonPage>
  )
}

export default ImageUploader
