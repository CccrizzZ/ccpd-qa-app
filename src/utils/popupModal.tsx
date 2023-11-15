import { Modal, Button } from 'react-bootstrap';

type popupModalProp = {
  title: string,
  content: string,
  show: boolean,
  confirmAction: () => void
}

const popupModal: React.FC<popupModalProp> = (props: popupModalProp) => {
  if (props.show) {
    return (
      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{props.title}</h4>
          <p>
            {props.content}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.confirmAction}>Confirm</Button>
          <Button onClick={() => { props.show = false }}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default popupModal