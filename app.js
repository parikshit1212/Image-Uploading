var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
	cloudinary = require("cloudinary"),
	multer = require("multer"),
	cloudinaryStorage = require("multer-storage-cloudinary");

app.use(bodyParser.urlencoded({extended: true}));


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})




app.post('/upload', (req, res, next) => {
  const upload = multer({ storage }).single('image')
  upload(req, res, function(err) {
    if (err) {
      return res.send(err)
    }
    console.log('file uploaded to server')
    console.log(req.file)

    // Now i am sending file to cloudinary
    const cloudinary = require('cloudinary').v2
    cloudinary.config({
     cloud_name: 'dkc0kyujg', 
     api_key: '742948971391738', 
     api_secret: 'hc-yj2cGcbPUurvmpWzdD3nseDM' 
    })
    
    const path = req.file.path
    const uniqueFilename = new Date().toISOString()

    cloudinary.uploader.upload(
      path,
      { public_id: `Ivypods/${uniqueFilename}`, tags: `Ivypods` }, 
      function(err, image) {
        if (err) return res.send(err)
        console.log('file uploaded to Cloudinary')
        // remove file from server
        const fs = require('fs')
        fs.unlinkSync(path)
        // return image details
        //res.json(image)
		  res.send(image);
		  // res.render('success.ejs',{info: image});
      }
    )
  })
})



//End


app.get("/",function(req,res){
	res.render("home.ejs");
});




app.listen(process.env.PORT || 3000, function()
{
	console.log("server has started!");	
});