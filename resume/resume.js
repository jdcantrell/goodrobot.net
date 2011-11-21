$(document).ready(function() {
	if ($('#scroller').css('display') != 'none') {
		$('#scroller').append($('#sections'))
		$('#section-headings > li').each(function (idx, li) {
			$(li).bind('click', function() {
				$('#sections').animate({left: -idx * 625}, 400, 'swing')
				$(this).parent().children().removeClass('selected')
				$(this).addClass('selected')
			})
		})
	}
})
