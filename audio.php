<?php
    $path = "audios/";
    $diretorio = dir($path);
    
    $arrayArquivos = array();
    $arrayArquivos2 = array();

    while($arquivo = $diretorio -> read()){
        if($arquivo != "." && $arquivo != ".."){

            // $novo_arquivo = str_replace("#", "", $arquivo);
            // $novo_arquivo = str_replace(" ", "_", $arquivo);
            // $novo_arquivo = str_replace(".", "*", $arquivo);
            // rename($path.$arquivo, $path.$novo_arquivo);

            // print "\\".$path.$arquivo." => "."\\".$path.$novo_arquivo."<br>";

            $path2 = "audios/".$arquivo;
            $diretorio2 = dir($path2);
            
            $arrayArquivos2[$arquivo] = array();
            while($arquivo2 = $diretorio2 -> read()){
                if($arquivo2 != "." && $arquivo2 != ".."){
                    array_push($arrayArquivos2[$arquivo], $arquivo."/".$arquivo2);
                }
            }

            $diretorio2 -> close();
        }
    }
    
    $diretorio -> close();
?>
<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LangVoice</title>
        <link rel="stylesheet" href="tools/bootstrap.min.css">
        <script src="tools/jquery.min.js"></script>
        <script src="tools/bootstrap.min.js"></script>
        <script src="tools/icons.js"></script>
        <script src="tools/translate.min.js"></script>
        <script src="tools/howler.min.js"></script>
        <link rel="icon" type="imagem/png" href="img/logositeingles.png" />
        <style>
            #controlls{
                width: 100%;
                text-align:center;
            }
            #controlls div{
                display: inline-block;
                cursor:pointer;
            }

            .fa-undo{
                transform: scale(-1, 1);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <h3>Lista de Áudios por tema</h3>
                <div id="audios">
                    <!-- <audio controls id="play">
                        <source id="som" src="audios\01_Born_in_the_USA___Greetings\ttsMP3.com_VoiceText_2022-7-5_22_52_28.mp3" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio> -->
                    <br>
                    <div id="controlls">
                        <div class="stop" onclick="stop()">
                            <i class="fa fa-stop fa-2x"></i>
                        </div>
                        <div id="prevTrack" onclick="prevTrack()">
                            <i class="fa fa-step-backward fa-2x"></i>
                        </div>
                        <div class="playpause" onclick="Play()">
                            <i class="fa fa-play-circle fa-5x"></i>
                        </div>
                        <div class="nextTrack" onclick="nextTrack()">
                            <i class="fa fa-step-forward fa-2x"></i>
                        </div>
                        <div class="repeatTrack">
                            <i class="fa fa-undo fa-2x" ></i>
                        </div>
                    </div>
                </div>
                <div id="lista">
                    <ul class="list-group">
                        <?php foreach($arrayArquivos2 as $key=>$value): ?>
                            <li class="list-group-item">
                                <input type="checkbox" class="lista" id="lista<?=$key;?>" value="<?=$key;?>">
                                <label for="lista<?=$key;?>"><?=$key;?></label>
                                <input type="hidden" id="hidden<?=$key;?>" value="<?=implode("¢", $value);?>">
                            </li>
                        <?php endforeach;?>
                    </ul>
                </div>
            </div>
        </div>
    </body>
    <script>
        var updateTimer;
        let play = document.createElement('audio');
        play.preload = "metadata"
        var index = 0

        function Play(){
            var lista = $("#lista").find(".lista")
            var audios = []

            for (let i = 0; i < lista.length; i++) {
                const element = lista[i];
                
                if(element.checked){
                    console.log(element.value)
                    audios.push($("#hidden"+element.value).val())
                }
            }

            audios = audios.join('¢')
            audios = audios.split('¢')
            console.log(audios)
            
            play.src = "audios\\"+audios[index];
            
            play.onloadeddata = function(){
                audDuration = play.duration;
                play.play();
                console.dir(play)

                updateTimer = setInterval(function(){
                    if(play.ended){
                        index += 1

                        play.src = "audios\\"+audios[index];
                        
                        var audDuration;
                        play.onloadeddata = function(){
                            audDuration = play.duration;
                            play.play();
                        }
                        
                        if(index == audios.length-1){
                            index = 0
                        }
                    }
                }, 5000.000+audDuration);
            }
        }

        function stop(){
            clearInterval(updateTimer);
        }
    </script>
</html>