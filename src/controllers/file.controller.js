const prisma = require("../config/prisma");
const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabase")

const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const folderId = req.body.folderId
      ? Number(req.body.folderId)
      : null;

    const fileName = Date.now() + "-" + file.originalname;

    // ✅ Upload to Supabase
    const { data, error } = await supabase.storage
      .from("miniFiles")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    // ✅ Get public URL
    const { data: urlData } = supabase.storage
      .from("miniFiles")
      .getPublicUrl(fileName);

    // ✅ Save in DB
    await prisma.file.create({
      data: {
        name: file.originalname,
        path: urlData.publicUrl,
        mimetype: file.mimetype,
        size: file.size,
        userId: req.user.id,
        folderId,
      },
    });

    if (folderId) {
      return res.redirect(`/folders/${folderId}`);
    }

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: {
        userId: req.user.id,
        folderId: null, // 👈 only root files for now
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch files");
  }
};

const deleteFile = async (req, res) => {
  try {
    const fileId = Number(req.params.id);

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    // 🔐 ensure user owns file
    if (file.userId !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    // delete from filesystem
    const filePath = path.join(__dirname, "..", "uploads", file.path);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // delete from DB
    await prisma.file.delete({
      where: { id: fileId },
    });

    res.redirect("/"); // or res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete failed");
  }
};

const getFileDetails = async (req, res) => {
  const fileId =  Number(req.params.id);

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    res.render("fileDetails", { file });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const downloadFile = async (req, res) => {
  const fileId = Number(req.params.id);

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).send("File not found");
    }


    res.redirect(file.path); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
};


module.exports = { uploadFile, getFiles, deleteFile, getFileDetails, downloadFile };