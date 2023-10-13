import React, { useState } from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Button, Form } from 'react-bootstrap';
import { SHA256, enc } from 'crypto-js';

const encoder = new TextEncoder();


const Login: React.FC = () => {
  const [userName, setUserName] = useState<string>('')
  const [userPassword, setUserPassword] = useState<string>('')
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(event.target.value)
  }

  const onRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked)
    setRememberMe(event.target.checked)
  }

  const login = (): boolean => {
    // encode password to a byte array
    // const byteArray = sha256(encoder.encode(userPassword))
    console.log(SHA256(userPassword).toString(enc.Base64))


    // if encoded string matches result from db return true
    if (true) {
      return true
    } else {
      return false
    }
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
            <Form.Control type="email" placeholder="Enter your email..." value={userName} onChange={onUserNameChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.pwdInput1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your password..." value={userPassword} onChange={onPasswordChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
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
