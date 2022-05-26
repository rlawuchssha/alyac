var express = require('express')
var open = require("open")
var http = require('http')
var bodyParser = require('body-parser')

var app = express();
var port = 3000;
var fs = require('fs')

/* module */
var multer = require('multer');
const { runInNewContext } = require('vm');
 
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, "image.jpg")
        // cb(null, file.originalname)
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
                    [198801525, 198700405, 199102142], 
                    [200511943, 201701571, 199200813, 200005559, 201904494,
                     201803036, 201600574, 198601398, 201700839, 200808096]]
var db_src;
let info_image = undefined
let info = undefined
let name = []
let company = []
let effect = []
let use = []
let caution = []
let image = []
let detail_info = []
let item_name = []
let classified_name = []
let company_name = []
let classfication = []
let pre_condition = [] 
let caution_eat = []
let caution_reaction = []
let keep = []
let counter = undefined
let text = undefined
let count = undefined

function delay(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=> resolve(), 1000)
    })
}

// var async = require('async')
// async.waterfall([function checkDir(callback){
    
// }],)

var file = []



async function getData(numbers){

    if(numbers[0][0] === undefined){

    }
    else{
        for(let i = 0 ; i < numbers.length; i++){
            name.push([])
            company.push([]) 
            effect.push([]) 
            use.push([])
            caution.push([])
            image.push([])
            detail_info.push([])
            item_name.push([])
            classified_name.push([])
            company_name.push([])
            classfication.push([])
            pre_condition.push([])
            caution_eat.push([])
            caution_reaction.push([])
            keep.push([])
        }
    }
    

    fs.readFile("./alyac_image.json", 'utf8', (error, data)=>{ // 이미지 관련
        if(error) return console.log(error)
        console.log("image file is successfully read")
        info_image = JSON.parse(data)
        if(numbers[0][0] === undefined){
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
        }
        else{
            for(var k = 0; k < numbers.length; k++){ // 알약이 몇개 찍혔는지
                for(var i = 0 ; i < numbers[k].length; i++){ // 각 알약의 예상 리스트 마다 확인
                    for(var j = 0 ; j < info_image.length; j++){
                        if(info_image[j]['품목일련번호'].toString() === numbers[k][i].toString()){
                            image[k][i] = info_image[j]['큰제품이미지']
                            item_name[k][i] = info_image[j]['품목명']
                            classified_name[k][i] = info_image[j]['분류명']
                            company_name[k][i] = info_image[j]['업소명']
                            classfication[k][i] = info_image[j]['전문일반구분']
                        }
                    }
                    if(image[k][i] === undefined){
                        image[k][i] = "데이터가 없습니다"
                        item_name[k][i] = "데이터가 없습니다"
                        classified_name[k][i] = "데이터가 없습니다"
                        company_name[k][i] = "데이터가 없습니다"
                        classfication[k][i] = "데이터가 없습니다"
                    }
                }
            } 
        }
  

    })
    fs.readFile("./alyac.json", 'utf8', (error, data)=>{
        if(error) return console.log(error)
        console.log("info file is successfully read")
        info = JSON.parse(data)

        if(numbers[0][0] === undefined){
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
        }
        else{
            for(var k = 0; k < numbers.length; k++){ // 알약이 총 몇개가 찍혔는지 나타냄
                for(var i = 0; i < numbers[k].length; i++){ // 알약 정보 관련
                    for(var j = 0 ; j < info.length; j++){
                        if(info[j].num === numbers[k][i].toString()){
                            detail_info[k][i] = "true"
                            name[k][i] = info[j].name
                            company[k][i] = info[j].company
                            effect[k][i] = info[j].effect
                            use[k][i] = info[j].use
                            caution[k][i] = info[j].caution
                            pre_condition[k][i] = info[j].pre_condition
                            caution_eat[k][i] = info[j].caution_eat
                            caution_reaction[k][i] = info[j].caution_reaction
                            keep[k][i] = info[j].keep
                        }
                    }
                    if(name[k][i] === undefined){
                        detail_info[k][i] = "false"
                        name[k][i] = "데이터가 없습니다"
                        company[k][i] = "데이터가 없습니다"
                        effect[k][i] = "데이터가 없습니다"
                        use[k][i] = "데이터가 없습니다"
                        caution[k][i] = "데이터가 없습니다"
                        pre_condition[k][i] = "데이터가 없습니다"
                        caution_eat[k][i] = "데이터가 없습니다"
                        caution_reaction[k][i] = "데이터가 없습니다"
                        keep[k][i] = "데이터가 없습니다"
                    }
                }
        }
        }
 
    })
    
    await delay()
    return new Promise(function(resolve, reject){
        resolve([detail_info, name, company, effect, use, pre_condition, caution, caution_eat, caution_reaction, keep, image, item_name, classified_name, company_name, classfication])
    })
}

