var privateFolderFlag = false;
$(document).ready(function(){
	loadId();
	loadParentId();
	isPrivateFolder();
	loadValues();
	bindEvent();
});

function bindEvent()
{
	$('#backBtn').click(function() {
		navigateBackPage();
	});
	
	$('#cancelBtn').click(function() {
		navigateBackPage();
	});
	
	$('#saveBtn').click(function() {
		
		if(validateForm() == true)
		{
			saveBookmark();
			setInterval(function(){navigateBackPage()}, 200);
		}
		
	});
}

function loadValues()
{
	database.transaction(function (tx) {

		tx.executeSql('select * from bookmark where id=?',[parseInt($('#id').val())],function (tx, results1) {
			var name = results1.rows.item(0).name;
			var type = results1.rows.item(0).type;
			var url = results1.rows.item(0).url;
			
			
			if(privateFolderFlag == true)
		    {
				var password = sessionStorage.getItem('passwd')

				name = decrypt(name, password);
				url = decrypt(url, password);
				type = decrypt(type, password);
		    }
			
			$('#name').val(name);
			$('#type').html(type);

			if(type == 'bookmark')
			{
				$('#urlTR').show();
				$('#url').val(url);
			}
			else
			{
				$('#moveTR').show();
				//$('#url').val(url);
			}
			
		});
		
		tx.executeSql('select * from bookmark',[],function (tx, results1) {
		
			var k1 = results1.rows.length;
				
			for(var j=0;j<k1;j++)
			{
				var name = results1.rows.item(j).name;
				var id = results1.rows.item(j).id;
				var type = results1.rows.item(j).type;
				$("#moveToDropdown").append("<option id='"+id+"'>" + name  + "</option>");
			}
		
			
		});
	 
	});
}


function saveBookmark()
{
database.transaction(function (tx) {
	
	var name = $('#name').val();
	var url = $('#url').val();
	if(privateFolderFlag == true)
    {
		var password = sessionStorage.getItem('passwd')

		name = encrypt(name, password);
		url = encrypt(url, password);
    }
	
	
	tx.executeSql('update bookmark set name=?,url=? where id=?',[name,url,parseInt($('#id').val())],function (tx, results1) {
		alert('Updated successfully!');
	});
 
});
}
function isPrivateFolder()
{
	database.transaction(function (tx) {
		
		var id = 0;

		tx.executeSql('select type from bookmark where id=?',[parseInt($("#parentid").val())],function (tx, results1) {
			var type = results1.rows.item(0).type;
			
			privateFolderFlag =  (type=='private');
		});
		
	});
	
	return privateFolderFlag;
}

function validateForm()
{
	var name = $( "#name" ).val();
	var url = $( "#url" ).val();
	
	if(name == '')
	{
		alert('Please enter Name')
		return false;
	}
	else if($("#url").is(":visible") )
	{
		if(url == '')
		{
			alert('Please enter URL')
			return false;
		}
		else
		{
			if(!isUrl(url))
			{
				alert('Please enter valid URL');
				return false;
			}	
		}	
	}
	return true;
}

function encrypt(message,key)
{
	return CryptoJS.AES.encrypt(message, key);
}

function decrypt(message,key)
{
	return  CryptoJS.AES.decrypt(message,key).toString(CryptoJS.enc.Utf8);
}