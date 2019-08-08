var privateFolderFlag = false;
$(document).ready(function(){
	loadParentId();
	loadPasswd();
	isPrivateFolder();
	setTimeout(function(){
		bindEvent();	
	},100);
	
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
			addBookmark();
			
			setInterval(function(){navigateBackPage()}, 200);
		}	
		
	});
	
	$('input:radio').change(function () {
       var selectedVal = $("input:radio:checked").val();
       if(selectedVal=='bookmark')
       {
    	   $('#urlTR').show();
       }
       else
       {
    	   $('#urlTR').hide();
       }
	});
	
	if(privateFolderFlag)
	{
		jQuery("input[name=type]:radio:first").attr('disabled',true);
	}
}

function addBookmark()
{
database.transaction(function (tx) {
	
 var id = 0;

	tx.executeSql('select max(id) count from bookmark',[],function (tx, results1) {
		id = results1.rows.item(0).count;
		id = id + 1;
		
		
		var name = $( "#name" ).val();
		var url = $( "#url" ).val();
		var type = $('input:radio[name="type"]:checked').val();
		
		if(privateFolderFlag)
	    {
			
			var password = sessionStorage.getItem('passwd')

			name = encrypt(name, password);
			url = encrypt(url, password);
			type = encrypt(type, password);
	    }	   
		
		database.transaction(function (tx1) 
		{
			tx1.executeSql('INSERT INTO bookmark (id, name, type, url, parent_id) VALUES(?,?,?,?,?)', 
					[id, name, type, url,$("#parentid").val()]);
		});
	
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
	var type = $('input:radio[name="type"]:checked').val();
	
	if(name == '')
	{
		alert('Please enter Name')
		return false;
	}
	else if(type==undefined)
	{
		alert('Please select Type')
		return false;
	}
	else if(type == 'bookmark')
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

