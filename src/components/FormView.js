import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class app extends Component {


    render() {
        var self = this.props.data;

        var inputForm;
        var table;
        var rows;
        var output;

        //Assign a default value
        var output = (<div></div>);
        console.log(self.state.edit);
        if (self.state.edit) {
            output = (
                <div className="App-edit">
                    <div className="App-edit-title">
                        <h2>Please enter inventory edit below:</h2>
                    </div>
                    <form onSubmit={self._editFirebaseData.bind(self)}>
                        <input type="text" value={self.state.editFields.name} placeholder="Enter Name Edit..." onChange={self.handleChange} name="name" />
                        <input type="text" value={self.state.editFields.description} placeholder="Enter Description Edit..." onChange={self.handleChange} name="description" />
                        <input type="text" value={self.state.editFields.quantity} placeholder="Enter Quantity Edit..." onChange={self.handleChange} name="quantity" />
                        <input type="text" className="hideinput" value={self.state.editFields.uuid} name="uuid" />
                        <button type="submit" className="submit-button-edit">Submit</button>
                        <button type="button" className="cancel-button" onClick={self._cancelEdit}>Cancel</button>
                    </form>
                </div>
            );

        } else {


            inputForm = <span>
                <h2>Please enter your out-of-this-world inventory item</h2>
                <form onSubmit={self.onSubmit.bind(self)} id="inventForm">
                    <input type="text" placeholder="Enter name..." name="name" />
                    <input type="text" placeholder="Enter description..." name="description" />
                    <input type="text" placeholder="Enter quantity..." name="quantity" />
                    <button type="submit">Submit</button>
                </form>
            </span>

            rows = self.state.inventory.map(function (item, index) {
                return Object.keys(item).map(function (s) {

                    return (
                        <tr key={s}>
                            <th> {item[s].inventory.name} </th>
                            <th> {item[s].inventory.description} </th>
                            <th> {item[s].inventory.quantity} </th>
                            <th>
                                <button value={item[s].inventory.uuid} onClick={self._handleClick.bind(self)}>Delete</button>
                                <button value={item[s].inventory.uuid} onClick={self._setFirebaseDataEditTable.bind(self)}>Edit</button>
                            </th>
                        </tr>
                    )
                });
            });

            table = (
                <span className="inventTable">
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
                        <h2 className="header-title">Inventory Galaxy App</h2>
                    </div>
                    <div className="text-center">
                        {inputForm}
                        <br />
                        {table}
                    </div>
                    <footer>
                        <div className="copyright">Copyright &#169; ELK WebDesigns</div>
                    </footer>
                </div>
            );

        }


        return output;
    }

}

export default app;