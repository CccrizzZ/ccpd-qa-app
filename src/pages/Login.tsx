import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Button, Fade, Form } from 'react-bootstrap';
import { SHA256, enc } from 'crypto-js';
import { User, UserInfo } from '../utils/Types';
import { sleep } from '../utils/utils';

const server = import.meta.env.VITE_APP_SERVER

type LoginProp = {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setUserInfo: (id: UserInfo) => void
}

const Login: React.FC<LoginProp> = (prop: LoginProp) => {
  const [userEmail, setUserEmail] = useState<string>('')
  const [userPassword, setUserPassword] = useState<string>('')
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  // checks if jwt token is in http only cookie
  const checkToken = async () => {
    prop.setLoading(true)
    await sleep(1000)
    await axios({
      method: 'post',
      url: server + '/userController/checkToken',
      responseType: 'text',
      data: '',
      withCredentials: true
    }).then((res) => {
      if (res.status === 200) {
        prop.setLogin(true)
        prop.setUserInfo(JSON.parse(res.data))
      }
    }).catch((err) => {
      console.log('please login')
    })
    prop.setLoading(false)
  }

  useEffect(() => {
    // check token
    checkToken()
  }, [])

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value)
  }

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(event.target.value)
  }

  const onRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked)
  }

  // need to implement sanitization to reduce server calls
  const sanitize = (input: string) => {

  }

  const login = async () => {
    // maybe put a len check here for less request
    // null check
    if (!userEmail || !userPassword) return alert('Please Enter Both Username and Password')

    // encode password to sha256 Base 64 string
    // so database only store sha256 hash
    const passwordHash = SHA256(userPassword).toString(enc.Base64)

    // construct user json
    const userInfo: User = {
      email: userEmail,
      password: passwordHash,
    }

    // send request
    prop.setLoading(true)
    await sleep(1000)
    await axios({
      method: 'post',
      url: server + '/userController/login',
      responseType: 'text',
      data: JSON.stringify(userInfo),
      withCredentials: true
    }).then((res) => {
      prop.setLogin(true)
      prop.setUserInfo(JSON.parse(res.data))
    }).catch((err) => {
      alert(' Login Error!!!')
    })
    prop.setLoading(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <Form>
          <Form.Group className="mb-3" controlId="loginForm.unameInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email..." value={userEmail} onChange={onEmailChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.pwdInput1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your password..." value={userPassword} onChange={onPasswordChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="rememberMeCheckbox">
            <Form.Check type="checkbox" label="Remember me" aria-selected={rememberMe} onChange={onRememberMeChange} />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" size='lg' onClick={login}>Login</Button>
          </div>
        </Form>
      </IonContent>
    </IonPage>
  )
}

export default Login
