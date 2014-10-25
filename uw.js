/*
 * uw.Library
 * Version 1.1 (25/10/2014)
 * Copyright 2014 Kajetan Hryńczuk and Damian Sobkowiak.  
 * All Rights Reserved.  
 * Use, reproduction, distribution, and modification of this code is subject to the terms and 
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Author: Kajetan Hryńczuk and Damian Sobkowiak
 * Project: https://github.com/unpxre/uw.Library
 */
 
 
 
 


/////////////////////////////////////////////   UNPXRE GALLERY   /////////////////////////////////////////////


$(document).ready(function() 
{
	//ustaiwnie anhorow na wywolanie funkcji pokazujacej powiekszone zdj  
	$('.uw_photo').each(function(i, val) 
	{
		$(this).addClass('uw_photo_index_'+i).parent().attr('orgin_href', $(this).parent().attr('href')).attr('href', 'javascript:uw_photo("'+$(this).parent().attr('href')+'", '+i+');');  
	});   

	//utworzenie divow dla kontenera ze zdj i kurtyny
	$('body').append('<div id="uw_photo_curtain" class="dn"> <i class="fa fa-spinner fa-spin fs36 " style="color: #fff; z-index: 999; left: 50%; top: 50%; position: fixed;"></i> </div>'
		+' <div id="uw_photo_box" class="dn"> <img src="">  <nav class="uw_fillpath"><a class="prev" href=""><span class="uw_ico_wrap"></span></a><a class="next" href=""><span class="uw_ico_wrap"></span></a></nav>'
		+' <h3></h3> <div id="uw_close_gallery"></div> <a href="" target="_blank"><div id="uw_max_photo"></div></a> </div> </div>');
	
	
	//oblusga zamkniecia okna
	$('#uw_photo_curtain, #uw_close_gallery').click(function(){ $('#uw_photo_box, #uw_photo_curtain').addClass('dn'); $('#uw_photo_curtain i').removeClass('dn');  });
	
	//zmiena wielkosci podczas resize, poniewaz zdj moze byc za duze
	$( window ).resize(function() 
	{
		var h=document.querySelector('#uw_photo_box img').naturalHeight;
		var w=document.querySelector('#uw_photo_box img').naturalWidth;
		var x=parseInt($( window ).width()*0.9);
		var y=parseInt($( window ).height()-80);
		//zmiejsznie wartosci jesli sa wieksze niz okno
		while ( (h>y) || (w>x) )  { h=parseInt(h*0.9); w=parseInt(w*0.9); }
		
		
		$('#uw_photo_box').css('marginTop', ('-'+parseInt(h/2+25))+'px').css('marginLeft', ('-'+parseInt(w/2+10))+'px');
		//$('#uw_photo_box img').css('width', w+'px').css('height', h+'px');  //zastapione CSSEM
		$('#uw_photo_box').css('width', (w+20)+'px').css('height', (h+50)+'px');
	});
	
	
	//gdy drzewko DOM zostanie zmienine -> zostana dodane nowe elemnty dynamicznie
	var uw_photo_block_ref=false;
	$("body").on("DOMSubtreeModified", function() 
	{
		if(!uw_photo_block_ref)
		{
			uw_photo_block_ref=true;
			setTimeout(function()
			{ 
				uw_photo_block_ref=false;
				$('.uw_photo').each(function(i, val) { $(this).parent().attr('href', $(this).parent().attr('orgin_href')).attr('orgin_href', '');  });
				$('.uw_photo').each(function(i, val) 
				{
					$(this).addClass('uw_photo_index_'+i).parent().attr('orgin_href', $(this).parent().attr('href')).attr('href', 'javascript:uw_photo("'+$(this).parent().attr('href')+'", '+i+');');  
				}); 
			}, 200);
		}
	});
	
	//klikniecie srodkowym przyciskiem
	$('a').mousedown(function(e)
	{
    if( (e.which==2) && ($(this).children().hasClass('uw_photo')) )
    {
			e.preventDefault();
			window.open($(this).attr('orgin_href'));  
			return false;
    }
    return true;// to allow the browser to know that we handled it.
	});
	
});

