import axios from 'axios';
import { server } from 'ionicons/icons';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

type RegistrationModelProp = {
  show: boolean,
  // confirmAction: () => void
  cancelAction: () => void
}

type RegInfo = {
  email: string,
  uname: string,
  upwd: string,
  code: string
}

const RegistrationModel: React.FC<RegistrationModelProp> = (props: RegistrationModelProp) => {
  const [regInfo, setRegInfo] = useState<RegInfo>({} as RegInfo)

  const register = async () => {
    // null check
    if (regInfo.code.length < 1 || regInfo.email.length < 1 || regInfo.uname.length < 1 || regInfo.upwd.length < 1) return alert('Invalid Register Information')

    // send register
    await axios({
      method: 'post',
      url: server + '/userController/register',
      responseType: 'text',
      data: JSON.stringify(regInfo),
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        return alert('Register Success')
      }
    }).catch((err) => {
      alert('Register Error!!!')
    })
  }

  return (
    <Modal style={{ color: '#adb5bd' }} show={props.show} size="lg" centered>
      <Modal.Header className='bg-dark'>
        <Modal.Title id="contained-modal-title-vcenter">
          Register
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark'>
        <Form>
          <Form.Group className="mb-3" controlId="loginForm.unameInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email..." value={regInfo.email} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.email">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="name" placeholder="Enter your name..." value={regInfo.uname} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.email">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password..." value={regInfo.upwd} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.email">
            <Form.Label>Invitation Code</Form.Label>
            <Form.Control type="name" placeholder="Enter invitation code..." value={regInfo.code} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className='bg-dark'>
        <Button variant='warning' onClick={register}>Confirm</Button>
        <Button variant='secondary' onClick={props.cancelAction}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RegistrationModel