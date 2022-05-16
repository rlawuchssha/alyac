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
let info_image = undefined
let info = undefined
let name = undefined 
let company = undefined
let effect = undefined
let use = undefined
let caution = undefined
let image = undefined
let detail_info = false
let item_name = undefined
let classified_name = undefined
let company_name = undefined
let classfication = undefined
function delay(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=> resolve(), 1000)
    })
}
async function getData(number){
    detail_info = false
    fs.readFile("./alyac_image.json", 'utf8', (error, data)=>{
        if(error) return console.log(error)
        console.log("image file is successfully read")
        info_image = JSON.parse(data)
        for(var j = 0 ; j < info_image.length; j++){
            if(info_image[j]['품목일련번호'].toString() === number){
                image = info_image[j]['큰제품이미지']
                item_name = info_image[j]['품목명']
                classified_name = info_image[j]['분류명']
                company_name = info_image[j]['업소명']
                classfication = info_image[j]['전문일반구분']
            }
        }

    })
    fs.readFile("./alyac.json", 'utf8', (error, data)=>{
        if(error) return console.log(error)
        console.log("json file is successfully read")
        info = JSON.parse(data)
        for(var i = 0 ; i < info.length; i++){
            if(info[i].num === number){
                name = info[i].name
                company = info[i].company
                effect = info[i].effect
                use = info[i].use
                caution = info[i].caution
                detail_info = true;
            }
        }
        // if(detail_info === false){
        //     name = "데이터베이스에 해당 알약이 없습니다."
        //     company = "데이터베이스에 해당 알약이 없습니다."
        //     effect = "데이터베이스에 해당 알약이 없습니다."
        //     use = "데이터베이스에 해당 알약이 없습니다."
        //     caution = "데이터베이스에 해당 알약이 없습니다."
        // }
    })
    await delay()
     console.log("이미지파일 크기" + info_image.length)
     console.log("정보 파일 크기" + info.length)
    return new Promise(function(resolve, reject){
        resolve([name, company, effect, use, caution, image, item_name, classified_name, company_name, classfication])
    })
}
app.post('/output', (req, res)=>{
    console.log(req.body.serial_number);
    getData(req.body.serial_number).then(function(data){
        if(detail_info === true){
            res.send('<!DOCTYPE html>' + 
            '<html><head><title>알약 정보</title></head>' +
            '<body><div> 제품명: ' + data[0] + "<br>" +
            '제조회사: ' + data[1] + "<br>" +
            '효과: ' + data[2] + "<br>" +
            '사용법: ' + data[3] + "<br>" +
            '주의사항: ' + data[4] + "<br>" +
            '<img src= ' + data[5] + ' width= 50% height=50%>' +
            '</div></body></html>'
            )

        }else{
            res.send('<!DOCTYPE html>' + 
            '<html><head><title>알약 정보</title></head>' +
            '<body><div> 제품명: ' + data[6] + "<br>" +
            '제조회사: ' + data[8] + "<br>" +
            '분류명: ' + data[7] + "<br>" +
            '전문일반구분: ' + data[9] + "<br>" +
            '<img src= ' + data[5] + ' width= 50% height=50%>' + '<br>' +
            '해당 알약은 기본적인 정보 외에 추가적인 정보가 제공되지 않습니다' +
            '</div></body></html>'
            )
        }

    })
    // res.redirect("http://localhost:5000/api/alyac/" + req.body.serial_number)
    // db_src = "http://localhost:5000/api/alyac/" + req.body.serial_number;
    // open(db_src)
    // res.redirect("https://alyacdetection.tk/output.html")
    


})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
    console.log("Web Server is running")
})



