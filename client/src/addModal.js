import React from 'react'
import { Modal, Form, Dropdown, Button } from 'semantic-ui-react'

// option array to be used by the dropdown
const dropdownOptions = [
    {key: 1, text: "SUV", value: 1},
    {key: 2, text: "Truck", value: 2},
    {key: 3, text: "Hybrid", value: 3}
]

// array used in the render method to convert key to actual value
const options_translator = {1: "SUV", 2: "Truck", 3: "Hybrid"}

// empty initial state
const initialState = {
    vehicle: {"name": "", "type": 0},
    typeFieldError: "",
    nameFieldError: ""
};

// AddVehicleModal is the component in charge of the UI form of adding new vehicles to the DB.
export default class AddVehicleModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
    }

    handleNameChange(e) {
        // assign the current value of the name field and the current date to the state
        let timeStamp = new Date().getTime();
        let newVehicle = this.state.vehicle
        newVehicle.name = e.target.value;
        newVehicle.creationTime = timeStamp;
        this.setState({vehicle: newVehicle});
    }

    handleTypeChange(e, obj) {
        // assign the current value of the type field and the current date to the state
        let timeStamp = new Date().getTime();
        let newVehicle = this.state.vehicle;
        newVehicle.type = obj.value;
        newVehicle.creationTime = timeStamp;
        this.setState({vehicle: newVehicle});
    }

    isFormValid() {
        // Check the current state object vehicle - marks an error if some property empty and returns false.
        let vehicle = this.state.vehicle;
        if(vehicle.name.length === 0 || vehicle.type === 0) {
            if(vehicle.name.length === 0)
                this.setState({nameFieldError: "error"});
            else 
                this.setState({nameFieldError: ""});
            if(vehicle.type === 0)
                this.setState({typeFieldError: "error"});
            else
                this.setState({typeFieldError: ""});
                
            return false;
        }
        else
            return true;
    }

    handleSubmit(e) {
        // checks if the form valid, if yes - set the new vehicle values to the state and closes the modal.
        if(this.isFormValid() === true) {
            let vehicle = this.state.vehicle;
            this.setState(initialState);
            this.props.closeModal();
            this.props.addVehicle(vehicle);
        }
        e.preventDefault();
    }

    render() {
        return (
            <Modal open={this.props.open} onClose={this.props.closeModal}>
                <Modal.Header>Add new vehicle</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>Vehicle name: <Form.Input error={this.state.nameFieldError} onChange={this.handleNameChange} value={this.state.vehicle.name} type="text" /></Form.Field>  
                        <Form.Field>Vehicle type: <Dropdown error={this.state.typeFieldError} onChange={this.handleTypeChange}placeholder={options_translator[this.state.vehicle.type]} options={dropdownOptions} fluid selection /></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button content="Cancel" icon='cancel' labelPosition='right' onClick={this.props.closeModal} negative />
                    <Button onClick={this.handleSubmit} type="submit" positive labelPosition='right' icon='checkmark' content='Done'/>
                </Modal.Actions>
            </Modal>
        )
    }
}