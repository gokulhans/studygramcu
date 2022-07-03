var express = require('express');
var router = express.Router();
var db = require('../connection')
var fun = require('../functions')
var ObjectId = require('mongodb').ObjectId


/* GET home page. */

/*

End pooints of backend applications and its json types... 

1. null
2. /courses/
3. /course/:course/
4. /:course/:semester/
5. /:course/:semester/:subject/
6. /:course/:semester/:subject/:type/
7. /:course/:semester/:subject/:type/:id/:filename/
8. /videos/:course/:semester/:subject/
9. /videos/:course/:semester/:subject/:module/

*/


//1. home page 
router.get('/', async function (req, res) {
  res.json( {message:"Welcome cowboys lets start your journey ?.?" });
});


// 2. courses 

router.get('/courses', async function (req, res) {
  let data = await db.get().collection('data').find({ "item": "courses" }).toArray()
    res.json(data);
});


// 3. course
router.get('/course/:course', async function (req, res) {
  course = req.params.course
  let data = await db.get().collection('data').find({ "item": course }).toArray()
  res.json({ data:data, course:course }); // courses.hbs
});

// 4. semester
router.get('/:course/:semester', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subjectid = (course + semester);
  let data = await db.get().collection('data').find({ "item": subjectid }).toArray()
  res.json( data); // subject.hbs
});

// 5. subject

router.get('/:course/:semester/:subject', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let typeid = (course + semester + subject)
  let data = await db.get().collection('data').find({ "item": typeid }).toArray()
  res.json(data); // type.hbs
  // res.json({ course, semester, subject, data }); // type.hbs
});

//6. type 
router.get('/:course/:semester/:subject/:type', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let type = req.params.type
  let fileid = (course + semester + subject + type)
  let uploads = await db.get().collection('uploads').find({ "item": fileid }).toArray()
  res.json( { course, semester, subject, type, uploads, users: true });
  res.json( { course, semester, subject, type, uploads }); // files.hbs
});

//7. downloading files option
router.get('/:course/:semester/:subject/:type/:id/:filename', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let type = req.params.type
  let id = req.params.id
  let file = await db.get().collection('uploads').findOne({ _id: ObjectId(id) })
  let url = file.link;
  let myArray = url.split("/").pop();
  myArray = myArray.split(".")
  file.filename = myArray[0]
  console.log(file);
  let blogname = "Calicut University " + course+" "+ semester+" "+ subject+" " + type + " download | " + file.filename
  let blogdesc = "Calicut University " + course+" "+ semester+" "+ subject+" " + type + " You can download from here.. Studocu place for calicut university students | " + file.filename
  res.json( { file, course, semester, subject, type, blogname,blogdesc }); // fileframe.hbs
})


//8. videos subject 
router.get('/videos/:course/:semester/:subject', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let moduleid = (course + semester + subject)
  url = course + '/' + semester + '/' + subject
  req.session.url = url
    res.json( { course, semester, subject }); // module.hbs
});


//9. videos module
router.get('/videos/:course/:semester/:subject/:module', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let module = req.params.module
  let videoid = ('videos' + course + semester + subject + module)
  let uploads = await db.get().collection('uploads').find({ "item": videoid, "type": "link" }).toArray()
  let playlists = await db.get().collection('uploads').find({ "item": videoid, "type": "playlist" }).toArray();
  res.json({ course, semester, subject, uploads, module, playlists }); // videos.hbs
});


















// router.get('/videos/:course/:semester/:subject', async function (req, res) {
//   let course = req.params.course
//   let semester = req.params.semester
//   let subject = req.params.subject
//   let videoid = ('videos' + course + semester + subject)
//   url = 'videos' + '/' + course + '/' + semester + '/' + subject
//   req.session.url = url
//   let uploads = await db.get().collection('uploads').find({ "item": videoid, "type": "link" }).toArray()
//   let playlists = await db.get().collection('uploads').find({ "item": videoid , "type":"playlist" }).toArray()
//   if (req.session.admin === true) {
//     res.json('videos', { course, semester, subject, uploads, playlists , admin: true });
//   } else {
//     res.json('videos', { course, semester, subject, uploads ,playlists });
//   }
// });

router.get('/myprofile', async function (req, res) {
  req.session.url = '/myprofile'
  let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
  let uploads = await db.get().collection('uploads').find({ "user": req.session.user }).toArray()
  if (user) {
    res.json({ user, uploads });
  } else {
    res.redirect('/login')
  }
});

