const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");
const fileExtLimiter = require("./middleware/fileExtLimiter");

const PORT = process.env.port || 3500;

const app = express();



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})


app.post("/upload",
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.doc']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files;
        console.log(files);

        Object.keys(files).forEach(key =>{
            const filepath = path.join(__dirname, 'files', files[key].name);
            files[key].mv(filepath, (err) => {
                if (err) {
                    return res.status(500).json({status: "error", message: err});
                }
            });
        });

        return res.json({ status: "Success", message: Object.keys(files).toString() });
    }
)


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});