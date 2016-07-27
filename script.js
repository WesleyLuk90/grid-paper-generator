function hideForm() {
	document.querySelector('.input-form').style.display = "none";
}

function getOption(name) {
	var regex = name + "=([^&]*)";
	var match = window.location.toString().match(regex);
	if (!match) {
		return null;
	}
	return decodeURIComponent(match[1] || "");
}

function getOptions() {
	return {
		document: {
			width: parseFloat(getOption('document-width')),
			height: parseFloat(getOption('document-height')),
		},
		vertical: {
			color: getOption('v-line-color'),
			width: parseFloat(getOption('v-line-width')),
			spacing: parseFloat(getOption('v-line-spacing')),
		},
		horizontal: {
			color: getOption('h-line-color'),
			width: parseFloat(getOption('h-line-width')),
			spacing: parseFloat(getOption('h-line-spacing')),
		},
	};
}

function createLine(x1, y1, x2, y2, stroke, color) {
	var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	line.setAttribute('x1', x1);
	line.setAttribute('x2', x2);
	line.setAttribute('y1', y1);
	line.setAttribute('y2', y2);
	line.setAttribute('stroke', color);
	line.setAttribute('stroke-width', stroke);
	return line;
}

function setDocumentSize(documentSize) {
	var svg = document.querySelector('.grid-svg');

	svg.setAttribute('width', documentSize.width + "mm");
	svg.setAttribute('height', documentSize.height + "mm");
	svg.setAttribute('viewBox', '0 0 ' + documentSize.width + ' ' + documentSize.height);
}

function generateGrid() {
	var options = getOptions();
	var documentSize = options.document;
	setDocumentSize(documentSize);

	var container = document.querySelector('.grid-container');

	var horizontal = options.horizontal;
	for (var y = 0; y < documentSize.height; y += horizontal.spacing) {
		var line = createLine(0, y, documentSize.width, y, horizontal.width, horizontal.color);
		container.appendChild(line);
	}

	var vertical = options.vertical;
	for (var x = 0; x < documentSize.height; x += vertical.spacing) {
		var line = createLine(x, 0, x, documentSize.height, vertical.width, vertical.color);
		container.appendChild(line);
	}
}

function main() {
	if (getOption('submitted') != null) {
		hideForm();
		generateGrid();
	}
}
main();
