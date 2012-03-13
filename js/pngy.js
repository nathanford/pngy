// pngy by Nathan Ford - pngy.artequalswork.com

pngy = function (ob) {
	
	var defaults = {
		loadspeed : false,
		loadsize : false,
		selector : '.pngy',
		display_results : false,
		apply_to_all_imgs: false,
		limits : {
			fast : 40,
			normal : 10,
			slow : 0
		},
		base: 'slow'
	}, p = new Object(), inittime;
	
	// pull in custom setting or use defaults
	if (ob) for (k in defaults) p[k] = (ob[k] != undefined) ? ob[k] : defaults[k];
	else p = defaults;
	
	// add all IMGs to p.selector if apply_to_all_imgs is true
	if (p.apply_to_all_imgs) p.selector += ', img';
	
	// get all elements that match the selector
	p.imgs = $(p.selector);
	
	if ($(p.imgs).length) { // only run the rest if there are elements that match p.selector
		
		var pngy1 = (p.imgs[0].tagName == 'IMG') ? $(p.imgs[0]).attr('src') : $(p.imgs[0]).css('background-image').replace('url("','').replace('")','');
		
		$.ajax({
			url: pngy1 + '?' + Math.random(), // pngy1
			beforeSend: function () {
				
				// get time before ajax request
				var initdate = new Date();
				inittime = initdate.getTime();
				
			},
			success: function (d) {
			
				var loaddate = new Date(), limits = [], i = 0, j = 0;
				
				// get image size in Kb
				if (!p.loadsize) p.loadsize = d.length / 1024;
				
				// get loadspeed in seconds
				if (!p.loadspeed) p.loadspeed = (loaddate.getTime() - inittime) / 1000; 
				
				// get Kbs
				p.mbs = Math.floor((p.loadsize / p.loadspeed) * 100) / 100; 
				
				// output speed if display_results has a selector
				$(p.display_results).html(p.mbs + ' Kbs'); 
				
				// uncomment to get a log of your load speed
				//console.log('Load speed: ' + p.mbs + ' Kbs'); 
				
				// reorder limits to highest to lowest
				for (k in p.limits) limits.push([k, p.limits[k]]);
				limits.sort(function(a, b) {return a[1] - b[1]});
				limits.reverse();
				
				// find the limit
				while (limits[i]) {
					p.speed = limits[i][0];
					if (limits[i][1] < p.mbs) break;
					i++;
				}
				
				p.base = limits[limits.length-1][0];
				
				// edit image paths
				while( p.imgs[j] ) {
					
					var t = p.imgs[j], reg = new RegExp("(\-" + p.base + "\.([A-Za-z]{3,4})\"*)$");
					
					if (t.tagName == 'IMG')
						$(t).attr('src', $(t).attr('src').replace(reg, '-' + p.speed + ".$2"));
					else
						$(t).css('background-image', 'url(' + $(t).css('background-image').replace('url("','').replace('")','').replace(reg, '-' + p.speed + ".$2") + ')');
							
					j++;
					
				}
				
			}
		
		});
		
	}

};