async function fileExist(file){
    while(file.length < 1){ // 파일이 없으면 대기
        file = fs.readdirSync('./output')
    }
    return new Promise(function(resolve, reject){
        resolve(file)
    })
}
app.post('/output', (req, res)=>{
    fileExist(file).then( () =>{
        console.log("file이 동기적으로 읽힘")
        fs.readFile('./output/serial_number.txt', 'utf-8', (err, data0)=>{
            if(err) throw err;
            data1 = JSON.parse(data0)
            getData(data1).then(function(data){
                res.write('<!DOCTYPE html>' +
                '<html><head><meta charset="utf-8"><title>알약 정보</title>' + 
                `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                 <link rel="preconnect" href="https://fonts.googleapis.com">
                 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                 <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet">
                `+
                '<style>' + 
                `   
                    body{
                        padding-top: 10px;
                        font-family: 'Noto Sans KR', sans-serif;
                    }

                    .material-symbols-outlined {
                        font-variation-settings:
                        'FILL' 0,
                        'wght' 400,
                        'GRAD' 0,
                        'opsz' 48
                    }
                
                
                    table{ 
                        margin-left: 9%;
                        margin-top: 10px; 
                        margin-bottom: 10px;
                        border-collapse: collapse;
                        border : 1px solid black;
                    }
                    td:nth-child(1){ 
                        width: 200px; 
                        padding-left: 10px; 
                        font-weight: bold; 
                        text-align: center;
                        background-color: #ced4da;
                    }
                    td:nth-child(2){ 
                        width: 1000px; 
                        padding: 5px 5px 5px 20px;
                    } 
                    td{
                        border-collapse: collapse;
                        border : 1px solid black;
                        margin-left : 10px;
                    } 
                    img{
                        display: block;
                        width: 300px;
                        height: 180px;
                        margin: 5px 5px 5px 5px;
                    }   
                    div.container{
                        margin-top: 30px;
                        margin-bottom: 25px;
                        margin-left: 8%;
                        overflow: hidden;
                        padding-left: 10px;
                    }
                    article{
                        float: left;
                    }
                    div.head{
                        text-align: center;
                    }
                    #btn_container{
                        position: fixed;
                        top: 25px;
                        right: 15px;
                    }

                ` + 
                '</style></head><body>' + 
                `</body></html>`
                )
                res.write(`        
                    <script class="jsbin" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>`)
                res.write(`<script> 
                    let check= 0;
                    function alyac_info(data, count1){
                        switch(count1){
                            case 'info0': document.getElementById('info0').innerHTML = data; break;
                            case 'info1': document.getElementById('info1').innerHTML = data; break;
                            case 'info2': document.getElementById('info2').innerHTML = data; break;
                            case 'info3': document.getElementById('info3').innerHTML = data; break;
                            case 'info4': document.getElementById('info4').innerHTML = data; break;
                        }
                    }
                </script>`)
                res.write(`
		            <script>
                        let basicFont = 15;
                        let class_font = document.getElementsByClassName("font");

                        function smaller(){    
                            basicFont -= 2;
                            if(basicFont < 10){
                                basicFont = 10;
                            }
                            for(let i=0; i < class_font.length; i++){
                                class_font[i].style.fontSize = basicFont + "px";
                            }
                        }
                        function bigger(){
                            basicFont += 5;
                            if(basicFont > 31){
                                basicFont = 30;
                            }
                            for(let i=0; i < class_font.length; i++){
                                class_font[i].style.fontSize = basicFont + "px";
                            }
                        }
                        function origin(){
                            basicFont = 15;
                            for(let i=0; i < class_font.length; i++){
                                class_font[i].style.fontSize = basicFont + "px";
                            }
                        }
                    </script>   
                
                
                `)    
                res.write(`<div id="btn_container"> 
                <button class="zoomOut" onclick="smaller()"><span class="material-symbols-outlined">remove</span></button>
                <button class="origin" onclick="origin()"><span class="material-symbols-outlined">autorenew</span></button>
                <button class="zoomIn" onclick="bigger()"><span class="material-symbols-outlined">add</span></button>
            </div>`)
                if(data[0][0][0].length === 1){
                    res.write("<div class='head'><h2>" + "1번째 알약과 유사한 알약을 찾아 클릭해주세요</h2></div>")
                    res.write("<div class='container'>")
                    for(let i = 0 ; i < data[0].length; i++){
                        if(data[0][i] === "true"){
                            text =  
                            "<table class=font border=1 >" + 
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
                            "<table class=font border=1 >" + 
                            "<tr><td>제품명</td><td>" + data[11][i] + "</td></tr>" +
                            "<tr><td>제조회사</td><td>" + data[13][i] + "</td></tr>" +
                            "<tr><td>분류명</td><td>" + data[12][i] + "</td></tr>" +
                            "<tr><td>전문일반구분</td><td>" + data[14][i] + "</td></tr>" + "</table>"
                            
                        }
                        if(data[10][i] === "데이터가 없습니다") continue; //이미지는 없고 알약 번호만 있으면 출력 x
                        count = "info0"
        
                        res.write('<article><img src = "' + data[10][i] +`" onclick='alyac_info("${text}", "${count}")'` + '></article>')
                                        
                    } 
                    res.write("</div>")  
                    res.write(`<div id= "${count}"></div>`)
                                
                }else{
                    for(var k = 0; k < data[0].length; k++){ // 알약이 총 몇개가 찍혔는지 나타냄
                    res.write("<div class='head'><h2>" + (k+1) + "번째 알약과 유사한 알약을 찾아 클릭해주세요</h2></div>")
                    res.write("<div class='container'>")
                    for(let i = 0 ; i < data[0][k].length; i++){
                        if(data[0][k][i] === "true"){
                            text =  
                            "<table class=font border=1 >" + 
                            "<tr ><td>제품명</td><td>" + data[1][k][i] + "</td></tr>" +
                            "<tr><td>제조회사</td><td>" + data[2][k][i] + "</td></tr>" +
                            "<tr><td>효능</td><td>" + data[3][k][i] + "</td></tr>" +
                            "<tr><td>섭취량 및 섭취방법</td><td>" + data[4][k][i] + "</td></tr>" +
                            "<tr><td>복용 전 주의사항</td><td>" + data[5][k][i] + "</td></tr>" +
                            "<tr><td>주의사항</td><td>" + data[6][k][i] + "</td></tr>" +
                            "<tr><td>섭취시 주의사항</td><td>" + data[7][k][i] + "</td></tr>" +
                            "<tr><td>부작용</td><td>" + data[8][k][i] + "</td></tr>" +
                            "<tr><td>보관방법</td><td>" + data[9][k][i] + "</td></tr>" + "</table>"
                            
                        }else{
                            text =  
                            "<table class=font border=1 >" + 
                            "<tr><td>제품명</td><td>" + data[11][k][i] + "</td></tr>" +
                            "<tr><td>제조회사</td><td>" + data[13][k][i] + "</td></tr>" +
                            "<tr><td>분류명</td><td>" + data[12][k][i] + "</td></tr>" +
                            "<tr><td>전문일반구분</td><td>" + data[14][k][i] + "</td></tr>" + "</table>"

                           
                        }
                        if(data[10][k][i] === "데이터가 없습니다") continue; //이미지는 없고 알약 번호만 있으면 출력 x
                        count = "info" + k
        
                        res.write('<article><img src = "' + data[10][k][i] +`" onclick='alyac_info("${text}", "${count}")'` + '></article>')
                                        
                    } 
                    res.write("</div>")  
                    res.write(`<div id= "${count}"></div>`)
                }
                }    
                
            })
        })
    }
    )   
})


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
    console.log("Web Server is running")
})


