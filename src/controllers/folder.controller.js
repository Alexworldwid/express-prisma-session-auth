const prisma = require("../config/prisma");

const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    const folder = await prisma.folder.create({
      data: {
        name,
        userId: req.user.id,
        parentId: parentId ? Number(parentId) : null,
      },
    });

    if (parentId) {
      return res.redirect(`/folders/${parentId}`);
    }

    res.redirect("/");
  } catch (err) {
    console.error("CREATE FOLDER ERROR:", err);
    res.status(500).send(err.message);
  }
};

async function getBreadcrumbs(folderId) {
  const breadcrumbs = [];

  let current = await prisma.folder.findUnique({
    where: { id: folderId }
  });

  while (current) {
    breadcrumbs.unshift(current); // add to beginning

    if (!current.parentId) break;

    current = await prisma.folder.findUnique({
      where: { id: current.parentId }
    });
  }

  return breadcrumbs;
}

const viewFolder = async (req, res) => {
  const folderId = Number(req.params.id);

  const folders = await prisma.folder.findMany({
    where: {
      parentId: folderId,
      userId: req.user.id,
    },
  });

  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
      userId: req.user.id,
    },
  });

  const breadCrumbs = folderId
  ? await getBreadcrumbs(folderId)
  : [];

  res.render("folder", { folders, files, folderId, breadCrumbs });
};

const editFolder = async (req, res) => {
  try {
    const folderId = Number(req.params.id);
    const { name, parentId } = req.body;

    await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    });

    if (parentId) {
      return res.redirect(`/folders/${parentId}`);
    }

    res.redirect("/");
  } catch (error) {
    console.error("EDIT FOLDER ERROR:", error);
    res.status(500).send(error.message);
  }
};


const deleteFolder = async (req, res) => {
  try {
    const folderId = Number(req.params.id);
    const { parentId } = req.body;

    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });

    if (parentId) {
      return res.redirect(`/folder/${parentId}`);
    }

    res.redirect("/");
  } catch (error) {
    console.error("DELETE FOLDER ERROR:", error);
    res.status(500).send(error.message);
  }
};


module.exports = {createFolder, viewFolder, editFolder, deleteFolder}