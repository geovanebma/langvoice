const utterance = new SpeechSynthesisUtterance()

const setTextmessage = (text, name) => {
    utterance.text = text
    console.log(utterance.text)
    
    if(name){
        setVoice(name)
    }
}

const speakText = () => {
    speechSynthesis.speak(utterance)
}

const pauseText = () => {
    speechSynthesis.pause(utterance)
}

const cancelText = () => {
    speechSynthesis.cancel(utterance)
}

const falar = (text) => {
    setTextmessage(text)
    speakText()
}

const falar2 = (text, name) => {
    setTextmessage(text, name)
    speakText()
}

//Tipos de vozes/idiomas no select
var voices = []

speechSynthesis.addEventListener('voiceschanged', () => {
    voices = speechSynthesis.getVoices()
    
    const usVoice = voices.find((voice) => voice.name === "Google US English")

    var options = ``
    
    voices.forEach(({name, lang}) => {
        if(usVoice && name === usVoice.name){
            options += `<option value='${name}' lang='${lang}' selected>${lang} - ${name}</option>`
            setVoice(name)
            $("#lang").val(lang)
        }else{
            options += `<option value='${name}' lang='${lang}'>${lang} - ${name}</option>`
            $("#lang").val(lang)
        }
    })

    //Se quiser ver todos os idiomas disponíveis, descomente essa linha
    //$("#selectIdioma").html(options) 
})

function removerInputText(id){
    $("#divText"+id).remove()
}

function idioma(idioma){
    $("#idioma").val(idioma)
}

function remove(id, key, ke){
    $("#"+id).remove()
    
    var find = $("#expression-box"+key).find(".row").find(".text")
    var textos = []
    for(i=0; i<find.length;i++){
        
        const element = $(find[i]).text().replaceAll("'", "¢");

        if(element){
            textos.push(element)
        }
    }
    
    textos = textos.join("§")
    
    
    
    
    /*$.ajax({
        url:"controller.php",
        async:false,
        method:"post",
        data:{"comando":"remover"},
        error:function(erro){
            console.log(erro)
        },
        success: function(data){
            console.log(data)
        }
    })*/
}

function listarPorId(){
    var lang = $("#lang").val()
    
    if(lang.indexOf("_") !== -1){
        lang = lang.replaceAll("_", "-")
    }
    
    $.ajax({
        url:"controller.php",
        async:false,
        method:"post",
        data:{"comando":"listar_por_id", "user":"giclesb7@gmail.com", "idioma":lang},
        error:function(erro){
            console.log(erro)
        },
        success: function(data){
            data = JSON.parse(data)
            console.log(data)

            var phases = {}
            if(data.resultados.length){
                var novos_dados = []
                
                for (let i = 0; i < data.resultados.length; i++) {
                    const element = data.resultados[i];
                    var texto = element.texto.replaceAll("¢", "'");
                    
                    if(!phases[element.materia]){
                        phases[element.materia] = {}
                    }
                    
                    if(!phases[element.materia][element.tema]){
                        phases[element.materia][element.tema] = []
                    }
                    
                    phases[element.materia][element.tema].push(texto)
                }

                var divb = ""
                var cont = 0;
                var cont2 = 0
                var qtdWords = []
                var selectMatter = []

                for (var [key, value] of Object.entries(phases)) {
                    selectMatter.push([data.resultados[cont2].materia, key])
                    divb += `
                        <ul class='menu' id="menu${cont}" cont='${cont}' style='color: ${data.resultados[cont2].color};' materia='${data.resultados[cont2].materia}'>
                            <h3 class='matter' cont='${cont}' id="matter${cont}" style='color: ${data.resultados[cont2].color};' onclick='matter(${cont})'>
                                <input type="checkbox" class='form-check-input inline' titulo='${cont}' id="titulo${cont}" onclick='findSubtitles(${cont})'>
                                <i class='fa fa-chevron-right inline' style='color: ${data.resultados[cont2].color};'></i>
                                ${key}
                            </h3>
                            <li class='expression-box' id='expression-box${cont}'>
                    `
                    var i = 0
                    for (var [ke, val] of Object.entries(value)) {
                        
                        var contn = (cont < 10)?"0"+cont:cont
                        var intn = (i < 10)?"0"+i:i
                        
                        divb += `
                            <ul class='themes inline' id='themes${i}'>
                                <li class='table-phases'>
                                    <h4 class='theme' cont='${contn+""+intn}' id='theme${contn+""+intn}' onclick='theme("${contn+""+intn}")' style='color: ${data.resultados[cont2].color};'>
                                        <input type="checkbox" class='form-check-input autoplayList inline' id='subtitulo${cont}${cont2}' tema='${ke}'>
                                        <i class='fa fa-chevron-right inline' style='color: ${data.resultados[cont2].color};'></i>
                                        ${ke}
                                    </h4>
                                    <ul id='ul${contn+""+intn}' cont='${contn+""+intn}' class='ul'>
                        `
                        
                        for (var [k, v] of Object.entries(val)) {
                            var voz = v.replaceAll("'", "\\&apos;")

                            var splitWord = v.split(" ")
                            for (let b = 0; b < splitWord.length; b++) {
                                const element = splitWord[b];
                                qtdWords.push(element)
                            }

                            divb += `
                                    <li class='row' id='textRow${cont2+""+k}'>
                                        <div class='col-sm-9'>
                                            <p class='text inline'>${v}</p>
                                            <p class='textTradA' id='textTad${cont2+""+k}'></p>
                                        </div>
                                        <div class='col-sm-3 center'>
                                            <i class='fa fa-play-circle play inline' onclick='falar("${voz}")' style='color: ${data.resultados[cont2].color};'></i>
                                            <i class='fa fa-eye inline play' id='eye${cont2+""+k}' onclick='trad("${voz}", "textTad${cont2+""+k}", "eye${cont2+""+k}")' style='color: ${data.resultados[cont2].color};'></i>
                                            <i class='fas fa-pen-alt inline play' onclick='' style='color: ${data.resultados[cont2].color};'></i>
                                            <i class='far fa-trash-alt inline play' onclick='remove("textRow${cont2+""+k}", "${cont}", "${i}")' style='color: ${data.resultados[cont2].color};'></i>
                                        </div>
                                    </li>
                                `
                                cont2++;
                        }
                        divb += `
                                    </ul>
                                </li>
                            </ul>
                        `
                        i += 1;
                        
                    }
                    divb += `
                            </li>
                        </ul>
                        `
                    cont += 1;
                }
                qtdWords = [...new Set(qtdWords)];

                $("main").html(divb)
                $("footer p").text("A quantidade aproximada de palavras diferentes é de "+qtdWords.length+".")
            }else{
                var msg = `
                <div class="alert alert-warning" role="alert">
                    Não foram encontrados resultados para o idioma selecionado.  
                </div>
                `
                $("main").html(msg)
            }

            

            selectMatter = [...new Set(selectMatter)]
            var optionsColors = ``
            
            for (let i = 0; i < selectMatter.length; i++) {
                const element = selectMatter[i];
                optionsColors += `<option value="${element[0]}" style="color: ${element[0]}; font-weight: bold;" selected>${element[1]}</option>`
            }

            $("#selectMatter").html(optionsColors)
        }
    })
}

