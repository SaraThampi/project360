import express from 'express';
import * as controllers from "../controllers/email-controllers.js";
import * as userControllers from "../controllers/user-controllers.js"
import * as galleryControllers from "../controllers/gallery-controllers.js"

const emailRouter = express.Router();
const userRouter = express.Router();
const galleryRouter = express.Router();

emailRouter.post('/', controllers.addEmailController); // the route where a new email is added to the list of emails
emailRouter.get('/', controllers.getAllEmails)

userRouter.post('/', userControllers.addUserController); // the route where a new user is added to the list of users
userRouter.get('/', userControllers.getAllUsers)
userRouter.post('/login', userControllers.loginUser) // the route where a registered user logs in
userRouter.delete('/:username', userControllers.deleteUser) // the route where a user is deleted

userRouter.get(
  '/authentication',
  (req, res, next) => {
    // Check authentication
    const isAuthenticated = userControllers.authenticateUser(req, res, next);

    if (isAuthenticated) {
      // Authentication succeeded, handle accordingly
      res.status(200).json({ message: 'Authenticated successfully' });
    } else {
      // Authentication failed, handle accordingly
      res.status(401).json({ error: 'Authentication failed' });
    }
    next();
  }
);

galleryRouter.post('/', galleryControllers.addGalleryVideo); // the route where a new video is added to the gallery
galleryRouter.get('/', galleryControllers.getAllVideos) // the route where all videos are fetched 

export { emailRouter };
export { userRouter };
export { galleryRouter };