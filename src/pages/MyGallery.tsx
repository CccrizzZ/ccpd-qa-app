import React, { useContext, useEffect, useState } from 'react'
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
} from '@tremor/react';

const MyGallery: React.FC = () => {
  const { userInfo, setLoading } = useContext(AppContext)
  const [sku, setSku] = useState<string>('')
  const [urlArr, setUrlArr] = useState<string[]>([])
  const [showEnlarge, setShowEnlarge] = useState<boolean>(false)
  const [galleryInfo, setGalleryInfo] = useState<Record<string, string[]>>({
    '': []
  })

  useEffect(() => {
    fetchAllUrls()
  }, [])

  const fetchAllUrls = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/imageController/getUrlsByOwner',
      responseType: 'text',
      withCredentials: true,
      data: JSON.stringify({ owner: userInfo.id })
    }).then((res) => {
      // setUrlArr(JSON.parse(res.data))
      processUrlArr(JSON.parse(res.data))
    }).catch((err) => {
      setLoading(false)
      throw err
    })
    setLoading(false)
  }

  // get the sku from url path
  const getUrlFileName = (url: string) => {
    return url.substring(url.lastIndexOf('/') + 1)
  }

  // url into array with key of sku
  const processUrlArr = (arr: string[]) => {
    arr.forEach((url) => {
      const sku = getUrlFileName(url).split('_')[0]
      !galleryInfo[sku] ? galleryInfo[sku] = [] : undefined
      galleryInfo[sku].push(url)
    })
  }

  return (
    <div className='gap-2'>
      {Object.entries(galleryInfo).map(([key, values]) => (
        <div key={key}>
          <h3>{key}</h3>
          <ul>
            {values.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default MyGallery