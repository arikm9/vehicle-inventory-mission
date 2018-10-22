import React from 'react'
import { Container, Button, Icon, Accordion } from 'semantic-ui-react'
import DeleteModal from './deleteModal'
import EditModal from './editModal'
import moment from 'moment'
import PropTypes from 'prop-types';

// object conatins type's enum as key. the 2 values in the array represent the name and the icon name (from semantic ui icons library)
const types = {
    1: ["SUV", "SUV"],
    2: ["Truck", "truck"],
    3: ["Hybrid", "car"]
}

// the date format displayed in the UI
const dateDisplayFormat = "DD/MM/YYYY, HH:mm"

// Vehicle component is the component that renders the list of the vehicles and handles the edit and delete events
export default class Vehicles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // should the Delete Modal be open
            openDeleteModal: false, 
            // should the Edit Modal be open
            openEditModal: false, 
            // the current index of vehicle object opened
            activeAccordionIndex: -1
        };
        this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this);
        this.handleEditModalOpen = this.handleEditModalOpen.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAccordionClick = this.handleAccordionClick.bind(this);
    }

    handleDeleteModalOpen(e, id) {
        this.setState({openDeleteModal: id});
    }

    handleEditModalOpen(e, id) {
        this.setState({openEditModal: id});
    }

    closeDeleteModal() {
        this.setState({openDeleteModal: false});
    }

    closeEditModal() {
        this.setState({openEditModal: false});
    }

    handleDeleteClick(e, id) {
        // calls a prop funcion deleteVehicle with id. this funtion passed to Delete Modal and called when user clicks the final delete button.
        this.props.deleteVehicle(id);
        this.closeDeleteModal();
    }

    handleSubmit(vehicle, id) {
        // calls a prop funcion editVehicle with id. this funtion passed to Edit Modal and called when user clicks the final edit button.
        this.props.editVehicle(vehicle, id);
        this.closeEditModal();
    }

    convertTimeStampToDate(timestamp) {
        // returns a formatted date string.
        let date = new Date(timestamp);
        return moment(date).format(dateDisplayFormat);
    }

    handleAccordionClick(e, titleProps) {
        // gets the index of the pressed accordion item and assigns it to the state.
        const { index } = titleProps
        if (this.state.activeAccordionIndex === index) {
            this.setState({activeAccordionIndex: -1});
        }
        else {
            this.setState({activeAccordionIndex: index});
        }
    }

    render() {
        // rendering an Accordion component (semantic ui) with vehicle data and the delete and edit modals.
        const activeAccordionIndex = this.state.activeAccordionIndex;

        var mappedVehicles = this.props.data.map((vehicle, key) =>
            <div id={key}>
                <DeleteModal vehicleId={vehicle._id} open={this.state.openDeleteModal===key} closeDeleteModal={this.closeDeleteModal} handleDeleteClick={this.handleDeleteClick} />
                {this.state.openEditModal !== false ? <EditModal vehicle={vehicle} open={this.state.openEditModal===key} handleSubmit={this.handleSubmit} closeEditModal={this.closeEditModal} /> : null }
                <Accordion.Title active={activeAccordionIndex === key} index={key} onClick={this.handleAccordionClick}>
                    <Icon name='dropdown' />
                        {vehicle.name}
                </Accordion.Title>
                <Accordion.Content active={activeAccordionIndex === key}>
                    <p>
                      <Icon name={types[vehicle.type][1]} />{types[vehicle.type][0]}
                      <br/>
                      <br />
                      Created at: {this.convertTimeStampToDate(vehicle.creationDate)}
                      <br />
                      <br />
                      Last connection: {this.convertTimeStampToDate(vehicle.lastConnetionDate)}
                      <br />
                      <br />
                      ID: {vehicle._id}
                    </p>
                    <Button value={key} onClick={(e) => this.handleDeleteModalOpen(e, key)} color="red">
                        <Icon name='trash' /> Delete
                    </Button>
                    <Button onClick={(e) => this.handleEditModalOpen(e, key)} color="orange">
                        <Icon name='edit' /> Edit
                    </Button>
            </Accordion.Content>
            </div>
        );
        if (mappedVehicles.length === 0 && this.props.firstLoad === false) 
            return <Container>No vehicles here - you can add one by pressing the "Add New Vehicle" button!</Container>
        else if (mappedVehicles.length === 0 && this.props.firstLoad === true)
            return <Container><Icon loading name='spinner' /> Checking for new vehicles...</Container>

        return (
            <Container>Vehicles <Accordion fluid styled>{mappedVehicles}</Accordion></Container>
            
            
        );
    }
}

Vehicles.propTypes = {
    // a function passed from App to fetch a put request with an edited vehicle object.
    editVehicle: PropTypes.func,
    // a function passed from App to fetch a delete request with a vehicle id as url param.
    deleteVehicle: PropTypes.func,
    // an array containing vehicle objects to be displayed.
    data: PropTypes.array,
    // a boolean prop indicates if the app is making it's first fetch of vehicles from the DB.
    firstLoad: PropTypes.bool
};