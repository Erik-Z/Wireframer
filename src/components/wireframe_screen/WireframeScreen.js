import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { Rnd } from "react-rnd";
import SaveModal from './SaveModal'

class WireframeScreen extends Component {
    state = {
        name: this.props.wireframe.name,
        components: this.props.wireframe.components,
        selectedComponent: null,
        isCurrentlyDragging: false,
        height: this.props.wireframe.height,
        width: this.props.wireframe.width,
        proposedHeight: this.props.wireframe.height,
        proposedWidth: this.props.wireframe.width,
        recentlySaved: false
    }

    changedTime = false;

    handleChangeDiagramDimensions = () => {
        this.setState({height: parseInt(this.state.proposedHeight), width: parseInt(this.state.proposedWidth), recentlySaved: false})
    }

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
            recentlySaved: false
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
                height: this.state.height,
                width: this.state.width,
                components: this.state.components
            }
        ).then(() => {this.setState({recentlySaved: true})})
    }

    handleAddContainer = () => {
        var nextitemkey
        if (this.state.components.length === 0){
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
        this.setState({components: list, recentlySaved: false})
    }

    handleAddLabel = () => {
        var nextitemkey
        if (this.state.components.length === 0){
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
        this.setState({components: list, recentlySaved: false})
    }

    handleAddButton = () => {
        var nextitemkey
        if (this.state.components.length === 0){
            nextitemkey = 0
        } else {
            nextitemkey = Math.max.apply(Math, this.state.components.map(function(o) { return o.key; })) + 1
        }
        let buttonItem = {
            name: 'button',
            text: 'submit',
            fontSize: 14,
            fontColor: '#000000',
            background: '#d3d3d3',
            borderColor: '#000000',
            borderThickness: 1,
            borderRadius: 0,
            height: 40,
            width: 100,
            xposition: 0,
            yposition: 0,
            key: nextitemkey
        }
        this.handleSelectComponent(buttonItem)
        let list = this.state.components
        list.push(buttonItem)
        this.setState({components: list, recentlySaved: false})
    }

    handleAddTextfield = () => {
        var nextitemkey
        if (this.state.components.length === 0){
            nextitemkey = 0
        } else {
            nextitemkey = Math.max.apply(Math, this.state.components.map(function(o) { return o.key; })) + 1
        }
        let buttonItem = {
            name: 'textfield',
            text: 'input',
            fontSize: 14,
            fontColor: '#d3d3d3',
            background: '#ffffff',
            borderColor: '#d3d3d3',
            borderThickness: 1,
            borderRadius: 1,
            height: 40,
            width: 200,
            xposition: 0,
            yposition: 0,
            key: nextitemkey
        }
        this.handleSelectComponent(buttonItem)
        let list = this.state.components
        list.push(buttonItem)
        this.setState({components: list, recentlySaved: false})
    }

    handleResize = (e, direction, ref, delta, position) => {
        this.setState({
            selectedComponent: {
            ...this.state.selectedComponent,
            xposition: position.x,
            yposition: position.y,
            height: ref.style.height,
            width: ref.style.width,
            },
            recentlySaved: false
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
                yposition: y + ui.deltaY,},
                recentlySaved: false
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
                this.setState({components: list, selectedComponent: null, recentlySaved: false})
            }
        }
    }

    duplicateComponent = (e) => {
        if (e.keyCode == 68 && e.ctrlKey){
            if(this.state.selectedComponent){
                e.preventDefault()
                let list = this.state.components
                var nextitemkey = Math.max.apply(Math, this.state.components.map(function(o) { return o.key; })) + 1
                let duplicateComponent = {
                    ...this.state.selectedComponent,
                    key: nextitemkey
                }
                list.push(duplicateComponent)
                this.setState({components: list, selectedComponent: duplicateComponent, recentlySaved: false})
            }
        }
    }

    handleComponentChange = (e) => {
        const { target } = e;
        this.setState({
            selectedComponent: {
                ...this.state.selectedComponent,
                [target.id]: target.value,
            },
            recentlySaved: false
        }, this.handleMoveSelectedToComponents);
    }

    componentDidMount(){
        document.addEventListener('keydown',this.deleteComponent);
        document.addEventListener('keydown',this.duplicateComponent);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.deleteComponent);
        document.removeEventListener('keydown',this.duplicateComponent);
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
        var height = this.state.height
        var width = this.state.width
        return (
                <div className="row" onClick={this.notCurrentlyDragging}>
                    <div className="input-field col s3">
                        <label className="active text_16" htmlFor="name">Wireframe Name</label>
                        <input className="text_20" type="text" name="name" id="name" onChange={this.handleChange} defaultValue={wireframe.name} />
                        <div>Height</div>
                        <input className="text_20" type="number" min="100" name="proposedHeight" id="proposedHeight" onChange={this.handleChange} defaultValue={this.state.proposedHeight} />
                        <div>Width</div>
                        <input className="text_20" type="number" min="100" name="proposedWidth" id="proposedWidth" onChange={this.handleChange} defaultValue={this.state.proposedWidth} />
                        <button onClick={this.handleChangeDiagramDimensions}> Update Diagram </button>
                        <div>
                            <i className="material-icons">zoom_in</i>
                            <i className="material-icons" style = {{marginLeft: '20px'}}>zoom_out</i>
                            <span style = {{marginLeft: '20px', cursor: "pointer"}} onClick={this.handleSave}>Save</span>
                            {
                                this.state.recentlySaved ? <span style = {{marginLeft: '20px', cursor: "pointer"}} onClick={this.handleClose}>Close</span> 
                                : <SaveModal name={this.state.name} components={this.state.components} height={this.state.height} width={this.state.width}
                                    id={this.props.wireframe.id} close={this.handleClose}/>
                            }
                        </div>
                        <div className="grey">
                            <h6 style={{textAlign: "center"}}>Add Controller</h6>
                            <div className="box" style={{height: '75px', marginLeft: '65px',}} onClick={this.handleAddContainer}></div>
                            <p style={{textAlign: "center", fontWeight: "bold"}}>Container</p>
                            <p style={{textAlign: "center", cursor: 'pointer'}} onClick={this.handleAddLabel}>Prompt for input: </p>
                            <p style={{textAlign: "center", fontWeight: "bold"}}>Label</p>
                            <div className="box" onClick={this.handleAddButton}
                            style={{cursor: 'pointer', height: '40px', width: '100px', marginLeft: '100px', background: '#d3d3d3', textAlign: 'center'}}>Submit</div>
                            <p style={{textAlign: "center", fontWeight: "bold"}}>Button</p>
                            <div className="box" onClick={this.handleAddTextfield} 
                            style={{cursor: 'pointer', height: '40px', width: '200px', marginLeft: '50px', color: '#d3d3d3'}}>input</div>
                            <p style={{textAlign: "center", fontWeight: "bold"}}>Textfield</p>
                        </div>
                        {
                            this.state.recentlySaved ? <p style={{textAlign: "center", fontWeight: "bold", color: "#39ff14"}}>Saved!</p> : <p></p>
                        }
                    </div>
                    <div className="box col s6" onClick={this.handleUnselectComponent}
                    style={{height: height, width: width, backgroundColor: "white", position: 'relative', overflow: 'auto', padding: '0'}}>
                            {
                                this.state.components.map(component => {
                                    if(component.name === 'container') {
                                        var background = component.background
                                        var borderColor = component.borderColor
                                        var borderRadius = parseInt(component.borderRadius)
                                        var borderThickness = parseInt(component.borderThickness)
                                        var style
                                        if(this.state.selectedComponent && this.state.selectedComponent.key === component.key){
                                            style = {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                outline: "2px dashed blue",
                                                border: "solid",
                                                borderColor: borderColor,
                                                borderRadius: borderRadius,
                                                borderWidth: borderThickness,
                                                background: background
                                            };
                                        } else {
                                            style = {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "solid",
                                                borderColor: borderColor,
                                                borderRadius: borderRadius,
                                                borderWidth: borderThickness,
                                                background: background
                                            };
                                        }
                                        
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
                                        var style
                                        var fontColor =  component.fontColor
                                        var fontSize = parseInt(component.fontSize)
                                        if(this.state.selectedComponent && this.state.selectedComponent.key === component.key){
                                            style = {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                outline: "2px dashed blue",
                                                color: fontColor,
                                                fontSize: fontSize
                                            };
                                        } else {
                                            style = {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: fontColor,
                                                fontSize: fontSize
                                            };
                                        }
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
                                                    {component.text}
                                            </Rnd>
                                        )
                                    }
                                    else if(component.name === 'button') {
                                        var background = component.background
                                        var borderColor = component.borderColor
                                        var borderRadius = parseInt(component.borderRadius)
                                        var borderThickness = parseInt(component.borderThickness)
                                        var fontColor =  component.fontColor
                                        var fontSize = parseInt(component.fontSize)
                                        var style
                                        if(this.state.selectedComponent && this.state.selectedComponent.key === component.key){
                                            style = {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: fontColor,
                                                fontSize: fontSize,
                                                outline: "2px dashed blue",
                                                border: "solid",
                                                borderColor: borderColor,
                                                borderRadius: borderRadius,
                                                borderWidth: borderThickness,
                                                background: background
                                            };
                                        } else {
                                            style = {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: fontColor,
                                                fontSize: fontSize,
                                                border: "solid",
                                                borderColor: borderColor,
                                                borderRadius: borderRadius,
                                                borderWidth: borderThickness,
                                                background: background
                                            };
                                        }
                                        
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
                                                    {component.text}
                                            </Rnd>
                                        )
                                    } else {
                                        var background = component.background
                                        var borderColor = component.borderColor
                                        var borderRadius = parseInt(component.borderRadius)
                                        var borderThickness = parseInt(component.borderThickness)
                                        var fontColor =  component.fontColor
                                        var fontSize = parseInt(component.fontSize)
                                        var style
                                        if(this.state.selectedComponent && this.state.selectedComponent.key === component.key){
                                            style = {
                                                display: "flex",
                                                alignItems: "center",
                                                color: fontColor,
                                                fontSize: fontSize,
                                                outline: "2px dashed blue",
                                                border: "solid",
                                                borderColor: borderColor,
                                                borderRadius: borderRadius,
                                                borderWidth: borderThickness,
                                                background: background
                                            };
                                        } else {
                                            style = {
                                                display: "flex",
                                                alignItems: "center",
                                                color: fontColor,
                                                fontSize: fontSize,
                                                border: "solid",
                                                borderColor: borderColor,
                                                borderRadius: borderRadius,
                                                borderWidth: borderThickness,
                                                background: background
                                            };
                                        }
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
                                                    {component.text}
                                            </Rnd>
                                        )
                                    }
                                })
                            }
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
                        : this.state.selectedComponent.name == 'label' ? (
                            <div>
                                <label className="active text_16" htmlFor="name">Text: </label>
                                <input className="text_20" type="text" name="text" id="text" onChange={this.handleComponentChange} value={this.state.selectedComponent.text} />
                                <div></div>
                                <label className="active text_16" htmlFor="name">Font Size: </label>
                                <input className="text_20" type="number" min='1' name="fontSize" id="fontSize" onChange={this.handleComponentChange} value={this.state.selectedComponent.fontSize} />
                                <div></div>
                                <label className="active text_16" htmlFor="name">Font Color: </label>
                                <input className="text_20" type="color" name="fontColor" id="fontColor" onChange={this.handleComponentChange} value={this.state.selectedComponent.fontColor} />
                            </div>
                        )
                        : this.state.selectedComponent.name == 'button' || this.state.selectedComponent.name == 'textfield' ? (
                            <div>
                                <label className="active text_16" htmlFor="name">Text: </label>
                                <input className="text_20" type="text" name="text" id="text" onChange={this.handleComponentChange} value={this.state.selectedComponent.text} />
                                <div></div>
                                <label className="active text_16" htmlFor="name">Font Size: </label>
                                <input className="text_20" type="number" min='1' name="fontSize" id="fontSize" onChange={this.handleComponentChange} value={this.state.selectedComponent.fontSize} />
                                <div></div>
                                <label className="active text_16" htmlFor="name">Font Color: </label>
                                <input className="text_20" type="color" name="fontColor" id="fontColor" onChange={this.handleComponentChange} value={this.state.selectedComponent.fontColor} />
                                <div></div>
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