// Pngy by Nathan Ford - pngy.artequalswork.com

pngy = function (ob) {
	
	var defaults = {
		fast: 180,
		normal: 300,
		slow: 'all'
	},	
	p = {
		file : (ob && ob.file != undefined) ? ob.file : '1k.gif',
		avg_limit : (ob && ob.avg_limit != undefined) ? ob.avg_limit : 3,
		selector : (ob && ob.selector != undefined) ? ob.selector : '.pngy',
		display_results: (ob && ob.display_results != undefined) ? ob.display_results : false,
		limits : (ob && ob.limits != undefined) ? ob.limits : defaults,
		i : 0,
		nm : 0
	};
	
	if (ob.apply_to_all_imgs) p.selector += ', img';
	
	p.imgs = $(p.selector);
	
	results( p );
	
};

results = function ( p ) {
	
	if (p.file) {
	
		var sd = new Date();
		var sm = sd.getTime();
		
		$("<img />").attr('src', p.file + '?' + sm).load(function () {
			
			if (this.complete && typeof this.naturalWidth != "undefined" && this.naturalWidth != 0){
				
				var time = new Date().getTime() - sm;
				p.nm += time;
				
				p.i++;
				
				if (p.i < p.avg_limit) results( p );
				else {
				
					if (p.nm != 0) { 
						
						p.avg = Math.round(p.nm / p.avg_limit); 
						
						for (k in p.limits) {
							
							if (!k.match('_suff')) {
							
								var sp = p.limits[k];
								
								if (sp > p.avg) {
									p.speed = k;
									break;
								}
								else p.speed = k;
							
							} 
						
						}
						
						// change suffix for speed
						if (p.limits[p.speed] !== 'all') appendimgs( p );
						
						// place speed results in selector
						$(p.display_results).html(p.speed + ' (' + p.avg + ')');
											
					}
					
				}
			
			}
			
		});
		
	}
	
};

appendimgs = function (p) {
	
	var s = p.speed, j = 0, reg = new RegExp("((\-[^\-]+)\.([A-Za-z]{3,4})\"*)$");
	
	while( p.imgs[j] ) {
		
		var t = p.imgs[j];
		
		if (t.tagName == 'IMG')
			$(t).attr('src', $(t).attr('src').replace(reg, '-' + s + ".$3"));
		else
			$(t).css('background-image', 'url(' + $(t).css('background-image').replace('url("','').replace('")','').replace(reg, '-' + s + ".$3") + ')');
				
		j++;
		
	}

};