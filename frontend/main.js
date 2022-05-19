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
let sample_list2 = [[200300406, 200808877, 200808948, 200809076, 200809276],
                    [198801525, 198700405, 199102142]]
var db_src;
let info_image = undefined
let info = undefined
let name
let company
let effect
let use
let caution
let image
let detail_info
let item_name
let classified_name
let company_name
let classfication
let pre_condition 
let caution_eat
let caution_reaction
let keep 

let text = undefined
let text2 = undefined

function delay(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=> resolve(), 1000)
    })
}
async function getData(numbers){

    name = new Array(numbers.length)
    company = new Array(numbers.length)
    effect = new Array(numbers.length)
    use = new Array(numbers.length)
    caution = new Array(numbers.length)
    image = new Array(numbers.length)
    detail_info = new Array(numbers.length)
    item_name = new Array(numbers.length)
    classified_name = new Array(numbers.length)
    company_name = new Array(numbers.length)
    classfication = new Array(numbers.length)
    pre_condition = new Array(numbers.length)
    caution_eat = new Array(numbers.length)
    caution_reaction = new Array(numbers.length)
    keep = new Array(numbers.length)

    fs.readFile("./alyac_image.json", 'utf8', (error, data)=>{ // 이미지 관련
        if(error) return console.log(error)
        console.log("image file is successfully read")
        info_image = JSON.parse(data)
  //      for(var k = 0; k < numbers.length; k++){ // 알약이 총 몇개가 찍혔는지 나타냄
            for(var i = 0 ; i < numbers.length; i++){ // 각 알약의 예상 리스트 마다 확인
                for(var j = 0 ; j < info_image.length; j++){
                    if(info_image[j]['품목일련번호'].toString() === numbers[i].toString()){
                        image[i] = info_image[j]['큰제품이미지']
                        item_name[i] = info_image[j]['품목명']
                        classified_name[i] = info_image[j]['분류명']
                        company_name[i] = info_image[j]['업소명']
                        classfication[i] = info_image[j]['전문일반구분']
                    }
                }
                if(image[i] === undefined){
                    image[i] = "데이터가 없습니다"
                    item_name[i] = "데이터가 없습니다"
                    classified_name[i] = "데이터가 없습니다"
                    company_name[i] = "데이터가 없습니다"
                    classfication[i] = "데이터가 없습니다"
                }
            }
        //} 
        console.log("아이템 이름이 배열인가?" + name)

    })
    fs.readFile("./alyac.json", 'utf8', (error, data)=>{
        if(error) return console.log(error)
        console.log("info file is successfully read")
        info = JSON.parse(data)

      //  for(var k = 0; k < numbers.length; k++){ // 알약이 총 몇개가 찍혔는지 나타냄
            for(var i = 0; i < numbers.length; i++){ // 알약 정보 관련
                for(var j = 0 ; j < info.length; j++){
                    if(info[j].num === numbers[i].toString()){
                        detail_info[i] = "true"
                        name[i] = info[j].name
                        company[i] = info[j].company
                        effect[i] = info[j].effect
                        use[i] = info[j].use
                        caution[i] = info[j].caution
                        pre_condition[i] = info[j].pre_condition
                        caution_eat[i] = info[j].caution_eat
                        caution_reaction[i] = info[j].caution_reaction
                        keep[i] = info[j].keep
                    }
                }
                if(name[i] === undefined){
                    detail_info[i] = "false"
                    name[i] = "데이터가 없습니다"
                    company[i] = "데이터가 없습니다"
                    effect[i] = "데이터가 없습니다"
                    use[i] = "데이터가 없습니다"
                    caution[i] = "데이터가 없습니다"
                    pre_condition[i] = "데이터가 없습니다"
                    caution_eat[i] = "데이터가 없습니다"
                    caution_reaction[i] = "데이터가 없습니다"
                    keep[i] = "데이터가 없습니다"
                }
            }
       // }
    })
    await delay()
    return new Promise(function(resolve, reject){
        resolve([detail_info, name, company, effect, use, pre_condition, caution, caution_eat, caution_reaction, keep, image, item_name, classified_name, company_name, classfication])
    })
}
app.post('/output', (req, res)=>{
    getData(sample_list).then(function(data){
        res.write('<!DOCTYPE html>' +
        '<html><head><meta charset="utf-8"><title>알약 정보</title>' + 
        '<style>' + 
        `table{ margin-top: 10px;}
         td:nth-child(1){ width: 150px; padding-left: 10px; font-weight: bold; background-color: #ced4da;}
         td:nth-child(2){ width: 600px; padding: 5px 5px 5px 10px;} 
         table, td{
             border-collapse: collapse;
             border : 1px solid black;
         }
        ` + 
        '</style></head><body>' + 
        '<script> function alyac_info(data){ document.getElementById("info").innerHTML = data;}</script></body></html>'
        )
        console.log("데이터의 크기는" + data[0].length)
      //  for(var k = 0; k < data.length; k++){ // 알약이 총 몇개가 찍혔는지 나타냄
            for(let i = 0 ; i < data[0].length; i++){
                if(data[0][i] === "true"){
                    text =  
                    "<table border=1 >" + 
                    "<tr><td>제품명</td><td>" + data[1][i] + "</td></tr>" +
                    "<tr><td>제조회사</td><td>" + data[2][i] + "</td></tr>" +
                    "<tr><td>효능</td><td>" + data[3][i] + "</td></tr>" +
                    "<tr><td>섭취량 및 섭취방법</td><td>" + data[4][i] + "</td></tr>" +
                    "<tr><td>복용 전 주의사항</td><td>" + data[5][i] + "</td></tr>" +
                    "<tr><td>주의사항</td><td>" + data[6][i] + "</td></tr>" +
                    "<tr><td>섭취시 주의사항</td><td>" + data[7][i] + "</td></tr>" +
                    "<tr><td>부작용</td><td>" + data[8][i] + "</td></tr>" +
                    "<tr><td>보관방법</td><td>" + data[9][i] + "</td></tr>" + "</table>"
                }else{
                    text =  
                    "<table border=1 >" + 
                    "<tr><td>제품명</td><td>" + data[11][i] + "</td></tr>" +
                    "<tr><td>제조회사</td><td>" + data[13][i] + "</td></tr>" +
                    "<tr><td>분류명</td><td>" + data[12][i] + "</td></tr>" +
                    "<tr><td>전문일반구분</td><td>" + data[14][i] + "</td></tr>" + "</table>"
                }
                if(data[10][i] === "데이터가 없습니다") continue; //이미지는 없고 알약 번호만 있으면 출력 x
    
                res.write('<img src = ' + data[10][i] + ' width=20% height=50% '+`onclick='alyac_info("${text}")'` + '>')
                // text0 = "image_num" + i // 아이디를 만들기 위함
                // res.write(`<script>document.getElementById("` + `image_num` + i +`").addEventListener("click", alyac_info);</script>`)
            } res.write('<div id="info"></div>')
        //}
  

        

    })
    // getData(sample_list2).then(function(data2){
    //     // console.log(data2[1])

    //     for(let i = 0 ; i < data2[5].length; i++){
    //         if(data2[0][i] === "true"){
    //             text2 =  
    //             "제품명: " + data2[1][i] + "\\n" +
    //             "제조회사: "  + data2[2][i] + "\\n" +
    //             "효능: " + data2[3][i] + "\\n" +
    //             "섭취량 및 섭취방법: " + data2[4][i] + "\\n" +
    //             "복용 전 주의사항: " + data2[5][i] + "\\n" +
    //             "주의사항: " + data2[6][i] + "\\n" +
    //             "섭취시 주의사항: " + data2[7][i] + "\\n" +
    //             "부작용: " + data2[8][i] + "\\n" +
    //             "보관방법: " + data2[9][i]  
    //         }else{
    //             text2 = "제품명: " + data2[11][i] + "\\n" +
    //             "제조회사: " + data2[13][i] + "\\n" +
    //             "분류명: " + data2[12][i] + "\\n" +
    //             "전문일반구분: " + data2[14][i]
    //         }
    //         if(data2[10][i] === null) continue; //이미지는 없고 알약 번호만 있으면 출력 x
    //     } //res.write('<div id="info2"></div>')
    // })
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



