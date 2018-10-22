import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

// DeleteModal is the component in charge of poping a window with a delete button to delete a vehicle with the id it gets from props
export default class DeleteModal extends React.Component {
    render() {
        return (
        <Modal open={this.props.open} onClose={this.props.closeDeleteModal}>
          <Modal.Header>Delete Vehicle</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to delete this vehicle?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.props.closeDeleteModal} negative>
              No
            </Button>
            <Button onClick={(e) => this.props.handleDeleteClick(e, this.props.vehicleId)} positive labelPosition='right' icon='trash' content='Yes'/>
          </Modal.Actions>
        </Modal>
        )
    }
}

DeleteModal.propTypes = {
    vehicleId: PropTypes.string,
    open: PropTypes.bool,
    closeDeleteModal: PropTypes.func,
    handleDeleteClick: PropTypes.func
}