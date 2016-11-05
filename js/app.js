$(function(){
  $('#search').submit(function(event){
    event.preventDefault();
    var searchTerm = $('#img').val();
    var query = $('input[name=query]:checked', '#search').val();
    if (checkURL(searchTerm)) {
    	$('#given_img').src = $('#img').val();
    	getData(searchTerm,query);
    }else{
    	$('.results').append("<h1>URL EXTENSION NOT SUPPORTED</h1>");
    }
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
		$('.results').empty();
		$('.results').append("<img class=\"img\" src=\"" +image+ "\">");
		if (query == "classify") {
			$.each(result.images[0].classifiers[0].classes, function(i, item) {
				$('.results').append("<li>"+item.class+"</li><span>" + item.score*100 + "%</span>");
			});
		} else {
			if (result.images[0].faces.length > 0) {
				$.each(result.images[0].faces, function(i, item) {
					$('.results').append("<li>age "+item.age.min+ "-"+item.age.min+ "("+ item.age.score*100 +")</li><span>" + item.gender.gender + "</span>");
					$('.results').append("<li>might be</li><span>" + item.identity.name+ "</span>");

				});
			} else {
				$('.results').append("<h1>NO Faces Found</h1>");
			}
		}
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		$('.search-results').append(error);
	});
};
function checkURL(url) {
	    return(url.match(/\.(jpeg|jpg|png)$/) != null);
}