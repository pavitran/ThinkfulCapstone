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
  		var $button = $('.uil-squares-css').clone();
  		$('.content').html($button);
  		$(".uil-squares-css").show();
        $(".overlay").fadeIn(100);
    }).ajaxStop(function () {
        $(".uil-squares-css").hide();
        $('.results').show();
    });
    console.log($(window).width());
    if ($(window).width() < 600) {
		console.log("apple");
		var $rotator = $(".rotator");
		$rotator.find("img:gt(0)").hide();
		setTimeout(Rotate, 1000);
		function Rotate() {
	      var $current = $rotator.find("img:visible");
	      var $next = $current.next();
	      if ($next.length == 0) $next = $rotator.find("img:eq(0)");
	      $current.hide();
	      $next.show();
	      setTimeout(Rotate, 1000);
		}
    }
    $(document).on('click', '#try', function () {
      	$('.upload').val("");
		$('input.text').val("");    
  		$(".overlay").fadeOut(1000);
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
					$('.content').append("<span>might be:</span><span>" + item.identity.name+ "</span><span>"+(item.identity.score*100).toFixed(2)+"</span>");

				});
			} else {
				$('.content').append("<h1>NO Faces Found</h1>");
			}
		}
		var btn_clone = $('.ubutton').clone().insertAfter("table").prop('id', 'try' );
		$('#try').show();
		$('.content').append(btn_clone);
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		$('.content').append(error);
	});
};
function checkURL(url) {
	    return(url.match(/\.(jpeg|jpg|png)$/) != null);
}