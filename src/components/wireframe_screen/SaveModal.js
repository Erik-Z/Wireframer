import React, { Component } from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { Link } from 'react-router-dom';
import { getFirestore } from 'redux-firestore';

class SaveModal extends Component {
  componentDidMount() {
    const options = {
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: false,
      startingTop: "4%",
      endingTop: "10%"
    };
    M.Modal.init(this.Modal, options);

    // let instance = M.Modal.getInstance(this.Modal);
    // instance.open();
    // instance.close();
    // instance.destroy();
  }
  saveWork = () => {
    const fireStore = getFirestore()
    let dbitem = fireStore.collection('wireframes').doc(this.props.id)
    dbitem.update(
      {
        name: this.props.name,
        height: this.props.height,
        width: this.props.width,
        components: this.props.components,
        zoom: this.props.zoom
      }
    ).then(this.props.close)
  }

  closeWithoutSaving = () => {
    this.props.close()
  }

  render() {
    return (
      <div style = {{display: "inline"}}>
        <span
          className="modal-trigger"
          data-target="modal1"
          style = {{marginLeft: '20px', cursor: "pointer"}}
        >
          Close
        </span>

        <div
          ref={Modal => {
            this.Modal = Modal;
          }}
          id="modal1"
          className="modal"
        >
          <div className="modal-content">
            <h4>You have some unsaved work</h4>
            <p>Are you sure you want quit without saving?</p>
            <p>All your progress will be lost</p>
          </div>
          <div className="modal-footer">
            <div className="modal-close waves-effect waves-green btn-flat" onClick={this.saveWork}>
              Save
            </div>
            <div className="modal-close waves-effect waves-red btn-flat" onClick={this.closeWithoutSaving}>
              Quit
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SaveModal;