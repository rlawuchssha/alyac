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
 
let sample_list = [200300406, 200808877, 200808948, 200809076, 200809276]
let sample_list2 = [198801525, 198700405, 199102142]
var db_src;
let info_image = undefined
let info = undefined
let name = new Array(); 
let company = new Array();
let effect = new Array();
let use = new Array();
let caution = new Array();
let image = new Array();
let detail_info = new Array();
let item_name = new Array();
let classified_name = new Array();
let company_name = new Array();
let classfication = new Array();
let pre_condition = new Array();
let caution_eat = new Array();
let caution_reaction = new Array();
let keep = new Array();

let text0
let row = 0
let col = 0
let text = undefined
let text2 = undefined

function delay(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=> resolve(), 1000)
    })
}
async function getData(numbers){
    fs.readFile("./alyac_image.json", 'utf8', (error, data)=>{ // 이미지 관련
        if(error) return console.log(error)
        console.log("image file is successfully read")
        info_image = JSON.parse(data)
        for(var i = 0 ; i < numbers.length; i++){
            for(var j = 0 ; j < info_image.length; j++){
                if(info_image[j]['품목일련번호'].toString() === numbers[i].toString()){
                    image.push(info_image[j]['큰제품이미지'])
                    item_name.push(info_image[j]['품목명'])
                    classified_name.push(info_image[j]['분류명'])
                    company_name.push(info_image[j]['업소명'])
                    classfication.push(info_image[j]['전문일반구분'])
                }
            }
            if(image[i] === undefined){
                image.push("데이터가 없습니다")
                item_name.push("데이터가 없습니다")
                classified_name.push("데이터가 없습니다")
                company_name.push("데이터가 없습니다")
                classfication.push("데이터가 없습니다")
            }
        }


    })
    fs.readFile("./alyac.json", 'utf8', (error, data)=>{
        if(error) return console.log(error)
        console.log("info file is successfully read")
        info = JSON.parse(data)
        for(var i = 0; i < numbers.length; i++){ // 알약 정보 관련
            for(var j = 0 ; j < info.length; j++){
                if(info[j].num === numbers[i].toString()){
                    detail_info.push("true")
                    name.push(info[j].name)
                    company.push(info[j].company)
                    effect.push(info[j].effect)
                    use.push(info[j].use)
                    caution.push(info[j].caution)
                    pre_condition.push(info[j].pre_condition)
                    caution_eat.push(info[j].caution_eat)
                    caution_reaction.push(info[j].caution_reaction)
                    keep.push(info[j].keep)
                }
            }
            if(name[i] === undefined){
                detail_info.push("false")
                name.push("데이터가 없습니다")
                company.push("데이터가 없습니다")
                effect.push("데이터가 없습니다")
                use.push("데이터가 없습니다")
                caution.push("데이터가 없습니다")
                pre_condition.push("데이터가 없습니다")
                caution_eat.push("데이터가 없습니다")
                caution_reaction.push("데이터가 없습니다")
                keep.push("데이터가 없습니다")
            }
        }
    })
    await delay()

    return new Promise(function(resolve, reject){
        resolve([detail_info, name, company, effect, use, pre_condition, caution, caution_eat, caution_reaction, keep, image, item_name, classified_name, company_name, classfication])
    })
}
app.post('/output', (req, res)=>{
    getData(sample_list).then(function(data){
        console.log(data[10])
    
        res.write('<!DOCTYPE html>' +
        '<html><head><meta charset="utf-8"><title>알약 정보</title></head><body>' + 
        '<script> function alyac_info(data){ document.getElementById("info").innerText = data;}</script></body></html>'
        )

        for(let i = 0 ; i < data[5].length; i++){
            if(data[0][i] === "true"){
                text =  
                "제품명: " + data[1][i] + "\\n" +
                "제조회사: "  + data[2][i] + "\\n" +
                "효능: " + data[3][i] + "\\n" +
                "섭취량 및 섭취방법: " + data[4][i] + "\\n" +
                "복용 전 주의사항: " + data[5][i] + "\\n" +
                "주의사항: " + data[6][i] + "\\n" +
                "섭취시 주의사항: " + data[7][i] + "\\n" +
                "부작용: " + data[8][i] + "\\n" +
                "보관방법: " + data[9][i]  
            }else{
                text =  "제품명: " + data[11][i] + "\\n" +
                "제조회사: " + data[13][i] + "\\n" +
                "분류명: " + data[12][i] + "\\n" +
                "전문일반구분: " + data[14][i]
            }
            if(data[10][i] === "데이터가 없습니다") continue; //이미지는 없고 알약 번호만 있으면 출력 x
            res.write('<img src = ' + data[10][i] + ' width=20% height=50% '+`onclick='alyac_info("${text}")'` + '>')
            // text0 = "image_num" + i // 아이디를 만들기 위함
            // res.write(`<script>document.getElementById("` + `image_num` + i +`").addEventListener("click", alyac_info);</script>`)
        } res.write('<div id="info"></div>')
        

    })
    getData(sample_list2).then(function(data2){
        // console.log(data2[1])

        for(let i = 0 ; i < data2[5].length; i++){
            if(data2[0][i] === "true"){
                text2 =  
                "제품명: " + data2[1][i] + "\\n" +
                "제조회사: "  + data2[2][i] + "\\n" +
                "효능: " + data2[3][i] + "\\n" +
                "섭취량 및 섭취방법: " + data2[4][i] + "\\n" +
                "복용 전 주의사항: " + data2[5][i] + "\\n" +
                "주의사항: " + data2[6][i] + "\\n" +
                "섭취시 주의사항: " + data2[7][i] + "\\n" +
                "부작용: " + data2[8][i] + "\\n" +
                "보관방법: " + data2[9][i]  
            }else{
                text2 =  "제품명: " + data2[11][i] + "\\n" +
                "제조회사: " + data2[13][i] + "\\n" +
                "분류명: " + data2[12][i] + "\\n" +
                "전문일반구분: " + data2[14][i]
            }
            if(data2[10][i] === "데이터가 없습니다") continue; //이미지는 없고 알약 번호만 있으면 출력 x
        } //res.write('<div id="info2"></div>')
    })
})