//obsluga klawiatury
$(document).keydown(function(e) 
{
	if(!$('#uw_photo_box, #uw_photo_curtain').hasClass('dn'))
	{
		switch(e.which)
		{
			case 37: eval($('.uw_fillpath .prev').attr('href').replace('javascript:', '')); break;
			case 39: eval($('.uw_fillpath .next').attr('href').replace('javascript:', '')); break;
			case 27: $('#uw_photo_box, #uw_photo_curtain').addClass('dn'); $('#uw_photo_curtain i').removeClass('dn');  break;
			default: return; //wyjscie zeby nie doszlo do zablokowania akcji domyslnej
		}
		e.preventDefault(); //zablokowanie wykonania akcji domyslnej
	}
});


//funkcja pokazujaca zdj
function uw_photo(src, index)
{
	//wyzerowanie wielkosci zdjecia zeby ladnie wyglada poznijsza animacja narysowania go
	if($('#uw_photo_box, #uw_photo_curtain').hasClass('dn'))
	{
		$('#uw_photo_box').css('marginTop', '0px').css('marginLeft', '0px').css('width', '0px').css('height', '0px');
		//$('#uw_photo_box img').css('width', '0px').css('height','0px'); //zastapione CSSEM
	}
	//pokazanie kurtyny zanimacja
	if($('#uw_photo_box, #uw_photo_curtain').hasClass('dn')) $('#uw_photo_curtain').css('opacity', '0').removeClass('dn').animate({'opacity': '1'}, 300);
	
	$('#uw_photo_box img').attr('src', src).load(function() 
	{
		//jesli zaladowano zdjecie
		//$('#uw_photo_box img').css('opacity', 0); //ukrycie zdj na czas animacji rozmiaru
		
		//ukrycie ladowarki
		$('#uw_photo_curtain i').addClass('dn');
		
		//dodanie opisu zdj
		$('#uw_photo_box h3').text('');
		$('#uw_photo_box h3').text($('.uw_photo_index_'+index).attr('alt'));
		
		//dodanie oblusgi strzalek
		$('.uw_fillpath .prev').attr('href', $('.uw_photo_index_'+ (index-1) ).parent().attr('href'));
		$('.uw_fillpath .next').attr('href', $('.uw_photo_index_'+ (index+1) ).parent().attr('href'));
		if( ($('.uw_fillpath .next').attr('href').indexOf("ascript:uw_photo(\"undefined")>0 ) || ($('.uw_fillpath .next').attr('href')=="") ) $('.uw_fillpath .next').attr('href', 'javascript:;');
		if( ($('.uw_fillpath .prev').attr('href').indexOf("ascript:uw_photo(\"undefined")>0 ) || ($('.uw_fillpath .prev').attr('href')=="") ) $('.uw_fillpath .next').attr('prev', 'javascript:;');
		
		//oblsuga ikonki do otworzenia w nowym oknie
		$('#uw_max_photo').parent().attr('href', src);
		
		//pobranie wielkosci ogrinalu (HTML5) i rozmiaru okna
		var h=document.querySelector('#uw_photo_box img').naturalHeight;
		var w=document.querySelector('#uw_photo_box img').naturalWidth;
		var x=parseInt($( window ).width()*0.9);
		var y=parseInt($( window ).height()-80);
		//zmiejsznie wartosci jesli sa wieksze niz okno
		while ( (h>y) || (w>x) )  { h=parseInt(h*0.9); w=parseInt(w*0.9); }
		
		
		//wycentrowanie zdjecia
		//$('#uw_photo_box img').animate({'width': w+'px', 'height': h+'px'}, { duration: 300, queue: false }); //zastapione CSSEM
		$('#uw_photo_box').animate({'marginTop': ('-'+parseInt(h/2+25))+'px', 'marginLeft': ('-'+parseInt(w/2+10))+'px', 'width': (w+20)+'px', 'height': (h+50)+'px'}, { duration: 300, queue: false });
			

		
		//pokazanie zdjecia
		if($('#uw_photo_box, #uw_photo_curtain').hasClass('dn')) $('#uw_photo_box').css('opacity', '0').removeClass('dn').animate({'opacity': '1'}, 500);

		
		//setTimeout(function() { $('#uw_photo_box img').css('opacity', 1); }, 300 ); //odkrycie zdj po czasie animacji rozmiaru
		
		
		
	} ).error(function() { alert('ERR!\n\nBAD IMAGE PATH OR SERVER OFFLINE');  $('#uw_photo_box, #uw_photo_curtain').addClass('dn'); $('#uw_photo_curtain i').removeClass('dn');   });
	
}


