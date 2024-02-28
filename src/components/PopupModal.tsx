import { Modal, Button } from 'react-bootstrap';

type PopupModalProp = {
  title: string,
  content: string | undefined,
  dom?: JSX.Element | undefined,
  show: boolean,
  confirmAction: () => void,
  cancelAction: () => void,
  showConfirmButton: boolean,
  showCloseButton: boolean
}

const PopupModal: React.FC<PopupModalProp> = (props: PopupModalProp) => {
  return (
    <Modal style={{ color: '#adb5bd' }} show={props.show} size="lg" centered>
      <Modal.Header className='bg-dark'>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark'>
        <p>
          {props.content ?? undefined}
        </p>
        {props.dom}
      </Modal.Body>
      <Modal.Footer className='bg-dark'>
        {props.showConfirmButton ? <Button variant='warning' onClick={props.confirmAction}>Confirm</Button> : undefined}
        {props.showCloseButton ? <Button variant='secondary' onClick={props.cancelAction}>Close</Button> : undefined}
      </Modal.Footer>
    </Modal>
  )
}

export default PopupModal