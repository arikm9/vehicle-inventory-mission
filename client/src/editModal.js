import React from 'react'
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import PropTypes from 'prop-types';

// options are displayed in the dropdown
const options = [
    {key: 1, text: "SUV", value: 1},
    {key: 2, text: "Truck", value: 2},
    {key: 3, text: "Hybrid", value: 3}
]

// empty initial state
const initialState = {
    vehicle: {"name": "", "type": 0},
    typeFieldError: "",
    nameFieldError: ""
};

// array used in the render method to convert key to actual value
const options_translator = {1: "SUV", 2: "Truck", 3: "Hybrid"}

// this component renders a Model (semantic ui component) with a form to edit a specific vehicle
export default class EditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
    }
    
    handleNameChange(e) {
        // reads the name field value and assigns it to state
        let newVehicle = this.state.vehicle;
        newVehicle.name = e.target.value;
        this.setState({vehicle: newVehicle})
    }

    handleTypeChange(e, obj) {
        // reads the type field value and assigns it to state
        let newVehicle = this.state.vehicle;
        newVehicle.type = obj.value;
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

    handleEditSubmit(e) {
        // checks if the form valid, if yes - calling the prop function handleSubmit with the new vehicle values and closes the modal.
        if(this.isFormValid()) {
            this.props.handleSubmit(this.state.vehicle, this.props.vehicle._id);
            this.props.closeEditModal();
            this.setState(initialState);
        }
        e.preventDefault();
    }

    componentDidMount() {
        let vehicle = {}
        vehicle.name = this.props.vehicle.name;
        vehicle.type = this.props.vehicle.type;
        this.setState({vehicle: vehicle});
    }

    render() {
        // rendering a Modal (semantic-ui) with a form contains vehicle data to edit
        if(this.props.vehicle) {
        return (
            <Modal open={this.props.open} onClose={this.props.closeEditModal}>
          <Modal.Header>Edit Vehicle</Modal.Header>
          <Modal.Content>
            <Form>
                <Form.Field>New name: <Form.Input error={this.state.nameFieldError} onChange={this.handleNameChange} value={this.state.vehicle.name} placeholder={this.props.vehicle.name} type="text" /></Form.Field>  
                <Form.Field>New type: <Dropdown error={this.state.typeFieldError} onChange={this.handleTypeChange} placeholder={options_translator[this.props.vehicle.type]} options={options} fluid selection /></Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.props.closeEditModal} negative>
              No
            </Button>
            <Button onClick={ this.handleEditSubmit } type="submit" positive labelPosition='right' icon='checkmark' content='Done'/>
          </Modal.Actions>
        </Modal>
        )
    }
    }
}

EditModal.propTypes = {
    // object with a specific vehicle data to edit
    vehicle: PropTypes.object,
    // boolean var indicates of this modal should by open or closed
    open: PropTypes.bool,
    // a function to handle submition of the form and updating the data to the DB
    handleSubmit: PropTypes.func,
    // a function used to close the modal
    closeEditModal: PropTypes.func
};