listarPorId();

function autoSelect(){
    var lang = $("#lang").val()
    
    if(lang.indexOf("_") != -1){
        lang = lang.replaceAll("_", "-")
    }
    
    $.ajax({
        url:"controller.php",
        async:false,
        method:"post",
        data:{"comando":"listar_por_id", "user":"giclesb7@gmail.com", "idioma":lang},
        error:function(erro){
            console.log(erro)
        },
        success: function(data){
            data = JSON.parse(data)

            var phases = {}
            if(data.resultados.length){
                for (let i = 0; i < data.resultados.length; i++) {
                    const element = data.resultados[i];
                    
                    if(!phases[element.materia]){
                        phases[element.materia] = {}
                    }
                    
                    if(!phases[element.materia][element.tema]){
                        phases[element.materia][element.tema] = []
                    }

                    phases[element.materia][element.tema].push(element.texto.replaceAll("¢", "'"))
                }

                var autodiv = ""
                var cont = 0;
                var cont2 = 0;

                for (var [key, value] of Object.entries(phases)) {
                    autodiv += `
                        <input type="checkbox" class='form-check-input' titulo='${cont}' id="titulo${cont}" onclick='findSubtitles(${cont})'>
                        <label for="titulo${cont}" class="form-check-label" style='color: ${data.resultados[cont2].color};'>${key}</label>
                        <br>
                        <div id="divTitulos${cont}" class="divTitulos">
                    `
                    
                    for (var [ke, val] of Object.entries(value)) {
                        autodiv += `
                            <div class='subtitulos'>
                                &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" class='form-check-input autoplayList' id='subtitulo${cont}${cont2}' tema='${ke}'>
                                <label for="subtitulo${cont}${cont2}" class="form-check-label" style='color: ${data.resultados[cont2].color};'>${ke}</label>
                            </div>
                        `
                        
                        for (var [k, v] of Object.entries(val)){
                            cont2 += 1;
                        }
                    }
                    
                    autodiv += `</div>`
                    cont += 1;
                }
                
                $("#autoDiv").html(autodiv)
            }else{
                var msg = `
                <div class="alert alert-warning" role="alert">
                    Não foram encontrados resultados para o idioma selecionado.  
                </div>
                `
                $("#autoDiv").html(msg)
            }
        }
    })
}

