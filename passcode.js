var passwordFlag = false;
var password = '';
$(document).ready(function(){
	loadPasswordFlag();
	setTimeout(function(){
		loadId();
		loadParentId();
		renderComponents();
		bindEvent();
	
	},200);
});

function renderComponents()
{

	if(passwordFlag == true)
	{
		$('#loginTable').show();
	}
	else
	{
		$('#registerTable').show();
	}
}

function bindEvent()
{
	$('#backBtn').click(function() {
		navigateHomePage();
	});
	
	$('#cancelBtn1').click(function() {
		navigateHomePage();
	});
	
	$('#cancelBtn2').click(function() {
		navigateHomePage();
	});
	
	$('#saveBtn').click(function() {
		
		if(validateForm() == true)
		{
			var enteredPasswd = $('#password2').val();
			var reEnteredPassword = $('#rePassword').val();
			if(enteredPasswd == reEnteredPassword)
			{
				savePassword();
				setTimeout(function(){
					sessionStorage.setItem("passwd", enteredPasswd);
					navigatePrivateHomePage();
				},200);
			}
			else
			{
				alert('Passwords does not match!')
			}	
		}	
		
		
		
	});
	
	$('#loginBtn').click(function() {
		if(validateForm() == true)
		{
			getPassword()
			setTimeout(function(){
				var enteredPasswd = $('#password1').val();
				var decrypted = decrypt(password, enteredPasswd);
				
				if(enteredPasswd == decrypted)
				{
					sessionStorage.setItem("passwd", enteredPasswd);
					navigatePrivateHomePage();
				}	
				else
				{
					alert('Invalid password.')
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
		var passwd = $('#password2').val();
		password = encrypt(passwd,passwd);

		tx.executeSql('insert into passwords(passwd) values(?)',[password],function (tx, results1) {
			alert('passwod saved')
			return password;
		});
	 
	});
}

function validateForm()
{
	if($('#loginTable').is(":visible"))
	{
		var password1 = $( "#password1" ).val();
		if(password1 == '')
		{
			alert('Please enter Password')
			return false;
		}
	}	
	else
	{
		var newpassword = $( "#password2" ).val();
		var rePassword = $( "#rePassword" ).val();
		
		if(newpassword == '')
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