<?php 

class Sql extends PDO {

	private $conn;

	public function __construct(){
		try {
			$dsn = "mysql:dbname=id18608326_langdatabase;host=localhost";
			$user = "id18608326_geodatabase";
			$pass = "Thunderstorm*25";
			$this->conn = new PDO($dsn, $user, $pass);
		} catch (PDOException $e) {
			print "Error!: " . $e->getMessage() . "<br/>";
			die();
		}
	}

	private function setParams($statement, $parameters = array()){

		foreach ($parameters as $key => $value) {
			
			$this->setParam($statement, $key, $value);

		}

	}

	private function setParam($statement, $key, $value){

		$statement->bindParam($key, $value);

	}

	public function query($rawQuery, $params = array()){

		$stmt = $this->conn->prepare($rawQuery);

		$this->setParams($stmt, $params);

		try {
			$stmt->execute();
		} catch (\Throwable $th) {
			throw $th;
		}

		return $stmt;

	}

	public function select($rawQuery, $params = array()):array
	{

		$stmt = $this->query($rawQuery, $params);

		return $stmt->fetchAll(PDO::FETCH_ASSOC);

	}

}

 ?>