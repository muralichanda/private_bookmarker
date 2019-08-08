var privateFlag= false;
var passwordSet = false;
var storedPassword = '';
$(document).ready(function(){
	loadPasswordFlag();
	getPassword();
	loadParentId();
	//loadSearchContent();
	
	loadContent();
	
});
function loadEvents()
{
	if(passwordSet)
	{
		$("#resetPasswdBtn").show();
		$("#setPasswdBtn").hide();
		
		$("#resetPasswdBtn").bind('click',function(){
			
			window.location.href="resetpasscode.html";
			return _this.next();
		})
		
	}
	else
	{
		$("#setPasswdBtn").show();
		$("#resetPasswdBtn").hide();
		
		$("#setPasswdBtn").bind('click',function(){
			
			window.location.href="passcode.html?parentid="+$('#parentid').val();
			return _this.next();
		})
	}	
	
	
	$(".folder").bind('click',function(){
		
		openFolder($(this).attr('id'));
		//return _this.next();
	})
	
	$(".private").bind('click',function(){
		
		var sessionPasswd = sessionStorage.getItem('passwd');
		
		if(sessionPasswd != null)
		{
			var password = decrypt(storedPassword, sessionPasswd);
			
			if(sessionPasswd == password)
			{
				window.location.href="home.html?parentid="+$(this).attr('id');
			}
			else
			{
				window.location.href="passcode.html?parentid="+$(this).attr('id');
			}
		}	
		else
		{
			window.location.href="passcode.html?parentid="+$(this).attr('id');
		}	
		
		return _this.next();
	})
	$(".bookmark").on('click',function(){
		
		var url = $(this).attr('url')
		if(url.indexOf('https://') != -1)
		{
			//leave it empty
		}
		else if(url.indexOf('http://') == -1)
		{
			url = 'http://'+url;
		}

		window.open(url);
		return _this.next();
	})
	
	$(".bookmark").bind("dragstart", function(){
		alert('drag start')
	});
	$(".bookmark").each(
		function()
		{
			var url = $(this).attr('url')
			if(url.indexOf('https://') != -1)
			{
				
			}
			else if(url.indexOf('http://') == -1)
			{
				url = 'http://'+url;
			}
			
			if(url.indexOf('uprr') != -1)
			{
				url = 'up.com';
			}
			
			$(this).attr("style","background-image:url('http://www.google.com/s2/favicons?domain="+url+"')");

		}
	);
	
	$(".additem").each(
		function()
		{
			$(this).click(function() {
				window.location.href="addbookmark.html?parentid="+($('#parentid').val());
				return _this.next();
			});
		}
	);
	
	$(".boxclose").each(
		function()
		{
			$(this).attr('title','Delete');
			$(this).click(function() {
				
				var r = confirm("Are you sure want to delete the folder?");
				if (r == true) {
					deleteBookmark($(this).parent().attr('id'));
					return false;
				} else {
					return false;
				}
				
			});
		}
	);
	
	$(".boxedit").each(
		function()
		{
			$(this).attr('title','Edit');
			$(this).click(function() {
				editBookark($(this).parent().attr('id'));
				return false;
			});
		}
	);
	
	if(parseInt($('#parentid').val()) == 0 )
	{
		$('#backBtn').hide();
	}
	else
	{
		$('#backBtn').show();
		$('#backBtn').click(function() {
			navigateBack();
			return _this.next();
		});
		
	}
	
	if(privateFlag == false)
	{
		$("#defaultPageCheck").attr('disabled',false);
		$("#defaultPageCheck").on('click',function(){
			
			if($("#defaultPageCheck:checked").val() == 'on')
			{
				localStorage.setItem('defaultPageId',$('#parentid').val());
			}
			else
			{
				localStorage.setItem('defaultPageId','0');
			}
			
			return _this.next();
		})
		
		if($('#parentid').val() == localStorage.getItem('defaultPageId'))
		{
			$("#defaultPageCheck").prop( "checked", true );
		}
		else
		{
			$("#defaultPageCheck").prop( "checked", false );
		}	
	}	
	else
	{
		$("#defaultPageCheck").attr('disabled',true);
	}
	
	
}
	
function openFolder(id)
{
	$('#parentid').val(id);
	loadContent();
}

