import axios from 'axios';
import { server, hashPassword } from '../utils/utils';
import { Clipboard } from '@capacitor/clipboard';
import { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AppContext } from '../App';

type RegistrationModelProp = {
  show: boolean,
  cancelAction: () => void
}

type RegInfo = {
  email: string,
  name: string,
  password: string,
  code: string
}

const defaultRegInfo = {
  email: '',
  name: '',
  password: '',
  code: ''
}

const RegistrationModel: React.FC<RegistrationModelProp> = (prop: RegistrationModelProp) => {
  const { setLoading } = useContext(AppContext)
  const [regInfo, setRegInfo] = useState<RegInfo>(defaultRegInfo)

  const register = async () => {
    // null check
    if (regInfo.code.length < 1 || regInfo.email.length < 1 || regInfo.name.length < 1 || regInfo.password.length < 1) return alert('Please Complete The Form')
    // send register post request
    setLoading(true)
    await axios({
      method: 'post',
      url: server + '/userController/registerUser',
      responseType: 'text',
      timeout: 3000,
      data: { ...regInfo, password: hashPassword(regInfo.password) },  // send the encoded data to register
      withCredentials: true,
    }).then((res) => {
      if (res.status === 201) {
        setRegInfo(defaultRegInfo)
        prop.cancelAction()
        return alert('Register Success')
      }
    }).catch((err) => {
      setLoading(false)
      alert('Register Error: ' + err.response.status)
    })
    setLoading(false)
  }

  const pasteInviteCode = async () => {
    const clip = await Clipboard.read()
    setRegInfo({ ...regInfo, code: clip.value.replace(/(\r\n|\n|\r)/gm, "") })
  }

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setRegInfo({ ...regInfo, email: event.target.value })
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setRegInfo({ ...regInfo, name: event.target.value })
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setRegInfo({ ...regInfo, password: event.target.value })
  const onInviteCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => setRegInfo({ ...regInfo, code: event.target.value })

  return (
    <Modal style={{ color: '#adb5bd' }} show={prop.show} size="lg" centered>
      <Modal.Header className='bg-dark'>
        <Modal.Title id="contained-modal-title-vcenter">
          Register
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark'>
        <Form>
          <Form.Group className="mb-3" controlId="loginForm.email">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email..." value={regInfo.email} onChange={onEmailChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.name">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="name" placeholder="Enter your name..." value={regInfo.name} onChange={onNameChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password..." value={regInfo.password} onChange={onPasswordChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginForm.invitationCode">
            <Form.Label>Invitation Code</Form.Label>
            <Form.Control type="name" placeholder="Enter invitation code..." value={regInfo.code} onChange={onInviteCodeChange} />
            <Button className='mt-3' onClick={pasteInviteCode}>Paste</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className='bg-dark'>
        <Button variant='warning' onClick={register}>Confirm</Button>
        <Button variant='secondary' onClick={prop.cancelAction}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RegistrationModel