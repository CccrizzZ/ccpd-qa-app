import { Modal, Button } from 'react-bootstrap';

type popupModalProp = {
  title: string,
  content: string,
  show: boolean,
  confirmAction: () => void
  cancelAction: () => void
}

const PopupModal: React.FC<popupModalProp> = (props: popupModalProp) => {
  return (
    <Modal style={{ color: '#adb5bd' }} show={props.show} size="lg" centered>
      <Modal.Header className='bg-dark'>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark'>
        <p>
          {props.content}
        </p>
      </Modal.Body>
      <Modal.Footer className='bg-dark'>
        <Button variant='warning' onClick={props.confirmAction}>Confirm</Button>
        <Button variant='secondary' onClick={props.cancelAction}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PopupModal