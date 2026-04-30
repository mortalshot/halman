import { i as slideDown, o as slideUp, r as dataMediaQueries } from "./app.min.js";
import "./offer-club.min.js";
//#region src/components/layout/showmore/showmore.js
function showMore() {
	const showMoreBlocks = document.querySelectorAll("[data-fls-showmore]");
	let showMoreBlocksRegular;
	let mdQueriesArray;
	if (showMoreBlocks.length) {
		showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function(item, index, self) {
			return !item.dataset.flsShowmoreMedia;
		});
		showMoreBlocksRegular.length && initItems(showMoreBlocksRegular);
		document.addEventListener("click", showMoreActions);
		window.addEventListener("resize", showMoreActions);
		mdQueriesArray = dataMediaQueries(showMoreBlocks, "flsShowmoreMedia");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				mdQueriesItem.matchMedia.addEventListener("change", function() {
					initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
			});
			initItemsMedia(mdQueriesArray);
		}
	}
	function initItemsMedia(mdQueriesArray) {
		mdQueriesArray.forEach((mdQueriesItem) => {
			initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
	}
	function initItems(showMoreBlocks, matchMedia) {
		showMoreBlocks.forEach((showMoreBlock) => {
			initItem(showMoreBlock, matchMedia);
		});
	}
	function initItem(showMoreBlock, matchMedia = false) {
		showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
		let showMoreContent = showMoreBlock.querySelectorAll("[data-fls-showmore-content]");
		let showMoreButton = showMoreBlock.querySelectorAll("[data-fls-showmore-button]");
		showMoreContent = Array.from(showMoreContent).filter((item) => item.closest("[data-fls-showmore]") === showMoreBlock)[0];
		showMoreButton = Array.from(showMoreButton).filter((item) => item.closest("[data-fls-showmore]") === showMoreBlock)[0];
		const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
		if (matchMedia.matches || !matchMedia) if (hiddenHeight < getOriginalHeight(showMoreContent)) {
			slideUp(showMoreContent, 0, showMoreBlock.classList.contains("--showmore-active") ? getOriginalHeight(showMoreContent) : hiddenHeight);
			showMoreButton.hidden = false;
			showMoreButton.setAttribute("aria-expanded", showMoreBlock.classList.contains("--showmore-active") ? "true" : "false");
		} else {
			slideDown(showMoreContent, 0, hiddenHeight);
			showMoreButton.hidden = true;
			showMoreButton.setAttribute("aria-expanded", "false");
		}
		else {
			showMoreBlock.classList.remove("--showmore-active");
			slideDown(showMoreContent, 0, hiddenHeight);
			showMoreButton.hidden = true;
			showMoreButton.setAttribute("aria-expanded", "false");
		}
	}
	function getHeight(showMoreBlock, showMoreContent) {
		let hiddenHeight = 0;
		const showMoreType = showMoreBlock.dataset.flsShowmore ? showMoreBlock.dataset.flsShowmore : "size";
		const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
		if (showMoreType === "items") {
			const showMoreTypeValue = showMoreContent.dataset.flsShowmoreContent ? showMoreContent.dataset.flsShowmoreContent : 3;
			const showMoreItems = showMoreContent.children;
			for (let index = 1; index < showMoreItems.length; index++) {
				const showMoreItem = showMoreItems[index - 1];
				const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
				const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
				hiddenHeight += showMoreItem.offsetHeight + marginTop;
				if (index == showMoreTypeValue) break;
				hiddenHeight += marginBottom;
			}
			rowGap && (hiddenHeight += (showMoreTypeValue - 1) * rowGap);
		} else hiddenHeight = showMoreContent.dataset.flsShowmoreContent ? showMoreContent.dataset.flsShowmoreContent : 150;
		return hiddenHeight;
	}
	function getOriginalHeight(showMoreContent) {
		let parentHidden;
		let hiddenHeight = showMoreContent.offsetHeight;
		showMoreContent.style.removeProperty("height");
		if (showMoreContent.closest(`[hidden]`)) {
			parentHidden = showMoreContent.closest(`[hidden]`);
			parentHidden.hidden = false;
		}
		let originalHeight = showMoreContent.offsetHeight;
		parentHidden && (parentHidden.hidden = true);
		showMoreContent.style.height = `${hiddenHeight}px`;
		return originalHeight;
	}
	function showMoreActions(e) {
		const targetEvent = e.target;
		const targetType = e.type;
		if (targetType === "click") {
			if (targetEvent.closest("[data-fls-showmore-button]")) {
				const showMoreButton = targetEvent.closest("[data-fls-showmore-button]");
				const showMoreBlock = showMoreButton.closest("[data-fls-showmore]");
				const showMoreContent = showMoreBlock.querySelector("[data-fls-showmore-content]");
				const showMoreSpeed = showMoreBlock.dataset.flsShowmoreButton ? showMoreBlock.dataset.flsShowmoreButton : "500";
				const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
				if (!showMoreContent.classList.contains("--slide")) {
					showMoreBlock.classList.contains("--showmore-active") ? slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
					showMoreBlock.classList.toggle("--showmore-active");
					showMoreButton.setAttribute("aria-expanded", showMoreBlock.classList.contains("--showmore-active") ? "true" : "false");
				}
			}
		} else if (targetType === "resize") {
			showMoreBlocksRegular && showMoreBlocksRegular.length && initItems(showMoreBlocksRegular);
			mdQueriesArray && mdQueriesArray.length && initItemsMedia(mdQueriesArray);
		}
	}
}
window.addEventListener("load", showMore);
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [
	"top",
	bottom,
	right,
	left
];
var start = "start";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
	return acc.concat([placement + "-" + start, placement + "-end"]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
	return acc.concat([
		placement,
		placement + "-" + start,
		placement + "-end"
	]);
}, []);
var modifierPhases = [
	"beforeRead",
	"read",
	"afterRead",
	"beforeMain",
	"main",
	"afterMain",
	"beforeWrite",
	"write",
	"afterWrite"
];
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
	return element ? (element.nodeName || "").toLowerCase() : null;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
	if (node == null) return window;
	if (node.toString() !== "[object Window]") {
		var ownerDocument = node.ownerDocument;
		return ownerDocument ? ownerDocument.defaultView || window : window;
	}
	return node;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement$1(node) {
	return node instanceof getWindow(node).Element || node instanceof Element;
}
function isHTMLElement(node) {
	return node instanceof getWindow(node).HTMLElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
	if (typeof ShadowRoot === "undefined") return false;
	return node instanceof getWindow(node).ShadowRoot || node instanceof ShadowRoot;
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
	var state = _ref.state;
	Object.keys(state.elements).forEach(function(name) {
		var style = state.styles[name] || {};
		var attributes = state.attributes[name] || {};
		var element = state.elements[name];
		if (!isHTMLElement(element) || !getNodeName(element)) return;
		Object.assign(element.style, style);
		Object.keys(attributes).forEach(function(name) {
			var value = attributes[name];
			if (value === false) element.removeAttribute(name);
			else element.setAttribute(name, value === true ? "" : value);
		});
	});
}
function effect$2(_ref2) {
	var state = _ref2.state;
	var initialStyles = {
		popper: {
			position: state.options.strategy,
			left: "0",
			top: "0",
			margin: "0"
		},
		arrow: { position: "absolute" },
		reference: {}
	};
	Object.assign(state.elements.popper.style, initialStyles.popper);
	state.styles = initialStyles;
	if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
	return function() {
		Object.keys(state.elements).forEach(function(name) {
			var element = state.elements[name];
			var attributes = state.attributes[name] || {};
			var style = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]).reduce(function(style, property) {
				style[property] = "";
				return style;
			}, {});
			if (!isHTMLElement(element) || !getNodeName(element)) return;
			Object.assign(element.style, style);
			Object.keys(attributes).forEach(function(attribute) {
				element.removeAttribute(attribute);
			});
		});
	};
}
var applyStyles_default = {
	name: "applyStyles",
	enabled: true,
	phase: "write",
	fn: applyStyles,
	effect: effect$2,
	requires: ["computeStyles"]
};
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement$1(placement) {
	return placement.split("-")[0];
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/math.js
var max = Math.max;
var min = Math.min;
var round = Math.round;
//#endregion
//#region node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
	var uaData = navigator.userAgentData;
	if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) return uaData.brands.map(function(item) {
		return item.brand + "/" + item.version;
	}).join(" ");
	return navigator.userAgent;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
	return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	var clientRect = element.getBoundingClientRect();
	var scaleX = 1;
	var scaleY = 1;
	if (includeScale && isHTMLElement(element)) {
		scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
		scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
	}
	var visualViewport = (isElement$1(element) ? getWindow(element) : window).visualViewport;
	var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
	var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
	var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
	var width = clientRect.width / scaleX;
	var height = clientRect.height / scaleY;
	return {
		width,
		height,
		top: y,
		right: x + width,
		bottom: y + height,
		left: x,
		x,
		y
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
	var clientRect = getBoundingClientRect(element);
	var width = element.offsetWidth;
	var height = element.offsetHeight;
	if (Math.abs(clientRect.width - width) <= 1) width = clientRect.width;
	if (Math.abs(clientRect.height - height) <= 1) height = clientRect.height;
	return {
		x: element.offsetLeft,
		y: element.offsetTop,
		width,
		height
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
	var rootNode = child.getRootNode && child.getRootNode();
	if (parent.contains(child)) return true;
	else if (rootNode && isShadowRoot(rootNode)) {
		var next = child;
		do {
			if (next && parent.isSameNode(next)) return true;
			next = next.parentNode || next.host;
		} while (next);
	}
	return false;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
	return [
		"table",
		"td",
		"th"
	].indexOf(getNodeName(element)) >= 0;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
	return ((isElement$1(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
	if (getNodeName(element) === "html") return element;
	return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	return element.offsetParent;
}
function getContainingBlock(element) {
	var isFirefox = /firefox/i.test(getUAString());
	if (/Trident/i.test(getUAString()) && isHTMLElement(element)) {
		if (getComputedStyle$1(element).position === "fixed") return null;
	}
	var currentNode = getParentNode(element);
	if (isShadowRoot(currentNode)) currentNode = currentNode.host;
	while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
		var css = getComputedStyle$1(currentNode);
		if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") return currentNode;
		else currentNode = currentNode.parentNode;
	}
	return null;
}
function getOffsetParent(element) {
	var window = getWindow(element);
	var offsetParent = getTrueOffsetParent(element);
	while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") offsetParent = getTrueOffsetParent(offsetParent);
	if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) return window;
	return offsetParent || getContainingBlock(element) || window;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
	return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/within.js
function within(min$2, value, max$2) {
	return max(min$2, min(value, max$2));
}
function withinMaxClamp(min, value, max) {
	var v = within(min, value, max);
	return v > max ? max : v;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
	return Object.assign({}, getFreshSideObject(), paddingObject);
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
	return keys.reduce(function(hashMap, key) {
		hashMap[key] = value;
		return hashMap;
	}, {});
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/arrow.js
var toPaddingObject = function toPaddingObject(padding, state) {
	padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, { placement: state.placement })) : padding;
	return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
	var _state$modifiersData$;
	var state = _ref.state, name = _ref.name, options = _ref.options;
	var arrowElement = state.elements.arrow;
	var popperOffsets = state.modifiersData.popperOffsets;
	var basePlacement = getBasePlacement$1(state.placement);
	var axis = getMainAxisFromPlacement(basePlacement);
	var len = ["left", "right"].indexOf(basePlacement) >= 0 ? "height" : "width";
	if (!arrowElement || !popperOffsets) return;
	var paddingObject = toPaddingObject(options.padding, state);
	var arrowRect = getLayoutRect(arrowElement);
	var minProp = axis === "y" ? "top" : left;
	var maxProp = axis === "y" ? bottom : right;
	var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
	var startDiff = popperOffsets[axis] - state.rects.reference[axis];
	var arrowOffsetParent = getOffsetParent(arrowElement);
	var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
	var centerToReference = endDiff / 2 - startDiff / 2;
	var min = paddingObject[minProp];
	var max = clientSize - arrowRect[len] - paddingObject[maxProp];
	var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
	var offset = within(min, center, max);
	var axisProp = axis;
	state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}
function effect$1(_ref2) {
	var state = _ref2.state;
	var _options$element = _ref2.options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
	if (arrowElement == null) return;
	if (typeof arrowElement === "string") {
		arrowElement = state.elements.popper.querySelector(arrowElement);
		if (!arrowElement) return;
	}
	if (!contains(state.elements.popper, arrowElement)) return;
	state.elements.arrow = arrowElement;
}
var arrow_default = {
	name: "arrow",
	enabled: true,
	phase: "main",
	fn: arrow,
	effect: effect$1,
	requires: ["popperOffsets"],
	requiresIfExists: ["preventOverflow"]
};
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
	return placement.split("-")[1];
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/computeStyles.js
var unsetSides = {
	top: "auto",
	right: "auto",
	bottom: "auto",
	left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
	var x = _ref.x, y = _ref.y;
	var dpr = win.devicePixelRatio || 1;
	return {
		x: round(x * dpr) / dpr || 0,
		y: round(y * dpr) / dpr || 0
	};
}
function mapToStyles(_ref2) {
	var _Object$assign2;
	var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
	var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
	var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
		x,
		y
	}) : {
		x,
		y
	};
	x = _ref3.x;
	y = _ref3.y;
	var hasX = offsets.hasOwnProperty("x");
	var hasY = offsets.hasOwnProperty("y");
	var sideX = left;
	var sideY = "top";
	var win = window;
	if (adaptive) {
		var offsetParent = getOffsetParent(popper);
		var heightProp = "clientHeight";
		var widthProp = "clientWidth";
		if (offsetParent === getWindow(popper)) {
			offsetParent = getDocumentElement(popper);
			if (getComputedStyle$1(offsetParent).position !== "static" && position === "absolute") {
				heightProp = "scrollHeight";
				widthProp = "scrollWidth";
			}
		}
		offsetParent = offsetParent;
		if (placement === "top" || (placement === "left" || placement === "right") && variation === "end") {
			sideY = bottom;
			var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
			y -= offsetY - popperRect.height;
			y *= gpuAcceleration ? 1 : -1;
		}
		if (placement === "left" || (placement === "top" || placement === "bottom") && variation === "end") {
			sideX = right;
			var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
			x -= offsetX - popperRect.width;
			x *= gpuAcceleration ? 1 : -1;
		}
	}
	var commonStyles = Object.assign({ position }, adaptive && unsetSides);
	var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
		x,
		y
	}, getWindow(popper)) : {
		x,
		y
	};
	x = _ref4.x;
	y = _ref4.y;
	if (gpuAcceleration) {
		var _Object$assign;
		return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
	}
	return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
	var state = _ref5.state, options = _ref5.options;
	var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
	var commonStyles = {
		placement: getBasePlacement$1(state.placement),
		variation: getVariation(state.placement),
		popper: state.elements.popper,
		popperRect: state.rects.popper,
		gpuAcceleration,
		isFixed: state.options.strategy === "fixed"
	};
	if (state.modifiersData.popperOffsets != null) state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
		offsets: state.modifiersData.popperOffsets,
		position: state.options.strategy,
		adaptive,
		roundOffsets
	})));
	if (state.modifiersData.arrow != null) state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
		offsets: state.modifiersData.arrow,
		position: "absolute",
		adaptive: false,
		roundOffsets
	})));
	state.attributes.popper = Object.assign({}, state.attributes.popper, { "data-popper-placement": state.placement });
}
var computeStyles_default = {
	name: "computeStyles",
	enabled: true,
	phase: "beforeWrite",
	fn: computeStyles,
	data: {}
};
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/eventListeners.js
var passive = { passive: true };
function effect(_ref) {
	var state = _ref.state, instance = _ref.instance, options = _ref.options;
	var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
	var window = getWindow(state.elements.popper);
	var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
	if (scroll) scrollParents.forEach(function(scrollParent) {
		scrollParent.addEventListener("scroll", instance.update, passive);
	});
	if (resize) window.addEventListener("resize", instance.update, passive);
	return function() {
		if (scroll) scrollParents.forEach(function(scrollParent) {
			scrollParent.removeEventListener("scroll", instance.update, passive);
		});
		if (resize) window.removeEventListener("resize", instance.update, passive);
	};
}
var eventListeners_default = {
	name: "eventListeners",
	enabled: true,
	phase: "write",
	fn: function fn() {},
	effect,
	data: {}
};
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash$1 = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function getOppositePlacement(placement) {
	return placement.replace(/left|right|bottom|top/g, function(matched) {
		return hash$1[matched];
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var hash = {
	start: "end",
	end: "start"
};
function getOppositeVariationPlacement(placement) {
	return placement.replace(/start|end/g, function(matched) {
		return hash[matched];
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
	var win = getWindow(node);
	return {
		scrollLeft: win.pageXOffset,
		scrollTop: win.pageYOffset
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
	return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element, strategy) {
	var win = getWindow(element);
	var html = getDocumentElement(element);
	var visualViewport = win.visualViewport;
	var width = html.clientWidth;
	var height = html.clientHeight;
	var x = 0;
	var y = 0;
	if (visualViewport) {
		width = visualViewport.width;
		height = visualViewport.height;
		var layoutViewport = isLayoutViewport();
		if (layoutViewport || !layoutViewport && strategy === "fixed") {
			x = visualViewport.offsetLeft;
			y = visualViewport.offsetTop;
		}
	}
	return {
		width,
		height,
		x: x + getWindowScrollBarX(element),
		y
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
	var _element$ownerDocumen;
	var html = getDocumentElement(element);
	var winScroll = getWindowScroll(element);
	var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
	var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
	var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
	var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
	var y = -winScroll.scrollTop;
	if (getComputedStyle$1(body || html).direction === "rtl") x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
	return {
		width,
		height,
		x,
		y
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
	var _getComputedStyle = getComputedStyle$1(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
	return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
	if ([
		"html",
		"body",
		"#document"
	].indexOf(getNodeName(node)) >= 0) return node.ownerDocument.body;
	if (isHTMLElement(node) && isScrollParent(node)) return node;
	return getScrollParent(getParentNode(node));
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
	var _element$ownerDocumen;
	if (list === void 0) list = [];
	var scrollParent = getScrollParent(element);
	var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
	var win = getWindow(scrollParent);
	var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
	var updatedList = list.concat(target);
	return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
	return Object.assign({}, rect, {
		left: rect.x,
		top: rect.y,
		right: rect.x + rect.width,
		bottom: rect.y + rect.height
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element, strategy) {
	var rect = getBoundingClientRect(element, false, strategy === "fixed");
	rect.top = rect.top + element.clientTop;
	rect.left = rect.left + element.clientLeft;
	rect.bottom = rect.top + element.clientHeight;
	rect.right = rect.left + element.clientWidth;
	rect.width = element.clientWidth;
	rect.height = element.clientHeight;
	rect.x = rect.left;
	rect.y = rect.top;
	return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
	return clippingParent === "viewport" ? rectToClientRect(getViewportRect(element, strategy)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
	var clippingParents = listScrollParents(getParentNode(element));
	var clipperElement = ["absolute", "fixed"].indexOf(getComputedStyle$1(element).position) >= 0 && isHTMLElement(element) ? getOffsetParent(element) : element;
	if (!isElement$1(clipperElement)) return [];
	return clippingParents.filter(function(clippingParent) {
		return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
	});
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
	var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
	var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
	var firstClippingParent = clippingParents[0];
	var clippingRect = clippingParents.reduce(function(accRect, clippingParent) {
		var rect = getClientRectFromMixedType(element, clippingParent, strategy);
		accRect.top = max(rect.top, accRect.top);
		accRect.right = min(rect.right, accRect.right);
		accRect.bottom = min(rect.bottom, accRect.bottom);
		accRect.left = max(rect.left, accRect.left);
		return accRect;
	}, getClientRectFromMixedType(element, firstClippingParent, strategy));
	clippingRect.width = clippingRect.right - clippingRect.left;
	clippingRect.height = clippingRect.bottom - clippingRect.top;
	clippingRect.x = clippingRect.left;
	clippingRect.y = clippingRect.top;
	return clippingRect;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
	var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
	var basePlacement = placement ? getBasePlacement$1(placement) : null;
	var variation = placement ? getVariation(placement) : null;
	var commonX = reference.x + reference.width / 2 - element.width / 2;
	var commonY = reference.y + reference.height / 2 - element.height / 2;
	var offsets;
	switch (basePlacement) {
		case "top":
			offsets = {
				x: commonX,
				y: reference.y - element.height
			};
			break;
		case bottom:
			offsets = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case right:
			offsets = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case left:
			offsets = {
				x: reference.x - element.width,
				y: commonY
			};
			break;
		default: offsets = {
			x: reference.x,
			y: reference.y
		};
	}
	var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
	if (mainAxis != null) {
		var len = mainAxis === "y" ? "height" : "width";
		switch (variation) {
			case start:
				offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
				break;
			case "end":
				offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
				break;
			default:
		}
	}
	return offsets;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state, options) {
	if (options === void 0) options = {};
	var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
	var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
	var altContext = elementContext === "popper" ? reference : popper;
	var popperRect = state.rects.popper;
	var element = state.elements[altBoundary ? altContext : elementContext];
	var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
	var referenceClientRect = getBoundingClientRect(state.elements.reference);
	var popperOffsets = computeOffsets({
		reference: referenceClientRect,
		element: popperRect,
		strategy: "absolute",
		placement
	});
	var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
	var elementClientRect = elementContext === "popper" ? popperClientRect : referenceClientRect;
	var overflowOffsets = {
		top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
		bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
		left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
		right: elementClientRect.right - clippingClientRect.right + paddingObject.right
	};
	var offsetData = state.modifiersData.offset;
	if (elementContext === "popper" && offsetData) {
		var offset = offsetData[placement];
		Object.keys(overflowOffsets).forEach(function(key) {
			var multiply = ["right", "bottom"].indexOf(key) >= 0 ? 1 : -1;
			var axis = ["top", "bottom"].indexOf(key) >= 0 ? "y" : "x";
			overflowOffsets[key] += offset[axis] * multiply;
		});
	}
	return overflowOffsets;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state, options) {
	if (options === void 0) options = {};
	var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
	var variation = getVariation(placement);
	var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement) {
		return getVariation(placement) === variation;
	}) : basePlacements;
	var allowedPlacements = placements$1.filter(function(placement) {
		return allowedAutoPlacements.indexOf(placement) >= 0;
	});
	if (allowedPlacements.length === 0) allowedPlacements = placements$1;
	var overflows = allowedPlacements.reduce(function(acc, placement) {
		acc[placement] = detectOverflow(state, {
			placement,
			boundary,
			rootBoundary,
			padding
		})[getBasePlacement$1(placement)];
		return acc;
	}, {});
	return Object.keys(overflows).sort(function(a, b) {
		return overflows[a] - overflows[b];
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
	if (getBasePlacement$1(placement) === "auto") return [];
	var oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeVariationPlacement(placement),
		oppositePlacement,
		getOppositeVariationPlacement(oppositePlacement)
	];
}
function flip(_ref) {
	var state = _ref.state, options = _ref.options, name = _ref.name;
	if (state.modifiersData[name]._skip) return;
	var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
	var preferredPlacement = state.options.placement;
	var isBasePlacement = getBasePlacement$1(preferredPlacement) === preferredPlacement;
	var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
	var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement) {
		return acc.concat(getBasePlacement$1(placement) === "auto" ? computeAutoPlacement(state, {
			placement,
			boundary,
			rootBoundary,
			padding,
			flipVariations,
			allowedAutoPlacements
		}) : placement);
	}, []);
	var referenceRect = state.rects.reference;
	var popperRect = state.rects.popper;
	var checksMap = /* @__PURE__ */ new Map();
	var makeFallbackChecks = true;
	var firstFittingPlacement = placements[0];
	for (var i = 0; i < placements.length; i++) {
		var placement = placements[i];
		var _basePlacement = getBasePlacement$1(placement);
		var isStartVariation = getVariation(placement) === start;
		var isVertical = ["top", bottom].indexOf(_basePlacement) >= 0;
		var len = isVertical ? "width" : "height";
		var overflow = detectOverflow(state, {
			placement,
			boundary,
			rootBoundary,
			altBoundary,
			padding
		});
		var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : "top";
		if (referenceRect[len] > popperRect[len]) mainVariationSide = getOppositePlacement(mainVariationSide);
		var altVariationSide = getOppositePlacement(mainVariationSide);
		var checks = [];
		if (checkMainAxis) checks.push(overflow[_basePlacement] <= 0);
		if (checkAltAxis) checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
		if (checks.every(function(check) {
			return check;
		})) {
			firstFittingPlacement = placement;
			makeFallbackChecks = false;
			break;
		}
		checksMap.set(placement, checks);
	}
	if (makeFallbackChecks) {
		var numberOfChecks = flipVariations ? 3 : 1;
		var _loop = function _loop(_i) {
			var fittingPlacement = placements.find(function(placement) {
				var checks = checksMap.get(placement);
				if (checks) return checks.slice(0, _i).every(function(check) {
					return check;
				});
			});
			if (fittingPlacement) {
				firstFittingPlacement = fittingPlacement;
				return "break";
			}
		};
		for (var _i = numberOfChecks; _i > 0; _i--) if (_loop(_i) === "break") break;
	}
	if (state.placement !== firstFittingPlacement) {
		state.modifiersData[name]._skip = true;
		state.placement = firstFittingPlacement;
		state.reset = true;
	}
}
var flip_default = {
	name: "flip",
	enabled: true,
	phase: "main",
	fn: flip,
	requiresIfExists: ["offset"],
	data: { _skip: false }
};
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
	if (preventedOffsets === void 0) preventedOffsets = {
		x: 0,
		y: 0
	};
	return {
		top: overflow.top - rect.height - preventedOffsets.y,
		right: overflow.right - rect.width + preventedOffsets.x,
		bottom: overflow.bottom - rect.height + preventedOffsets.y,
		left: overflow.left - rect.width - preventedOffsets.x
	};
}
function isAnySideFullyClipped(overflow) {
	return [
		"top",
		right,
		bottom,
		left
	].some(function(side) {
		return overflow[side] >= 0;
	});
}
function hide(_ref) {
	var state = _ref.state, name = _ref.name;
	var referenceRect = state.rects.reference;
	var popperRect = state.rects.popper;
	var preventedOffsets = state.modifiersData.preventOverflow;
	var referenceOverflow = detectOverflow(state, { elementContext: "reference" });
	var popperAltOverflow = detectOverflow(state, { altBoundary: true });
	var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
	var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
	var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
	var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
	state.modifiersData[name] = {
		referenceClippingOffsets,
		popperEscapeOffsets,
		isReferenceHidden,
		hasPopperEscaped
	};
	state.attributes.popper = Object.assign({}, state.attributes.popper, {
		"data-popper-reference-hidden": isReferenceHidden,
		"data-popper-escaped": hasPopperEscaped
	});
}
var hide_default = {
	name: "hide",
	enabled: true,
	phase: "main",
	requiresIfExists: ["preventOverflow"],
	fn: hide
};
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset) {
	var basePlacement = getBasePlacement$1(placement);
	var invertDistance = ["left", "top"].indexOf(basePlacement) >= 0 ? -1 : 1;
	var _ref = typeof offset === "function" ? offset(Object.assign({}, rects, { placement })) : offset, skidding = _ref[0], distance = _ref[1];
	skidding = skidding || 0;
	distance = (distance || 0) * invertDistance;
	return ["left", "right"].indexOf(basePlacement) >= 0 ? {
		x: distance,
		y: skidding
	} : {
		x: skidding,
		y: distance
	};
}
function offset(_ref2) {
	var state = _ref2.state, options = _ref2.options, name = _ref2.name;
	var _options$offset = options.offset, offset = _options$offset === void 0 ? [0, 0] : _options$offset;
	var data = placements.reduce(function(acc, placement) {
		acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
		return acc;
	}, {});
	var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
	if (state.modifiersData.popperOffsets != null) {
		state.modifiersData.popperOffsets.x += x;
		state.modifiersData.popperOffsets.y += y;
	}
	state.modifiersData[name] = data;
}
var offset_default = {
	name: "offset",
	enabled: true,
	phase: "main",
	requires: ["popperOffsets"],
	fn: offset
};
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
	var state = _ref.state, name = _ref.name;
	state.modifiersData[name] = computeOffsets({
		reference: state.rects.reference,
		element: state.rects.popper,
		strategy: "absolute",
		placement: state.placement
	});
}
var popperOffsets_default = {
	name: "popperOffsets",
	enabled: true,
	phase: "read",
	fn: popperOffsets,
	data: {}
};
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
	return axis === "x" ? "y" : "x";
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
	var state = _ref.state, options = _ref.options, name = _ref.name;
	var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
	var overflow = detectOverflow(state, {
		boundary,
		rootBoundary,
		padding,
		altBoundary
	});
	var basePlacement = getBasePlacement$1(state.placement);
	var variation = getVariation(state.placement);
	var isBasePlacement = !variation;
	var mainAxis = getMainAxisFromPlacement(basePlacement);
	var altAxis = getAltAxis(mainAxis);
	var popperOffsets = state.modifiersData.popperOffsets;
	var referenceRect = state.rects.reference;
	var popperRect = state.rects.popper;
	var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, { placement: state.placement })) : tetherOffset;
	var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
		mainAxis: tetherOffsetValue,
		altAxis: tetherOffsetValue
	} : Object.assign({
		mainAxis: 0,
		altAxis: 0
	}, tetherOffsetValue);
	var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
	var data = {
		x: 0,
		y: 0
	};
	if (!popperOffsets) return;
	if (checkMainAxis) {
		var _offsetModifierState$;
		var mainSide = mainAxis === "y" ? "top" : left;
		var altSide = mainAxis === "y" ? bottom : right;
		var len = mainAxis === "y" ? "height" : "width";
		var offset = popperOffsets[mainAxis];
		var min$1 = offset + overflow[mainSide];
		var max$1 = offset - overflow[altSide];
		var additive = tether ? -popperRect[len] / 2 : 0;
		var minLen = variation === "start" ? referenceRect[len] : popperRect[len];
		var maxLen = variation === "start" ? -popperRect[len] : -referenceRect[len];
		var arrowElement = state.elements.arrow;
		var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
			width: 0,
			height: 0
		};
		var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
		var arrowPaddingMin = arrowPaddingObject[mainSide];
		var arrowPaddingMax = arrowPaddingObject[altSide];
		var arrowLen = within(0, referenceRect[len], arrowRect[len]);
		var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
		var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
		var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
		var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
		var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
		var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
		var tetherMax = offset + maxOffset - offsetModifierValue;
		var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
		popperOffsets[mainAxis] = preventedOffset;
		data[mainAxis] = preventedOffset - offset;
	}
	if (checkAltAxis) {
		var _offsetModifierState$2;
		var _mainSide = mainAxis === "x" ? "top" : left;
		var _altSide = mainAxis === "x" ? bottom : right;
		var _offset = popperOffsets[altAxis];
		var _len = altAxis === "y" ? "height" : "width";
		var _min = _offset + overflow[_mainSide];
		var _max = _offset - overflow[_altSide];
		var isOriginSide = ["top", left].indexOf(basePlacement) !== -1;
		var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
		var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
		var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
		var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
		popperOffsets[altAxis] = _preventedOffset;
		data[altAxis] = _preventedOffset - _offset;
	}
	state.modifiersData[name] = data;
}
var preventOverflow_default = {
	name: "preventOverflow",
	enabled: true,
	phase: "main",
	fn: preventOverflow,
	requiresIfExists: ["offset"]
};
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
	return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
	if (node === getWindow(node) || !isHTMLElement(node)) return getWindowScroll(node);
	else return getHTMLElementScroll(node);
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
	var rect = element.getBoundingClientRect();
	var scaleX = round(rect.width) / element.offsetWidth || 1;
	var scaleY = round(rect.height) / element.offsetHeight || 1;
	return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
	if (isFixed === void 0) isFixed = false;
	var isOffsetParentAnElement = isHTMLElement(offsetParent);
	var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
	var documentElement = getDocumentElement(offsetParent);
	var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
	var scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	var offsets = {
		x: 0,
		y: 0
	};
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isHTMLElement(offsetParent)) {
			offsets = getBoundingClientRect(offsetParent, true);
			offsets.x += offsetParent.clientLeft;
			offsets.y += offsetParent.clientTop;
		} else if (documentElement) offsets.x = getWindowScrollBarX(documentElement);
	}
	return {
		x: rect.left + scroll.scrollLeft - offsets.x,
		y: rect.top + scroll.scrollTop - offsets.y,
		width: rect.width,
		height: rect.height
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
	var map = /* @__PURE__ */ new Map();
	var visited = /* @__PURE__ */ new Set();
	var result = [];
	modifiers.forEach(function(modifier) {
		map.set(modifier.name, modifier);
	});
	function sort(modifier) {
		visited.add(modifier.name);
		[].concat(modifier.requires || [], modifier.requiresIfExists || []).forEach(function(dep) {
			if (!visited.has(dep)) {
				var depModifier = map.get(dep);
				if (depModifier) sort(depModifier);
			}
		});
		result.push(modifier);
	}
	modifiers.forEach(function(modifier) {
		if (!visited.has(modifier.name)) sort(modifier);
	});
	return result;
}
function orderModifiers(modifiers) {
	var orderedModifiers = order(modifiers);
	return modifierPhases.reduce(function(acc, phase) {
		return acc.concat(orderedModifiers.filter(function(modifier) {
			return modifier.phase === phase;
		}));
	}, []);
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/debounce.js
function debounce$1(fn) {
	var pending;
	return function() {
		if (!pending) pending = new Promise(function(resolve) {
			Promise.resolve().then(function() {
				pending = void 0;
				resolve(fn());
			});
		});
		return pending;
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
	var merged = modifiers.reduce(function(merged, current) {
		var existing = merged[current.name];
		merged[current.name] = existing ? Object.assign({}, existing, current, {
			options: Object.assign({}, existing.options, current.options),
			data: Object.assign({}, existing.data, current.data)
		}) : current;
		return merged;
	}, {});
	return Object.keys(merged).map(function(key) {
		return merged[key];
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/createPopper.js
var DEFAULT_OPTIONS = {
	placement: "bottom",
	modifiers: [],
	strategy: "absolute"
};
function areValidElements() {
	for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
	return !args.some(function(element) {
		return !(element && typeof element.getBoundingClientRect === "function");
	});
}
function popperGenerator(generatorOptions) {
	if (generatorOptions === void 0) generatorOptions = {};
	var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
	return function createPopper(reference, popper, options) {
		if (options === void 0) options = defaultOptions;
		var state = {
			placement: "bottom",
			orderedModifiers: [],
			options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
			modifiersData: {},
			elements: {
				reference,
				popper
			},
			attributes: {},
			styles: {}
		};
		var effectCleanupFns = [];
		var isDestroyed = false;
		var instance = {
			state,
			setOptions: function setOptions(setOptionsAction) {
				var options = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
				cleanupModifierEffects();
				state.options = Object.assign({}, defaultOptions, state.options, options);
				state.scrollParents = {
					reference: isElement$1(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
					popper: listScrollParents(popper)
				};
				var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers)));
				state.orderedModifiers = orderedModifiers.filter(function(m) {
					return m.enabled;
				});
				runModifierEffects();
				return instance.update();
			},
			forceUpdate: function forceUpdate() {
				if (isDestroyed) return;
				var _state$elements = state.elements, reference = _state$elements.reference, popper = _state$elements.popper;
				if (!areValidElements(reference, popper)) return;
				state.rects = {
					reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === "fixed"),
					popper: getLayoutRect(popper)
				};
				state.reset = false;
				state.placement = state.options.placement;
				state.orderedModifiers.forEach(function(modifier) {
					return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
				});
				for (var index = 0; index < state.orderedModifiers.length; index++) {
					if (state.reset === true) {
						state.reset = false;
						index = -1;
						continue;
					}
					var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
					if (typeof fn === "function") state = fn({
						state,
						options: _options,
						name,
						instance
					}) || state;
				}
			},
			update: debounce$1(function() {
				return new Promise(function(resolve) {
					instance.forceUpdate();
					resolve(state);
				});
			}),
			destroy: function destroy() {
				cleanupModifierEffects();
				isDestroyed = true;
			}
		};
		if (!areValidElements(reference, popper)) return instance;
		instance.setOptions(options).then(function(state) {
			if (!isDestroyed && options.onFirstUpdate) options.onFirstUpdate(state);
		});
		function runModifierEffects() {
			state.orderedModifiers.forEach(function(_ref) {
				var name = _ref.name, _ref$options = _ref.options, options = _ref$options === void 0 ? {} : _ref$options, effect = _ref.effect;
				if (typeof effect === "function") {
					var cleanupFn = effect({
						state,
						name,
						instance,
						options
					});
					effectCleanupFns.push(cleanupFn || function noopFn() {});
				}
			});
		}
		function cleanupModifierEffects() {
			effectCleanupFns.forEach(function(fn) {
				return fn();
			});
			effectCleanupFns = [];
		}
		return instance;
	};
}
var createPopper = /* @__PURE__ */ popperGenerator({ defaultModifiers: [
	eventListeners_default,
	popperOffsets_default,
	computeStyles_default,
	applyStyles_default,
	offset_default,
	flip_default,
	preventOverflow_default,
	arrow_default,
	hide_default
] });
//#endregion
//#region node_modules/tippy.js/dist/tippy.esm.js
/**!
* tippy.js v6.3.7
* (c) 2017-2021 atomiks
* MIT License
*/
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
	passive: true,
	capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
	return document.body;
};
function getValueAtIndexOrReturn(value, index, defaultValue) {
	if (Array.isArray(value)) {
		var v = value[index];
		return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
	}
	return value;
}
function isType(value, type) {
	var str = {}.toString.call(value);
	return str.indexOf("[object") === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
	return typeof value === "function" ? value.apply(void 0, args) : value;
}
function debounce(fn, ms) {
	if (ms === 0) return fn;
	var timeout;
	return function(arg) {
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			fn(arg);
		}, ms);
	};
}
function splitBySpaces(value) {
	return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
	return [].concat(value);
}
function pushIfUnique(arr, value) {
	if (arr.indexOf(value) === -1) arr.push(value);
}
function unique(arr) {
	return arr.filter(function(item, index) {
		return arr.indexOf(item) === index;
	});
}
function getBasePlacement(placement) {
	return placement.split("-")[0];
}
function arrayFrom(value) {
	return [].slice.call(value);
}
function removeUndefinedProps(obj) {
	return Object.keys(obj).reduce(function(acc, key) {
		if (obj[key] !== void 0) acc[key] = obj[key];
		return acc;
	}, {});
}
function div() {
	return document.createElement("div");
}
function isElement(value) {
	return ["Element", "Fragment"].some(function(type) {
		return isType(value, type);
	});
}
function isNodeList(value) {
	return isType(value, "NodeList");
}
function isMouseEvent(value) {
	return isType(value, "MouseEvent");
}
function isReferenceElement(value) {
	return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
	if (isElement(value)) return [value];
	if (isNodeList(value)) return arrayFrom(value);
	if (Array.isArray(value)) return value;
	return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
	els.forEach(function(el) {
		if (el) el.style.transitionDuration = value + "ms";
	});
}
function setVisibilityState(els, state) {
	els.forEach(function(el) {
		if (el) el.setAttribute("data-state", state);
	});
}
function getOwnerDocument(elementOrElements) {
	var _element$ownerDocumen;
	var element = normalizeToArray(elementOrElements)[0];
	return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
	var clientX = event.clientX, clientY = event.clientY;
	return popperTreeData.every(function(_ref) {
		var popperRect = _ref.popperRect, popperState = _ref.popperState;
		var interactiveBorder = _ref.props.interactiveBorder;
		var basePlacement = getBasePlacement(popperState.placement);
		var offsetData = popperState.modifiersData.offset;
		if (!offsetData) return true;
		var topDistance = basePlacement === "bottom" ? offsetData.top.y : 0;
		var bottomDistance = basePlacement === "top" ? offsetData.bottom.y : 0;
		var leftDistance = basePlacement === "right" ? offsetData.left.x : 0;
		var rightDistance = basePlacement === "left" ? offsetData.right.x : 0;
		var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
		var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
		var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
		var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
		return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
	});
}
function updateTransitionEndListener(box, action, listener) {
	var method = action + "EventListener";
	["transitionend", "webkitTransitionEnd"].forEach(function(event) {
		box[method](event, listener);
	});
}
/**
* Compared to xxx.contains, this function works for dom structures with shadow
* dom
*/
function actualContains(parent, child) {
	var target = child;
	while (target) {
		var _target$getRootNode;
		if (parent.contains(target)) return true;
		target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
	}
	return false;
}
var currentInput = { isTouch: false };
var lastMouseMoveTime = 0;
/**
* When a `touchstart` event is fired, it's assumed the user is using touch
* input. We'll bind a `mousemove` event listener to listen for mouse input in
* the future. This way, the `isTouch` property is fully dynamic and will handle
* hybrid devices that use a mix of touch + mouse input.
*/
function onDocumentTouchStart() {
	if (currentInput.isTouch) return;
	currentInput.isTouch = true;
	if (window.performance) document.addEventListener("mousemove", onDocumentMouseMove);
}
/**
* When two `mousemove` event are fired consecutively within 20ms, it's assumed
* the user is using mouse input again. `mousemove` can fire on touch devices as
* well, but very rarely that quickly.
*/
function onDocumentMouseMove() {
	var now = performance.now();
	if (now - lastMouseMoveTime < 20) {
		currentInput.isTouch = false;
		document.removeEventListener("mousemove", onDocumentMouseMove);
	}
	lastMouseMoveTime = now;
}
/**
* When an element is in focus and has a tippy, leaving the tab/window and
* returning causes it to show again. For mouse users this is unexpected, but
* for keyboard use it makes sense.
* TODO: find a better technique to solve this problem
*/
function onWindowBlur() {
	var activeElement = document.activeElement;
	if (isReferenceElement(activeElement)) {
		var instance = activeElement._tippy;
		if (activeElement.blur && !instance.state.isVisible) activeElement.blur();
	}
}
function bindGlobalEventListeners() {
	document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
	window.addEventListener("blur", onWindowBlur);
}
var isIE11 = typeof window !== "undefined" && typeof document !== "undefined" ? !!window.msCrypto : false;
var defaultProps = Object.assign({
	appendTo: TIPPY_DEFAULT_APPEND_TO,
	aria: {
		content: "auto",
		expanded: "auto"
	},
	delay: 0,
	duration: [300, 250],
	getReferenceClientRect: null,
	hideOnClick: true,
	ignoreAttributes: false,
	interactive: false,
	interactiveBorder: 2,
	interactiveDebounce: 0,
	moveTransition: "",
	offset: [0, 10],
	onAfterUpdate: function onAfterUpdate() {},
	onBeforeUpdate: function onBeforeUpdate() {},
	onCreate: function onCreate() {},
	onDestroy: function onDestroy() {},
	onHidden: function onHidden() {},
	onHide: function onHide() {},
	onMount: function onMount() {},
	onShow: function onShow() {},
	onShown: function onShown() {},
	onTrigger: function onTrigger() {},
	onUntrigger: function onUntrigger() {},
	onClickOutside: function onClickOutside() {},
	placement: "top",
	plugins: [],
	popperOptions: {},
	render: null,
	showOnCreate: false,
	touch: true,
	trigger: "mouseenter focus",
	triggerTarget: null
}, {
	animateFill: false,
	followCursor: false,
	inlinePositioning: false,
	sticky: false
}, {
	allowHTML: false,
	animation: "fade",
	arrow: true,
	content: "",
	inertia: false,
	maxWidth: 350,
	role: "tooltip",
	theme: "",
	zIndex: 9999
});
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps(partialProps) {
	Object.keys(partialProps).forEach(function(key) {
		defaultProps[key] = partialProps[key];
	});
};
function getExtendedPassedProps(passedProps) {
	var pluginProps = (passedProps.plugins || []).reduce(function(acc, plugin) {
		var name = plugin.name, defaultValue = plugin.defaultValue;
		if (name) {
			var _name;
			acc[name] = passedProps[name] !== void 0 ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
		}
		return acc;
	}, {});
	return Object.assign({}, passedProps, pluginProps);
}
function getDataAttributeProps(reference, plugins) {
	return (plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, { plugins }))) : defaultKeys).reduce(function(acc, key) {
		var valueAsString = (reference.getAttribute("data-tippy-" + key) || "").trim();
		if (!valueAsString) return acc;
		if (key === "content") acc[key] = valueAsString;
		else try {
			acc[key] = JSON.parse(valueAsString);
		} catch (e) {
			acc[key] = valueAsString;
		}
		return acc;
	}, {});
}
function evaluateProps(reference, props) {
	var out = Object.assign({}, props, { content: invokeWithArgsOrReturn(props.content, [reference]) }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
	out.aria = Object.assign({}, defaultProps.aria, out.aria);
	out.aria = {
		expanded: out.aria.expanded === "auto" ? props.interactive : out.aria.expanded,
		content: out.aria.content === "auto" ? props.interactive ? null : "describedby" : out.aria.content
	};
	return out;
}
var innerHTML = function innerHTML() {
	return "innerHTML";
};
function dangerouslySetInnerHTML(element, html) {
	element[innerHTML()] = html;
}
function createArrowElement(value) {
	var arrow = div();
	if (value === true) arrow.className = ARROW_CLASS;
	else {
		arrow.className = SVG_ARROW_CLASS;
		if (isElement(value)) arrow.appendChild(value);
		else dangerouslySetInnerHTML(arrow, value);
	}
	return arrow;
}
function setContent(content, props) {
	if (isElement(props.content)) {
		dangerouslySetInnerHTML(content, "");
		content.appendChild(props.content);
	} else if (typeof props.content !== "function") if (props.allowHTML) dangerouslySetInnerHTML(content, props.content);
	else content.textContent = props.content;
}
function getChildren(popper) {
	var box = popper.firstElementChild;
	var boxChildren = arrayFrom(box.children);
	return {
		box,
		content: boxChildren.find(function(node) {
			return node.classList.contains(CONTENT_CLASS);
		}),
		arrow: boxChildren.find(function(node) {
			return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
		}),
		backdrop: boxChildren.find(function(node) {
			return node.classList.contains(BACKDROP_CLASS);
		})
	};
}
function render(instance) {
	var popper = div();
	var box = div();
	box.className = BOX_CLASS;
	box.setAttribute("data-state", "hidden");
	box.setAttribute("tabindex", "-1");
	var content = div();
	content.className = CONTENT_CLASS;
	content.setAttribute("data-state", "hidden");
	setContent(content, instance.props);
	popper.appendChild(box);
	box.appendChild(content);
	onUpdate(instance.props, instance.props);
	function onUpdate(prevProps, nextProps) {
		var _getChildren = getChildren(popper), box = _getChildren.box, content = _getChildren.content, arrow = _getChildren.arrow;
		if (nextProps.theme) box.setAttribute("data-theme", nextProps.theme);
		else box.removeAttribute("data-theme");
		if (typeof nextProps.animation === "string") box.setAttribute("data-animation", nextProps.animation);
		else box.removeAttribute("data-animation");
		if (nextProps.inertia) box.setAttribute("data-inertia", "");
		else box.removeAttribute("data-inertia");
		box.style.maxWidth = typeof nextProps.maxWidth === "number" ? nextProps.maxWidth + "px" : nextProps.maxWidth;
		if (nextProps.role) box.setAttribute("role", nextProps.role);
		else box.removeAttribute("role");
		if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) setContent(content, instance.props);
		if (nextProps.arrow) {
			if (!arrow) box.appendChild(createArrowElement(nextProps.arrow));
			else if (prevProps.arrow !== nextProps.arrow) {
				box.removeChild(arrow);
				box.appendChild(createArrowElement(nextProps.arrow));
			}
		} else if (arrow) box.removeChild(arrow);
	}
	return {
		popper,
		onUpdate
	};
}
render.$$tippy = true;
var idCounter = 1;
var mouseMoveListeners = [];
var mountedInstances = [];
function createTippy(reference, passedProps) {
	var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
	var showTimeout;
	var hideTimeout;
	var scheduleHideAnimationFrame;
	var isVisibleFromClick = false;
	var didHideDueToDocumentMouseDown = false;
	var didTouchMove = false;
	var ignoreOnFirstUpdate = false;
	var lastTriggerEvent;
	var currentTransitionEndListener;
	var onFirstUpdate;
	var listeners = [];
	var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
	var currentTarget;
	var id = idCounter++;
	var popperInstance = null;
	var plugins = unique(props.plugins);
	var instance = {
		id,
		reference,
		popper: div(),
		popperInstance,
		props,
		state: {
			isEnabled: true,
			isVisible: false,
			isDestroyed: false,
			isMounted: false,
			isShown: false
		},
		plugins,
		clearDelayTimeouts,
		setProps,
		setContent,
		show,
		hide,
		hideWithInteractivity,
		enable,
		disable,
		unmount,
		destroy
	};
	/* istanbul ignore if */
	if (!props.render) return instance;
	var _props$render = props.render(instance), popper = _props$render.popper, onUpdate = _props$render.onUpdate;
	popper.setAttribute("data-tippy-root", "");
	popper.id = "tippy-" + instance.id;
	instance.popper = popper;
	reference._tippy = instance;
	popper._tippy = instance;
	var pluginsHooks = plugins.map(function(plugin) {
		return plugin.fn(instance);
	});
	var hasAriaExpanded = reference.hasAttribute("aria-expanded");
	addListeners();
	handleAriaExpandedAttribute();
	handleStyles();
	invokeHook("onCreate", [instance]);
	if (props.showOnCreate) scheduleShow();
	popper.addEventListener("mouseenter", function() {
		if (instance.props.interactive && instance.state.isVisible) instance.clearDelayTimeouts();
	});
	popper.addEventListener("mouseleave", function() {
		if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) getDocument().addEventListener("mousemove", debouncedOnMouseMove);
	});
	return instance;
	function getNormalizedTouchSettings() {
		var touch = instance.props.touch;
		return Array.isArray(touch) ? touch : [touch, 0];
	}
	function getIsCustomTouchBehavior() {
		return getNormalizedTouchSettings()[0] === "hold";
	}
	function getIsDefaultRenderFn() {
		var _instance$props$rende;
		return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
	}
	function getCurrentTarget() {
		return currentTarget || reference;
	}
	function getDocument() {
		var parent = getCurrentTarget().parentNode;
		return parent ? getOwnerDocument(parent) : document;
	}
	function getDefaultTemplateChildren() {
		return getChildren(popper);
	}
	function getDelay(isShow) {
		if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === "focus") return 0;
		return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
	}
	function handleStyles(fromHide) {
		if (fromHide === void 0) fromHide = false;
		popper.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
		popper.style.zIndex = "" + instance.props.zIndex;
	}
	function invokeHook(hook, args, shouldInvokePropsHook) {
		if (shouldInvokePropsHook === void 0) shouldInvokePropsHook = true;
		pluginsHooks.forEach(function(pluginHooks) {
			if (pluginHooks[hook]) pluginHooks[hook].apply(pluginHooks, args);
		});
		if (shouldInvokePropsHook) {
			var _instance$props;
			(_instance$props = instance.props)[hook].apply(_instance$props, args);
		}
	}
	function handleAriaContentAttribute() {
		var aria = instance.props.aria;
		if (!aria.content) return;
		var attr = "aria-" + aria.content;
		var id = popper.id;
		normalizeToArray(instance.props.triggerTarget || reference).forEach(function(node) {
			var currentValue = node.getAttribute(attr);
			if (instance.state.isVisible) node.setAttribute(attr, currentValue ? currentValue + " " + id : id);
			else {
				var nextValue = currentValue && currentValue.replace(id, "").trim();
				if (nextValue) node.setAttribute(attr, nextValue);
				else node.removeAttribute(attr);
			}
		});
	}
	function handleAriaExpandedAttribute() {
		if (hasAriaExpanded || !instance.props.aria.expanded) return;
		normalizeToArray(instance.props.triggerTarget || reference).forEach(function(node) {
			if (instance.props.interactive) node.setAttribute("aria-expanded", instance.state.isVisible && node === getCurrentTarget() ? "true" : "false");
			else node.removeAttribute("aria-expanded");
		});
	}
	function cleanupInteractiveMouseListeners() {
		getDocument().removeEventListener("mousemove", debouncedOnMouseMove);
		mouseMoveListeners = mouseMoveListeners.filter(function(listener) {
			return listener !== debouncedOnMouseMove;
		});
	}
	function onDocumentPress(event) {
		if (currentInput.isTouch) {
			if (didTouchMove || event.type === "mousedown") return;
		}
		var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
		if (instance.props.interactive && actualContains(popper, actualTarget)) return;
		if (normalizeToArray(instance.props.triggerTarget || reference).some(function(el) {
			return actualContains(el, actualTarget);
		})) {
			if (currentInput.isTouch) return;
			if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) return;
		} else invokeHook("onClickOutside", [instance, event]);
		if (instance.props.hideOnClick === true) {
			instance.clearDelayTimeouts();
			instance.hide();
			didHideDueToDocumentMouseDown = true;
			setTimeout(function() {
				didHideDueToDocumentMouseDown = false;
			});
			if (!instance.state.isMounted) removeDocumentPress();
		}
	}
	function onTouchMove() {
		didTouchMove = true;
	}
	function onTouchStart() {
		didTouchMove = false;
	}
	function addDocumentPress() {
		var doc = getDocument();
		doc.addEventListener("mousedown", onDocumentPress, true);
		doc.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
		doc.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
		doc.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
	}
	function removeDocumentPress() {
		var doc = getDocument();
		doc.removeEventListener("mousedown", onDocumentPress, true);
		doc.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
		doc.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
		doc.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
	}
	function onTransitionedOut(duration, callback) {
		onTransitionEnd(duration, function() {
			if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) callback();
		});
	}
	function onTransitionedIn(duration, callback) {
		onTransitionEnd(duration, callback);
	}
	function onTransitionEnd(duration, callback) {
		var box = getDefaultTemplateChildren().box;
		function listener(event) {
			if (event.target === box) {
				updateTransitionEndListener(box, "remove", listener);
				callback();
			}
		}
		if (duration === 0) return callback();
		updateTransitionEndListener(box, "remove", currentTransitionEndListener);
		updateTransitionEndListener(box, "add", listener);
		currentTransitionEndListener = listener;
	}
	function on(eventType, handler, options) {
		if (options === void 0) options = false;
		normalizeToArray(instance.props.triggerTarget || reference).forEach(function(node) {
			node.addEventListener(eventType, handler, options);
			listeners.push({
				node,
				eventType,
				handler,
				options
			});
		});
	}
	function addListeners() {
		if (getIsCustomTouchBehavior()) {
			on("touchstart", onTrigger, { passive: true });
			on("touchend", onMouseLeave, { passive: true });
		}
		splitBySpaces(instance.props.trigger).forEach(function(eventType) {
			if (eventType === "manual") return;
			on(eventType, onTrigger);
			switch (eventType) {
				case "mouseenter":
					on("mouseleave", onMouseLeave);
					break;
				case "focus":
					on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
					break;
				case "focusin":
					on("focusout", onBlurOrFocusOut);
					break;
			}
		});
	}
	function removeListeners() {
		listeners.forEach(function(_ref) {
			var node = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
			node.removeEventListener(eventType, handler, options);
		});
		listeners = [];
	}
	function onTrigger(event) {
		var _lastTriggerEvent;
		var shouldScheduleClickHide = false;
		if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) return;
		var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === "focus";
		lastTriggerEvent = event;
		currentTarget = event.currentTarget;
		handleAriaExpandedAttribute();
		if (!instance.state.isVisible && isMouseEvent(event)) mouseMoveListeners.forEach(function(listener) {
			return listener(event);
		});
		if (event.type === "click" && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) shouldScheduleClickHide = true;
		else scheduleShow(event);
		if (event.type === "click") isVisibleFromClick = !shouldScheduleClickHide;
		if (shouldScheduleClickHide && !wasFocused) scheduleHide(event);
	}
	function onMouseMove(event) {
		var target = event.target;
		var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);
		if (event.type === "mousemove" && isCursorOverReferenceOrPopper) return;
		if (isCursorOutsideInteractiveBorder(getNestedPopperTree().concat(popper).map(function(popper) {
			var _instance$popperInsta;
			var state = (_instance$popperInsta = popper._tippy.popperInstance) == null ? void 0 : _instance$popperInsta.state;
			if (state) return {
				popperRect: popper.getBoundingClientRect(),
				popperState: state,
				props
			};
			return null;
		}).filter(Boolean), event)) {
			cleanupInteractiveMouseListeners();
			scheduleHide(event);
		}
	}
	function onMouseLeave(event) {
		if (isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick) return;
		if (instance.props.interactive) {
			instance.hideWithInteractivity(event);
			return;
		}
		scheduleHide(event);
	}
	function onBlurOrFocusOut(event) {
		if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) return;
		if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) return;
		scheduleHide(event);
	}
	function isEventListenerStopped(event) {
		return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
	}
	function createPopperInstance() {
		destroyPopperInstance();
		var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
		var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
		var computedReference = getReferenceClientRect ? {
			getBoundingClientRect: getReferenceClientRect,
			contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
		} : reference;
		var modifiers = [
			{
				name: "offset",
				options: { offset }
			},
			{
				name: "preventOverflow",
				options: { padding: {
					top: 2,
					bottom: 2,
					left: 5,
					right: 5
				} }
			},
			{
				name: "flip",
				options: { padding: 5 }
			},
			{
				name: "computeStyles",
				options: { adaptive: !moveTransition }
			},
			{
				name: "$$tippy",
				enabled: true,
				phase: "beforeWrite",
				requires: ["computeStyles"],
				fn: function fn(_ref2) {
					var state = _ref2.state;
					if (getIsDefaultRenderFn()) {
						var box = getDefaultTemplateChildren().box;
						[
							"placement",
							"reference-hidden",
							"escaped"
						].forEach(function(attr) {
							if (attr === "placement") box.setAttribute("data-placement", state.placement);
							else if (state.attributes.popper["data-popper-" + attr]) box.setAttribute("data-" + attr, "");
							else box.removeAttribute("data-" + attr);
						});
						state.attributes.popper = {};
					}
				}
			}
		];
		if (getIsDefaultRenderFn() && arrow) modifiers.push({
			name: "arrow",
			options: {
				element: arrow,
				padding: 3
			}
		});
		modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
		instance.popperInstance = createPopper(computedReference, popper, Object.assign({}, popperOptions, {
			placement,
			onFirstUpdate,
			modifiers
		}));
	}
	function destroyPopperInstance() {
		if (instance.popperInstance) {
			instance.popperInstance.destroy();
			instance.popperInstance = null;
		}
	}
	function mount() {
		var appendTo = instance.props.appendTo;
		var parentNode;
		var node = getCurrentTarget();
		if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === "parent") parentNode = node.parentNode;
		else parentNode = invokeWithArgsOrReturn(appendTo, [node]);
		if (!parentNode.contains(popper)) parentNode.appendChild(popper);
		instance.state.isMounted = true;
		createPopperInstance();
	}
	function getNestedPopperTree() {
		return arrayFrom(popper.querySelectorAll("[data-tippy-root]"));
	}
	function scheduleShow(event) {
		instance.clearDelayTimeouts();
		if (event) invokeHook("onTrigger", [instance, event]);
		addDocumentPress();
		var delay = getDelay(true);
		var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
		if (currentInput.isTouch && touchValue === "hold" && touchDelay) delay = touchDelay;
		if (delay) showTimeout = setTimeout(function() {
			instance.show();
		}, delay);
		else instance.show();
	}
	function scheduleHide(event) {
		instance.clearDelayTimeouts();
		invokeHook("onUntrigger", [instance, event]);
		if (!instance.state.isVisible) {
			removeDocumentPress();
			return;
		}
		if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(event.type) >= 0 && isVisibleFromClick) return;
		var delay = getDelay(false);
		if (delay) hideTimeout = setTimeout(function() {
			if (instance.state.isVisible) instance.hide();
		}, delay);
		else scheduleHideAnimationFrame = requestAnimationFrame(function() {
			instance.hide();
		});
	}
	function enable() {
		instance.state.isEnabled = true;
	}
	function disable() {
		instance.hide();
		instance.state.isEnabled = false;
	}
	function clearDelayTimeouts() {
		clearTimeout(showTimeout);
		clearTimeout(hideTimeout);
		cancelAnimationFrame(scheduleHideAnimationFrame);
	}
	function setProps(partialProps) {
		if (instance.state.isDestroyed) return;
		invokeHook("onBeforeUpdate", [instance, partialProps]);
		removeListeners();
		var prevProps = instance.props;
		var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), { ignoreAttributes: true }));
		instance.props = nextProps;
		addListeners();
		if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
			cleanupInteractiveMouseListeners();
			debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
		}
		if (prevProps.triggerTarget && !nextProps.triggerTarget) normalizeToArray(prevProps.triggerTarget).forEach(function(node) {
			node.removeAttribute("aria-expanded");
		});
		else if (nextProps.triggerTarget) reference.removeAttribute("aria-expanded");
		handleAriaExpandedAttribute();
		handleStyles();
		if (onUpdate) onUpdate(prevProps, nextProps);
		if (instance.popperInstance) {
			createPopperInstance();
			getNestedPopperTree().forEach(function(nestedPopper) {
				requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
			});
		}
		invokeHook("onAfterUpdate", [instance, partialProps]);
	}
	function setContent(content) {
		instance.setProps({ content });
	}
	function show() {
		var isAlreadyVisible = instance.state.isVisible;
		var isDestroyed = instance.state.isDestroyed;
		var isDisabled = !instance.state.isEnabled;
		var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
		var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
		if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) return;
		if (getCurrentTarget().hasAttribute("disabled")) return;
		invokeHook("onShow", [instance], false);
		if (instance.props.onShow(instance) === false) return;
		instance.state.isVisible = true;
		if (getIsDefaultRenderFn()) popper.style.visibility = "visible";
		handleStyles();
		addDocumentPress();
		if (!instance.state.isMounted) popper.style.transition = "none";
		if (getIsDefaultRenderFn()) {
			var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content = _getDefaultTemplateCh2.content;
			setTransitionDuration([box, content], 0);
		}
		onFirstUpdate = function onFirstUpdate() {
			var _instance$popperInsta2;
			if (!instance.state.isVisible || ignoreOnFirstUpdate) return;
			ignoreOnFirstUpdate = true;
			popper.offsetHeight;
			popper.style.transition = instance.props.moveTransition;
			if (getIsDefaultRenderFn() && instance.props.animation) {
				var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
				setTransitionDuration([_box, _content], duration);
				setVisibilityState([_box, _content], "visible");
			}
			handleAriaContentAttribute();
			handleAriaExpandedAttribute();
			pushIfUnique(mountedInstances, instance);
			(_instance$popperInsta2 = instance.popperInstance) == null || _instance$popperInsta2.forceUpdate();
			invokeHook("onMount", [instance]);
			if (instance.props.animation && getIsDefaultRenderFn()) onTransitionedIn(duration, function() {
				instance.state.isShown = true;
				invokeHook("onShown", [instance]);
			});
		};
		mount();
	}
	function hide() {
		var isAlreadyHidden = !instance.state.isVisible;
		var isDestroyed = instance.state.isDestroyed;
		var isDisabled = !instance.state.isEnabled;
		var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
		if (isAlreadyHidden || isDestroyed || isDisabled) return;
		invokeHook("onHide", [instance], false);
		if (instance.props.onHide(instance) === false) return;
		instance.state.isVisible = false;
		instance.state.isShown = false;
		ignoreOnFirstUpdate = false;
		isVisibleFromClick = false;
		if (getIsDefaultRenderFn()) popper.style.visibility = "hidden";
		cleanupInteractiveMouseListeners();
		removeDocumentPress();
		handleStyles(true);
		if (getIsDefaultRenderFn()) {
			var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content = _getDefaultTemplateCh4.content;
			if (instance.props.animation) {
				setTransitionDuration([box, content], duration);
				setVisibilityState([box, content], "hidden");
			}
		}
		handleAriaContentAttribute();
		handleAriaExpandedAttribute();
		if (instance.props.animation) {
			if (getIsDefaultRenderFn()) onTransitionedOut(duration, instance.unmount);
		} else instance.unmount();
	}
	function hideWithInteractivity(event) {
		getDocument().addEventListener("mousemove", debouncedOnMouseMove);
		pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
		debouncedOnMouseMove(event);
	}
	function unmount() {
		if (instance.state.isVisible) instance.hide();
		if (!instance.state.isMounted) return;
		destroyPopperInstance();
		getNestedPopperTree().forEach(function(nestedPopper) {
			nestedPopper._tippy.unmount();
		});
		if (popper.parentNode) popper.parentNode.removeChild(popper);
		mountedInstances = mountedInstances.filter(function(i) {
			return i !== instance;
		});
		instance.state.isMounted = false;
		invokeHook("onHidden", [instance]);
	}
	function destroy() {
		if (instance.state.isDestroyed) return;
		instance.clearDelayTimeouts();
		instance.unmount();
		removeListeners();
		delete reference._tippy;
		instance.state.isDestroyed = true;
		invokeHook("onDestroy", [instance]);
	}
}
function tippy(targets, optionalProps) {
	if (optionalProps === void 0) optionalProps = {};
	var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
	bindGlobalEventListeners();
	var passedProps = Object.assign({}, optionalProps, { plugins });
	var instances = getArrayOfElements(targets).reduce(function(acc, reference) {
		var instance = reference && createTippy(reference, passedProps);
		if (instance) acc.push(instance);
		return acc;
	}, []);
	return isElement(targets) ? instances[0] : instances;
}
tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;
Object.assign({}, applyStyles_default, { effect: function effect(_ref) {
	var state = _ref.state;
	var initialStyles = {
		popper: {
			position: state.options.strategy,
			left: "0",
			top: "0",
			margin: "0"
		},
		arrow: { position: "absolute" },
		reference: {}
	};
	Object.assign(state.elements.popper.style, initialStyles.popper);
	state.styles = initialStyles;
	if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
} });
tippy.setDefaultProps({ render });
//#endregion
//#region src/components/effects/tippy/tippy.js
var tippyItems = document.querySelectorAll("[data-fls-tippy-content]");
if (tippyItems.length) tippy(tippyItems, {
	content(reference) {
		return reference.dataset.flsTippyContent || "";
	},
	allowHTML: false,
	arrow: true,
	theme: "single-product-service"
});
//#endregion
//#region src/components/sections/single-products/single-products.js
function initSingleProductStickyPurchase() {
	const desktopMedia = window.matchMedia("(min-width: 991.98px)");
	document.querySelectorAll("[data-fls-single-products]").forEach((section) => {
		const purchaseButton = section.querySelector(".single-product__button");
		const stickyButton = section.querySelector(".single-product__sticky-button");
		if (!purchaseButton || !stickyButton) return;
		const updateStickyPurchase = () => {
			if (!desktopMedia.matches) {
				section.classList.remove("--sticky-purchase-visible");
				return;
			}
			const headerOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-bottom-height")) || 0;
			const shouldShow = purchaseButton.getBoundingClientRect().bottom <= headerOffset;
			section.classList.toggle("--sticky-purchase-visible", shouldShow);
		};
		stickyButton.addEventListener("click", () => {
			purchaseButton.click();
		});
		updateStickyPurchase();
		window.addEventListener("scroll", updateStickyPurchase, { passive: true });
		window.addEventListener("resize", updateStickyPurchase, { passive: true });
		desktopMedia.addEventListener("change", updateStickyPurchase);
	});
}
function initSingleProductGalleryAssets() {
	document.querySelectorAll("[data-fls-single-products]").forEach((section) => {
		section.querySelectorAll("[data-fls-gallery-item]").forEach((item) => {
			const image = item.querySelector("img");
			const href = item.getAttribute("href");
			if (image && !item.dataset.src && !item.hasAttribute("data-single-product-video") && !href) item.dataset.src = image.currentSrc || image.dataset.src || image.getAttribute("src") || "";
			if (item.hasAttribute("data-single-product-video")) {
				const videoEmbed = item.dataset.videoEmbed || "";
				const videoSrc = item.dataset.videoSrc || "";
				const videoType = item.dataset.videoType || "video/mp4";
				if (videoEmbed) {
					item.dataset.src = videoEmbed;
					item.removeAttribute("href");
					item.setAttribute("data-iframe", "true");
					item.removeAttribute("data-video");
				} else {
					item.dataset.src = "";
					item.dataset.video = JSON.stringify({
						source: [{
							src: videoSrc,
							type: videoType
						}],
						attributes: {
							preload: "metadata",
							controls: true,
							playsinline: true
						}
					});
				}
			}
		});
	});
}
function initSingleProductVideoThumbs() {
	document.querySelectorAll("[data-fls-single-products]").forEach((section) => {
		const galleryItems = [...section.querySelectorAll(".single-product__gallery [data-fls-gallery-item]")];
		section.querySelectorAll(".single-product__thumb-button_video[data-gallery-open-index]").forEach((button) => {
			button.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				galleryItems[Number(button.dataset.galleryOpenIndex)]?.click();
			});
		});
	});
}
document.addEventListener("DOMContentLoaded", initSingleProductGalleryAssets);
document.addEventListener("DOMContentLoaded", initSingleProductVideoThumbs);
document.addEventListener("DOMContentLoaded", initSingleProductStickyPurchase);
//#endregion
//#region src/components/custom/copy/copy.js
document.addEventListener("click", (e) => {
	const btn = e.target.closest(".copy-item__button");
	if (!btn) return;
	if (btn.parentElement.querySelector(".copy-item__tooltip")) {
		e.preventDefault();
		e.stopPropagation();
		return;
	}
	const text = btn.getAttribute("data-copy");
	if (!text) return;
	navigator.clipboard.writeText(text).then(() => {
		let tooltip = btn.querySelector(".copy-tooltip");
		if (!tooltip) {
			tooltip = document.createElement("div");
			tooltip.className = "copy-item__tooltip";
			tooltip.textContent = "Скопировано в буфер обмена";
			tooltip.hidden = true;
			btn.parentElement.appendChild(tooltip);
		}
		if (tooltip._hideTimer) {
			clearTimeout(tooltip._hideTimer);
			tooltip._hideTimer = null;
		}
		slideDown(tooltip, 200);
		tooltip._hideTimer = setTimeout(() => {
			slideUp(tooltip, 200);
			document.addEventListener("slideUpDone", function handler(ev) {
				if (ev.detail.target === tooltip) {
					tooltip.remove();
					document.removeEventListener("slideUpDone", handler);
				}
			});
			tooltip._hideTimer = null;
		}, 3e3);
	});
});
//#endregion
