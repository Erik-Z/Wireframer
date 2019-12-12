import React from 'react';
import Modal from './Modal'


class WireframeCard extends React.Component {
    state = {
        id: this.props.wireframe.id
    }

    closeModal = (e) => {
        e.stopPropagation()
        console.log(this.state.id)
    }

    

    render() {
        const { wireframe } = this.props;
        return (
            <div className = "Container">
                <div className="card z-depth-2 rounded grey lighten-4 todo-list-link hoverable">
                    <Modal id = {wireframe.id}/>
                    <div className="card-content grey-text text-darken-4 item_card">
                        <span className="card-title">{wireframe.name}</span>
                    </div>
                </div>

                
            </div>
        );
    }
}
export default WireframeCard;