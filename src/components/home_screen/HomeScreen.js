import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeLinks from './WireframeLinks'
import { getFirestore } from 'redux-firestore';
class HomeScreen extends Component {
    handleNewWireframe = () => {
        let newWireframeData = {
            name: 'default name',
            owner: this.props.auth.uid,
            components: [],
            time: Date.now(),
        }
        const fireStore = getFirestore();
        let newWireframe = fireStore.collection("wireframes").doc();
        newWireframe.set(newWireframeData);
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="z-depth-2" style={{
                backgroundColor: "#55435f", paddingBottom: '70px', borderRadius: '0 0 10px 10px',
                backgroundImage: 'linear-gradient(to bottom, #7F5A95, #473850)'
            }}>
                <div className="dashboard container">
                    <div className="row">
                        <div className="col s12 m4">
                            <WireframeLinks />
                        </div>

                        <div className="col s8">
                            <div className="banner">
                            Wireframer<br />
                            </div>

                            <div style={{ paddingTop: '15px' }} className="home_new_list_container center-align">
                                <a onClick={this.handleNewWireframe} className="waves-effect waves-light btn-large red accent-2 hoverable rounded">
                                    <i className="material-icons right">library_add</i>Create a New Wireframe
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes', orderBy: ["time", "desc"] },
    ]),
)(HomeScreen);