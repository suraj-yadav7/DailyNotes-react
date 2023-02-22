const express = require("express")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

//Route 1: Fetching notes of exisiting user by GET "api/note/fechallnotes" - login needed
try{
router.get("/fetchallnotes",fetchuser,async (req,res)=>{
    const notes = await Notes.find({user: req.user.id})
    res.json(notes)
})
}
catch(error){
    console.error(error.message)
    res.status(500).send("Internal Server Error")
}



//Route 2: Add a new notes using post "api/note/addnote". login needed
router.post("/addnote",fetchuser,[
    body('title', 'Minimum length of title is 8 Character').isLength({ min: 8 }),
    body('description','Minimum length of Desc is 15 Character').isLength({ min: 15 }),
], async (req,res)=>{
try{
    const{title,description,tag}=req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Notes({
        title,description,tag, user:req.user.id
    })
    const saveNote = await note.save()
    res.json(saveNote)
}
catch(error){
    console.error(error.message)
    res.status(500).send("Internal Server Error")
}
})

//Rout 3: Update exisiting note by using PUT "api/note/updatenote" login required
router.put("/updatenote/:id",fetchuser, async (req,res)=>{
    const {title,description,tag}=req.body

    try{
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};
    
    //find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    if(note.user.toString()!== req.user.id){
        return res.status(401).send("Not Allowed")
    }
    
    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note});
    }
catch(error){
    console.error(error.message)
    res.status(500).send("Internal Server Error")
        }
})

//Router 4: Delete exisiting note by using DELETE "api/note/deletenote" login required
router.delete("/deletenote/:id",fetchuser, async (req,res)=>{
    try{
    
        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    if(note.user.toString()!== req.user.id){
        return res.status(401).send("Not Allowed")
    }
    
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"success":"Successfull Deleted", note:note});
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
     
    })
    
module.exports = router