var passwordFlag = false;
var password = '';
$(document).ready(function(){
	bindEvent();
});

function bindEvent()
{
	$('#backBtn').click(function() {
		navigateHomePage();
	});
	
	$('#cancelBtn').click(function() {
		navigateHomePage();
	});
	
	$('#saveBtn').click(function() {
		if(validateForm() == true)
		{
			getPassword();
			
			setTimeout(function(){
				var oldpassword = $('#oldpassword').val();
				var decrypted = decrypt(password, oldpassword);
				if(oldpassword == decrypted)
				{
					var newpassword = $('#newpassword').val();
					var rePassword = $('#rePassword').val();
					if(newpassword == rePassword)
					{
						savePassword();
						resetEncryptedData();
						setTimeout(function(){
							alert('All bookmarks encrypted with new password successfully!')
							sessionStorage.setItem("passwd", newpassword);
							navigateHomePage();
						},200);
					}
					else
					{
						alert('Passwords does not match!')
					}
				}
				else
				{
					alert('Please enter valid password!')
				}	
			},200);
		}	
		
		
	});

}

function loadPasswordFlag()
{
	database.transaction(function (tx) {
		
		tx.executeSql('select count(passwd) count from passwords',[],function (tx, results1) {
			
			passwordFlag =  results1.rows.item(0).count > 0 ? true : false;

			return passwordFlag;
		});
		
	});	

	return passwordFlag;
}

function getPassword()
{
	database.transaction(function (tx) {

		tx.executeSql('select passwd from passwords',[],function (tx, results1) {
			
			password = results1.rows.length > 0 ? results1.rows.item(0).passwd : '';

		});
	 
	});	
}

function savePassword()
{
	database.transaction(function (tx) {
		var passwd = $('#newpassword').val();
		password = encrypt(passwd,passwd);

		tx.executeSql('delete from passwords',[],function (tx, results1) {
			
		});
		tx.executeSql('insert into passwords(passwd) values(?)',[password],function (tx, results1) {
			alert('passwod saved')
			return password;
		});
	 
	});
}

function resetEncryptedData()
{
	database.transaction(function (tx) {
		var newpasswd = $('#newpassword').val();
		var oldpasswd = $('#oldpassword').val();

		tx.executeSql('select id from bookmark where type="private"',[],function (tx, results1) {
			
			tx.executeSql('select * from bookmark where parent_id=?',[results1.rows.item(0).id+''],function (tx, results2) {
				var k = results2.rows.length;
				for(var i=0; i < k;i++)
				{
					var id = results2.rows.item(i).id;
					var type = results2.rows.item(i).type;
					var url = results2.rows.item(i).url;
					var name = results2.rows.item(i).name;
					
					name = decrypt(name, oldpasswd);
					type = decrypt(type, oldpasswd);
					url = decrypt(url, oldpasswd);
					
					name =  encrypt(name, newpasswd);
					type =  encrypt(type, newpasswd);
					url =  encrypt(url, newpasswd);
					
					tx.executeSql('update bookmark set name=?,url=?,type=? where id=?',[name,url,type,id],function (tx, results1) {
						
					});
				}
				
				
			});
		});
		
	});
}

function validateForm()
{
	var oldpassword = $( "#oldpassword" ).val();
	var newpassword = $( "#newpassword" ).val();
	var rePassword = $( "#rePassword" ).val();
	
	if(oldpassword == '')
	{
		alert('Please enter Old Password')
		return false;
	}
	else if(newpassword == '')
	{
		alert('Please enter New Password')
		return false;
	}
	else if(rePassword == '')
	{
		alert('Please enter Re Password')
		return false;
	}
	else if(rePassword != newpassword)
	{
		alert('Passwords does not match')
		return false;
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