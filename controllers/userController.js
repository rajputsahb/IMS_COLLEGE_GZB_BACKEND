
import bcrypt from 'bcrypt'
import userModel from './../model/model.js'
import jwt from 'jsonwebtoken'


class UserController {

    static userRegistration = async (req, res) => {
        const { name, email, pass, c_pass, tc } = req.body
        const user = await userModel.findOne({ email: email })
        // const user = false
        if (user) {
            res.send({ "status": "failed", "message": "Email Already Registered" })
        }
        else {
            if (name && email && pass && c_pass && tc) {
                if (pass === c_pass) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(pass, salt)
                        console.log(name, email, pass, tc, hashPassword, salt)
                        const doc = new userModel({
                            name,
                            email,
                            pass: hashPassword,
                            tc
                        })
                        await doc.save()
                        const saved_user = await userModel.findOne({ email: email })
                        // generate token
                        const token = jwt.sign({ UserID: saved_user._id }, "secretkey", { expiresIn: '5d' })
                        res.send({ "status": "success", "message": "Registration Successful", "token": token })

                    }
                    catch (error) {
                        res.send({ status: 'failed', 'message': error })

                    }


                }
                else {
                    res.send({ "status": "failed", "message": "Password and Confirm Password does not match" })
                }

            }
            else {
                res.send({ "status": "failed", "message": "All fields are required" })
            }


        }

    }

    static userLogin = async (req, res) => {
        try {
            const { email, pass } = req.body
            if (email && pass) {
                const user = await userModel.findOne({ email: email })
                if (user) {
                    const isMatch = await bcrypt.compare(pass, user.pass)
                    if (isMatch) {
                        // generate token
                        const token = jwt.sign({ UserID: user._id }, "secretkey", { expiresIn: '5d' })
                        res.send({ "status": "success", "message": "Login Successful", "token": token })
                    }
                    else {
                        res.send({ "status": "failed", "message": "Invalid Password or Email" })
                    }
                }
                else {
                    res.send({ "status": "failed", "message": "Invalid Email" })
                }

            }
            else {
                res.send({ "status": "failed", "message": "All fields are required" })
            }
        }
        catch (error) {
            res.send({ "status": "failed", "message": "unable to login", "error": error })
        }


    }

    static changeUserPassword = async (req, res) => {
        const { pass, c_pass, token } = req.body
        console.log(pass,c_pass, req.user)
        if (pass && c_pass) {
            if (pass === c_pass) {
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(pass, salt)
                const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { pass: hashPassword })
                console.log(user)
                if (user) {
                    res.send({ "status": "success", "message": "Password Changed Successfully" })}
                else{
                    res.send({ "status": "failed", "message": "Password Not Changed" })
                }
                
                
                
                
            }
            else{
                res.send({ "status": "failed", "message": "Password and Confirm Password does not match" })
            }

        }
        else {
            res.send({ "status": "failed", "message": "All fields are required" })
        }



    }
}

export default UserController