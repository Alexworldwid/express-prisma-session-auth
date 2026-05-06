const { v4:uuidv4 } = require('uuid');
const prisma = require("../config/prisma");

const createShareLink = async (req, res) => {
    try {
        const folderId = Number(req.params.id);
        const { expiresIn } = req.body; // in days
        
        let days = parseInt(expiresIn);
        if (isNaN(days) || days <= 0) {
            days = 7; // default to 7 days
        }
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);

        const token = uuidv4();

        const share = await prisma.sharedLink.create({
            data: {
                token,
                folderId,
                expiresAt
            }
        })

        const shareUrl = `${req.protocol}://${req.get('host')}/share/${token}`;

        res.send(`Share link: <a href="${shareUrl}">${shareUrl}</a>`);

    } catch (error) {
        console.error("Error creating share link:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const viewFolder = async (req, res) => {
  const { token } = req.params;

  try {
    const share = await prisma.sharedLink.findUnique({
      where: { token },
      include: {
        folder: {
          include: {
            files: true,
            children: true, // if you support nested folders
          },
        },
      },
    });

    if (!share) {
      return res.status(404).send("Invalid link");
    }

    if (new Date() > share.expiresAt) {
      return res.status(403).send("Link expired");
    }

    res.render("sharedFolder", {
      folder: share.folder,
      isShared: true,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading shared folder");
  }
};


module.exports = {
    createShareLink,
    viewFolder
};