import User from '../user/user.model.js'
import { encrypt, checkPassword } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const registerUser = async(req, res) => {
    try{
        const { name, surname, username, email, password, phone } = req.body

        let user = new User({ name, surname, username, email, password, phone})
        
        user.password = await encrypt(password)

        user.role = 'ADMIN'

        await user.save()

        return res.send(
            {
                success: true,
                message: `User registered succesfully, can be logged with username: ${user.username}`
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error'})
    }
}

export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        })

        if (!user) {
            return res.status(400).send({ message: 'Wrong username, email, or password' })
        }

        if (user.status === false) {
            return res.status(403).send(
                {
                    success: false,
                    message: 'User account is inactive'
                }
            )
        }

        const isMatch = await checkPassword(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Wrong username, email, or password' })
        }

        let loggedUser = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            status: user.status,
            role: user.role
        };

        let token = await generateJwt(loggedUser)

        return res.send({
            success: true,
            message: `Welcome ${user.name}`,
            loggedUser,
            token
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error' })
    }
}