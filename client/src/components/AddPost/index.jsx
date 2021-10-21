import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon, Image, Segment } from 'semantic-ui-react';

import styles from './styles.module.scss';

const AddPost = ({
  addPost,
  uploadImage
}) => {
  const [body, setBody] = useState('');
  const [readerImage, setReaderImage] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddPost = async () => {
    if (!body) {
      return;
    }
    setIsUploading(true);
    try {
      let data = { body };
      if (image) {
        const { id: imageId } = await uploadImage(image);
        data = { ...data, imageId };
      }
      await addPost(data);
    } finally {
      // TODO: show error
      setBody('');
      setImage(undefined);
      setReaderImage(undefined);
      setIsUploading(false);
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
    <Segment>
      <Form onSubmit={handleAddPost} loading={isUploading}>
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
          Attach image
          <input
            name="image"
            type="file"
            onChange={onSelectFile}
            hidden
          />
        </Button>
        <Button floated="right" color="blue" type="submit">Post</Button>
      </Form>
    </Segment>
  );
};

AddPost.propTypes = {
  addPost: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};

export default AddPost;