/////////////////////////////////////////////  END UNPXRE GALLERY   /////////////////////////////////////////////

















/////////////////////////////////////////////  UNPXRE CLOUDS   /////////////////////////////////////////////
var cloud_width=0; //used by ucloud
var bname=navigator.appName; if (bname=="Microsoft Internet Explorer") var its_wide=screen.width; else its_wide=window.innerWidth;

$(document).ready(function() 
{
	$('body').append('<div id="cloud"></div>');
});

$(document).on("mouseover", ".ucloud", function(e)
{
	var wnd_w=window.innerWidth;
	var wnd_h=window.innerHeight;
	
	var cloudstyle_attr = $(this).attr('cloudstyle');
	if (typeof cloudstyle_attr !== typeof undefined && cloudstyle_attr !== false) $('#cloud').addClass( $(this).attr("cloudstyle") ); else  $('#cloud').addClass('default_cloud'); 
	$('#cloud').html( $(this).attr("cloudcontent") );
	blockmargin=0;
	
	$("#cloud").css("marginTop", e.pageY- ( parseInt($("#cloud").height()/2) ) - 30 -(wnd_h/2)).css("marginLeft", e.pageX+blockmargin+39-(wnd_w/2)).css("display", "block");
});

$(document).on("mousemove", ".ucloud", function(e)
{
	var wnd_w=window.innerWidth;
	var wnd_h=window.innerHeight;
	$("#cloud").css("marginTop", e.pageY- ( parseInt($("#cloud").height()/2) ) - 30 -(wnd_h/2)).css("marginLeft", e.pageX+blockmargin+39-(wnd_w/2));
}); 

$(document).on("mouseout", ".ucloud", function()
{
	$("#cloud").css("display", "none").removeClass();
}); 


/////////////////////////////////////////////  END UNPXRE CLOUDS   /////////////////////////////////////////////



















/////////////////////////////////////////////  UNPXRE NOTIFY   /////////////////////////////////////////////

var unotify_num=0;
var unotify_max_width=200;

$(document).ready(function() 
{
	$('body').append('<div id="unotify_box"></div>');
});


function hide_unotify(id)
{
	$('#unotify_'+id+'').addClass('unotify_hide');
	setTimeout(function() { $('#unotify_'+id+'').remove(); }, 400 );
}


function create_unotify(msg, notify_type)
{
	var it_num=unotify_num;
	++unotify_num;
	
	switch(notify_type)
	{
		case 'alert': var notify_class='unotify_alert'; break;
		case 'ok': var notify_class='unotify_ok'; break;
		case 'warning': var notify_class='unotify_warning'; break;
		case 'nat': var notify_class='unotify_nat'; break;
		case 'error': var notify_class='unotify_error'; break;
		
		default: var notify_class='unotify_info'; break;
	}
	
	$('body').append('<div id="notify_test_box" style="width: auto; display: inline-block;">'+msg+'</div>');
	var msg_width=$('#notify_test_box').width();
	$('#notify_test_box').remove();
	
	if(msg_width<=unotify_max_width) msg=msg.replace(/ /g, '&nbsp;');
	
	
	$('#unotify_box').append('<div class="unotify '+notify_class+'" id="unotify_'+it_num+'"><div class="unotify_image"></div><span>'+msg+'</span><div class="clear hx0"></div></div>');
	
	if(msg_width>unotify_max_width) $('#unotify_'+it_num).find('span').css('height', 'auto').css('minHeight', '60px').css('borderBottom', '10px solid #fff');
	
	
	setTimeout(function() { hide_unotify( it_num ); }, 9000 );
}

function ualert(msg) { create_unotify(msg, 'alert'); }
function uok(msg) { create_unotify(msg, 'ok'); }
function uinfo(msg) { create_unotify(msg, 'info'); }
function uwarning(msg) { create_unotify(msg, 'warning'); }
function promocja(msg) { create_unotify(msg, 'nat'); }
function uerror(msg) { create_unotify(msg, 'error'); }


$(document).on('click', '.unotify', function()
{
	hide_unotify( $(this).attr('id').replace('unotify_', '') );
});



