import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import Draggable from 'react-draggable'


class WireframeScreen extends Component {
    state = {
        name: this.props.wireframe.name,
        components: this.props.wireframe.components
    }
    changedTime = false;

    updateTime = () => {
        let fireStore = getFirestore();
        if(!this.props.wireframe) {
            this.props.history.push({pathname: '/'})
        }
        fireStore.collection('wireframes').doc(this.props.wireframe.id).update({ time: Date.now() })
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        // const fireStore = getFirestore();
        // let dbitem = fireStore.collection('todoLists').doc(this.props.todoList.id);
        // dbitem.update({ [target.id]: target.value });
    }

    handleClose = () => {
        this.props.history.push({pathname: '/'})
    }

    handleSave = () => {
        const fireStore = getFirestore()
        let dbitem = fireStore.collection('wireframes').doc(this.props.wireframe.id)
        dbitem.update(
            {
                name: this.state.name,
                components: this.state.components
            }
        ).then(() => {this.props.history.push({pathname: '/'})})
    }

    render() {
        const auth = this.props.auth;
        let wireframe = this.props.wireframe;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        if (!this.changedTime) {
            this.changedTime = true;
            this.updateTime();
        }

        return (
                <div className="row">
                    <div className="input-field col s3">
                        <label className="active text_16" htmlFor="name">Wireframe Name</label>
                        <input className="text_20" type="text" name="name" id="name" onChange={this.handleChange} defaultValue={wireframe.name} />
                        <div>
                            <i className="material-icons">zoom_in</i>
                            <i className="material-icons" style = {{marginLeft: '20px'}}>zoom_out</i>
                            <span style = {{marginLeft: '20px', cursor: "pointer"}} onClick={this.handleSave}>Save</span>
                            <span style = {{marginLeft: '20px', cursor: "pointer"}} onClick={this.handleClose}>Close</span>
                        </div> 
                    </div>
                    <div className="box col s6" style={{height: '600px', width: '600px', backgroundColor: "white", position: 'relative', overflow: 'auto', padding: '0'}}>
                        <div style={{height: '1000px', width: '1000px', padding: '10px'}}>
                            <Draggable bounds="parent">
                                
                                    <div className="box">
                                        I can only be moved within my offsetParent.
                                    </div>
                                
                            </Draggable>
                        </div>
                    </div>
                    <div className="grey col s3">
                        <h6>Properties</h6>
                    </div>               
                </div>
                
            
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { wireframes } = state.firestore.data;
    const wireframe = wireframes ? wireframes[id] : null;
    if (wireframe){
        wireframe.id = id;
    }
    return {
        wireframe,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(WireframeScreen);