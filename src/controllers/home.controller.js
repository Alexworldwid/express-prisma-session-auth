const prisma = require("../config/prisma"); 

const homepage = async (req, res) => {
    try {
        const files = await prisma.file.findMany({
        where: {
            userId: req.user.id,
            folderId: null,
        },
        orderBy: {
            id: "desc",
        },
        });

        const folders = await prisma.folder.findMany({
            where: {
                userId: req.user.id,
                parentId: null,
            },
        });

        res.render("homepage", { files, folders });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading homepage");
    }
}

module.exports = {homepage}