import React from 'react';
import { Modal, Button } from 'react-materialize';

class WireframeCard extends React.Component {
    closeModal = (e) => {
        e.stopPropagation()
    }

    render() {
        const { wireframe } = this.props;
        return (
            <div className = "Container">
                <div className="card z-depth-2 rounded grey lighten-4 todo-list-link hoverable">
                    <span className="item-delete hoverable modal-trigger" href="#modal1">X</span>
                    <div className="card-content grey-text text-darken-4 item_card">
                        <span className="card-title">{wireframe.name}</span>
                    </div>
                </div>

                <div className="">
                    <Modal id="modal1" header="Delete List?" actions={
                        <div className="grey lighten-2">
                            <Button className="red accent-2"
                                onClick={this.deleteList} modal="close">Yes</Button><span>  </span>
                            <Button className="purple lighten-2" onClick={this.closeModal} modal="close">No</Button>
                        </div>}>
                        <p><b>Are you sure you want to delete this list?</b></p>
                    </Modal>
                </div>
            </div>
        );
    }
}
export default WireframeCard;