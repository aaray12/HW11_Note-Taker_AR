const express = require("express");
const path = require("path");
const fs = require("fs");
// const apiRoutes = require("./routes/apiRoutes");
// const htmlRoutes = require("./routes/htmlRoutes");

// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3000;


// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
// app.use("/api", apiRoutes);
// app.use("/", htmlRoutes);
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        // console.log(data);
        const newData = JSON.parse(data);
        res.json(newData);
    })
});
app.post("/api/notes", function (req, res) {

    // console.log(req.body);
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        // console.log(data);
        let uniqueId = (data.length).toString();
        console.log(uniqueId);
        req.body.id = uniqueId;
       let noteList = JSON.parse(data);
        noteList.push(req.body);
        fs.writeFile("./db/db.json", JSON.stringify(noteList), function (err) {
            if (err) throw err;
            console.log("added");
            res.redirect("/notes");
        });
    });
})
// app.get("/api/notes/:id", function(req, res) {
//     res.json(req.params.id);
// });
app.delete("/api/notes/:id", function (req, res) {   
    res.send('Got a DELETE request at /user')
    console.log("test2");    
    //splice or slice
    let noteId = req.params.id;
    console.log(noteId)
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        let noteList = JSON.parse(data)
        console.log(noteList)
        noteList.forEach((item, i)=> {
            if(item.id === noteId){
                noteList.splice(i, 1);
            }
        })
        console.log(noteList);
        fs.writeFile("./db/db.json", JSON.stringify(noteList),function (err) {
            if (err) throw err;
            console.log("deleted");
    
        });
    
    })
    
});
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));