import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Button, Form } from 'react-bootstrap';
import { User, UserInfo } from '../utils/Types';
import { hashPassword, server } from '../utils/utils';
import RegistrationModel from '../components/RegistrationModel';

type LoginProp = {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
}

const Login: React.FC<LoginProp> = (prop: LoginProp) => {
  const [userEmail, setUserEmail] = useState<string>('')
  const [userPassword, setUserPassword] = useState<string>('')
  const [showReg, setShowReg] = useState<boolean>(false)

  // checks if jwt token is in http only cookie
  const checkToken = async () => {
    prop.setLoading(true)
    await axios({
      method: 'post',
      url: server + '/userController/checkToken',
      responseType: 'text',
      data: '',
      timeout: 3000,
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        prop.setLogin(true)
        prop.setUserInfo(JSON.parse(res.data))
      }
    }).catch(() => {
      console.log('jwt token not found, please login')
    })
    prop.setLoading(false)
  }

  useEffect(() => {
    checkToken()
  }, [])

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value)
  }

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(event.target.value)
  }

  const login = async () => {
    // null check
    if (!userEmail || !userPassword) return alert('Please Enter Both Username and Password')

    // encode password to sha256 Base 64 string
    // so database only store sha256 hash
    // construct user json
    const userLoginInfo: User = {
      email: userEmail,
      password: hashPassword(userPassword),
    }

    // send request
    prop.setLoading(true)
    await axios({
      method: 'post',
      url: server + '/userController/login',
      responseType: 'text',
      data: JSON.stringify(userLoginInfo),
      withCredentials: true,
      timeout: 3000
    }).then((res) => {
      if (res.status === 200) {
        prop.setLogin(true)
        prop.setUserInfo(JSON.parse(res.data))
      }
      prop.setLoading(false)
    }).catch((err) => {
      prop.setLoading(false)
      alert('Login Error: ' + err.response.data)
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <RegistrationModel show={showReg} cancelAction={() => setShowReg(false)} />
        <Form>
          <Form.Group className="mb-3" controlId="loginForm.unameInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email..." value={userEmail} onChange={onEmailChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.pwdInput1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your password..." value={userPassword} onChange={onPasswordChange} />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="success" size='lg' onClick={login}>Login</Button>
            <Button variant="primary" size='lg' onClick={() => setShowReg(true)}>Register</Button>
          </div>
        </Form>
      </IonContent>
    </IonPage>
  )
}

export default Login
