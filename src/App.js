import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Table } from 'react-bootstrap';

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
      edit: false
    }
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

  _editFirebaseData(event) {
    event.preventDefault();
    this.setState({ edit: true });
    var uuid = event.target.value;
    const newDetails = {};
  

    event.target.childNodes.forEach(function (e) {
      if(e.tagName === 'INPUT') {
        newDetails[e.name] = e.value
      } else {
        e.value = null
      }
    })

    firebase.database().ref().child('inventoryApp/' + uuid).update({ inventory: newDetails });

    this._loadFirebaseData();
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
    var inputForm;
    var table;
    var rows;
    
    //Assign a default value
    var output = (<div></div>);
    console.log(this.state.edit);
    if (this.state.edit) {
        output = (
          <div className="App-edit">
            <div className="App-edit-title">
              <h2>Please enter inventory edit below:</h2>
            </div>
            <form onSubmit={this.onSubmit.bind(this)}>
              <input type="text" placeholder="Enter Name Edit..." name="name" />
              <input type="text" placeholder="Enter Description Edit..." name="description"/>
              <input type="text" placeholder="Enter Quantity Edit..." name="quantity"/>  
              <button type="submit" className="submit-button-edit">Submit</button>      
            </form>
          </div>
        );

    } else {


      inputForm = <span>
        <h2>Please enter your inventory Item</h2>
        <form onSubmit={this.onSubmit.bind(this)} id="inventForm">
          <input type="text" placeholder="Enter name..." name="name" />
          <input type="text" placeholder="Enter description..." name="description" />
          <input type="text" placeholder="Enter quantity..." name="quantity" />
          <button type="submit">Submit</button>
        </form>
      </span>

      // if (this.state.submitted && this.state.inventory.length) {
      var self = this;
      rows = this.state.inventory.map(function (item, index) {
        return Object.keys(item).map(function (s) {

          return (
            <tr key={s}>
              <th> {item[s].inventory.name} </th>
              <th> {item[s].inventory.description} </th>
              <th> {item[s].inventory.quantity} </th>
              <th><button value={item[s].inventory.uuid} onClick={self._handleClick.bind(self)}>Delete</button> <button value={item[s].inventory.uuid} onClick={self._editFirebaseData.bind(self)}>Edit</button> </th>
            </tr>
          )
        });
      });



      table = (
        <span>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th> Name </th>
                <th> Description </th>
                <th> Quantity </th>
                <th> Actions </th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </span>
      )


      output = (
        <div className="App">
          <div className="App-header">
            <h2>Inventory App</h2>
          </div>
          <div className="text-center">
            {inputForm}
            <br />
            {table}
          </div>
        </div>
      );
      
    }

    
    return output;
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
