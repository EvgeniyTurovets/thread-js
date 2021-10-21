import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';

const ConfirmAction = ({
  toggle,
  confirm,
  data
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    setIsLoading(true);
    try {
      confirm(data);
    } finally {
      setIsLoading(false);
      toggle();
    }
  };

  return (
    <Modal size="mini" open onClose={() => toggle()}>
      <Modal.Header>Are you sure?</Modal.Header>
      <Modal.Actions>
        <Button
          disabled={isLoading}
          onClick={() => toggle()}
        >
          Disagree
        </Button>
        <Button
          loading={isLoading}
          disabled={isLoading}
          color="blue"
          onClick={handleConfirm}
        >
          Agree
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

ConfirmAction.propTypes = {
  toggle: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(PropTypes.any)
  ]).isRequired
};

export default ConfirmAction;
