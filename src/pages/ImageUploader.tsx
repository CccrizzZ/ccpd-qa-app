import { ChangeEventHandler, useEffect, useState } from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { fileFromPath } from 'formdata-node/file-from-path'
import LoadingSpinner from '../utils/LoadingSpiner'
import { server } from '../utils/utils'
import fs from 'fs'
import axios from 'axios'
import './ImageUploader.css'

const ImageUploader: React.FC = () => {
  const [sku, setSku] = useState<number>()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [fileFormData, setFileFormData] = useState<FormData>(new FormData())
  const [showSelected, setShowSelected] = useState<boolean>(false)

  const handleSkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSku(Number(event.target.value))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    for (const file of event.target.files) {
      // console.log(!selectedFiles.includes(file))
      // console.log()
      // if (!selectedFiles.includes(file)) {
      // }
      selectedFiles.push(file)
    }
    console.log('hey, file has changed length to: ' + selectedFiles.length)
    selectedFiles.length > 0 ? setShowSelected(true) : setShowSelected(false)
  }

  // send async request to upload
  const handleUpload = async () => {
    if (selectedFiles.length < 1) return
    if (!sku) return alert('Please Enter SKU')
    setUploading(true)

    // append files to form data from selected file array
    for (const file of selectedFiles) {
      fileFormData.append(file.name, file)
    }

    // post the files to server
    await axios({
      method: 'post',
      url: server + '/imageController/uploadImage/' + sku,
      responseType: 'text',
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: fileFormData
    }).then((res) => {
      alert('Upload Success')
    }).catch((err) => {
      setUploading(false)
      alert('Failed to Upload: ' + err.response.status)
      throw err
    })

    // clean up previous selection
    setFileFormData(new FormData())
    setSelectedFiles([])
    setUploading(false)
  }

  // render the selected file section
  const renderFormDataEntries = () => {
    if (!showSelected) {
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
          <hr color='white' />
          <Button variant="success" onClick={handleUpload} disabled={uploading} size='lg'>Upload</Button>
          <ListGroup>
            {renderFormDataEntries()}
          </ListGroup>
        </Form>
      </IonContent>
    </IonPage>
  )
}

export default ImageUploader
