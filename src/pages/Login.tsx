import React, { useState } from 'react'
import axios from 'axios';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Button, Fade, Form } from 'react-bootstrap';
import { SHA256, enc } from 'crypto-js';
import { User } from '../utils/Types'

const server = import.meta.env.VITE_APP_SERVER

type LoginProp = {
  setLogin: () => void,
  setToken: (token: string) => void
}

const Login: React.FC<LoginProp> = (prop: LoginProp) => {
  const [userEmail, setUserEmail] = useState<string>('')
  const [userPassword, setUserPassword] = useState<string>('')
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value)
  }

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(event.target.value)
  }

  const onRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked)
  }

  const sanitize = (input: string) => {

  }

  const login = async () => {
    if (!userEmail || !userPassword) {
      alert('Please Enter Both Username and Password')
      return
    }

    // encode password to sha256 Base 64 string
    const passwordHash = SHA256(userPassword).toString(enc.Base64)

    // construct json to send
    const userInfo: User = {
      email: userEmail,
      password: passwordHash,
    }
    console.log(JSON.stringify(userInfo))

    await axios({
      method: 'post',
      url: server + '/userController/login',
      responseType: 'text',
      data: JSON.stringify(userInfo),
    }).then((res) => {
      if (Boolean(res.data) === true) {
        alert('Login Success!!!')
        prop.setLogin()
        prop.setToken(res.data)
      } else {
        alert('Login Failed!!!')
      }
    }).catch((err) => {
      alert(err + ' Server Error, Contact Admin!!!')
      throw err
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
        <Fade in timeout={5000}>
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
        </Fade>
      </IonContent>
    </IonPage>
  )
}

export default Login