// app.post('/output', (req, res)=>{
//     console.log(req.body.serial_number);
//     getData(req.body.serial_number).then(function(data){
            // console.log(data)

        // if(detail_info === true){
        //     res.send('<!DOCTYPE html>' + 
            // '<html><head><title>알약 정보</title></head>' +
            // '<body><div> 제품명: ' + data[0] + "<br>" +
            // '제조회사: ' + data[1] + "<br>" +
            // '효과: ' + data[2] + "<br>" +
            // '사용법: ' + data[3] + "<br>" +
            // '주의사항: ' + data[4] + "<br>" +
            // '<img src= ' + data[5] + ' width= 50% height=50%>' +
            // '</div></body></html>'
            // )

        // }else{
        //     res.send('<!DOCTYPE html>' + 
        //     '<html><head><title>알약 정보</title></head>' +
        //     '<body><div> 제품명: ' + data[6] + "<br>" +
        //     '제조회사: ' + data[8] + "<br>" +
        //     '분류명: ' + data[7] + "<br>" +
        //     '전문일반구분: ' + data[9] + "<br>" +
        //     '<img src= ' + data[5] + ' width= 50% height=50%>' + '<br>' +
        //     '해당 알약은 기본적인 정보 외에 추가적인 정보가 제공되지 않습니다' +
        //     '</div></body></html>'
        //     )
        // }

    // })
    // res.redirect("http://localhost:5000/api/alyac/" + req.body.serial_number)
    // db_src = "http://localhost:5000/api/alyac/" + req.body.serial_number;
    // open(db_src)
    // res.redirect("https://alyacdetection.tk/output.html")
    


// })

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
    console.log("Web Server is running")
})



