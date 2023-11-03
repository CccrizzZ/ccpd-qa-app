import React, { InvalidEvent } from 'react'
import { QARecord } from '../utils/Types'
import { Card } from 'react-bootstrap'

type InvTableProp = {
    InventoryArr: QARecord[]
}

// table for personal inventory
// sorting and filtering function
// sealed = primary
// new = success
// used like new = secondary
// used = dark
// damaged = danger
// missing parts = warning

// const getVariant = (condition: string) => {
//     switch (key) {
//         case value:

//             break;

//         default:
//             break;
//     }
// }

const InventoryTable: React.FC<InvTableProp> = (prop: InvTableProp) => {
    // render a single inventory card
    const renderCard = (inventory: QARecord, index: number) => {
        return (
            <Card id={String(index)} border="primary" style={{ width: '18rem' }}>
                <Card.Header>{inventory.sku}</Card.Header>
                <Card.Body>
                    <Card.Title>{inventory.itemCondition}</Card.Title>
                    <Card.Text>{inventory.platform}</Card.Text>
                    <Card.Text>{inventory.comment}</Card.Text>
                    <Card.Text>{inventory.link}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">Last updated {inventory.time}</small>
                </Card.Footer>
            </Card>
        )
    }

    // render table from inventory array
    const renderTable = () => {
        return (
            <>
                {prop.InventoryArr.map((value, index) => {
                    return renderCard(value, index)
                })}
            </>
        )
    }

    return (
        <div style={{ minHeight: '200px', backgroundColor: '#101', borderRadius: '1em' }}>{renderTable()}</div>
    )
}

export default InventoryTable