/////////////////////////////////////////////  END UNPXRE NOTIFY   /////////////////////////////////////////////

























/////////////////////////////////////////////  UNPXRE VALIDATOR  /////////////////////////////////////////////

function uvalidate(inputQ)
{
	var validtype_attr=$(inputQ).attr('validtype');
	var errmsg="";
	
	if (typeof validtype_attr !== typeof undefined && validtype_attr !== false)
	{
		if($(inputQ).attr('validtype')=='num')
		{
			var val=parseInt($(inputQ).val());
			if(isNaN(val)) {  errmsg+="Wartość w polu: "+$(inputQ).attr('validfieldname')+" nie jest liczbą.\n"; }
			if($(inputQ).attr('minnum')>val) {  errmsg+="Wartość: "+val+" w polu: "+$(inputQ).attr('validfieldname')+" jest za mała, minimum to: "+$(inputQ).attr('minnum')+"\n"; }
			if($(inputQ).attr('maxnum')<val) {  errmsg+="Wartość: "+val+" w polu: "+$(inputQ).attr('validfieldname')+" jest za duża, maximum to: "+$(inputQ).attr('maxnum')+"\n"; }
		}
		else if($(inputQ).attr('validtype')=='len')
		{
			var len=$(inputQ).val().length;
			if($(inputQ).attr('minlen')>len) {  errmsg+="Ilość znaków: "+len+" w polu: "+$(inputQ).attr('validfieldname')+" jest za krótka, minimum to: "+$(inputQ).attr('minlen')+"\n"; }
			if($(inputQ).attr('maxlen')<len) {  errmsg+="Ilość znaków: "+len+" w polu: "+$(inputQ).attr('validfieldname')+" jest za duża, maximum to: "+$(inputQ).attr('maxlen')+"\n"; }
		}
		else if($(inputQ).attr('validtype')=='mail')
		{
			var mail=$(inputQ).val();
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!re.test(mail)) {  errmsg+="Podano błędny e-mail w polu: "+$(inputQ).attr('validfieldname')+"\n"; }
		}
		else if($(inputQ).attr('validtype')=='select')
		{
			if($(inputQ).val()==$(inputQ).attr('defaultval'))  {  errmsg+="Nie wybrano wartości w liście wyboru: "+$(inputQ).attr('validfieldname')+"\n"; }
		}
		else if($(inputQ).attr('validtype')=='checkbox')
		{
			if(!$(inputQ).prop( "checked" ))  {  errmsg+="Musisz zaznaczyć pole: "+$(inputQ).attr('validfieldname')+"\n"; }
		}
		else uerror('ERR! bad validtype');
	}
	
	return errmsg;
}


$(document).on('focusout', 'input[type=text]', function()
{
	if($(this).val().length==0) return "";
	msg=uvalidate(this);
	if(msg.length>0) { $(this).addClass('bad').removeClass('good'); uwarning(msg);   }
	else $(this).addClass('good').removeClass('bad');
});

$(document).on('change', 'select', function()
{
	msg=uvalidate(this);
	if(msg.length>0) { $(this).addClass('bad').removeClass('good'); uwarning(msg);   }
	else $(this).addClass('good').removeClass('bad');
});

$(document).on('click', 'input[type=checkbox]', function()
{
	msg=uvalidate(this);
	if(msg.length>0) uwarning(msg);   
});



$(document).on('submit, click', '.validate', function(event)
{
	var form_class=$(this).attr('validclass');
	if (typeof form_class !== typeof undefined && form_class !== false)
	{
		$('.'+form_class).each(function(it)
		{
			msg=uvalidate(this);
			if(msg.length>0) { $(this).addClass('bad').removeClass('good'); uwarning(msg); event.preventDefault(); }
			else $(this).addClass('good').removeClass('bad'); 
		});
	}
	else { uerror('ERR! empty validclass '); event.preventDefault(); }
});


function check_form(class4validate)
{
	var isBad=false;
	$(class4validate).each(function(it)
	{
		msg=uvalidate(this);
		if(msg.length>0) { $(this).addClass('bad').removeClass('good'); uwarning(msg); isBad=true; }
		else $(this).addClass('good').removeClass('bad'); 
	});
	if(isBad) return false;
	return true;
}

/////////////////////////////////////////////  END UNPXRE VALIDATOR  /////////////////////////////////////////////




