router.get('/list/:id', async function (req, res) {
  if (req.session.user) {
    let old = await db.get().collection('list').findOne({ id: ObjectId(req.params.id), userid: req.session.user })
    if (!old) {
      let uploads = await db.get().collection('uploads').findOne({ _id: ObjectId(req.params.id) })
      let listdata = { data: uploads, userid: req.session.user, id: uploads._id }
      db.get().collection('list').insertOne(listdata)
    }
    res.redirect('back')
  } else {
    res.redirect('/login')
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/');
});

router.get('/list', async function (req, res) {
  req.session.url = '/list'
  if (req.session.user) {
    let listdata = await db.get().collection('list').find({ userid: req.session.user }).toArray()
    res.json('list', { listdata });
  } else {
    res.redirect('/login')
  }
});

router.get('/deletelist/:id', async function (req, res) {
  let id = req.params.id
  db.get().collection('list').deleteOne({ id: ObjectId(id), userid: req.session.user })
  res.redirect('back')
});

router.get('/about', async function (req, res) {
  res.json('about');
});

router.get('/admin', async function (req, res) {
  res.json('admin');
});

router.get('/login', function (req, res) {
  if (req.session.loggedIN) {
    res.redirect('/users/')
  }
  if (req.session.loggedfalse) {
    res.json('login', { err: true });
  } else {
    res.json('login');
  }
});

router.get('/signup', (req, res) => {
  if (req.session.signupstatusfalse) {
    res.json('signup', { err: true })
  } else
    res.json('signup')
})

router.get('/delete/:id', async function (req, res) {
  let id = req.params.id
  db.get().collection('data').deleteOne({ _id: ObjectId(id) })
  res.redirect('back')
});

router.get('/deleteupload/:id', async function (req, res) {
  let id = req.params.id
  db.get().collection('uploads').deleteOne({ _id: ObjectId(id) })
  res.redirect('back')
});

router.get('/edit/:id', async function (req, res) {
  let id = req.params.id
  let data = await db.get().collection('data').findOne({ _id: ObjectId(id) })
  res.json('edit', { data })
});
 
router.get('/editupload/:id', async function (req, res) {
  let id = req.params.id
  let upload = await db.get().collection('uploads').findOne({ _id: ObjectId(id) })
  res.json('editupload', { upload })
});

router.post('/edit', async function (req, res) {
  let newdata = req.body.name
  let query = { _id: ObjectId(req.body.id) }
  var newvalues = { $set: { name: newdata } };
  db.get().collection('data').updateOne(query, newvalues)
  res.redirect(req.session.url)
});

router.post('/editupload', async function (req, res) {
  let newname = req.body.name
  let newlink = req.body.link
  let query = { _id: ObjectId(req.body.id) }
  var newvalues = { $set: { name: newname, link: newlink } };
  db.get().collection('uploads').updateOne(query, newvalues)
  res.redirect(req.session.url)
});

router.get('/add:parameter', async function (req, res) {
  let parameter = req.params.parameter
  res.json('add', { parameter });
});

router.post('/add', async function (req, res) {
  let data = req.body
  db.get().collection('data').insertOne(data)
  url = req.session.url
  res.redirect(url);
});

router.post('/admin', async function (req, res) {
  let admindata = req.body
  if (admindata.gmail === "gbroz@123", admindata.password === "9846551975") {
    req.session.admin = true
    let users = await db.get().collection('users').find().toArray()
    res.json('admindata', { users });
  } else {
    res.json('admin');
  }
});


router.get('/upload:parameter', async function (req, res) {
  let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
  let parameter = req.params.parameter
  res.json('upload', { parameter, user });
});

router.get('/pdfupload:parameter', async function (req, res) {
  let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
  let parameter = req.params.parameter
  res.json('uploadpdf', { parameter, user });
});

router.post('/upload', async function (req, res) {
  let upload = req.body
  var ytlink = upload.link
  var playlist = upload.playlist
  if (ytlink) {
    ytlink = ytlink.replace("https://youtu.be/", "");
    upload.link = ytlink
  }
  if (playlist) {
    playlist = playlist.replace("https://youtube.com/playlist?", "");
    upload.playlist = playlist
  }
  db.get().collection('uploads').insertOne(upload)
  url = req.session.url
  res.redirect(url);
});

router.post('/pdfupload', async function (req, res) {
  let upload = req.body
  db.get().collection('uploads').insertOne(upload)
  url = req.session.url
  res.redirect(url);
});

router.post('/signup', (req, res) => {
  fun.doSignup(req.body).then((response) => {
    if (response.signupstatus) {
      session = req.session;
      session.user = response.insertedId
      session.loggedfalse = false
      session.loggedIN = true
      res.redirect(req.session.url)
    } else {
      req.session.signupstatusfalse = true
      res.redirect('/signup/')
    }
  })
})


router.post('/login', (req, res) => {
  fun.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = String(response.user._id)
      req.session.loggedfalse = false
      req.session.loggedIN = true
      res.redirect(req.session.url)
    } else {
      req.session.loggedfalse = true
      res.redirect('/login');
    }
  })
})

module.exports = router;
