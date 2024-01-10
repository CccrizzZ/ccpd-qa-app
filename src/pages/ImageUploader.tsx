import { useState } from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap'
import LoadingSpinner from '../components/LoadingSpiner'
import { server } from '../utils/utils'
import { UserInfo } from '../utils/Types'
import axios from 'axios'
import './ImageUploader.css'
import MyGallery from './MyGallery';

type ImageUploaderProp = {
  userInfo: UserInfo
}

const ImageUploader: React.FC<ImageUploaderProp> = (prop: ImageUploaderProp) => {
  const [sku, setSku] = useState<number>(1)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [fileFormData, setFileFormData] = useState<FormData>(new FormData())

  const handleSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSku(Number(event.target.value))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length < 1) return
    setSelectedFiles([])
    for (const file of event.target.files) {
      setSelectedFiles((prevFiles) => [...prevFiles, file])
    }
  }

  // clear everything increment sku by 1
  const clearForm = () => {
    setFileFormData(new FormData())
    setSelectedFiles([])
    setSku(sku + 1)
  }

  // send async request to upload
  const handleUpload = async () => {
    if (selectedFiles.length < 1) return alert('Please Select Photos')
    if (!sku) return alert('Please Enter SKU')
    setUploading(true)

    // append files to form data from selected file array
    for (const file of selectedFiles) {
      fileFormData.append(file.name, file)
    }

    // post the files to server
    await axios({
      method: 'post',
      url: `${server}/imageController/uploadImage/${prop.userInfo.id}/${prop.userInfo.name}/${sku}`,
      responseType: 'text',
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: fileFormData
    }).then((res) => {
      if (res.status === 200) {
        alert(`Upload Success: ${res.status}`)
      }
    }).catch((err) => {
      clearForm()
      setUploading(false)
      alert(`Failed to Upload:  ${err.response.statusText}`)
      throw err
    })

    // clean up previous selection
    clearForm()
    setUploading(false)
  }

  // render the selected file section
  const renderSelectedPhotos = () => {
    if (selectedFiles.length < 1) {
      return <small style={{ margin: 'auto' }}>Please Select Files</small>
    }
    return (
      <>
        {selectedFiles.map((file) => {
          const url = URL.createObjectURL(file)
          return (
            <ListGroup.Item key={file.name}>
              <Row>
                <Col><img src={url} width="60px"></img></Col>
                <Col><p>{file.name}</p></Col>
              </Row>
            </ListGroup.Item>
          )
        })}
      </>
    )
  }

  return (
    <IonPage>
      <LoadingSpinner show={uploading} />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Image Uploader</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <Form>
          <Form.Group>
            <Form.Label>SKU</Form.Label>
            <Form.Control type="number" onChange={handleSkuChange} maxLength={6} value={sku} />
          </Form.Group>
          <hr color='white' />
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Select files</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>
        </Form>
        <hr color='white' />
        <div className='d-grid'>
          <Button variant="success" onClick={handleUpload} disabled={uploading} size='lg'>Upload</Button>
        </div>
        <hr color='white' />
        <ListGroup>
          {renderSelectedPhotos()}
        </ListGroup>
        <hr color='white' />
        <MyGallery />
      </IonContent>
    </IonPage>
  )
}

export default ImageUploader