function inserir(){
    var qtdTextos = parseInt($("#qtdTextos").val())

    var traducao = []
    var textos = []
    
    for (let index = 0; index <= qtdTextos; index++) {
        const newText = $("#newText"+index).val()
        const trad = $("#newText"+index).attr('trad')
        
        if(newText){
            const element = newText.replaceAll("'", "¢");

            if(element){
                textos.push(element)
                traducao.push(trad)
            }
        }
    }
    
    var conf = 0
    
    var materia = $("#materia").val()
    var cor = $("#favcolor").val()
    var tema = $("#tema").val()
    var idioma = $("#idioma").val()
    var user = "giclesb7@gmail.com"
    
    if(idioma.indexOf("_") !== -1){
        idioma = idioma.replaceAll("_", "-")
    }
    
    console.log({"comando":"inserir", materia:materia, cor:cor, tema:tema, idioma:idioma, texto:textos, traducao:traducao, user:user})
    
    if(traducao.length > 0){
        $.ajax({
            url:"controller.php",
            async:false,
            method:"post",
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            dataType: 'json',
            data:{"comando":"inserir", materia:materia, cor:cor, tema:tema, idioma:idioma, texto:textos, traducao:traducao, user:user},
            error:function(erro){
                console.log(erro)
            },
            success: function(data){
                if(data.resultados == "OK"){
                    alert("Dados inseridos com sucesso.");
                    document.location.reload(true);
                }
            }
        })
        
        conf++;
    }
}

function autoPlay(){
    
    var autoplayList = $(".autoplayList")
    var listaPlay = []
    
    for(i=0;i<autoplayList.length;i++){
        if($(autoplayList[i]).is(":checked")){
            listaPlay.push("'"+$(autoplayList[i]).attr('tema')+"'")
        }
    }
    
    if(listaPlay.length > 0){
        listaPlay = listaPlay.join(', ')
        
        var traduz = $("#traduz").is(":checked")
        
        $.ajax({
            url:"controller.php",
            async:false,
            method:"post",
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            dataType: 'json',
            data:{"comando":"autoplay", "temas":listaPlay, "traduz":traduz},
            success:function(data){
                if($("#autoPlay").hasClass('fa-play-circle')){
                    $("#autoPlay").removeClass('fa-play-circle')
                    $("#autoPlay").addClass('fa-pause-circle')
                    
                    var resultados = data.resultados
                    console.log(resultados)
                    var vozes = []
                    
                    for(i=0;i<resultados.length;i++){
                        var texto = resultados[i].texto
                        var traducao = resultados[i].traducao
                        
                        vozes.push([texto, "Google US English", "en-US"])
                        
                        if(traduz && resultados[i].traducao){
                            vozes.push([traducao, "Microsoft Daniel - Portuguese (Brazil)", "pt-BR"])
                        }
                    }
                    
                    console.log(vozes)
                    
                    var j = 0
                    falar2(vozes[j][0], vozes[j][1])
                
                    var meuInterval = setInterval(() => {
                        if(j < vozes.length-1){
                            j++
                            falar2(vozes[j][0], vozes[j][1])
                        }else{
                            if($("#repetir").is(":checked")){
                                j = -1
                            }else{
                                $("#autoPlay").removeClass('fa-pause-circle')
                                $("#autoPlay").addClass('fa-play-circle')
                                clearInterval(meuInterval);    
                            }
                        }
                    }, 5000);
                }else{
                    $("#autoPlay").removeClass('fa-pause-circle')
                    $("#autoPlay").addClass('fa-play-circle')
                    pauseText()
                }
            },
            error:function(erro){
                console.log(erro)
            }
        })
    }else{
        alert("SelecioneSelecione quais títulos você gostaria de ouvir automáticamente primeiro.");
    }
}

// listarPorId();

const setVoice = (idioma) => {
    if(idioma.indexOf("_") != -1){
        idioma = idioma.replaceAll("_", "-")
    }
    
    utterance.voice = voices.find(voice => voice.name === idioma)
}

$("#selectIdioma").on("change", function(){
    setVoice($(this).val())

    voices = speechSynthesis.getVoices()
    const usVoice = voices.find((voice) => {
        if(voice.name === $(this).val()){
            $("#lang").val(voice.lang)
        }
    })

    listarPorId();
    $("#selectMatter").val("")
})

function findSubtitles(id){
    if($("#titulo"+id+"").is(":checked")){
        
        $("#expression-box"+id).find('input:checkbox').prop('checked', true);
    }else{
        $("#expression-box"+id).find('input:checkbox').prop('checked', false);
    }
}

//abrindo cada modo
// function matter(this){
//     $("#expression-box"+$(this).attr('cont')).slideToggle(500)
//     console.log($(this).prop('open'))
    
