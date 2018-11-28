const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file)
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
});
const upload = multer({
    dest: 'tmp/',
    storage,
    limits: {
      fileSize: 3 * 1024 * 1024 // 3mo
    },

    fileFilter: (req, file, cb) => {
      if (!file.mimetype.includes('image/png')) {
        cb(new Error('Mauvais format de fichier'));
      }
  
      cb(null, true); // OK -> Tu peux continuer
    }
});

app.use(express.static(path.join(__dirname, 'public')))

app.post('/upload', upload.array('photos', 3), (req, res, next) => {
  fs.rename(req.files.path, 'public/images' + req.files.originalname, function(err){
    if (err) {
        res.send('problème durant le déplacement');
    } else {
        res.send('Fichier uploadé avec succès');
    }
  });
    console.log(req.files);
    res.end();
  });

app.listen(3000, 
    console.log(`Server is listening on 3000`)
    );