import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import Draggable from 'react-draggable'
import { Rnd } from "react-rnd";

class WireframeScreen extends Component {
    state = {
        name: this.props.wireframe.name,
        components: this.props.wireframe.components,
        selectedComponent: null,
        isCurrentlyDragging: false,
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

    handleAddContainer = () => {
        var nextitemkey
        if (this.state.components.length == 0){
            nextitemkey = 0
        } else {
            nextitemkey = Math.max.apply(Math, this.state.components.map(function(o) { return o.key; })) + 1
        }
        let containerItem = {
            name: 'container',
            height: 200,
            width: 200,
            xposition: 0,
            yposition: 0,
            background: '#ffffff',
            borderColor: '#000000',
            borderThickness: 1,
            borderRadius: 0,
            key: nextitemkey
        }
        this.handleSelectComponent(containerItem)
        let list = this.state.components
        list.push(containerItem)
        this.setState({components: list})
    }

    handleAddLabel = () => {
        var nextitemkey
        if (this.state.components.length == 0){
            nextitemkey = 0
        } else {
            nextitemkey = Math.max.apply(Math, this.state.components.map(function(o) { return o.key; })) + 1
        }
        let labelItem = {
            name: 'label',
            text: 'label text',
            fontSize: 14,
            fontColor: '#ffffff',
            height: 50,
            width: 100,
            xposition: 0,
            yposition: 0,
            key: nextitemkey
        }
        this.handleSelectComponent(labelItem)
        let list = this.state.components
        list.push(labelItem)
        this.setState({components: list})
    }

    handleResize = (e, direction, ref, delta, position) => {
        this.setState({
            selectedComponent: {
            ...this.state.selectedComponent,
            xposition: position.x,
            yposition: position.y,
            height: ref.style.height,
            width: ref.style.width,
            }
        }, this.handleMoveSelectedToComponents)
    }

    handleDrag = (e, ui) => {
        const x = this.state.selectedComponent.xposition
        const y = this.state.selectedComponent.yposition
        this.setState(
            {
                selectedComponent: {
                ...this.state.selectedComponent,
                xposition: x + ui.deltaX,
                yposition: y + ui.deltaY,}
            }, this.handleMoveSelectedToComponents
        )
    }

    handleMoveSelectedToComponents = () => {
        let list = this.state.components
        let index = list.map(o => {return o.key}).indexOf(this.state.selectedComponent.key)
        list[index] = this.state.selectedComponent
        this.setState({components: list})
    } 

    handleSelectComponent = (component) => {
        this.setState({selectedComponent: component, isCurrentlyDragging: true})
    }

    notCurrentlyDragging = () => {
        if(this.state.isCurrentlyDragging){
            this.setState({isCurrentlyDragging: false})
        }
    }

    handleUnselectComponent = () =>{
        if(!this.state.isCurrentlyDragging){
            this.setState({selectedComponent: null})
        }
    }

    deleteComponent = (e) => {
        if(e.keyCode == 46){
            if(this.state.selectedComponent){
                let list = this.state.components
                let index = list.map(o => {return o.key}).indexOf(this.state.selectedComponent.key)
                list.splice(index, 1)
                this.setState({components: list, selectedComponent: null})
            }
        }
    }

    handleComponentChange = (e) => {
        const { target } = e;
        this.setState({
            selectedComponent: {
                ...this.state.selectedComponent,
                [target.id]: target.value,
            }
        }, this.handleMoveSelectedToComponents);
    }

    componentDidMount(){
        document.addEventListener('keydown',this.deleteComponent);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.deleteComponent);
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
                <div className="row" onClick={this.notCurrentlyDragging}>
                    <div className="input-field col s3">
                        <label className="active text_16" htmlFor="name">Wireframe Name</label>
                        <input className="text_20" type="text" name="name" id="name" onChange={this.handleChange} defaultValue={wireframe.name} />
                        <div>
                            <i className="material-icons">zoom_in</i>
                            <i className="material-icons" style = {{marginLeft: '20px'}}>zoom_out</i>
                            <span style = {{marginLeft: '20px', cursor: "pointer"}} onClick={this.handleSave}>Save</span>
                            <span style = {{marginLeft: '20px', cursor: "pointer"}} onClick={this.handleClose}>Close</span>
                        </div>
                        <div className="grey">
                            <h6 style={{textAlign: "center"}}>Add Controller</h6>
                            <div className="box" style={{height: '75px', marginLeft: '65px',}} onClick={this.handleAddContainer}></div>
                            <p style={{textAlign: "center", fontWeight: "bold"}}>Container</p>
                            <p style={{textAlign: "center"}}>Prompt for input: </p>
                            <p style={{textAlign: "center", fontWeight: "bold"}}>Label</p>
                        </div>
                    </div>
                    <div className="box col s6" onClick={this.handleUnselectComponent}
                    style={{height: '600px', width: '600px', backgroundColor: "white", position: 'relative', overflow: 'auto', padding: '0'}}>
                        <div style={{height: '1000px', width: '1000px', padding: '10px'}}>
                            {
                                this.state.components.map(component => {
                                    if(component.name == 'container') {
                                        var background = component.background
                                        var borderColor = component.borderColor
                                        var borderRadius = parseInt(component.borderRadius)
                                        var borderThickness = parseInt(component.borderThickness)
                                        const style = {
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "solid",
                                            borderColor: borderColor,
                                            borderRadius: borderRadius,
                                            borderWidth: borderThickness,
                                            background: background
                                        };
                                        return (
                                        <Rnd
                                            key={component.key}
                                            style={style}
                                            size={{ width: component.width, height: component.height }}
                                            position={{ x: component.xposition, y: component.yposition}}
                                            onDragStart={() => this.handleSelectComponent(component)}
                                            onDrag = {this.handleDrag}
                                            onResizeStart = {() => this.handleSelectComponent(component)}
                                            onResizeStop={this.handleResize}>
                                        </Rnd>
                                        )
                                    } else if (component.name == 'label') {

                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className="white col s3">
                        <h6>Properties</h6>
                        
                        {this.state.selectedComponent ? this.state.selectedComponent.name == 'container' ? (
                            <div>
                                <label className="active text_16" htmlFor="name">Background: </label>
                                <input className="text_20" type="color" name="background" id="background" onChange={this.handleComponentChange} value={this.state.selectedComponent.background} />
                                <div></div>
                                <label className="active text_16" htmlFor="name">Border Color: </label>
                                <input className="text_20" type="color" name="borderColor" id="borderColor" onChange={this.handleComponentChange} value={this.state.selectedComponent.borderColor} />
                                <div></div>
                                <label className="active text_16" htmlFor="name">Border Thickness: </label>
                                <input className="text_20" type="number" min='0' name="borderThickness" id="borderThickness" onChange={this.handleComponentChange} value={this.state.selectedComponent.borderThickness} />
                                <div></div>
                                <label className="active text_16" htmlFor="name">Border Radius: </label>
                                <input className="text_20" type="number" min='0' name="borderRadius" id="borderRadius" onChange={this.handleComponentChange} value={this.state.selectedComponent.borderRadius} />
                            </div>
                        ) 
                        : (<div></div>)
                        : (<div></div>)
                        }
                        
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