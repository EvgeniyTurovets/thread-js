import { Router } from 'express';
import * as postService from '../services/postService';

const router = Router();

router
  .get('/', (req, res, next) => postService.getPosts(req.query)
    .then(posts => res.send(posts))
    .catch(next))
  .get('/:id', (req, res, next) => postService.getPostById(req.params.id)
    .then(post => res.send(post))
    .catch(next))
  .post('/', (req, res, next) => postService.create(req.user.id, req.body)
    .then(post => {
      req.io.emit('new_post', post); // notify all users that a new post was created
      return res.send(post);
    })
    .catch(next))
  .put('/update', (req, res, next) => postService.updatePost(req.body)
    .then(post => res.send(post))
    .catch(next))
  .post('/delete/:id', (req, res, next) => postService.deletePost(req.params.id)
    .then(() => res.send({ id: req.params.id }))
    .catch(next))
  .get('/react/all', (req, res, next) => postService.getAllReactions(req.query)
    .then(reactions => res.send(reactions))
    .catch(next))
  .get('/react/:id', (req, res, next) => postService.getPostReaction(req.user.id, req.params.id)
    .then(reaction => res.send(reaction))
    .catch(next))
  .put('/react', (req, res, next) => postService.setReaction(req.user.id, req.body)
    .then(reaction => {
      if (req.body.post && reaction.isLike && (req.body.post.userId !== req.user.id)) {
        req.io.to(req.body.post.userId).emit('like', 'Your post was liked!');
      }
      return res.send(reaction);
    })
    .catch(next));

export default router;
