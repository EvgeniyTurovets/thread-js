import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon, Image, Modal } from 'semantic-ui-react';
import Spinner from 'src/components/Spinner';

import styles from './styles.module.scss';

const UpdatedPost = ({
  updatedPost: post,
  updatePost: update,
  uploadImage,
  toggleUpdatedPost: toggle
}) => {
  const { id: currentId, body: currentBody, image: currentImage } = post;
  const [body, setBody] = useState(currentBody || '');
  const [readerImage, setReaderImage] = useState(currentImage?.link || undefined);
  const [image, setImage] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdatePost = async () => {
    if (!body) {
      return;
    }
    setIsUploading(true);
    try {
      let data = { body, postId: currentId };
      if (image) {
        const { id: imageId } = await uploadImage(image);
        data = { ...data, imageId };
      }
      await update(data);
    } finally {
      // TODO: show error
      setBody('');
      setImage(undefined);
      setReaderImage(undefined);
      setIsUploading(false);
      toggle();
    }
  };

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setReaderImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setImage(e.target.files[0]);
      e.target.value = null;
    }
  };

  return (
    <Modal centered={false} open onClose={() => toggle()}>
      {post
        ? (
          <Modal.Content>
            <Form onSubmit={handleUpdatePost} loading={isUploading}>
              <Form.TextArea
                name="body"
                value={body}
                placeholder="What is the news?"
                onChange={ev => setBody(ev.target.value)}
              />
              {readerImage && (
                <div className={styles.imageWrapper}>
                  <Image className={styles.image} src={readerImage} alt="post" />
                </div>
              )}
              <Button color="teal" icon labelPosition="left" as="label">
                <Icon name="image" />
                New image
                <input
                  name="image"
                  type="file"
                  onChange={onSelectFile}
                  hidden
                />
              </Button>
              <Button floated="right" color="blue" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Content>
        )
        : <Spinner />}
    </Modal>
  );
};

UpdatedPost.propTypes = {
  updatedPost: PropTypes.objectOf(PropTypes.any).isRequired,
  updatePost: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  toggleUpdatedPost: PropTypes.func.isRequired
};

export default UpdatedPost;
