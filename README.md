# ClickWrapper
Wraps mousedown, click, and dblclick events around an element to provide mutually exclusive events.

## Usage

	var wrapper = new ClickWrapper(document.body, { delay: 250 });

	wrapper.on('click', function (event) {
		// event is a generic MouseEvent
	});

	wrapper.on('mousedown', function (event) {
		// event is a generic MouseEvent
	});

	wrapper.on('dblclick', function (event) {
		// event is a generic MouseEvent
	});

## Options

**delay** - in ms, the cutoff time by which a decision must be made about which event to fire. Defaults to 200.