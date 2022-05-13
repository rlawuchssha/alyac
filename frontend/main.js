var express = require('express')
var open = require("open")
var http = require('http')
var bodyParser = require('body-parser')

var app = express();
var port = 3000;
var fs = require('fs')

/* module */
var multer = require('multer')
 
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({storage : _storage})
 
/* public 내에 존재하는 파일을 사용 */
app.use(express.static('public'))

app.use(express.json()) 
app.use(express.urlencoded({extends: true}))

app.use(bodyParser.json())

/* 최초 경로 */
app.get('/', (req, res) => {
 
    res.sendFile('/')    // public/index.html 을 읽고 화면에 띄움
 
})
 
/* upload 경로 */
 
app.post('/upload', upload.any(), (req, res) => {
    if(req.files.length === 0){ // 사진이 업로드 되지 않은 상태에서 업로드 버튼 누르면
        console.log("사진이 업로드 되지 않았습니다.")
        console.log("사진을 다시 업로드 해주세요.")
    }else{ // 사진이 업로드 된 후에 업로드 버튼이 눌리면
        console.log(req.files) 
        console.log("사진이 성공적으로 업로드 되었습니다")
    }
})
 
var db_src;
app.post('/output', (req, res)=>{
    console.log(req.body.serial_number);
    // res.redirect("http://localhost:5000/api/alyac/" + req.body.serial_number)
    // db_src = "http://localhost:5000/api/alyac/" + req.body.serial_number;
    // open(db_src)
    res.redirect("https://alyacdetection.tk/output")
    fs.readFile("./alyac.json", 'utf8', (error, data)=>{
        if(error) return console.log(error)
        console.log("json file is successfully read")
        const user = JSON.parse(data)

        for(var i = 0 ; i < user.length; i++){
            if(user[i].num === req.body.serial_number){
                console.log(
               `제품명: ${user[i].name}
                제조회사: ${user[i].company}
                효과: ${user[i].effect}
                사용법: ${user[i].use}
                주의사항: ${user[i].caution}
                ` )
                res.send('<!DOCTYPE html>' + 
                         '<html><head><title>알약 정보</title></head>' +
                         '<body><div> 제품명: ' + user[i].name + "<br>" +
                         '제조회사: ' + user[i].company + "<br>" +
                         '효과: ' + user[i].effect + "<br>" +
                         '사용법: ' + user[i].use + "<br>" +
                         '주의사항: ' + user[i].caution + "<br>" +
                         '</div></body></html>'
                         )

            }
        }
    })

    }
)

app.listen(port, () => {
    
    console.log(`http://localhost:${port}`)
    console.log("Web Server is running")
})



 