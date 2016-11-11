$(function(){
  $('#search').submit(function(event){
    event.preventDefault();
    var searchTerm = $('#img').val();
    var query = $('input[name=query]:checked', '#search').val();
    if (checkURL(searchTerm)) {
    	$('#given_img').src = $('#img').val();
    	getData(searchTerm,query);
    }else{
    	$('.content').append("<h1>URL EXTENSION NOT SUPPORTED</h1>");
    }
  });
  $(document).ajaxStart(function () {
  		var $button = $('.uil-squares-css').clone().prop('id', 'loading' );
  		$('.content').html($button);
  		$("#loading").show();
        $(".overlay").fadeIn(100);
    }).ajaxStop(function () {
        $("#loading").hide();
        $('.results').show();
    });
    console.log($(window).width());
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    	console.log("Appl");
		$(".rotator").empty();
		$(".rotator").append("<img width=\"150px\" src=\"https://staticdelivery.nexusmods.com/mods/110/images/74627-0-1459502036.jpg\"/>");
		$(".form").css({'width' : 'auto','height' : 'auto','display':'inline-block'});

    }
    $(document).on('click', '#try', function () {
      	$('.upload').val("");
		$('input.text').val("");    
  		$(".overlay").fadeOut(300);
	});
	$(document).on('click', '.info', function () {    
  		infooverlay();
	});
	$(document).on('click', '.cancel-button', function () {    
  		$(".overlay").fadeOut(300);
	});
});

var getData = function(image,query) {
	
	// the parameters we need to pass in our request to IBM Watson™ Visual Recognition service"faces"
	var request = { 
		url: image,
		api_key: '84923a713de2b16e6e72a4bb707eae8dd8dd208d',
		version: '2016-05-19'
	};
	
	$.ajax({
		url: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/"+query,
		data: request,
		type: "GET"
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		//console.log(result);
		$('.content').empty();
		$('.content').append("<img class=\"img\" src=\"" +image+ "\">");
		$('.content').append("<table  class=\"results\"></table>");
		if (query == "classify") {
				$('table').append("<tr><th>CLASS</th><th>PROBABILITY</th></tr>");
			$.each(result.images[0].classifiers[0].classes, function(i, item) {
				$('table').append("<tr><td>"+item.class+"</td><td>" + (item.score*100).toFixed(2) + "%</td></tr>");
			});
		} else {
			if (result.images[0].faces.length > 0) {
				$('table').append("<tr><th>GENDER</th><th>PROBABILITY</th><th>AGE(min/max)</th><th>PROBABILITY</th></tr>")
				$.each(result.images[0].faces, function(i, item) {
					$('table').append("<tr><td>"+ item.gender.gender +"</td><td>"+(item.gender.score*100).toFixed(2)+"%</td><td>"+item.age.min+ "-"+item.age.max+ "</td><td>"+ (item.age.score*100).toFixed(2) + "</td><tr>");
					$('.content').append("<div><span>might be:</span><span style=\"margin:8px;font-family:Georgia Bold;\">" + item.identity.name+ "</span><span>"+(item.identity.score*100).toFixed(2)+"%</span></div>");

				});
			} else {
				$('.content').append("<h1>NO Faces Found</h1>");
			}
		}
		var btn_clone = $('.ubutton').clone().appendTo('.content').insertAfter("table").prop('id', 'try' );
		$('#try').show();
		//$().append(btn_clone);
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		$('.content').append(error);
	});
};
function checkURL(url) {
	    return(url.match(/\.(jpeg|jpg|png)$/) != null);
}
function infooverlay() {
	$('.content').empty();
	$('.content').append("<button class=\"cancel-button\"><i class=\"fa fa-times fa-3x\" aria-hidden=\"true\"></i></button>");
	img = "<img onclick=\"getData(this.src,'classify')\" width=\"150px\" src=\"https://staticdelivery.nexusmods.com/mods/110/images/74627-0-1459502036.jpg\"/>";
	if ($(window).width() > 600) {
		img += "<img onclick=\"getData(this.src,'classify')\" width=\"150px\" src=\"http://r.ddmcdn.com/s_f/o_1/cx_633/cy_0/cw_1725/ch_1725/w_720/APL/uploads/2014/11/too-cute-doggone-it-video-playlist.jpg\"/>";
		img += "<img onclick=\"getData(this.src,'detect_faces')\" width=\"150px\" src=\"http://a4.files.biography.com/image/upload/c_fill,cs_srgb,dpr_1.0,g_face,h_300,q_80,w_300/MTE4MDAzNDEwMDU4NTc3NDIy.jpg\"/>";
	}
	$('.content').append("<h1>What's In The Image</h1>");
	$('.content').append("<h3>What?</h3>")
	$('.content').append("<ul style=\"display:inline-block;\"><li>This app lets you recognize items and objects in an Image.</li><li>It also let's you detect faces,estimated age and gender of the person.</li><li>It can also guess names of some of the famous personalities.</li></ul>");
	$('.content').append("<h3>How?</h3>")
	$('.content').append("<ul style=\"display:inline-block;\"><li>Upload image of your own or paste image link from web to try it.</li><li>check if you want to detect a face or classify the image.</li><li>Click on image below to see how it works!</li></ul>");
	$('.content').append("<div class=\"rotator\" style=\"display: none;\">"+img+"</div>");
	$('.rotator').show();
	$(".overlay").fadeIn(1000);
}
