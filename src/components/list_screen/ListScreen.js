import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { Modal, Button } from 'react-materialize';

class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
    }

    sortCriteria = 'none';
    changedTime = false;

    updateTime = () => {
        console.log("updating time")
        let fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({ time: Date.now() })
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        const fireStore = getFirestore();
        let dbitem = fireStore.collection('todoLists').doc(this.props.todoList.id);
        dbitem.update({ [target.id]: target.value });
    }

    addItem = () => {
        console.log("Adding a new item");
        this.props.history.push({
            pathname: this.props.todoList.id + "/item/" + this.props.todoList.items.length,
        });
    }

    deleteList = () => {
        let fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });

        this.props.history.goBack();
    }

    sortByDescription = () => {
        if (this.sortCriteria !== SORT_BY_TASK_INCREASING)
            this.sortCriteria = SORT_BY_TASK_INCREASING
        else
            this.sortCriteria = SORT_BY_TASK_DECREASING;
        this.sortList(this.sortCriteria);
    }

    sortByDueDate = () => {
        if (this.sortCriteria !== SORT_BY_DUE_DATE_INCREASING)
            this.sortCriteria = SORT_BY_DUE_DATE_INCREASING;
        else
            this.sortCriteria = SORT_BY_DUE_DATE_DECREASING;
        this.sortList(this.sortCriteria);
    }

    sortByCompleted = () => {
        if (this.sortCriteria !== SORT_BY_STATUS_INCREASING)
            this.sortCriteria = SORT_BY_STATUS_INCREASING;
        else
            this.sortCriteria = SORT_BY_STATUS_DECREASING;
        this.sortList(this.sortCriteria);
    }

    sortList = (criteria) => {
        console.log("Sorting by: ", this.sortCriteria);
        let newItems = this.generateItemsInSortedOrder(criteria);
        for (let i = 0; i < newItems.length; i++) {
            newItems[i].key = i;
            newItems[i].id = i;
        }

        let firestore = getFirestore();
        firestore.collection("todoLists").doc(this.props.todoList.id).update({ items: newItems });
    }

    generateItemsInSortedOrder = (criteria) => {
        let newItems = Object.assign([], this.props.todoList.items);
        newItems.sort(function (a, b) {
            if (criteria === SORT_BY_TASK_INCREASING)
                return a.description.localeCompare(b.description);
            else if (criteria === SORT_BY_TASK_DECREASING)
                return b.description.localeCompare(a.description);
            else if (criteria === SORT_BY_DUE_DATE_INCREASING)
                return a.due_date.localeCompare(b.due_date);
            else if (criteria === SORT_BY_DUE_DATE_DECREASING)
                return b.due_date.localeCompare(a.due_date);
            else if (criteria === SORT_BY_STATUS_INCREASING)
                return ("" + a.completed).localeCompare("" + b.completed);
            else
                return ("" + b.completed).localeCompare("" + a.completed);
        });
        return newItems;
    }

    render() {
        const auth = this.props.auth;
        let todoList = this.props.todoList;

        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        if (!todoList)
            return <React.Fragment />

        if (!this.changedTime) {
            this.changedTime = true;
            this.updateTime();
        }

        return (
            <div className="grey lighten-2">
                <div className="row margin_bottom_-10">
                    <h4 className="grey-text text-darken-3 col s10">Todo List</h4>
                    <div className="col s1 center-align">
                        <h4 className="btn-floating btn-large waves-effect waves-light purple lighten-2 hoverable"
                            onClick={this.addItem}><i className="material-icons">add</i></h4>
                    </div>
                    <div className="col s1 center-align">
                        <h4 className="btn-floating btn-large waves-effect waves-light red accent-2 hoverable modal-trigger"
                            href="#modal1"><i className="material-icons">delete</i></h4>
                    </div>
                </div>
                <div className="padding_20 row">
                    <div className="input-field col s6">
                        <label className="active text_16" htmlFor="name">List Name</label>
                        <input className="text_20" type="text" name="name" id="name" onChange={this.handleChange} defaultValue={todoList.name} />
                    </div>
                    <div className="input-field col s6">
                        <label className="active text_16" htmlFor="owner">List Owner</label>
                        <input className="text_20" type="text" name="owner" id="owner" onChange={this.handleChange} defaultValue={todoList.owner} />
                    </div>
                </div>
                <div className="row red accent-2 rounded list_section_header ">
                    <div className="col s3 left-align">
                        <h5 className="list_sort_header padding_12" onClick={this.sortByDescription}><b>Description</b></h5>
                    </div>
                    <div className="col s3 center-align">
                        <h5 className="list_sort_header" onClick={this.sortByDueDate}><b>Due Date</b></h5>
                    </div>
                    <div className="col s3 right-align">
                        <h5 className="list_sort_header padding_12" onClick={this.sortByCompleted}><b>Completed</b></h5>
                    </div>
                </div>
                <ItemsList addItem={this.addItem} todoList={todoList} />
                <div className="">
                    <Modal id="modal1" header="Delete List?" actions={
                        <div className="grey lighten-2">
                            <Button className="red accent-2" tooltip="The list will not be retrievable." tooltipOptions={{ position: 'top' }}
                                onClick={this.deleteList} modal="close">Yes</Button><span>  </span>
                            <Button className="purple lighten-2" modal="close">No</Button>
                        </div>}>
                        <p><b>Are you sure you want to delete this list?</b></p>
                    </Modal>
                </div>
            </div>
        );
    }
}

const SORT_BY_TASK_INCREASING = 'sort_by_task_increasing';
const SORT_BY_TASK_DECREASING = 'sort_by_task_decreasing';
const SORT_BY_DUE_DATE_INCREASING = 'sort_by_due_date_increasing';
const SORT_BY_DUE_DATE_DECREASING = 'sort_by_due_date_decreasing';
const SORT_BY_STATUS_INCREASING = 'sort_by_status_increasing';
const SORT_BY_STATUS_DECREASING = 'sort_by_status_decreasing';

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { todoLists } = state.firestore.data;
    const todoList = todoLists ? todoLists[id] : null;
    if (todoList)
        todoList.id = id;

    return {
        todoList,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'todoLists' },
    ]),
)(ListScreen);