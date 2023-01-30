const { all } = require("express/lib/application");
const { builtinModules } = require("module");
const path = require("path");

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files;
        const fileExtension = [];
        Object.keys(files).forEach(key => {
            fileExtension.push(path.extname(files[key].name));
        });

        const allowed  = fileExtension.every(ext => allowedExtArray.includes(ext));

        if (!allowed) {
            const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`;
            return res.status(422).json({status: "error", message});
        }

        next();
    }
}

module.exports = fileExtLimiter;