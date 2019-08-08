var database;

$(function(){
	createDB();
});


function createDB()
{

database = openDatabase('bookmarker', '1.0', 'database for bookmark app', 10 * 1024 * 1024);
database.transaction(function (tx) {
 tx.executeSql('CREATE TABLE IF NOT EXISTS bookmark (id, name, type, url, parent_id, create_date)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS passwords (passwd, create_date)');
});
}
