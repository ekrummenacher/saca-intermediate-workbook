import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Table } from 'react-bootstrap';
import FormView from './components/FormView.js';

var uuid = require('uuid');
var firebase = require('firebase');

var config = {
  apiKey: "AIzaSyDuJrW40GyMVJL7Ue3-gIuzY-hvJElFhAk",
  authDomain: "inventoryapp-f58eb.firebaseapp.com",
  databaseURL: "https://inventoryapp-f58eb.firebaseio.com",
  storageBucket: "inventoryapp-f58eb.appspot.com",
  messagingSenderId: "486087380160"
};
firebase.initializeApp(config);


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inventory: [],
      submitted: false,
      edit: false,
      editFields: [],
      typed: '',
      change: []
    }

    this._editFirebaseData = this._editFirebaseData.bind(this);
    this._setFirebaseDataEditTable = this._setFirebaseDataEditTable.bind(this);
    this._onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this._cancelEdit = this._cancelEdit.bind(this);
  }

  componentDidMount() {
    this._loadFirebaseData();
  }

  //loading the data from firebase
  _loadFirebaseData() {
    var self = this;

    this.setState({ inventory: [] });
    //getting data from firebase
    firebase.database().ref().once('value').then((snapshot) => {
      snapshot.forEach(function (data) {
        self.setState({
          inventory: self.state.inventory.concat(data.val())
        });
      });
    });
  }

//event = <input type="text" value={this.state.editFields.name} placeholder="Enter Name Edit..." onChange={this.handleChange} name="name" />
  handleChange(event) {
    var change = {};
    change[event.target.name] = event.target.value;
    this.setState({ editFields: change });
  }

  _cancelEdit(event) {
    this.setState({ edit: false });
  }

  _setFirebaseDataEditTable(event) {
    event.preventDefault();

    const entryId = event.target.value;

    this.setState({
      edit: true,
      editUUID: entryId,
      editFields: []
    });

    //We use this when we go into the firebase database since we loose 'this'
    var self = this;

    firebase.database().ref().child('inventoryApp').orderByChild('uuid').on('value', (snapshot) => {
      snapshot.forEach(function (child) {
        var value = child.val();
        var name = value.inventory.name;
        var quantity = value.inventory.quantity;
        var description = value.inventory.description;
        var uuid = value.inventory.uuid;

        var editFields = {};

        if (uuid === entryId) {
          editFields['name'] = name;
          editFields['quantity'] = quantity;
          editFields['description'] = description;
          editFields['uuid'] = uuid;

          self.setState({ editFields : editFields });
        }
      });
    })
  }

  _editFirebaseData(event) {
    event.preventDefault();

    // var uuid = event.target.value;

    const newDetails = {};
    event.target.childNodes.forEach(function (e) {
      if (e.tagName === 'INPUT') {
        newDetails[e.name] = e.value
      }
    });

    var uuid = newDetails['uuid'];
    var self = this;

    firebase.database().ref().child('/inventoryApp/' + uuid).update({ inventory: newDetails });

    this._loadFirebaseData();

    this.setState({
      edit: false
    });
  }

  _handleClick(event) {
    event.preventDefault();
    console.log(event.target.value);
    //remove one element
    var uuid = event.target.value;
    firebase.database().ref().child('inventoryApp/' + uuid).remove();

    this._loadFirebaseData();
  }


  render() {

    return (
      <div>
        <FormView data={this}/>
      </div>
    )
  }

  //adding our function that will handle our form submit
  onSubmit(event) {

    event.preventDefault();

    //creating our initial variables (const = var)
    const details = {}
    const id = uuid.v1(); //generating our unique key

    //go through each element in the form making sure it's an input element
    event.target.childNodes.forEach(function (el) {
      if (el.tagName === 'INPUT') {
        details[el.name] = el.value
      } else {
        el.value = null
      }
      //adding one more element uuid
      details['uuid'] = id;
    })

    //saving to Firebase
    firebase.database().ref('inventoryApp/' + id).set({
      inventory: details
    });

    this.setState({
      submitted: true
    })

    this.setState({
      edit: false
    })

    // document.getElementById("inventForm").reset();
    this._loadFirebaseData();
  }

}



export default App;