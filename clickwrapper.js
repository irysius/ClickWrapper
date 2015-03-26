;(function (definition) {
	if (typeof define === 'function' && define.amd) {
		define([], definition());
	} else {
		window.ClickWrapper = definition();
	}
})(function () {
	function ClickWrapper(elements, options) {
		var validEvents = ['mousedown', 'click', 'dblclick'];
		var callbackHash = { 
			'mousedown' : [], 
			'click' 	: [], 
			'dblclick' 	: [] 
		};

		// process options object
		// delay:number - in ms, cutoff time before settling on what event to fire.
		options = options || {};
		var delay = parseInt(options.delay) || 200;
		
		function on(eventName, callback) {
			if (validEvents.indexOf(eventName) !== -1) {
				if (callback && typeof callback === 'function') {
					callbackHash[eventName].push(callback);
				}
			}
		}
		function off(eventName, callback) {
			if (validEvents.indexOf(eventName) !== -1) {
				var index = callbackHash[eventName].indexOf(callback);
				callbackHash[eventName].splice(index, 1);
			}
		}

		function bindElement(element) {
			var mouseUpCount = 0;
			element.addEventListener('mousedown', function (event) {
				if (getButton(event) !== 1) return; // Only accept left mouse clicks (sorry right handers!)
				if (mouseUpCount !== 0) return; // Prevent additional mousedowns from interfering with dblclicks.
				element.addEventListener('mouseup', onMouseUp);
				
				setTimeout(function () {
					var i;
					switch (mouseUpCount) {
						case 0:
							// Fire off mousedown event
							for (i = 0; i < callbackHash['mousedown'].length; ++i) {
								callbackHash['mousedown'][i].call(element, event);
							}
							break;
						case 1:
							// Fire off click event
							for (i = 0; i < callbackHash['click'].length; ++i) {
								callbackHash['click'][i].call(element, event);
							}
							break;
						default:
							// Fire off dblclick event
							for (i = 0; i < callbackHash['dblclick'].length; ++i) {
								callbackHash['dblclick'][i].call(element, event);
							}
							break;
					}
					element.removeEventListener('mouseup', onMouseUp);
					mouseUpCount = 0;
				}, delay);
			});	

			function onMouseUp(event) {
				mouseUpCount++;
			}
		}

		// because browsers can't decide on how to map mouse buttons
		// 1 - lmb, 2 - mmb, 3 - rmb
		function getButton(event) {
			if (!event.which && event.button) {
				if (event.button & 1) return 1;
				else if (event.button & 4) return 2;
				else if (event.button & 2) return 3;
			} 
			return event.which;
		}

		if (elements.addEventListener) {
			bindElement(elements);
		} else if (elements.hasOwnProperty('length')) {
			[].forEach.call(elements, function (element) {
				if (element.addEventListener) {
					bindElement(element);
				}
			});
		}

		return {
			on 	: on,
			off	: off
		};
	}

	return ClickWrapper;
})