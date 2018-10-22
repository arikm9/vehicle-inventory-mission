import React from 'react';
import './App.css';
import AddModal from './addModal'
import Vehicles from './Vehicles'
import { Header, Container, Button, Icon } from 'semantic-ui-react'

// This is the main application component which manages the UI and stores the results of api requests.
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // array contains the updated vehicles fetched from the API
      vehicles: [],
      // should the "Add New Vehicle" Modal be open
      addVehicleModalOpen: false,
      // is it the first load
      firstLoad: true
    }
    this.addNewVehicle = this.addNewVehicle.bind(this);
    this.deleteVehicle = this.deleteVehicle.bind(this);
    this.getUpdatedVehicles = this.getUpdatedVehicles.bind(this);
    this.editVehicle = this.editVehicle.bind(this);
    this.openAddVehicleModalHandler = this.openAddVehicleModalHandler.bind(this);
    this.closeAddVehicleModal = this.closeAddVehicleModal.bind(this);
  }

  openAddVehicleModalHandler(e) {
    this.setState({addVehicleModalOpen: true});
  }

  closeAddVehicleModal() {
    this.setState({addVehicleModalOpen: false});
  }

  getUpdatedVehicles() {
    // Fetch a GET request to the vehicles API - expect to get all the vehicles objects.
    fetch('api/')
    .then(res => {
      if(res.ok) { // check for a valid 200 ok status
        return res.json() 
      }
      else {
        return false
      }
    })
    .then(vehiclesJson => {
      if(vehiclesJson) { // check if got a JSON object as expected
        this.setState({vehicles: vehiclesJson, firstLoad: false})
      }});
  }

  addNewVehicle(vehicle) {
    // Fetch a POST request with a vehicle object in the body.
    fetch('api/', {method: "post", headers: {"content-type": "application/json"}, body: JSON.stringify(vehicle)})
    .then(this.getUpdatedVehicles());
  }

  editVehicle(vehicle, id) {
    // Fetch a PUT request with an edited vehicle object in the body.
    fetch(`/api/${id}`, {method: "put", headers: {"content-type": "application/json"}, body: JSON.stringify(vehicle)})
    .then(this.getUpdatedVehicles());
  }

  deleteVehicle(id) {
    // Fetch a DELETE request with a vehicle id as a url parameter.
    fetch(`api/${id}`, {method: "delete"})
    .then(this.getUpdatedVehicles());
  }

  componentDidMount() {
    // Set an interval to fetch a request and updating the vehicles state object. Every 3 seconds.
    this.getUpdatedVehicles();
    this.fetchVehicleInterval = setInterval(this.getUpdatedVehicles, 3000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.loadingData !== this.state.loadingData && nextState.vehicles === this.state.vehicles && nextState.addVehicleModalOpen === this.state.addVehicleModalOpen)
      return false
    else 
      return true
  }

  componentWillUnmount() {
    clearInterval(this.fetchVehicleInterval);
  }

  render() {
    // renders the - header, add new vehicle button, add new vehicle modal and the vehicles accordion.
    return (
      <div>
        <Container>
          <Header icon textAlign='center' as='h1'>
          <Icon name="react"/>
            <Header.Content>
              Vehicle Inventory
            </Header.Content>
          </Header>
          <br />
          <Button onClick={this.openAddVehicleModalHandler} color="green"><Icon name='plus' /> Add New Vehicle!</Button>
          {this.state.addVehicleModalOpen ? <AddModal open={this.state.addVehicleModalOpen} closeModal={this.closeAddVehicleModal} addVehicle={this.addNewVehicle} /> : null }
        </Container>
        <br />
        <Vehicles firstLoad={this.state.firstLoad} editVehicle={this.editVehicle} deleteVehicle={this.deleteVehicle} data={this.state.vehicles} />
      </div>
    )
  }
}

export default App;
