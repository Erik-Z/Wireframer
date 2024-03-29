import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux';
import { getFirestore } from 'redux-firestore';
import wireframeData from './WireframerData.json'
import { Redirect } from 'react-router-dom';

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('wireframes').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        wireframeData.wireframes.forEach(wireframe => {
            fireStore.collection('wireframes').add({
                name: wireframe.name,
                owner: wireframe.owner,
                components: wireframe.components,
                time: Date.now(),
                height: wireframe.height,
                width: wireframe.width
            }).then(() => {
                console.log("DATABASE RESET");
            }).catch((err) => {
                console.log(err);
            });
        })
    }
    render() {
        return(
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
                <button onClick={this.test}>Test</button>
            </div>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);