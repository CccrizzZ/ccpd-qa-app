import React, { useContext, useEffect, useState, ForwardRefExoticComponent, forwardRef } from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Modal } from 'react-bootstrap'
import axios from 'axios'
import { QARecord } from '../utils/Types';
import { getVariant, server, copy, openInBrowser } from '../utils/utils'
import LoadingSpiner from '../components/LoadingSpiner';
import { AppContext } from '../App';
import {
  List,
  ListItem,
  Badge,
  Col,
  Card,
  Button,
  Subtitle,
} from '@tremor/react';
import { RiRefreshLine } from "react-icons/ri"

const initInfo = { '': [] }
type MyGalleryProps = {}
export interface IMyGallery {
  fetchAllUrls: () => void;
}

const MyGallery: React.ForwardRefExoticComponent<MyGalleryProps & React.RefAttributes<IMyGallery>> = forwardRef((prop, ref) => {
  const { userInfo, setLoading } = useContext(AppContext)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [selectedSku, setSelectedSku] = useState<string>('')
  const [galleryInfo, setGalleryInfo] = useState<Record<string, string[]>>(initInfo)

  useEffect(() => {
    fetchAllUrls()
  }, [])

  React.useImperativeHandle(ref, () => ({
    fetchAllUrls: () => fetchAllUrls()
  }))

  const fetchAllUrls = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/imageController/getUrlsByOwner',
      responseType: 'text',
      withCredentials: true,
      data: JSON.stringify({ owner: userInfo.id })
    }).then((res) => {
      processUrlArr(JSON.parse(res.data))
    }).catch((err) => {
      setLoading(false)
      throw err
    })
    setLoading(false)
  }

  const deleteImage = async (sku: string, url: string) => {
    setLoading(true)
    await axios({
      method: 'delete',
      url: server + '/imageController/deleteImageByName',
      responseType: 'text',
      withCredentials: true,
      data: JSON.stringify({ sku: sku, name: getUrlFileName(url) })
    }).then((res) => {
      if (res.status === 200) {
        Object.entries(galleryInfo).map(([key, value]): void => {
          if (key === sku) setGalleryInfo({ ...galleryInfo, [key]: galleryInfo[key].filter((val) => val !== url) })
        })
        alert('Image Deleted!')
      }
    }).catch(() => {
      setLoading(false)
      alert(`Failed to Delete`)
    })
    setLoading(false)
    setShowPopup(false)
    fetchAllUrls()
  }

  // get the sku from url path
  const getUrlFileName = (url: string) => {
    return url.substring(url.lastIndexOf('/') + 1)
  }

  // url into array with key of sku
  const processUrlArr = (arr: string[]) => {
    arr.forEach((url) => {
      // wtf copilot
      const sku = new URL(url).pathname.split('/')[new URL(url).pathname.split('/').length - 2]
      if (!galleryInfo[sku]) galleryInfo[sku] = []
      if (!galleryInfo[sku].some(item => item === url)) galleryInfo[sku].push(url)
    })
  }

  const showImagePopup = (sku: string) => {
    setSelectedSku(sku)
    setShowPopup(true)
  }

  const renderImagePopup = () => {
    return (
      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header className='bg-dark border-0' closeButton>
          <Modal.Title>{selectedSku}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark border-0'>
          {galleryInfo[selectedSku].filter(item => item !== null).map((value, index) => {
            return (
              <div key={index} className='flex mb-3'>
                <img src={value} />
                <Button
                  className='h-12 absolute mt-8 ml-6 opacity-50'
                  color='rose'
                  onClick={() => deleteImage(selectedSku, value)}
                >
                  Delete
                </Button>
                <p className='h-6 absolute ml-6 text-red-500 bg-stone-800 opacity-80 mt-2'>
                  {getUrlFileName(value)}
                </p>
              </div>
            )
          })}
        </Modal.Body>
        <Modal.Footer className='bg-dark border-0'>
          <Button color='slate' onClick={() => setShowPopup(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <div className='grid gap-2'>
      {renderImagePopup()}
      <div className='flex gap-3 mt-3'>
        <Button className='h-10' onClick={fetchAllUrls} color='emerald'><RiRefreshLine /></Button>
        <p className='mt-2 ml-10'>Image From Last 48 Hours 👇</p>
      </div>
      <hr color='white' />
      {Object.entries(galleryInfo).map(([key, values]) => {
        if (values.length > 0) return (
          <Card className='flex gap-6' key={key}>
            <h3>{key}</h3>
            <Button className='absolute right-3 mt-2' onClick={() => showImagePopup(key)} color='slate'>Show Images</Button>
          </Card>
        )
      })}
    </div>
  )
})

export default MyGallery