function navigateBack()
{
	loadPreviousParentId();
	loadContent();
}

function loadSearchContent()
{
	 var availableTags = new Array();
	 database.transaction(function (tx) {

			tx.executeSql('select * from bookmark where type != "private"',[],function (tx, results1) {
				
				var k1 = results1.rows.length;
				
				for(var j=0;j<k1;j++)
				{
					var name = results1.rows.item(j).name;
					tx.executeSql('select name from bookmark where parent_id=?',[results1.rows.item(j).id+''],function (tx, results2) {
						var k = results2.rows.length;
						for(var i=0;i<k;i++)
						{
							availableTags[i] = results2.rows.item(i).name+"-"+name;
						}
						
						
					});
				}
				
			});
			
		});
	 setTimeout(function(){
		 
		 $( "#searchText" ).autocomplete({
		      source: availableTags
		 });
		 
	 },200);
	 
   
}

function loadContent()
{

database.transaction(function (tx) {
	var parentID = $("#parentid").val();
	$("#contentDIV").html("");
	
	isPrivateFolder(parentID);
	
	
	tx.executeSql('select * from bookmark where parent_id=? order by type desc',[parentID],function (tx, results1) {
		var k = results1.rows.length;
		setTimeout(function(){
		
			for(var i=0; i < k;i++)
			{
				
				var type = results1.rows.item(i).type;
				
				var id = results1.rows.item(i).id;
				var url = results1.rows.item(i).url;
				var name = results1.rows.item(i).name;
				if(privateFlag == true)
				{
					var password = sessionStorage.getItem('passwd')
					name = decrypt(name, password);
					url = decrypt(url, password);
					type = decrypt(type, password);
					
				}
				
				if(type == 'folder' || type == 'private')
				{
					$("#contentDIV").append("<div  class='"+type
					+"' id='"+id+"' url='"+url+"'><a class='boxedit'></a><a class='boxclose'></a>"
					+name+"</div>");	
				}
				else
				{
					$("#contentDIV").append("<div class='"+type
					+"' id='"+id+"' url='"+url+"'>"
					+"<a class='boxedit'></a><a class='boxclose'></a><div class='bookmarkLabel'>"+name+"</div></div>");
				}
				
			}	
		},200);
	});
 
});

setTimeout(function(){loadEvents()}, 300);
}

function loadPreviousParentId()
{
	database.transaction(function (tx) {
		var parentID = $("#parentid").val();

		tx.executeSql('select parent_id from bookmark where id=?',[parseInt(parentID)],function (tx, results1) {
			var k = results1.rows.length;

			if(k > 0)
			{
				$("#parentid").val(results1.rows.item(0).parent_id);
			}
		});
 
	});
}

function deleteBookmark(id)
{
	
	database.transaction(function (tx) {
		tx.executeSql('delete from bookmark where id=? or parent_id=?',[parseInt(id),id],function (tx, results1) {
			
		});
	});
	loadContent();	
}

function editBookark(id)
{
	window.location.href="editbookmark.html?id="+id+"&parentid="+$("#parentid").val();
}

function isPrivateFolder(id)
{

	database.transaction(function (tx) {
		
		tx.executeSql('select type from bookmark where id=?',[parseInt(id)],function (tx, results1) {
			var type = results1.rows.length > 0 ? results1.rows.item(0).type : 'folder';
			privateFlag =  (type=='private');
		});
		
	});
	
	return privateFlag;
}

function loadPasswordFlag()
{
	database.transaction(function (tx) {
		
		tx.executeSql('select count(passwd) count from passwords',[],function (tx, results1) {
			
			passwordSet =  results1.rows.item(0).count > 0 ? true : false;

			return passwordSet;
		});
		
	});	

	return passwordSet;
}

function getPassword()
{
	database.transaction(function (tx) {

		tx.executeSql('select passwd from passwords',[],function (tx, results1) {
			
			storedPassword = results1.rows.length > 0 ? results1.rows.item(0).passwd : '';

		});
	 
	});	
}

function encrypt(message,key)
{
	return CryptoJS.AES.encrypt(message, key);
}

function decrypt(message,key)
{
	return  CryptoJS.AES.decrypt(message,key).toString(CryptoJS.enc.Utf8);
}