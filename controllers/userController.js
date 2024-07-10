
import bcrypt from 'bcrypt'
import userModel from './../model/model.js'


class UserController {

   static userRegistration = async (req,res)=>{
    const {name, email, pass , c_pass, tc} = req.body
    const user = await userModel.findOne({email:email})
    // const user = false
    if (user){ 
        res.send({"status":"failed","message":"Email Already Registered"})
    }
    else{
        if (name && email && pass && c_pass && tc){
            if (pass === c_pass){
                try{
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(pass, salt)
                    console.log(name,email,pass,tc,hashPassword,salt)
                    const doc = new userModel({
                        name,
                        email,
                        pass:hashPassword,
                        tc
                    })
                    await doc.save()
                    res.send({"status":"success","message":"Registration Successful"})

                }
                catch (error) {
                    res.send({status:'failed','message': error})

                }
                

            }
            else{
                res.send({"status":"failed","message":"Password and Confirm Password does not match"})
            }
 
        }
        else{
            res.send({"status":"failed","message":"All fields are required"})
        }


    }

   }



}


export default UserController