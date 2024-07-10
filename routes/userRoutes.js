
import express from 'express'
import UserController from './../controllers/userController.js'

const router = express.Router()



// public 

router.post('/registration', UserController.userRegistration)
router.post('/login',()=>{})
router.post('/reset-pass-email',()=>{})
router.post('/reset-pass/:id/:token',()=>{})
// private

export default router