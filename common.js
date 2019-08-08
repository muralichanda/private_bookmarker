function $_GET(q,s) { 
	
    s = s ? s : window.location.search; 
    s = s.replace('?','');
    var array = s.split('&');
    for(var i=0;i<array.length;i++)
    {
    	if(array[i].split('=')[0] == q)
    	{
    		return array[i].split('=')[1];
    	}
    }

    return s.split('=')[1]; 
}

function loadParentId()
{
	var value = $_GET('parentid');
	value = (value == undefined) ? localStorage.getItem('defaultPageId') : value;
	value = (value != undefined) ? value : 0;
	$('#parentid').val(value)
}

function loadId()
{
	var value = $_GET('id');
	value = (value != undefined) ? value : 0;
	$('#id').val(value)
}

function loadPasswd()
{
	var value = $_GET('passwd');
	value = (value != undefined) ? value : 0;
	$('#id').val(value)
}

function navigateBackPage()
{
	window.location.href="home.html?parentid="+($('#parentid').val());
}

function navigateHomePage()
{
	window.location.href="home.html";
}

function navigatePrivateHomePage()
{
	window.location.href="home.html?parentid="+($('#parentid').val());//+"&passwd="+($('#password1').val());
}

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}
