import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import { Modal, Button } from 'semantic-ui-react';
import { getCroppedImg } from 'src/helpers/imageCropHelper';

import 'react-image-crop/lib/ReactCrop.scss';

const AvatarChange = ({ imageLink, uploadImage, toggle, updateAvatar }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 30,
    aspect: 1 / 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef(null);

  const handleUpdateAvatar = async () => {
    setIsUploading(true);
    const croppedImg = await getCroppedImg(imgRef.current, completedCrop);
    try {
      let data = {};
      if (croppedImg) {
        const { id: imageId } = await uploadImage(croppedImg);
        data = { ...data, imageId };
      }
      await updateAvatar(data);
    } finally {
      // TODO: show error
      setIsUploading(false);
      toggle();
    }
  };

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  return (
    <Modal open dimmer="blurring" size="tiny" onClose={() => toggle()}>
      <Modal.Header>Crop your new profile picture</Modal.Header>
      <Modal.Content>
        <ReactCrop
          src={imageLink}
          crop={crop}
          onImageLoaded={onLoad}
          circularCrop
          onChange={newCrop => setCrop(newCrop)}
          onComplete={newCrop => setCompletedCrop(newCrop)}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => toggle()} loading={isUploading} disabled={isUploading}>
          Close
        </Button>
        <Button
          color="blue"
          onClick={handleUpdateAvatar}
          loading={isUploading}
          disabled={isUploading || !completedCrop?.height || !completedCrop?.width}
        >
          Update
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

AvatarChange.propTypes = {
  imageLink: PropTypes.string.isRequired,
  uploadImage: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  updateAvatar: PropTypes.func.isRequired
};

export default AvatarChange;
