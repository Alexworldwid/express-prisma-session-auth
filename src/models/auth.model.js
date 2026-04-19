const prisma = require("../config/prisma")

const addUser = async (name, email, hashedPassword) => {
    return await prisma.user.create({
        data: {
            email, 
            password: hashedPassword,
            name
        }
    })
}

const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {email}
    })
}

module.exports = {addUser, findUserByEmail}


