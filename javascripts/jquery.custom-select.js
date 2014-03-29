(function ( $ ) {
	var mouse_on_dropdown = false; //for customized select box
	var IOS = (navigator.userAgent.match(/iPad|iPhone|iPod/i) != null)?true:false; //for IOS devices
	$.fn.customSelect = function(options) {
		var opts = $.extend({}, $.fn.customSelect.defaults, options);
		this.each(function(i) {
			var sel_elem = $(this);
			var width = sel_elem.outerWidth()-2;
			var height = sel_elem.outerHeight();
			var margin_t = sel_elem.css('margin-top');
			var margin_b = sel_elem.css('margin-bottom');
			var margin_l = sel_elem.css('margin-left');
			var margin_r = sel_elem.css('margin-right');
			var background = sel_elem.css('background-color');
			var font_size = sel_elem.css('font-size');
			sel_elem.hide().wrap('<div class="sel-box curvy-all" />');//round corners optional
			var sel_box = sel_elem.parent();
			var sel_text = (sel_elem.hasClass('multi'))?sel_elem.children('option:eq(0)').text():sel_elem.find(':selected').text();
			//tab index
			var tab_index = '';
			if(sel_elem.attr('tabindex')) {tab_index = ' tabindex="'+sel_elem.attr('tabindex')+'"';}
			//IOS safari
			var sel_txt_wd_offset = (IOS)?37:29;
			var sel_txt_class = (IOS)?' IOS':'';
			sel_box.width(width).height(height).css('background-color', background).css('margin-top',margin_t).css('margin-bottom',margin_b).css('margin-left',margin_l).css('margin-right',margin_r).append('<a class="arr-box" style="height:'+height+'px;"></a><input type="text" readonly="readonly" class="sel-text'+sel_txt_class+'" style="border:none;width:'+(width-sel_txt_wd_offset)+'px;font-size:'+font_size+';" value="'+sel_text+'" '+tab_index+' /><ul class="dropdown_ul curvy-bottom" style="margin:-2px 0 0 -1px;top:'+height+'px;left:0;padding-bottom:4px;"></ul>').children('ul').hide();
			var sel_txt = sel_box.find('input:text.sel-text');
			var sel_txt_mt = (height-sel_txt.outerHeight())/2;
			sel_txt.css('margin-top', sel_txt_mt+'px');
			sel_elem.siblings('.arr-box, .sel-text').click(function(){
				if($(this).hasClass('arr-box')) {$(this).siblings('.sel-text').focus();}else {$(this).focus();}
				$(this).siblings('ul.dropdown_ul').slideToggle(100);
			}).siblings('ul.dropdown_ul').hover(function() {
				mouse_on_dropdown = true;}, function() {
				mouse_on_dropdown = false;
			});
			
			sel_elem.selClick();
			var txt_width = sel_box.children('ul.dropdown_ul').width();
			if(txt_width < width) {sel_box.children('ul.dropdown_ul').width(width)}
		
		});
	};
	
	//options for future use
	$.fn.customSelect.defaults = {
		
	};
	
	//render dropdown list and click event
	$.fn.selClick = function() {
		this.each(function() {
			var elem = $(this);
            var font_family = elem.css('font-family');
            console.log(font_family)
            var font_size = elem.css('font-size');
            var font_weight = elem.css('font-weight');
			elem.siblings('ul.dropdown_ul').html('');
			var sel_box = elem.parent();
			var sel_txt = sel_box.find('input:text.sel-text');
			var opt = elem.children('option');
			opt.each(function(){
				if(elem.hasClass('multi')) {
					if(opt.index($(this))>0) {
						var checkAll = ($(this).val() == '' || $(this).val() == 'any')?' class="checkAll"':'';
						var checked = ($(this).hasClass('checked'))?'checked="checked"':'';
						sel_box.children('ul.dropdown_ul').append('<li class="dropdown_li" rel="'+opt.eq(opt.index(this)).val()+'" style="font-size:'+font_size+';font-weight:'+font_weight+';font-family:'+font_family+';"><label title="'+$(this).text()+'"><input '+checkAll+' type="checkbox" value="'+$(this).val()+'" name="'+elem.attr('name')+'[]" '+checked+' /> '+($(this).text())+'</label></li>');
					}
				}else {
					var selected = ($(this).text() == elem.find(':selected').text())?' selected':'';
					sel_box.children('ul.dropdown_ul').append('<li class="dropdown_li'+selected+'" rel="'+$(this).val()+'" style="font-size:'+font_size+';font-weight:'+font_weight+';font-family:'+font_family+';">'+($(this).text())+'</li>');
				}
			});
			if(elem.hasClass('multi')) {
				var checkboxes = elem.siblings('ul.dropdown_ul').find('input:checkbox');
				checkboxes.change(function() {
					elem.siblings('.sel-text').focus();
					
					if($(this).hasClass('checkAll')) {
						checkboxes.not('.checkAll').attr('checked', false);
					}else {
						checkboxes.filter('.checkAll').attr('checked', false);
					}
					if(checkboxes.filter(':checked').length==0) {
						checkboxes.filter('.checkAll').attr('checked', true);
					}
				});
			}else {
				sel_box.find('ul.dropdown_ul li').click(function(){
					var idx = sel_box.find('ul.dropdown_ul li').index($(this));
					sel_box.find('ul.dropdown_ul li').removeClass('selected');
					$(this).addClass('selected');
					$(this).parents().siblings('input.sel-text').val($(this).text());
					elem.children('option:eq('+idx+')').attr('selected', true);
					elem.change();
					$('ul.dropdown_ul:visible').slideUp(100);
				});
			}
			sel_txt.blur(function() {
				if(!mouse_on_dropdown) { 
					sel_box.find('ul.dropdown_ul:visible').slideUp(100);
				}
			});
		});
	}
}( jQuery ));