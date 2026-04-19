const homepage = async (req, res, next) => {
    try {
        return res.render("homepage", {

        })
    } catch (error) {
        next(error)
    }
}

module.exports = {homepage}