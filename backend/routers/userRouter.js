import express from 'express';
import User from '../models/userModel';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAdmin, isAuth } from '../utils';

const userRouter = express.Router();

userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
}))

userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
}))

userRouter.get('/createadmin', expressAsyncHandler(async (req, res) => {
    try {
        const user = new User({
            name: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true,
        });
        const createdUser = await user.save();
        res.send(createdUser);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}));

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    });
    if (!signinUser) {
        res.status(401).send({
            message: 'Invalid Email or Password',
        });
    } else {
        res.send({
            _id: signinUser._id,
            name: signinUser.name,
            email: signinUser.email,
            isAdmin: signinUser.isAdmin,
            token: generateToken(signinUser),
        })
    }
}));

userRouter.post('/register', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    const createdUser = await user.save();
    if (!createdUser) {
        res.status(401).send({
            message: 'Invalid User Data',
        });
    } else {
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: generateToken(createdUser),
        })
    }

}));

userRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const user = new User({
        name: 'user',
        email: 'email',
        password: 'password',
    });
    const createdUser = await user.save();
    if (createdUser) {
        res.status(201).send({ message: 'User created', user: createdUser });
    } else {
        res.status(500).send({ message: 'Error in creating user' });
    }
}))

userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        const deletedUser = await user.remove();
        res.send({ message: 'User Deleted', user: deletedUser })
    } else {
        res.status(404).send({ message: 'User Not Found!' })
    }
}))

// userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     if (!user) {
//         res.status(404).send({
//             message: 'User Not Found',
//         });
//     } else {
//         user.name = req.body.name || user.name;
//         user.email = req.body.email || user.email;
//         user.password = req.body.password || user.password;
//         const updatedUser = await user.save();
//         res.send({
//             _id: updatedUser._id,
//             name: updatedUser.name,
//             email: updatedUser.email,
//             isAdmin: updatedUser.isAdmin,
//             token: generateToken(updatedUser),
//         })
//     }
// }));

userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        const updatedUser = await user.save();
        if (updatedUser) {
            res.send({ message: 'User Update', user: updatedUser });
        } else {
            res.status(500).send({ message: 'Error in updating user' });
        }
    } else {
        res.status(404).send({ message: 'User not found' });
    }
})
);

export default userRouter;