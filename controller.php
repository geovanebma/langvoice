<?php
    header ('Content-type: text/html; charset=UTF-8');
    require_once("Sql.php");

    switch ($_POST["comando"]) {
        case 'listagem':
            $sql = new Sql();
            $query = "SELECT * FROM phases;";
            $dados = $sql->select($query);
            $dados["resultados"] = $sql->select($query);
            $dados["query"] = $query;
        break;
        case 'listar_por_id':
            $sql = new Sql();
            $query = "SELECT * FROM phases WHERE user = '{$_POST["user"]}' AND idioma = '{$_POST["idioma"]}' ORDER BY materia, tema ASC;";
            $dados["resultados"] = $sql->select($query);
            $dados["query"] = $query;
        break;
        case 'inserir':
            $sql = new Sql();
            
            for($i = 0; $i < count((array) $_POST["texto"]); $i++){
                $createdAt = date("Y-m-d H:i:s");
                
                $query = "INSERT INTO phases(materia, color, tema, idioma, texto, traducao, user, createdAt) VALUES ('".addslashes($_POST["materia"])."', '".addslashes($_POST["cor"])."', '".addslashes($_POST["tema"])."', '".addslashes($_POST["idioma"])."', '".$_POST["texto"][$i]."', '".$_POST["traducao"][$i]."', '".addslashes($_POST["user"])."', '".addslashes($createdAt)."')";
                $sql->query($query);
            }
            
            $dados["resultados"] = "OK";
            $dados["query"] = $query;
        break;
        case 'inserir2':
            $sql = new Sql();
            
            $query = $_POST["novos_dados"];
            
            $sql->query($query);
             
            $dados["resultados"] = "OK";
            $dados["query"] = $query;
        break;
        case 'remover':
            $sql = new Sql();
            $query = "UPDATE expressions SET texto '".$_POST["texto"]."' WHERE materia = '".$_POST["texto"]."' AND  tema = '".$_POST["tema"]."'";
            $sql->query($query);
            $dados["resultados"] = "OK";
            $dados["query"] = $query;
        break;
        case 'autoplay':
            $sql = new Sql();
            if($_POST['traduz']){
                $query = "SELECT texto, traducao FROM phases WHERE tema IN (".$_POST["temas"].") ORDER BY materia, tema ASC;";
            }else{
                $query = "SELECT texto FROM phases WHERE tema IN (".$_POST["temas"].")";
            }
            
            $dados["resultados"] = $sql->select($query);
            $dados["query"] = $query;
        break;
        default:
            # code...
        break;
    }
    
    echo json_encode($dados);
?>