//     if($(this).prop('open') == "0" || !$(this).prop('open')){
//         $(this).find('i').css("transform", "rotate(90deg)")    
//         $(this).prop('open', 1)
//     }else{
//         $(this).find('i').css("transform", "rotate(0deg)")
//         $(this).prop('open', "0")
//     }
// }


async function trad(phase, id, eye){
    if($("#"+id).hasClass("textTradA")){
        var t = await translate(phase, { to: "pt" });
        $("#"+id).text(t).removeClass("textTradA").addClass("textTradB")
        $("#"+eye).removeClass("fa-eye").addClass("fa-eye-slash")
    }else{
        $("#"+id).removeClass("textTradB").addClass("textTradA")
        $("#"+eye).removeClass("fa-eye-slash").addClass("fa-eye")
    }
}

async function trad2(phase, id, eye){
    var t = await translate(phase, { to: "pt" });
    
    return t;
}

async function trad3(id){
    var phase = $("#newText"+id).val()
    var t = await translate(phase, { to: "pt" });
    
    $("#newText"+id).attr("trad", t)
}



function addTextos(){
    var qtd = parseInt($("#qtdTextos").val())

    var input = `
        <div class="" id="divText${qtd+1}">
            <input type="text" class="form-control inputT inline" id="newText${qtd+1}" name="newText${qtd+1}" placeholder="Insira o texto a ser lido..." onmouseout="trad3(${qtd+1})" trad="">
            <input type="button" class="btnT btn btn-danger btn-sm inline" value="Remover" onclick="removerInputText('${qtd+1}')"><br>
            <br>
        </div>
    `
    
    $("#divTextos").append(input)
    $("#qtdTextos").val(qtd+1)
}

function matter(id){
    $("#expression-box"+id).slideToggle(500)
    
    if($("#matter"+id).prop('open') == "0" || !$("#matter"+id).prop('open')){
        $("#matter"+id).find('i').css("transform", "rotate(90deg)")    
        $("#matter"+id).prop('open', 1)
    }else{
        $("#matter"+id).find('i').css("transform", "rotate(0deg)")
        $("#matter"+id).prop('open', "0")
    }
}

function theme(id){
    $("#ul"+id).slideToggle(500)
    console.log($("#ul"+id), "ul"+id)
    
    if($("#theme"+id).prop('open') == "0" || !$("#theme"+id).prop('open')){
        $("#theme"+id).find('i').css("transform", "rotate(90deg)")    
        $("#theme"+id).prop('open', 1)
    }else{
        $("#theme"+id).find('i').css("transform", "rotate(0deg)")
        $("#theme"+id).prop('open', "0")
    }
}

$("#selectMatter").on("change", function(){
    if($("#selectMatter").val()){
        var menu = $(".menu")

        for (let i = 0; i < menu.length; i++) {
            var element = menu[i];
            var cor = $(element).attr("materia")
    
            if($("#selectMatter").val().indexOf(cor) != -1){
                $(element).css("display", "block")
            }else{
                $(element).css("display", "none")
            }
        }
    }
})

var ExcelToJSON = function() {

    this.parseExcel = function(file) {
      var reader = new FileReader();
      var json_parse = {}

      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });

        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          var json_object = JSON.stringify(XL_row_object);
          json_parse = JSON.parse(json_object);
          inserirDados(json_parse, file)
          jQuery( '#xlx_json' ).val( json_object );
        })
      };

      reader.onerror = function(ex) {
        console.log(ex);
      };

      reader.readAsBinaryString(file);
    };
};

function handleFileSelect() {
  var files = $("#file");
  files = files[0].files // FileList object
  var extension = files[0].name.split('.')[1]
  

  if(extension == 'json'){
    var importedFile = document.getElementById('file').files[0];
    var reader = new FileReader();

    reader.onload = function() {
      var fileContent = JSON.parse(reader.result)
    //   inserirDados(fileContent, files[0].name)
    }

    reader.readAsText(importedFile); 
  }else if(extension == 'xlsx' || extension == 'xls'){
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
  }else{
    Swal.fire({
        title: '<strong>O tipo de dado informado é inválido.</strong>',
        icon: 'info',
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Ok',
      }).then((result) => {            
        $("#file").val('')
      })
  }
}

// if($("article").height() > 400){
//     $("article").css("overflow-y", "scroll")
// }

//memhack
// var titulo = document.getElementsByClassName("conZMt");
// titulo = titulo[0].innerText
// var materia = titulo[0];
// var tema = titulo[1];
// var collection = document.getElementsByClassName("faSVdd");
// var colecao = document.getElementsByClassName("iOfRtW");
// var objeto = {"materia":materia,"tema":tema, "frases":[]}
// for(i = 0; i < colecao.length; i++){objeto.frases.push({"phase":collection[i].innerText, "traducao":colecao[i].innerText})}
//console.log(objeto)
//