//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/js/common/functions.js
function addLoadedAttr() {
	if (!document.documentElement.hasAttribute("data-fls-preloader-loading")) window.addEventListener("load", function() {
		setTimeout(function() {
			document.documentElement.setAttribute("data-fls-loaded", "");
		}, 0);
	});
}
var slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore && target.style.removeProperty("height");
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore && target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideUpDone", { detail: { target } }));
		}, duration);
	}
};
var slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.hidden = target.hidden ? false : null;
		showmore && target.style.removeProperty("height");
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideDownDone", { detail: { target } }));
		}, duration);
	}
};
var slideToggle = (target, duration = 500) => {
	if (target.hidden) return slideDown(target, duration);
	else return slideUp(target, duration);
};
var bodyLockStatus = true;
var bodyLockToggle = (delay = 500) => {
	if (document.documentElement.hasAttribute("data-fls-scrolllock")) bodyUnlock(delay);
	else bodyLock(delay);
};
var bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		setTimeout(() => {
			lockPaddingElements.forEach((lockPaddingElement) => {
				lockPaddingElement.style.paddingRight = "";
			});
			document.body.style.paddingRight = "";
			document.documentElement.removeAttribute("data-fls-scrolllock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
var bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
		lockPaddingElements.forEach((lockPaddingElement) => {
			lockPaddingElement.style.paddingRight = lockPaddingValue;
		});
		document.body.style.paddingRight = lockPaddingValue;
		document.documentElement.setAttribute("data-fls-scrolllock", "");
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
		const [value, type = "max"] = item.dataset[dataSetValue].split(",");
		return {
			value,
			type,
			item
		};
	});
	if (media.length === 0) return [];
	const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
	return [...new Set(breakpointsArray)].map((query) => {
		const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
		const matchMedia = window.matchMedia(mediaQuery);
		return {
			itemsArray: media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType),
			matchMedia
		};
	});
}
//#endregion
//#region node_modules/swiper/shared/ssr-window.esm.mjs
/**
* SSR Window 5.0.1
* Better handling for window object in SSR environment
* https://github.com/nolimits4web/ssr-window
*
* Copyright 2025, Vladimir Kharlampidi
*
* Licensed under MIT
*
* Released on: June 27, 2025
*/
function isObject$1(obj) {
	return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
}
function extend$1(target = {}, src = {}) {
	const noExtend = [
		"__proto__",
		"constructor",
		"prototype"
	];
	Object.keys(src).filter((key) => noExtend.indexOf(key) < 0).forEach((key) => {
		if (typeof target[key] === "undefined") target[key] = src[key];
		else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) extend$1(target[key], src[key]);
	});
}
var ssrDocument = {
	body: {},
	addEventListener() {},
	removeEventListener() {},
	activeElement: {
		blur() {},
		nodeName: ""
	},
	querySelector() {
		return null;
	},
	querySelectorAll() {
		return [];
	},
	getElementById() {
		return null;
	},
	createEvent() {
		return { initEvent() {} };
	},
	createElement() {
		return {
			children: [],
			childNodes: [],
			style: {},
			setAttribute() {},
			getElementsByTagName() {
				return [];
			}
		};
	},
	createElementNS() {
		return {};
	},
	importNode() {
		return null;
	},
	location: {
		hash: "",
		host: "",
		hostname: "",
		href: "",
		origin: "",
		pathname: "",
		protocol: "",
		search: ""
	}
};
function getDocument() {
	const doc = typeof document !== "undefined" ? document : {};
	extend$1(doc, ssrDocument);
	return doc;
}
var ssrWindow = {
	document: ssrDocument,
	navigator: { userAgent: "" },
	location: {
		hash: "",
		host: "",
		hostname: "",
		href: "",
		origin: "",
		pathname: "",
		protocol: "",
		search: ""
	},
	history: {
		replaceState() {},
		pushState() {},
		go() {},
		back() {}
	},
	CustomEvent: function CustomEvent() {
		return this;
	},
	addEventListener() {},
	removeEventListener() {},
	getComputedStyle() {
		return { getPropertyValue() {
			return "";
		} };
	},
	Image() {},
	Date() {},
	screen: {},
	setTimeout() {},
	clearTimeout() {},
	matchMedia() {
		return {};
	},
	requestAnimationFrame(callback) {
		if (typeof setTimeout === "undefined") {
			callback();
			return null;
		}
		return setTimeout(callback, 0);
	},
	cancelAnimationFrame(id) {
		if (typeof setTimeout === "undefined") return;
		clearTimeout(id);
	}
};
function getWindow() {
	const win = typeof window !== "undefined" ? window : {};
	extend$1(win, ssrWindow);
	return win;
}
//#endregion
//#region node_modules/swiper/shared/utils.mjs
function classesToTokens(classes = "") {
	return classes.trim().split(" ").filter((c) => !!c.trim());
}
function deleteProps(obj) {
	const object = obj;
	Object.keys(object).forEach((key) => {
		try {
			object[key] = null;
		} catch (e) {}
		try {
			delete object[key];
		} catch (e) {}
	});
}
function nextTick(callback, delay = 0) {
	return setTimeout(callback, delay);
}
function now() {
	return Date.now();
}
function getComputedStyle$1(el) {
	const window = getWindow();
	let style;
	if (window.getComputedStyle) style = window.getComputedStyle(el, null);
	if (!style && el.currentStyle) style = el.currentStyle;
	if (!style) style = el.style;
	return style;
}
function getTranslate(el, axis = "x") {
	const window = getWindow();
	let matrix;
	let curTransform;
	let transformMatrix;
	const curStyle = getComputedStyle$1(el);
	if (window.WebKitCSSMatrix) {
		curTransform = curStyle.transform || curStyle.webkitTransform;
		if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
		transformMatrix = new window.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
	} else {
		transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
		matrix = transformMatrix.toString().split(",");
	}
	if (axis === "x") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
	else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
	else curTransform = parseFloat(matrix[4]);
	if (axis === "y") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
	else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
	else curTransform = parseFloat(matrix[5]);
	return curTransform || 0;
}
function isObject(o) {
	return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
}
function isNode(node) {
	if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") return node instanceof HTMLElement;
	return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend(...args) {
	const to = Object(args[0]);
	for (let i = 1; i < args.length; i += 1) {
		const nextSource = args[i];
		if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
			const keysArray = Object.keys(Object(nextSource)).filter((key) => key !== "__proto__" && key !== "constructor" && key !== "prototype");
			for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
				const nextKey = keysArray[nextIndex];
				const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
				if (desc !== void 0 && desc.enumerable) if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey];
				else extend(to[nextKey], nextSource[nextKey]);
				else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
					to[nextKey] = {};
					if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey];
					else extend(to[nextKey], nextSource[nextKey]);
				} else to[nextKey] = nextSource[nextKey];
			}
		}
	}
	return to;
}
function setCSSProperty(el, varName, varValue) {
	el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll({ swiper, targetPosition, side }) {
	const window = getWindow();
	const startPosition = -swiper.translate;
	let startTime = null;
	let time;
	const duration = swiper.params.speed;
	swiper.wrapperEl.style.scrollSnapType = "none";
	window.cancelAnimationFrame(swiper.cssModeFrameID);
	const dir = targetPosition > startPosition ? "next" : "prev";
	const isOutOfBound = (current, target) => {
		return dir === "next" && current >= target || dir === "prev" && current <= target;
	};
	const animate = () => {
		time = (/* @__PURE__ */ new Date()).getTime();
		if (startTime === null) startTime = time;
		const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
		let currentPosition = startPosition + (.5 - Math.cos(progress * Math.PI) / 2) * (targetPosition - startPosition);
		if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
		swiper.wrapperEl.scrollTo({ [side]: currentPosition });
		if (isOutOfBound(currentPosition, targetPosition)) {
			swiper.wrapperEl.style.overflow = "hidden";
			swiper.wrapperEl.style.scrollSnapType = "";
			setTimeout(() => {
				swiper.wrapperEl.style.overflow = "";
				swiper.wrapperEl.scrollTo({ [side]: currentPosition });
			});
			window.cancelAnimationFrame(swiper.cssModeFrameID);
			return;
		}
		swiper.cssModeFrameID = window.requestAnimationFrame(animate);
	};
	animate();
}
function getSlideTransformEl(slideEl) {
	return slideEl.querySelector(".swiper-slide-transform") || slideEl.shadowRoot && slideEl.shadowRoot.querySelector(".swiper-slide-transform") || slideEl;
}
function elementChildren(element, selector = "") {
	const window = getWindow();
	const children = [...element.children];
	if (window.HTMLSlotElement && element instanceof HTMLSlotElement) children.push(...element.assignedElements());
	if (!selector) return children;
	return children.filter((el) => el.matches(selector));
}
function elementIsChildOfSlot(el, slot) {
	const elementsQueue = [slot];
	while (elementsQueue.length > 0) {
		const elementToCheck = elementsQueue.shift();
		if (el === elementToCheck) return true;
		elementsQueue.push(...elementToCheck.children, ...elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : [], ...elementToCheck.assignedElements ? elementToCheck.assignedElements() : []);
	}
}
function elementIsChildOf(el, parent) {
	const window = getWindow();
	let isChild = parent.contains(el);
	if (!isChild && window.HTMLSlotElement && parent instanceof HTMLSlotElement) {
		isChild = [...parent.assignedElements()].includes(el);
		if (!isChild) isChild = elementIsChildOfSlot(el, parent);
	}
	return isChild;
}
function showWarning(text) {
	try {
		console.warn(text);
		return;
	} catch (err) {}
}
function createElement(tag, classes = []) {
	const el = document.createElement(tag);
	el.classList.add(...Array.isArray(classes) ? classes : classesToTokens(classes));
	return el;
}
function elementPrevAll(el, selector) {
	const prevEls = [];
	while (el.previousElementSibling) {
		const prev = el.previousElementSibling;
		if (selector) {
			if (prev.matches(selector)) prevEls.push(prev);
		} else prevEls.push(prev);
		el = prev;
	}
	return prevEls;
}
function elementNextAll(el, selector) {
	const nextEls = [];
	while (el.nextElementSibling) {
		const next = el.nextElementSibling;
		if (selector) {
			if (next.matches(selector)) nextEls.push(next);
		} else nextEls.push(next);
		el = next;
	}
	return nextEls;
}
function elementStyle(el, prop) {
	return getWindow().getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
	let child = el;
	let i;
	if (child) {
		i = 0;
		while ((child = child.previousSibling) !== null) if (child.nodeType === 1) i += 1;
		return i;
	}
}
function elementParents(el, selector) {
	const parents = [];
	let parent = el.parentElement;
	while (parent) {
		if (selector) {
			if (parent.matches(selector)) parents.push(parent);
		} else parents.push(parent);
		parent = parent.parentElement;
	}
	return parents;
}
function elementTransitionEnd(el, callback) {
	function fireCallBack(e) {
		if (e.target !== el) return;
		callback.call(el, e);
		el.removeEventListener("transitionend", fireCallBack);
	}
	if (callback) el.addEventListener("transitionend", fireCallBack);
}
function elementOuterSize(el, size, includeMargins) {
	const window = getWindow();
	if (includeMargins) return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
	return el.offsetWidth;
}
function makeElementsArray(el) {
	return (Array.isArray(el) ? el : [el]).filter((e) => !!e);
}
function setInnerHTML(el, html = "") {
	if (typeof trustedTypes !== "undefined") el.innerHTML = trustedTypes.createPolicy("html", { createHTML: (s) => s }).createHTML(html);
	else el.innerHTML = html;
}
//#endregion
//#region node_modules/swiper/shared/swiper-core.mjs
var support;
function calcSupport() {
	const window = getWindow();
	const document = getDocument();
	return {
		smoothScroll: document.documentElement && document.documentElement.style && "scrollBehavior" in document.documentElement.style,
		touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
	};
}
function getSupport() {
	if (!support) support = calcSupport();
	return support;
}
var deviceCached;
function calcDevice({ userAgent } = {}) {
	const support = getSupport();
	const window = getWindow();
	const platform = window.navigator.platform;
	const ua = userAgent || window.navigator.userAgent;
	const device = {
		ios: false,
		android: false
	};
	const screenWidth = window.screen.width;
	const screenHeight = window.screen.height;
	const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	let ipad = ua.match(/(iPad)(?!\1).*OS\s([\d_]+)/);
	const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
	const windows = platform === "Win32";
	let macos = platform === "MacIntel";
	if (!ipad && macos && support.touch && [
		"1024x1366",
		"1366x1024",
		"834x1194",
		"1194x834",
		"834x1112",
		"1112x834",
		"768x1024",
		"1024x768",
		"820x1180",
		"1180x820",
		"810x1080",
		"1080x810"
	].indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
		ipad = ua.match(/(Version)\/([\d.]+)/);
		if (!ipad) ipad = [
			0,
			1,
			"13_0_0"
		];
		macos = false;
	}
	if (android && !windows) {
		device.os = "android";
		device.android = true;
	}
	if (ipad || iphone || ipod) {
		device.os = "ios";
		device.ios = true;
	}
	return device;
}
function getDevice(overrides = {}) {
	if (!deviceCached) deviceCached = calcDevice(overrides);
	return deviceCached;
}
var browser;
function calcBrowser() {
	const window = getWindow();
	const device = getDevice();
	let needPerspectiveFix = false;
	function isSafari() {
		const ua = window.navigator.userAgent.toLowerCase();
		return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
	}
	if (isSafari()) {
		const ua = String(window.navigator.userAgent);
		if (ua.includes("Version/")) {
			const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
			needPerspectiveFix = major < 16 || major === 16 && minor < 2;
		}
	}
	const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent);
	const isSafariBrowser = isSafari();
	const need3dFix = isSafariBrowser || isWebView && device.ios;
	return {
		isSafari: needPerspectiveFix || isSafariBrowser,
		needPerspectiveFix,
		need3dFix,
		isWebView
	};
}
function getBrowser() {
	if (!browser) browser = calcBrowser();
	return browser;
}
function Resize({ swiper, on, emit }) {
	const window = getWindow();
	let observer = null;
	let animationFrame = null;
	const resizeHandler = () => {
		if (!swiper || swiper.destroyed || !swiper.initialized) return;
		emit("beforeResize");
		emit("resize");
	};
	const createObserver = () => {
		if (!swiper || swiper.destroyed || !swiper.initialized) return;
		observer = new ResizeObserver((entries) => {
			animationFrame = window.requestAnimationFrame(() => {
				const { width, height } = swiper;
				let newWidth = width;
				let newHeight = height;
				entries.forEach(({ contentBoxSize, contentRect, target }) => {
					if (target && target !== swiper.el) return;
					newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
					newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
				});
				if (newWidth !== width || newHeight !== height) resizeHandler();
			});
		});
		observer.observe(swiper.el);
	};
	const removeObserver = () => {
		if (animationFrame) window.cancelAnimationFrame(animationFrame);
		if (observer && observer.unobserve && swiper.el) {
			observer.unobserve(swiper.el);
			observer = null;
		}
	};
	const orientationChangeHandler = () => {
		if (!swiper || swiper.destroyed || !swiper.initialized) return;
		emit("orientationchange");
	};
	on("init", () => {
		if (swiper.params.resizeObserver && typeof window.ResizeObserver !== "undefined") {
			createObserver();
			return;
		}
		window.addEventListener("resize", resizeHandler);
		window.addEventListener("orientationchange", orientationChangeHandler);
	});
	on("destroy", () => {
		removeObserver();
		window.removeEventListener("resize", resizeHandler);
		window.removeEventListener("orientationchange", orientationChangeHandler);
	});
}
function Observer({ swiper, extendParams, on, emit }) {
	const observers = [];
	const window = getWindow();
	const attach = (target, options = {}) => {
		const observer = new (window.MutationObserver || window.WebkitMutationObserver)((mutations) => {
			if (swiper.__preventObserver__) return;
			if (mutations.length === 1) {
				emit("observerUpdate", mutations[0]);
				return;
			}
			const observerUpdate = function observerUpdate() {
				emit("observerUpdate", mutations[0]);
			};
			if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate);
			else window.setTimeout(observerUpdate, 0);
		});
		observer.observe(target, {
			attributes: typeof options.attributes === "undefined" ? true : options.attributes,
			childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
			characterData: typeof options.characterData === "undefined" ? true : options.characterData
		});
		observers.push(observer);
	};
	const init = () => {
		if (!swiper.params.observer) return;
		if (swiper.params.observeParents) {
			const containerParents = elementParents(swiper.hostEl);
			for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
		}
		attach(swiper.hostEl, { childList: swiper.params.observeSlideChildren });
		attach(swiper.wrapperEl, { attributes: false });
	};
	const destroy = () => {
		observers.forEach((observer) => {
			observer.disconnect();
		});
		observers.splice(0, observers.length);
	};
	extendParams({
		observer: false,
		observeParents: false,
		observeSlideChildren: false
	});
	on("init", init);
	on("destroy", destroy);
}
var eventsEmitter = {
	on(events, handler, priority) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (typeof handler !== "function") return self;
		const method = priority ? "unshift" : "push";
		events.split(" ").forEach((event) => {
			if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
			self.eventsListeners[event][method](handler);
		});
		return self;
	},
	once(events, handler, priority) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (typeof handler !== "function") return self;
		function onceHandler(...args) {
			self.off(events, onceHandler);
			if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
			handler.apply(self, args);
		}
		onceHandler.__emitterProxy = handler;
		return self.on(events, onceHandler, priority);
	},
	onAny(handler, priority) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (typeof handler !== "function") return self;
		const method = priority ? "unshift" : "push";
		if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
		return self;
	},
	offAny(handler) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (!self.eventsAnyListeners) return self;
		const index = self.eventsAnyListeners.indexOf(handler);
		if (index >= 0) self.eventsAnyListeners.splice(index, 1);
		return self;
	},
	off(events, handler) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (!self.eventsListeners) return self;
		events.split(" ").forEach((event) => {
			if (typeof handler === "undefined") self.eventsListeners[event] = [];
			else if (self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler, index) => {
				if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
			});
		});
		return self;
	},
	emit(...args) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (!self.eventsListeners) return self;
		let events;
		let data;
		let context;
		if (typeof args[0] === "string" || Array.isArray(args[0])) {
			events = args[0];
			data = args.slice(1, args.length);
			context = self;
		} else {
			events = args[0].events;
			data = args[0].data;
			context = args[0].context || self;
		}
		data.unshift(context);
		(Array.isArray(events) ? events : events.split(" ")).forEach((event) => {
			if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler) => {
				eventHandler.apply(context, [event, ...data]);
			});
			if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler) => {
				eventHandler.apply(context, data);
			});
		});
		return self;
	}
};
function updateSize() {
	const swiper = this;
	let width;
	let height;
	const el = swiper.el;
	if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) width = swiper.params.width;
	else width = el.clientWidth;
	if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) height = swiper.params.height;
	else height = el.clientHeight;
	if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) return;
	width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
	height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
	if (Number.isNaN(width)) width = 0;
	if (Number.isNaN(height)) height = 0;
	Object.assign(swiper, {
		width,
		height,
		size: swiper.isHorizontal() ? width : height
	});
}
function updateSlides() {
	const swiper = this;
	function getDirectionPropertyValue(node, label) {
		return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
	}
	const params = swiper.params;
	const { wrapperEl, slidesEl, rtlTranslate: rtl, wrongRTL } = swiper;
	const isVirtual = swiper.virtual && params.virtual.enabled;
	const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
	const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
	const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
	let snapGrid = [];
	const slidesGrid = [];
	const slidesSizesGrid = [];
	let offsetBefore = params.slidesOffsetBefore;
	if (typeof offsetBefore === "function") offsetBefore = params.slidesOffsetBefore.call(swiper);
	let offsetAfter = params.slidesOffsetAfter;
	if (typeof offsetAfter === "function") offsetAfter = params.slidesOffsetAfter.call(swiper);
	const previousSnapGridLength = swiper.snapGrid.length;
	const previousSlidesGridLength = swiper.slidesGrid.length;
	const swiperSize = swiper.size - offsetBefore - offsetAfter;
	let spaceBetween = params.spaceBetween;
	let slidePosition = -offsetBefore;
	let prevSlideSize = 0;
	let index = 0;
	if (typeof swiperSize === "undefined") return;
	if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
	else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
	swiper.virtualSize = -spaceBetween - offsetBefore - offsetAfter;
	slides.forEach((slideEl) => {
		if (rtl) slideEl.style.marginLeft = "";
		else slideEl.style.marginRight = "";
		slideEl.style.marginBottom = "";
		slideEl.style.marginTop = "";
	});
	if (params.centeredSlides && params.cssMode) {
		setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
		setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
	}
	if (params.cssMode) {
		setCSSProperty(wrapperEl, "--swiper-slides-offset-before", `${offsetBefore}px`);
		setCSSProperty(wrapperEl, "--swiper-slides-offset-after", `${offsetAfter}px`);
	}
	const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
	if (gridEnabled) swiper.grid.initSlides(slides);
	else if (swiper.grid) swiper.grid.unsetSlides();
	let slideSize;
	const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
		return typeof params.breakpoints[key].slidesPerView !== "undefined";
	}).length > 0;
	for (let i = 0; i < slidesLength; i += 1) {
		slideSize = 0;
		const slide = slides[i];
		if (slide) {
			if (gridEnabled) swiper.grid.updateSlide(i, slide, slides);
			if (elementStyle(slide, "display") === "none") continue;
		}
		if (isVirtual && params.slidesPerView === "auto") {
			if (params.virtual.slidesPerViewAutoSlideSize) slideSize = params.virtual.slidesPerViewAutoSlideSize;
			if (slideSize && slide) {
				if (params.roundLengths) slideSize = Math.floor(slideSize);
				slide.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
			}
		} else if (params.slidesPerView === "auto") {
			if (shouldResetSlideSize) slide.style[swiper.getDirectionLabel("width")] = ``;
			const slideStyles = getComputedStyle(slide);
			const currentTransform = slide.style.transform;
			const currentWebKitTransform = slide.style.webkitTransform;
			if (currentTransform) slide.style.transform = "none";
			if (currentWebKitTransform) slide.style.webkitTransform = "none";
			if (params.roundLengths) slideSize = swiper.isHorizontal() ? elementOuterSize(slide, "width", true) : elementOuterSize(slide, "height", true);
			else {
				const width = getDirectionPropertyValue(slideStyles, "width");
				const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
				const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
				const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
				const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
				const boxSizing = slideStyles.getPropertyValue("box-sizing");
				if (boxSizing && boxSizing === "border-box") slideSize = width + marginLeft + marginRight;
				else {
					const { clientWidth, offsetWidth } = slide;
					slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
				}
			}
			if (currentTransform) slide.style.transform = currentTransform;
			if (currentWebKitTransform) slide.style.webkitTransform = currentWebKitTransform;
			if (params.roundLengths) slideSize = Math.floor(slideSize);
		} else {
			slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
			if (params.roundLengths) slideSize = Math.floor(slideSize);
			if (slide) slide.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
		}
		if (slide) slide.swiperSlideSize = slideSize;
		slidesSizesGrid.push(slideSize);
		if (params.centeredSlides) {
			slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
			if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
			if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
			if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
			if (params.roundLengths) slidePosition = Math.floor(slidePosition);
			if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
			slidesGrid.push(slidePosition);
		} else {
			if (params.roundLengths) slidePosition = Math.floor(slidePosition);
			if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
			slidesGrid.push(slidePosition);
			slidePosition = slidePosition + slideSize + spaceBetween;
		}
		swiper.virtualSize += slideSize + spaceBetween;
		prevSlideSize = slideSize;
		index += 1;
	}
	swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
	if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
	if (params.setWrapperSize) wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
	if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid);
	if (!params.centeredSlides) {
		const isFractionalSlidesPerView = params.slidesPerView !== "auto" && params.slidesPerView % 1 !== 0;
		const shouldSnapToSlideEdge = params.snapToSlideEdge && !params.loop && (params.slidesPerView === "auto" || isFractionalSlidesPerView);
		let lastAllowedSnapIndex = snapGrid.length;
		if (shouldSnapToSlideEdge) {
			let minVisibleSlides;
			if (params.slidesPerView === "auto") {
				minVisibleSlides = 1;
				let accumulatedSize = 0;
				for (let i = slidesSizesGrid.length - 1; i >= 0; i -= 1) {
					accumulatedSize += slidesSizesGrid[i] + (i < slidesSizesGrid.length - 1 ? spaceBetween : 0);
					if (accumulatedSize <= swiperSize) minVisibleSlides = slidesSizesGrid.length - i;
					else break;
				}
			} else minVisibleSlides = Math.floor(params.slidesPerView);
			lastAllowedSnapIndex = Math.max(slidesLength - minVisibleSlides, 0);
		}
		const newSlidesGrid = [];
		for (let i = 0; i < snapGrid.length; i += 1) {
			let slidesGridItem = snapGrid[i];
			if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
			if (shouldSnapToSlideEdge) {
				if (i <= lastAllowedSnapIndex) newSlidesGrid.push(slidesGridItem);
			} else if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
		}
		snapGrid = newSlidesGrid;
		if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
			if (!shouldSnapToSlideEdge) snapGrid.push(swiper.virtualSize - swiperSize);
		}
	}
	if (isVirtual && params.loop) {
		const size = slidesSizesGrid[0] + spaceBetween;
		if (params.slidesPerGroup > 1) {
			const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
			const groupSize = size * params.slidesPerGroup;
			for (let i = 0; i < groups; i += 1) snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
		}
		for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
			if (params.slidesPerGroup === 1) snapGrid.push(snapGrid[snapGrid.length - 1] + size);
			slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
			swiper.virtualSize += size;
		}
	}
	if (snapGrid.length === 0) snapGrid = [0];
	if (spaceBetween !== 0) {
		const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
		slides.filter((_, slideIndex) => {
			if (!params.cssMode || params.loop) return true;
			if (slideIndex === slides.length - 1) return false;
			return true;
		}).forEach((slideEl) => {
			slideEl.style[key] = `${spaceBetween}px`;
		});
	}
	if (params.centeredSlides && params.centeredSlidesBounds) {
		let allSlidesSize = 0;
		slidesSizesGrid.forEach((slideSizeValue) => {
			allSlidesSize += slideSizeValue + (spaceBetween || 0);
		});
		allSlidesSize -= spaceBetween;
		const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
		snapGrid = snapGrid.map((snap) => {
			if (snap <= 0) return -offsetBefore;
			if (snap > maxSnap) return maxSnap + offsetAfter;
			return snap;
		});
	}
	if (params.centerInsufficientSlides) {
		let allSlidesSize = 0;
		slidesSizesGrid.forEach((slideSizeValue) => {
			allSlidesSize += slideSizeValue + (spaceBetween || 0);
		});
		allSlidesSize -= spaceBetween;
		if (allSlidesSize < swiperSize) {
			const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
			snapGrid.forEach((snap, snapIndex) => {
				snapGrid[snapIndex] = snap - allSlidesOffset;
			});
			slidesGrid.forEach((snap, snapIndex) => {
				slidesGrid[snapIndex] = snap + allSlidesOffset;
			});
		}
	}
	Object.assign(swiper, {
		slides,
		snapGrid,
		slidesGrid,
		slidesSizesGrid
	});
	if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
		setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
		setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
		const addToSnapGrid = -swiper.snapGrid[0];
		const addToSlidesGrid = -swiper.slidesGrid[0];
		swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
		swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
	}
	if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
	if (snapGrid.length !== previousSnapGridLength) {
		if (swiper.params.watchOverflow) swiper.checkOverflow();
		swiper.emit("snapGridLengthChange");
	}
	if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
	if (params.watchSlidesProgress) swiper.updateSlidesOffset();
	swiper.emit("slidesUpdated");
	if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
		const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
		const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
		if (slidesLength <= params.maxBackfaceHiddenSlides) {
			if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
		} else if (hasClassBackfaceClassAdded) swiper.el.classList.remove(backFaceHiddenClass);
	}
}
function updateAutoHeight(speed) {
	const swiper = this;
	const activeSlides = [];
	const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
	let newHeight = 0;
	let i;
	if (typeof speed === "number") swiper.setTransition(speed);
	else if (speed === true) swiper.setTransition(swiper.params.speed);
	const getSlideByIndex = (index) => {
		if (isVirtual) return swiper.slides[swiper.getSlideIndexByData(index)];
		return swiper.slides[index];
	};
	if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || []).forEach((slide) => {
		activeSlides.push(slide);
	});
	else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
		const index = swiper.activeIndex + i;
		if (index > swiper.slides.length && !isVirtual) break;
		activeSlides.push(getSlideByIndex(index));
	}
	else activeSlides.push(getSlideByIndex(swiper.activeIndex));
	for (i = 0; i < activeSlides.length; i += 1) if (typeof activeSlides[i] !== "undefined") {
		const height = activeSlides[i].offsetHeight;
		newHeight = height > newHeight ? height : newHeight;
	}
	if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
}
function updateSlidesOffset() {
	const swiper = this;
	const slides = swiper.slides;
	const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
	for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
}
var toggleSlideClasses$1 = (slideEl, condition, className) => {
	if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className);
	else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
};
function updateSlidesProgress(translate = this && this.translate || 0) {
	const swiper = this;
	const params = swiper.params;
	const { slides, rtlTranslate: rtl, snapGrid } = swiper;
	if (slides.length === 0) return;
	if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
	let offsetCenter = -translate;
	if (rtl) offsetCenter = translate;
	swiper.visibleSlidesIndexes = [];
	swiper.visibleSlides = [];
	let spaceBetween = params.spaceBetween;
	if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
	else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
	for (let i = 0; i < slides.length; i += 1) {
		const slide = slides[i];
		let slideOffset = slide.swiperSlideOffset;
		if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
		const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
		const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
		const slideBefore = -(offsetCenter - slideOffset);
		const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
		const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
		const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
		if (isVisible) {
			swiper.visibleSlides.push(slide);
			swiper.visibleSlidesIndexes.push(i);
		}
		toggleSlideClasses$1(slide, isVisible, params.slideVisibleClass);
		toggleSlideClasses$1(slide, isFullyVisible, params.slideFullyVisibleClass);
		slide.progress = rtl ? -slideProgress : slideProgress;
		slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
	}
}
function updateProgress(translate) {
	const swiper = this;
	if (typeof translate === "undefined") {
		const multiplier = swiper.rtlTranslate ? -1 : 1;
		translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
	}
	const params = swiper.params;
	const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
	let { progress, isBeginning, isEnd, progressLoop } = swiper;
	const wasBeginning = isBeginning;
	const wasEnd = isEnd;
	if (translatesDiff === 0) {
		progress = 0;
		isBeginning = true;
		isEnd = true;
	} else {
		progress = (translate - swiper.minTranslate()) / translatesDiff;
		const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
		const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
		isBeginning = isBeginningRounded || progress <= 0;
		isEnd = isEndRounded || progress >= 1;
		if (isBeginningRounded) progress = 0;
		if (isEndRounded) progress = 1;
	}
	if (params.loop) {
		const firstSlideIndex = swiper.getSlideIndexByData(0);
		const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
		const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
		const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
		const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
		const translateAbs = Math.abs(translate);
		if (translateAbs >= firstSlideTranslate) progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
		else progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
		if (progressLoop > 1) progressLoop -= 1;
	}
	Object.assign(swiper, {
		progress,
		progressLoop,
		isBeginning,
		isEnd
	});
	if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
	if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
	if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
	if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
	swiper.emit("progress", progress);
}
var toggleSlideClasses = (slideEl, condition, className) => {
	if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className);
	else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
};
function updateSlidesClasses() {
	const swiper = this;
	const { slides, params, slidesEl, activeIndex } = swiper;
	const isVirtual = swiper.virtual && params.virtual.enabled;
	const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
	const getFilteredSlide = (selector) => {
		return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
	};
	let activeSlide;
	let prevSlide;
	let nextSlide;
	if (isVirtual) if (params.loop) {
		let slideIndex = activeIndex - swiper.virtual.slidesBefore;
		if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
		if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
		activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
	} else activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
	else if (gridEnabled) {
		activeSlide = slides.find((slideEl) => slideEl.column === activeIndex);
		nextSlide = slides.find((slideEl) => slideEl.column === activeIndex + 1);
		prevSlide = slides.find((slideEl) => slideEl.column === activeIndex - 1);
	} else activeSlide = slides[activeIndex];
	if (activeSlide) {
		if (!gridEnabled) {
			nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
			if (params.loop && !nextSlide) nextSlide = slides[0];
			prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
			if (params.loop && false);
		}
	}
	slides.forEach((slideEl) => {
		toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
		toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
		toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
	});
	swiper.emitSlidesClasses();
}
var processLazyPreloader = (swiper, imageEl) => {
	if (!swiper || swiper.destroyed || !swiper.params) return;
	const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
	const slideEl = imageEl.closest(slideSelector());
	if (slideEl) {
		let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
		if (!lazyEl && swiper.isElement) if (slideEl.shadowRoot) lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
		else requestAnimationFrame(() => {
			if (slideEl.shadowRoot) {
				lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
				if (lazyEl && !lazyEl.lazyPreloaderManaged) lazyEl.remove();
			}
		});
		if (lazyEl && !lazyEl.lazyPreloaderManaged) lazyEl.remove();
	}
};
var unlazy = (swiper, index) => {
	if (!swiper.slides[index]) return;
	const imageEl = swiper.slides[index].querySelector("[loading=\"lazy\"]");
	if (imageEl) imageEl.removeAttribute("loading");
};
var preload = (swiper) => {
	if (!swiper || swiper.destroyed || !swiper.params) return;
	let amount = swiper.params.lazyPreloadPrevNext;
	const len = swiper.slides.length;
	if (!len || !amount || amount < 0) return;
	amount = Math.min(amount, len);
	const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
	const activeIndex = swiper.activeIndex;
	if (swiper.params.grid && swiper.params.grid.rows > 1) {
		const activeColumn = activeIndex;
		const preloadColumns = [activeColumn - amount];
		preloadColumns.push(...Array.from({ length: amount }).map((_, i) => {
			return activeColumn + slidesPerView + i;
		}));
		swiper.slides.forEach((slideEl, i) => {
			if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
		});
		return;
	}
	const slideIndexLastInView = activeIndex + slidesPerView - 1;
	if (swiper.params.rewind || swiper.params.loop) for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
		const realIndex = (i % len + len) % len;
		if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
	}
	else for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) unlazy(swiper, i);
};
function getActiveIndexByTranslate(swiper) {
	const { slidesGrid, params } = swiper;
	const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
	let activeIndex;
	for (let i = 0; i < slidesGrid.length; i += 1) if (typeof slidesGrid[i + 1] !== "undefined") {
		if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i;
		else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
	} else if (translate >= slidesGrid[i]) activeIndex = i;
	if (params.normalizeSlideIndex) {
		if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
	}
	return activeIndex;
}
function updateActiveIndex(newActiveIndex) {
	const swiper = this;
	const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
	const { snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex } = swiper;
	let activeIndex = newActiveIndex;
	let snapIndex;
	const getVirtualRealIndex = (aIndex) => {
		let realIndex = aIndex - swiper.virtual.slidesBefore;
		if (realIndex < 0) realIndex = swiper.virtual.slides.length + realIndex;
		if (realIndex >= swiper.virtual.slides.length) realIndex -= swiper.virtual.slides.length;
		return realIndex;
	};
	if (typeof activeIndex === "undefined") activeIndex = getActiveIndexByTranslate(swiper);
	if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate);
	else {
		const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
		snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
	}
	if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
	if (activeIndex === previousIndex && !swiper.params.loop) {
		if (snapIndex !== previousSnapIndex) {
			swiper.snapIndex = snapIndex;
			swiper.emit("snapIndexChange");
		}
		return;
	}
	if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
		swiper.realIndex = getVirtualRealIndex(activeIndex);
		return;
	}
	const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
	let realIndex;
	if (swiper.virtual && params.virtual.enabled) if (params.loop) realIndex = getVirtualRealIndex(activeIndex);
	else realIndex = activeIndex;
	else if (gridEnabled) {
		const firstSlideInColumn = swiper.slides.find((slideEl) => slideEl.column === activeIndex);
		let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
		if (Number.isNaN(activeSlideIndex)) activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
		realIndex = Math.floor(activeSlideIndex / params.grid.rows);
	} else if (swiper.slides[activeIndex]) {
		const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
		if (slideIndex) realIndex = parseInt(slideIndex, 10);
		else realIndex = activeIndex;
	} else realIndex = activeIndex;
	Object.assign(swiper, {
		previousSnapIndex,
		snapIndex,
		previousRealIndex,
		realIndex,
		previousIndex,
		activeIndex
	});
	if (swiper.initialized) preload(swiper);
	swiper.emit("activeIndexChange");
	swiper.emit("snapIndexChange");
	if (swiper.initialized || swiper.params.runCallbacksOnInit) {
		if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
		swiper.emit("slideChange");
	}
}
function updateClickedSlide(el, path) {
	const swiper = this;
	const params = swiper.params;
	let slide = el.closest(`.${params.slideClass}, swiper-slide`);
	if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl) => {
		if (!slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) slide = pathEl;
	});
	let slideFound = false;
	let slideIndex;
	if (slide) {
		for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
			slideFound = true;
			slideIndex = i;
			break;
		}
	}
	if (slide && slideFound) {
		swiper.clickedSlide = slide;
		if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(slide.getAttribute("data-swiper-slide-index"), 10);
		else swiper.clickedIndex = slideIndex;
	} else {
		swiper.clickedSlide = void 0;
		swiper.clickedIndex = void 0;
		return;
	}
	if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
}
var update = {
	updateSize,
	updateSlides,
	updateAutoHeight,
	updateSlidesOffset,
	updateSlidesProgress,
	updateProgress,
	updateSlidesClasses,
	updateActiveIndex,
	updateClickedSlide
};
function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
	const swiper = this;
	const { params, rtlTranslate: rtl, translate, wrapperEl } = swiper;
	if (params.virtualTranslate) return rtl ? -translate : translate;
	if (params.cssMode) return translate;
	let currentTranslate = getTranslate(wrapperEl, axis);
	currentTranslate += swiper.cssOverflowAdjustment();
	if (rtl) currentTranslate = -currentTranslate;
	return currentTranslate || 0;
}
function setTranslate(translate, byController) {
	const swiper = this;
	const { rtlTranslate: rtl, params, wrapperEl, progress } = swiper;
	let x = 0;
	let y = 0;
	const z = 0;
	if (swiper.isHorizontal()) x = rtl ? -translate : translate;
	else y = translate;
	if (params.roundLengths) {
		x = Math.floor(x);
		y = Math.floor(y);
	}
	swiper.previousTranslate = swiper.translate;
	swiper.translate = swiper.isHorizontal() ? x : y;
	if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y;
	else if (!params.virtualTranslate) {
		if (swiper.isHorizontal()) x -= swiper.cssOverflowAdjustment();
		else y -= swiper.cssOverflowAdjustment();
		wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
	}
	let newProgress;
	const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
	if (translatesDiff === 0) newProgress = 0;
	else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
	if (newProgress !== progress) swiper.updateProgress(translate);
	swiper.emit("setTranslate", swiper.translate, byController);
}
function minTranslate() {
	return -this.snapGrid[0];
}
function maxTranslate() {
	return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
	const swiper = this;
	const { params, wrapperEl } = swiper;
	if (swiper.animating && params.preventInteractionOnTransition) return false;
	const minTranslate = swiper.minTranslate();
	const maxTranslate = swiper.maxTranslate();
	let newTranslate;
	if (translateBounds && translate > minTranslate) newTranslate = minTranslate;
	else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;
	else newTranslate = translate;
	swiper.updateProgress(newTranslate);
	if (params.cssMode) {
		const isH = swiper.isHorizontal();
		if (speed === 0) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
		else {
			if (!swiper.support.smoothScroll) {
				animateCSSModeScroll({
					swiper,
					targetPosition: -newTranslate,
					side: isH ? "left" : "top"
				});
				return true;
			}
			wrapperEl.scrollTo({
				[isH ? "left" : "top"]: -newTranslate,
				behavior: "smooth"
			});
		}
		return true;
	}
	if (speed === 0) {
		swiper.setTransition(0);
		swiper.setTranslate(newTranslate);
		if (runCallbacks) {
			swiper.emit("beforeTransitionStart", speed, internal);
			swiper.emit("transitionEnd");
		}
	} else {
		swiper.setTransition(speed);
		swiper.setTranslate(newTranslate);
		if (runCallbacks) {
			swiper.emit("beforeTransitionStart", speed, internal);
			swiper.emit("transitionStart");
		}
		if (!swiper.animating) {
			swiper.animating = true;
			if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
				if (!swiper || swiper.destroyed) return;
				if (e.target !== this) return;
				swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
				swiper.onTranslateToWrapperTransitionEnd = null;
				delete swiper.onTranslateToWrapperTransitionEnd;
				swiper.animating = false;
				if (runCallbacks) swiper.emit("transitionEnd");
			};
			swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
		}
	}
	return true;
}
var translate = {
	getTranslate: getSwiperTranslate,
	setTranslate,
	minTranslate,
	maxTranslate,
	translateTo
};
function setTransition(duration, byController) {
	const swiper = this;
	if (!swiper.params.cssMode) {
		swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
		swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
	}
	swiper.emit("setTransition", duration, byController);
}
function transitionEmit({ swiper, runCallbacks, direction, step }) {
	const { activeIndex, previousIndex } = swiper;
	let dir = direction;
	if (!dir) if (activeIndex > previousIndex) dir = "next";
	else if (activeIndex < previousIndex) dir = "prev";
	else dir = "reset";
	swiper.emit(`transition${step}`);
	if (runCallbacks && dir === "reset") swiper.emit(`slideResetTransition${step}`);
	else if (runCallbacks && activeIndex !== previousIndex) {
		swiper.emit(`slideChangeTransition${step}`);
		if (dir === "next") swiper.emit(`slideNextTransition${step}`);
		else swiper.emit(`slidePrevTransition${step}`);
	}
}
function transitionStart(runCallbacks = true, direction) {
	const swiper = this;
	const { params } = swiper;
	if (params.cssMode) return;
	if (params.autoHeight) swiper.updateAutoHeight();
	transitionEmit({
		swiper,
		runCallbacks,
		direction,
		step: "Start"
	});
}
function transitionEnd(runCallbacks = true, direction) {
	const swiper = this;
	const { params } = swiper;
	swiper.animating = false;
	if (params.cssMode) return;
	swiper.setTransition(0);
	transitionEmit({
		swiper,
		runCallbacks,
		direction,
		step: "End"
	});
}
var transition = {
	setTransition,
	transitionStart,
	transitionEnd
};
function slideTo(index = 0, speed, runCallbacks = true, internal, initial) {
	if (typeof index === "string") index = parseInt(index, 10);
	const swiper = this;
	let slideIndex = index;
	if (slideIndex < 0) slideIndex = 0;
	const { params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled } = swiper;
	if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) return false;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
	let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
	if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
	const translate = -snapGrid[snapIndex];
	if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
		const normalizedTranslate = -Math.floor(translate * 100);
		const normalizedGrid = Math.floor(slidesGrid[i] * 100);
		const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
		if (typeof slidesGrid[i + 1] !== "undefined") {
			if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i;
			else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
		} else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
	}
	if (swiper.initialized && slideIndex !== activeIndex) {
		if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) return false;
		if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
			if ((activeIndex || 0) !== slideIndex) return false;
		}
	}
	if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
	swiper.updateProgress(translate);
	let direction;
	if (slideIndex > activeIndex) direction = "next";
	else if (slideIndex < activeIndex) direction = "prev";
	else direction = "reset";
	const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
	if (!(isVirtual && initial) && (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate)) {
		swiper.updateActiveIndex(slideIndex);
		if (params.autoHeight) swiper.updateAutoHeight();
		swiper.updateSlidesClasses();
		if (params.effect !== "slide") swiper.setTranslate(translate);
		if (direction !== "reset") {
			swiper.transitionStart(runCallbacks, direction);
			swiper.transitionEnd(runCallbacks, direction);
		}
		return false;
	}
	if (params.cssMode) {
		const isH = swiper.isHorizontal();
		const t = rtl ? translate : -translate;
		if (speed === 0) {
			if (isVirtual) {
				swiper.wrapperEl.style.scrollSnapType = "none";
				swiper._immediateVirtual = true;
			}
			if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
				swiper._cssModeVirtualInitialSet = true;
				requestAnimationFrame(() => {
					wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
				});
			} else wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
			if (isVirtual) requestAnimationFrame(() => {
				swiper.wrapperEl.style.scrollSnapType = "";
				swiper._immediateVirtual = false;
			});
		} else {
			if (!swiper.support.smoothScroll) {
				animateCSSModeScroll({
					swiper,
					targetPosition: t,
					side: isH ? "left" : "top"
				});
				return true;
			}
			wrapperEl.scrollTo({
				[isH ? "left" : "top"]: t,
				behavior: "smooth"
			});
		}
		return true;
	}
	const isSafari = getBrowser().isSafari;
	if (isVirtual && !initial && isSafari && swiper.isElement) swiper.virtual.update(false, false, slideIndex);
	swiper.setTransition(speed);
	swiper.setTranslate(translate);
	swiper.updateActiveIndex(slideIndex);
	swiper.updateSlidesClasses();
	swiper.emit("beforeTransitionStart", speed, internal);
	swiper.transitionStart(runCallbacks, direction);
	if (speed === 0) swiper.transitionEnd(runCallbacks, direction);
	else if (!swiper.animating) {
		swiper.animating = true;
		if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
			if (!swiper || swiper.destroyed) return;
			if (e.target !== this) return;
			swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
			swiper.onSlideToWrapperTransitionEnd = null;
			delete swiper.onSlideToWrapperTransitionEnd;
			swiper.transitionEnd(runCallbacks, direction);
		};
		swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
	}
	return true;
}
function slideToLoop(index = 0, speed, runCallbacks = true, internal) {
	if (typeof index === "string") index = parseInt(index, 10);
	const swiper = this;
	if (swiper.destroyed) return;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
	let newIndex = index;
	if (swiper.params.loop) if (swiper.virtual && swiper.params.virtual.enabled) newIndex = newIndex + swiper.virtual.slidesBefore;
	else {
		let targetSlideIndex;
		if (gridEnabled) {
			const slideIndex = newIndex * swiper.params.grid.rows;
			targetSlideIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
		} else targetSlideIndex = swiper.getSlideIndexByData(newIndex);
		const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
		const { centeredSlides, slidesOffsetBefore, slidesOffsetAfter } = swiper.params;
		const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
		let slidesPerView = swiper.params.slidesPerView;
		if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic();
		else {
			slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
			if (bothDirections && slidesPerView % 2 === 0) slidesPerView = slidesPerView + 1;
		}
		let needLoopFix = cols - targetSlideIndex < slidesPerView;
		if (bothDirections) needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
		if (internal && bothDirections && swiper.params.slidesPerView !== "auto" && !gridEnabled) needLoopFix = false;
		if (needLoopFix) {
			const direction = bothDirections ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
			swiper.loopFix({
				direction,
				slideTo: true,
				activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
				slideRealIndex: direction === "next" ? swiper.realIndex : void 0
			});
		}
		if (gridEnabled) {
			const slideIndex = newIndex * swiper.params.grid.rows;
			newIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
		} else newIndex = swiper.getSlideIndexByData(newIndex);
	}
	requestAnimationFrame(() => {
		swiper.slideTo(newIndex, speed, runCallbacks, internal);
	});
	return swiper;
}
function slideNext(speed, runCallbacks = true, internal) {
	const swiper = this;
	const { enabled, params, animating } = swiper;
	if (!enabled || swiper.destroyed) return swiper;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	let perGroup = params.slidesPerGroup;
	if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
	const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
	const isVirtual = swiper.virtual && params.virtual.enabled;
	if (params.loop) {
		if (animating && !isVirtual && params.loopPreventsSliding) return false;
		swiper.loopFix({ direction: "next" });
		swiper._clientLeft = swiper.wrapperEl.clientLeft;
		if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
			requestAnimationFrame(() => {
				swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
			});
			return true;
		}
	}
	if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
	return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}
function slidePrev(speed, runCallbacks = true, internal) {
	const swiper = this;
	const { params, snapGrid, slidesGrid, rtlTranslate, enabled, animating } = swiper;
	if (!enabled || swiper.destroyed) return swiper;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	const isVirtual = swiper.virtual && params.virtual.enabled;
	if (params.loop) {
		if (animating && !isVirtual && params.loopPreventsSliding) return false;
		swiper.loopFix({ direction: "prev" });
		swiper._clientLeft = swiper.wrapperEl.clientLeft;
	}
	const translate = rtlTranslate ? swiper.translate : -swiper.translate;
	function normalize(val) {
		if (val < 0) return -Math.floor(Math.abs(val));
		return Math.floor(val);
	}
	const normalizedTranslate = normalize(translate);
	const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
	const isFreeMode = params.freeMode && params.freeMode.enabled;
	let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
	if (typeof prevSnap === "undefined" && (params.cssMode || isFreeMode)) {
		let prevSnapIndex;
		snapGrid.forEach((snap, snapIndex) => {
			if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
		});
		if (typeof prevSnapIndex !== "undefined") prevSnap = isFreeMode ? snapGrid[prevSnapIndex] : snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
	}
	let prevIndex = 0;
	if (typeof prevSnap !== "undefined") {
		prevIndex = slidesGrid.indexOf(prevSnap);
		if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
		if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
			prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
			prevIndex = Math.max(prevIndex, 0);
		}
	}
	if (params.rewind && swiper.isBeginning) {
		const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
		return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
	} else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
		requestAnimationFrame(() => {
			swiper.slideTo(prevIndex, speed, runCallbacks, internal);
		});
		return true;
	}
	return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed, runCallbacks = true, internal) {
	const swiper = this;
	if (swiper.destroyed) return;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
function slideToClosest(speed, runCallbacks = true, internal, threshold = .5) {
	const swiper = this;
	if (swiper.destroyed) return;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	let index = swiper.activeIndex;
	const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
	const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
	const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
	if (translate >= swiper.snapGrid[snapIndex]) {
		const currentSnap = swiper.snapGrid[snapIndex];
		const nextSnap = swiper.snapGrid[snapIndex + 1];
		if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
	} else {
		const prevSnap = swiper.snapGrid[snapIndex - 1];
		const currentSnap = swiper.snapGrid[snapIndex];
		if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
	}
	index = Math.max(index, 0);
	index = Math.min(index, swiper.slidesGrid.length - 1);
	return swiper.slideTo(index, speed, runCallbacks, internal);
}
function slideToClickedSlide() {
	const swiper = this;
	if (swiper.destroyed) return;
	const { params, slidesEl } = swiper;
	const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
	let slideToIndex = swiper.getSlideIndexWhenGrid(swiper.clickedIndex);
	let realIndex;
	const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
	const isGrid = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
	if (params.loop) {
		if (swiper.animating) return;
		realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
		if (params.centeredSlides) swiper.slideToLoop(realIndex);
		else if (slideToIndex > (isGrid ? (swiper.slides.length - slidesPerView) / 2 - (swiper.params.grid.rows - 1) : swiper.slides.length - slidesPerView)) {
			swiper.loopFix();
			slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
			nextTick(() => {
				swiper.slideTo(slideToIndex);
			});
		} else swiper.slideTo(slideToIndex);
	} else swiper.slideTo(slideToIndex);
}
var slide = {
	slideTo,
	slideToLoop,
	slideNext,
	slidePrev,
	slideReset,
	slideToClosest,
	slideToClickedSlide
};
function loopCreate(slideRealIndex, initial) {
	const swiper = this;
	const { params, slidesEl } = swiper;
	if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
	const initSlides = () => {
		elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`).forEach((el, index) => {
			el.setAttribute("data-swiper-slide-index", index);
		});
	};
	const clearBlankSlides = () => {
		const slides = elementChildren(slidesEl, `.${params.slideBlankClass}`);
		slides.forEach((el) => {
			el.remove();
		});
		if (slides.length > 0) {
			swiper.recalcSlides();
			swiper.updateSlides();
		}
	};
	const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
	if (params.loopAddBlankSlides && (params.slidesPerGroup > 1 || gridEnabled)) clearBlankSlides();
	const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
	const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
	const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
	const addBlankSlides = (amountOfSlides) => {
		for (let i = 0; i < amountOfSlides; i += 1) {
			const slideEl = swiper.isElement ? createElement("swiper-slide", [params.slideBlankClass]) : createElement("div", [params.slideClass, params.slideBlankClass]);
			swiper.slidesEl.append(slideEl);
		}
	};
	if (shouldFillGroup) {
		if (params.loopAddBlankSlides) {
			addBlankSlides(slidesPerGroup - swiper.slides.length % slidesPerGroup);
			swiper.recalcSlides();
			swiper.updateSlides();
		} else showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
		initSlides();
	} else if (shouldFillGrid) {
		if (params.loopAddBlankSlides) {
			addBlankSlides(params.grid.rows - swiper.slides.length % params.grid.rows);
			swiper.recalcSlides();
			swiper.updateSlides();
		} else showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
		initSlides();
	} else initSlides();
	const bothDirections = params.centeredSlides || !!params.slidesOffsetBefore || !!params.slidesOffsetAfter;
	swiper.loopFix({
		slideRealIndex,
		direction: bothDirections ? void 0 : "next",
		initial
	});
}
function loopFix({ slideRealIndex, slideTo = true, direction, setTranslate, activeSlideIndex, initial, byController, byMousewheel } = {}) {
	const swiper = this;
	if (!swiper.params.loop) return;
	swiper.emit("beforeLoopFix");
	const { slides, allowSlidePrev, allowSlideNext, slidesEl, params } = swiper;
	const { centeredSlides, slidesOffsetBefore, slidesOffsetAfter, initialSlide } = params;
	const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
	swiper.allowSlidePrev = true;
	swiper.allowSlideNext = true;
	if (swiper.virtual && params.virtual.enabled) {
		if (slideTo) {
			if (!bothDirections && swiper.snapIndex === 0) swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
			else if (bothDirections && swiper.snapIndex < params.slidesPerView) swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
			else if (swiper.snapIndex === swiper.snapGrid.length - 1) swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
		}
		swiper.allowSlidePrev = allowSlidePrev;
		swiper.allowSlideNext = allowSlideNext;
		swiper.emit("loopFix");
		return;
	}
	let slidesPerView = params.slidesPerView;
	if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic();
	else {
		slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
		if (bothDirections && slidesPerView % 2 === 0) slidesPerView = slidesPerView + 1;
	}
	const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
	let loopedSlides = bothDirections ? Math.max(slidesPerGroup, Math.ceil(slidesPerView / 2)) : slidesPerGroup;
	if (loopedSlides % slidesPerGroup !== 0) loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
	loopedSlides += params.loopAdditionalSlides;
	swiper.loopedSlides = loopedSlides;
	const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
	if (slides.length < slidesPerView + loopedSlides || swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters");
	else if (gridEnabled && params.grid.fill === "row") showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
	const prependSlidesIndexes = [];
	const appendSlidesIndexes = [];
	const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
	const isInitialOverflow = initial && cols - initialSlide < slidesPerView && !bothDirections;
	let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
	if (typeof activeSlideIndex === "undefined") activeSlideIndex = swiper.getSlideIndex(slides.find((el) => el.classList.contains(params.slideActiveClass)));
	else activeIndex = activeSlideIndex;
	const isNext = direction === "next" || !direction;
	const isPrev = direction === "prev" || !direction;
	let slidesPrepended = 0;
	let slidesAppended = 0;
	const activeColIndexWithShift = (gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex) + (bothDirections && typeof setTranslate === "undefined" ? -slidesPerView / 2 + .5 : 0);
	if (activeColIndexWithShift < loopedSlides) {
		slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
		for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
			const index = i - Math.floor(i / cols) * cols;
			if (gridEnabled) {
				const colIndexToPrepend = cols - index - 1;
				for (let i = slides.length - 1; i >= 0; i -= 1) if (slides[i].column === colIndexToPrepend) prependSlidesIndexes.push(i);
			} else prependSlidesIndexes.push(cols - index - 1);
		}
	} else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
		slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
		if (isInitialOverflow) slidesAppended = Math.max(slidesAppended, slidesPerView - cols + initialSlide + 1);
		for (let i = 0; i < slidesAppended; i += 1) {
			const index = i - Math.floor(i / cols) * cols;
			if (gridEnabled) slides.forEach((slide, slideIndex) => {
				if (slide.column === index) appendSlidesIndexes.push(slideIndex);
			});
			else appendSlidesIndexes.push(index);
		}
	}
	swiper.__preventObserver__ = true;
	requestAnimationFrame(() => {
		swiper.__preventObserver__ = false;
	});
	if (swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
		if (appendSlidesIndexes.includes(activeSlideIndex)) appendSlidesIndexes.splice(appendSlidesIndexes.indexOf(activeSlideIndex), 1);
		if (prependSlidesIndexes.includes(activeSlideIndex)) prependSlidesIndexes.splice(prependSlidesIndexes.indexOf(activeSlideIndex), 1);
	}
	if (isPrev) prependSlidesIndexes.forEach((index) => {
		slides[index].swiperLoopMoveDOM = true;
		slidesEl.prepend(slides[index]);
		slides[index].swiperLoopMoveDOM = false;
	});
	if (isNext) appendSlidesIndexes.forEach((index) => {
		slides[index].swiperLoopMoveDOM = true;
		slidesEl.append(slides[index]);
		slides[index].swiperLoopMoveDOM = false;
	});
	swiper.recalcSlides();
	if (params.slidesPerView === "auto") swiper.updateSlides();
	else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) swiper.slides.forEach((slide, slideIndex) => {
		swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
	});
	if (params.watchSlidesProgress) swiper.updateSlidesOffset();
	if (slideTo) {
		if (prependSlidesIndexes.length > 0 && isPrev) {
			if (typeof slideRealIndex === "undefined") {
				const currentSlideTranslate = swiper.slidesGrid[activeIndex];
				const diff = swiper.slidesGrid[activeIndex + slidesPrepended] - currentSlideTranslate;
				if (byMousewheel) swiper.setTranslate(swiper.translate - diff);
				else {
					swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
					if (setTranslate) {
						swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
						swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
					}
				}
			} else if (setTranslate) {
				const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
				swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
				swiper.touchEventsData.currentTranslate = swiper.translate;
			}
		} else if (appendSlidesIndexes.length > 0 && isNext) if (typeof slideRealIndex === "undefined") {
			const currentSlideTranslate = swiper.slidesGrid[activeIndex];
			const diff = swiper.slidesGrid[activeIndex - slidesAppended] - currentSlideTranslate;
			if (byMousewheel) swiper.setTranslate(swiper.translate - diff);
			else {
				swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
				if (setTranslate) {
					swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
					swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
				}
			}
		} else {
			const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
			swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
		}
	}
	swiper.allowSlidePrev = allowSlidePrev;
	swiper.allowSlideNext = allowSlideNext;
	if (swiper.controller && swiper.controller.control && !byController) {
		const loopParams = {
			slideRealIndex,
			direction,
			setTranslate,
			activeSlideIndex,
			byController: true
		};
		if (Array.isArray(swiper.controller.control)) swiper.controller.control.forEach((c) => {
			if (!c.destroyed && c.params.loop) c.loopFix({
				...loopParams,
				slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo : false
			});
		});
		else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) swiper.controller.control.loopFix({
			...loopParams,
			slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo : false
		});
	}
	swiper.emit("loopFix");
}
function loopDestroy() {
	const swiper = this;
	const { params, slidesEl } = swiper;
	if (!params.loop || !slidesEl || swiper.virtual && swiper.params.virtual.enabled) return;
	swiper.recalcSlides();
	const newSlidesOrder = [];
	swiper.slides.forEach((slideEl) => {
		const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
		newSlidesOrder[index] = slideEl;
	});
	swiper.slides.forEach((slideEl) => {
		slideEl.removeAttribute("data-swiper-slide-index");
	});
	newSlidesOrder.forEach((slideEl) => {
		slidesEl.append(slideEl);
	});
	swiper.recalcSlides();
	swiper.slideTo(swiper.realIndex, 0);
}
var loop = {
	loopCreate,
	loopFix,
	loopDestroy
};
function setGrabCursor(moving) {
	const swiper = this;
	if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
	const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
	if (swiper.isElement) swiper.__preventObserver__ = true;
	el.style.cursor = "move";
	el.style.cursor = moving ? "grabbing" : "grab";
	if (swiper.isElement) requestAnimationFrame(() => {
		swiper.__preventObserver__ = false;
	});
}
function unsetGrabCursor() {
	const swiper = this;
	if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
	if (swiper.isElement) swiper.__preventObserver__ = true;
	swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
	if (swiper.isElement) requestAnimationFrame(() => {
		swiper.__preventObserver__ = false;
	});
}
var grabCursor = {
	setGrabCursor,
	unsetGrabCursor
};
function closestElement(selector, base = this) {
	function __closestFrom(el) {
		if (!el || el === getDocument() || el === getWindow()) return null;
		if (el.assignedSlot) el = el.assignedSlot;
		const found = el.closest(selector);
		if (!found && !el.getRootNode) return null;
		return found || __closestFrom(el.getRootNode().host);
	}
	return __closestFrom(base);
}
function preventEdgeSwipe(swiper, event, startX) {
	const window = getWindow();
	const { params } = swiper;
	const edgeSwipeDetection = params.edgeSwipeDetection;
	const edgeSwipeThreshold = params.edgeSwipeThreshold;
	if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
		if (edgeSwipeDetection === "prevent") {
			event.preventDefault();
			return true;
		}
		return false;
	}
	return true;
}
function onTouchStart(event) {
	const swiper = this;
	const document = getDocument();
	let e = event;
	if (e.originalEvent) e = e.originalEvent;
	const data = swiper.touchEventsData;
	if (e.type === "pointerdown") {
		if (data.pointerId !== null && data.pointerId !== e.pointerId) return;
		data.pointerId = e.pointerId;
	} else if (e.type === "touchstart" && e.targetTouches.length === 1) data.touchId = e.targetTouches[0].identifier;
	if (e.type === "touchstart") {
		preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
		return;
	}
	const { params, touches, enabled } = swiper;
	if (!enabled) return;
	if (!params.simulateTouch && e.pointerType === "mouse") return;
	if (swiper.animating && params.preventInteractionOnTransition) return;
	if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
	let targetEl = e.target;
	if (params.touchEventsTarget === "wrapper") {
		if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
	}
	if ("which" in e && e.which === 3) return;
	if ("button" in e && e.button > 0) return;
	if (data.isTouched && data.isMoved) return;
	const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
	const eventPath = e.composedPath ? e.composedPath() : e.path;
	if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) targetEl = eventPath[0];
	const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
	const isTargetShadow = !!(e.target && e.target.shadowRoot);
	if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
		swiper.allowClick = true;
		return;
	}
	if (params.swipeHandler) {
		if (!targetEl.closest(params.swipeHandler)) return;
	}
	touches.currentX = e.pageX;
	touches.currentY = e.pageY;
	const startX = touches.currentX;
	const startY = touches.currentY;
	if (!preventEdgeSwipe(swiper, e, startX)) return;
	Object.assign(data, {
		isTouched: true,
		isMoved: false,
		allowTouchCallbacks: true,
		isScrolling: void 0,
		startMoving: void 0
	});
	touches.startX = startX;
	touches.startY = startY;
	data.touchStartTime = now();
	swiper.allowClick = true;
	swiper.updateSize();
	swiper.swipeDirection = void 0;
	if (params.threshold > 0) data.allowThresholdMove = false;
	let preventDefault = true;
	if (targetEl.matches(data.focusableElements)) {
		preventDefault = false;
		if (targetEl.nodeName === "SELECT") data.isTouched = false;
	}
	if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl && (e.pointerType === "mouse" || e.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) document.activeElement.blur();
	const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
	if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) e.preventDefault();
	if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
	swiper.emit("touchStart", e);
}
function onTouchMove(event) {
	const document = getDocument();
	const swiper = this;
	const data = swiper.touchEventsData;
	const { params, touches, rtlTranslate: rtl, enabled } = swiper;
	if (!enabled) return;
	if (!params.simulateTouch && event.pointerType === "mouse") return;
	let e = event;
	if (e.originalEvent) e = e.originalEvent;
	if (e.type === "pointermove") {
		if (data.touchId !== null) return;
		if (e.pointerId !== data.pointerId) return;
	}
	let targetTouch;
	if (e.type === "touchmove") {
		targetTouch = [...e.changedTouches].find((t) => t.identifier === data.touchId);
		if (!targetTouch || targetTouch.identifier !== data.touchId) return;
	} else targetTouch = e;
	if (!data.isTouched) {
		if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
		return;
	}
	const pageX = targetTouch.pageX;
	const pageY = targetTouch.pageY;
	if (e.preventedByNestedSwiper) {
		touches.startX = pageX;
		touches.startY = pageY;
		return;
	}
	if (!swiper.allowTouchMove) {
		if (!e.target.matches(data.focusableElements)) swiper.allowClick = false;
		if (data.isTouched) {
			Object.assign(touches, {
				startX: pageX,
				startY: pageY,
				currentX: pageX,
				currentY: pageY
			});
			data.touchStartTime = now();
		}
		return;
	}
	if (params.touchReleaseOnEdges && !params.loop) {
		if (swiper.isVertical()) {
			if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
				data.isTouched = false;
				data.isMoved = false;
				return;
			}
		} else if (rtl && (pageX > touches.startX && -swiper.translate <= swiper.maxTranslate() || pageX < touches.startX && -swiper.translate >= swiper.minTranslate())) return;
		else if (!rtl && (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate())) return;
	}
	if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== e.target && e.pointerType !== "mouse") document.activeElement.blur();
	if (document.activeElement) {
		if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
			data.isMoved = true;
			swiper.allowClick = false;
			return;
		}
	}
	if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
	touches.previousX = touches.currentX;
	touches.previousY = touches.currentY;
	touches.currentX = pageX;
	touches.currentY = pageY;
	const diffX = touches.currentX - touches.startX;
	const diffY = touches.currentY - touches.startY;
	if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
	if (typeof data.isScrolling === "undefined") {
		let touchAngle;
		if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false;
		else if (diffX * diffX + diffY * diffY >= 25) {
			touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
			data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
		}
	}
	if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
	if (typeof data.startMoving === "undefined") {
		if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
	}
	if (data.isScrolling || e.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
		data.isTouched = false;
		return;
	}
	if (!data.startMoving) return;
	swiper.allowClick = false;
	if (!params.cssMode && e.cancelable) e.preventDefault();
	if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
	let diff = swiper.isHorizontal() ? diffX : diffY;
	let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
	if (params.oneWayMovement) {
		diff = Math.abs(diff) * (rtl ? 1 : -1);
		touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
	}
	touches.diff = diff;
	diff *= params.touchRatio;
	if (rtl) {
		diff = -diff;
		touchesDiff = -touchesDiff;
	}
	const prevTouchesDirection = swiper.touchesDirection;
	swiper.swipeDirection = diff > 0 ? "prev" : "next";
	swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
	const isLoop = swiper.params.loop && !params.cssMode;
	const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
	if (!data.isMoved) {
		if (isLoop && allowLoopFix) swiper.loopFix({ direction: swiper.swipeDirection });
		data.startTranslate = swiper.getTranslate();
		swiper.setTransition(0);
		if (swiper.animating) {
			const evt = new window.CustomEvent("transitionend", {
				bubbles: true,
				cancelable: true,
				detail: { bySwiperTouchMove: true }
			});
			swiper.wrapperEl.dispatchEvent(evt);
		}
		data.allowMomentumBounce = false;
		if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(true);
		swiper.emit("sliderFirstMove", e);
	}
	(/* @__PURE__ */ new Date()).getTime();
	if (params._loopSwapReset !== false && data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
		Object.assign(touches, {
			startX: pageX,
			startY: pageY,
			currentX: pageX,
			currentY: pageY,
			startTranslate: data.currentTranslate
		});
		data.loopSwapReset = true;
		data.startTranslate = data.currentTranslate;
		return;
	}
	swiper.emit("sliderMove", e);
	data.isMoved = true;
	data.currentTranslate = diff + data.startTranslate;
	let disableParentSwiper = true;
	let resistanceRatio = params.resistanceRatio;
	if (params.touchReleaseOnEdges) resistanceRatio = 0;
	if (diff > 0) {
		if (isLoop && allowLoopFix && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) swiper.loopFix({
			direction: "prev",
			setTranslate: true,
			activeSlideIndex: 0
		});
		if (data.currentTranslate > swiper.minTranslate()) {
			disableParentSwiper = false;
			if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
		}
	} else if (diff < 0) {
		if (isLoop && allowLoopFix && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) swiper.loopFix({
			direction: "next",
			setTranslate: true,
			activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
		});
		if (data.currentTranslate < swiper.maxTranslate()) {
			disableParentSwiper = false;
			if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
		}
	}
	if (disableParentSwiper) e.preventedByNestedSwiper = true;
	if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
	if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
	if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
	if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
		if (!data.allowThresholdMove) {
			data.allowThresholdMove = true;
			touches.startX = touches.currentX;
			touches.startY = touches.currentY;
			data.currentTranslate = data.startTranslate;
			touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
			return;
		}
	} else {
		data.currentTranslate = data.startTranslate;
		return;
	}
	if (!params.followFinger || params.cssMode) return;
	if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
		swiper.updateActiveIndex();
		swiper.updateSlidesClasses();
	}
	if (params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
	swiper.updateProgress(data.currentTranslate);
	swiper.setTranslate(data.currentTranslate);
}
function onTouchEnd(event) {
	const swiper = this;
	const data = swiper.touchEventsData;
	let e = event;
	if (e.originalEvent) e = e.originalEvent;
	let targetTouch;
	if (!(e.type === "touchend" || e.type === "touchcancel")) {
		if (data.touchId !== null) return;
		if (e.pointerId !== data.pointerId) return;
		targetTouch = e;
	} else {
		targetTouch = [...e.changedTouches].find((t) => t.identifier === data.touchId);
		if (!targetTouch || targetTouch.identifier !== data.touchId) return;
	}
	if ([
		"pointercancel",
		"pointerout",
		"pointerleave",
		"contextmenu"
	].includes(e.type)) {
		if (!(["pointercancel", "contextmenu"].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView))) return;
	}
	data.pointerId = null;
	data.touchId = null;
	const { params, touches, rtlTranslate: rtl, slidesGrid, enabled } = swiper;
	if (!enabled) return;
	if (!params.simulateTouch && e.pointerType === "mouse") return;
	if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
	data.allowTouchCallbacks = false;
	if (!data.isTouched) {
		if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
		data.isMoved = false;
		data.startMoving = false;
		return;
	}
	if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(false);
	const touchEndTime = now();
	const timeDiff = touchEndTime - data.touchStartTime;
	if (swiper.allowClick) {
		const pathTree = e.path || e.composedPath && e.composedPath();
		swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
		swiper.emit("tap click", e);
		if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
	}
	data.lastClickTime = now();
	nextTick(() => {
		if (!swiper.destroyed) swiper.allowClick = true;
	});
	if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
		data.isTouched = false;
		data.isMoved = false;
		data.startMoving = false;
		return;
	}
	data.isTouched = false;
	data.isMoved = false;
	data.startMoving = false;
	let currentPos;
	if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate;
	else currentPos = -data.currentTranslate;
	if (params.cssMode) return;
	if (params.freeMode && params.freeMode.enabled) {
		swiper.freeMode.onTouchEnd({ currentPos });
		return;
	}
	const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
	let stopIndex = 0;
	let groupSize = swiper.slidesSizesGrid[0];
	for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
		const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
		if (typeof slidesGrid[i + increment] !== "undefined") {
			if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
				stopIndex = i;
				groupSize = slidesGrid[i + increment] - slidesGrid[i];
			}
		} else if (swipeToLast || currentPos >= slidesGrid[i]) {
			stopIndex = i;
			groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
		}
	}
	let rewindFirstIndex = null;
	let rewindLastIndex = null;
	if (params.rewind) {
		if (swiper.isBeginning) rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
		else if (swiper.isEnd) rewindFirstIndex = 0;
	}
	const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
	const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
	if (timeDiff > params.longSwipesMs) {
		if (!params.longSwipes) {
			swiper.slideTo(swiper.activeIndex);
			return;
		}
		if (swiper.swipeDirection === "next") if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
		else swiper.slideTo(stopIndex);
		if (swiper.swipeDirection === "prev") if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment);
		else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex);
		else swiper.slideTo(stopIndex);
	} else {
		if (!params.shortSwipes) {
			swiper.slideTo(swiper.activeIndex);
			return;
		}
		if (!(swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl))) {
			if (swiper.swipeDirection === "next") swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
			if (swiper.swipeDirection === "prev") swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
		} else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment);
		else swiper.slideTo(stopIndex);
	}
}
function onResize() {
	const swiper = this;
	const { params, el } = swiper;
	if (el && el.offsetWidth === 0) return;
	if (params.breakpoints) swiper.setBreakpoint();
	const { allowSlideNext, allowSlidePrev, snapGrid } = swiper;
	const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
	swiper.allowSlideNext = true;
	swiper.allowSlidePrev = true;
	swiper.updateSize();
	swiper.updateSlides();
	swiper.updateSlidesClasses();
	const isVirtualLoop = isVirtual && params.loop;
	if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
		const slides = isVirtual ? swiper.virtual.slides : swiper.slides;
		swiper.slideTo(slides.length - 1, 0, false, true);
	} else if (swiper.params.loop && !isVirtual) swiper.slideToLoop(swiper.realIndex, 0, false, true);
	else swiper.slideTo(swiper.activeIndex, 0, false, true);
	if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
		clearTimeout(swiper.autoplay.resizeTimeout);
		swiper.autoplay.resizeTimeout = setTimeout(() => {
			if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.resume();
		}, 500);
	}
	swiper.allowSlidePrev = allowSlidePrev;
	swiper.allowSlideNext = allowSlideNext;
	if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
}
function onClick(e) {
	const swiper = this;
	if (!swiper.enabled) return;
	if (!swiper.allowClick) {
		if (swiper.params.preventClicks) e.preventDefault();
		if (swiper.params.preventClicksPropagation && swiper.animating) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}
}
function onScroll() {
	const swiper = this;
	const { wrapperEl, rtlTranslate, enabled } = swiper;
	if (!enabled) return;
	swiper.previousTranslate = swiper.translate;
	if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft;
	else swiper.translate = -wrapperEl.scrollTop;
	if (swiper.translate === 0) swiper.translate = 0;
	swiper.updateActiveIndex();
	swiper.updateSlidesClasses();
	let newProgress;
	const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
	if (translatesDiff === 0) newProgress = 0;
	else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
	if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
	swiper.emit("setTranslate", swiper.translate, false);
}
function onLoad(e) {
	const swiper = this;
	processLazyPreloader(swiper, e.target);
	if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) return;
	swiper.update();
}
function onDocumentTouchStart() {
	const swiper = this;
	if (swiper.documentTouchHandlerProceeded) return;
	swiper.documentTouchHandlerProceeded = true;
	if (swiper.params.touchReleaseOnEdges) swiper.el.style.touchAction = "auto";
}
var events = (swiper, method) => {
	const document = getDocument();
	const { params, el, wrapperEl, device } = swiper;
	const capture = !!params.nested;
	const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
	const swiperMethod = method;
	if (!el || typeof el === "string") return;
	document[domMethod]("touchstart", swiper.onDocumentTouchStart, {
		passive: false,
		capture
	});
	el[domMethod]("touchstart", swiper.onTouchStart, { passive: false });
	el[domMethod]("pointerdown", swiper.onTouchStart, { passive: false });
	document[domMethod]("touchmove", swiper.onTouchMove, {
		passive: false,
		capture
	});
	document[domMethod]("pointermove", swiper.onTouchMove, {
		passive: false,
		capture
	});
	document[domMethod]("touchend", swiper.onTouchEnd, { passive: true });
	document[domMethod]("pointerup", swiper.onTouchEnd, { passive: true });
	document[domMethod]("pointercancel", swiper.onTouchEnd, { passive: true });
	document[domMethod]("touchcancel", swiper.onTouchEnd, { passive: true });
	document[domMethod]("pointerout", swiper.onTouchEnd, { passive: true });
	document[domMethod]("pointerleave", swiper.onTouchEnd, { passive: true });
	document[domMethod]("contextmenu", swiper.onTouchEnd, { passive: true });
	if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
	if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
	if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
	else swiper[swiperMethod]("observerUpdate", onResize, true);
	el[domMethod]("load", swiper.onLoad, { capture: true });
};
function attachEvents() {
	const swiper = this;
	const { params } = swiper;
	swiper.onTouchStart = onTouchStart.bind(swiper);
	swiper.onTouchMove = onTouchMove.bind(swiper);
	swiper.onTouchEnd = onTouchEnd.bind(swiper);
	swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
	if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
	swiper.onClick = onClick.bind(swiper);
	swiper.onLoad = onLoad.bind(swiper);
	events(swiper, "on");
}
function detachEvents() {
	events(this, "off");
}
var events$1 = {
	attachEvents,
	detachEvents
};
var isGridEnabled = (swiper, params) => {
	return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
	const swiper = this;
	const { realIndex, initialized, params, el } = swiper;
	const breakpoints = params.breakpoints;
	if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;
	const document = getDocument();
	const breakpointsBase = params.breakpointsBase === "window" || !params.breakpointsBase ? params.breakpointsBase : "container";
	const breakpointContainer = ["window", "container"].includes(params.breakpointsBase) || !params.breakpointsBase ? swiper.el : document.querySelector(params.breakpointsBase);
	const breakpoint = swiper.getBreakpoint(breakpoints, breakpointsBase, breakpointContainer);
	if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
	const breakpointParams = (breakpoint in breakpoints ? breakpoints[breakpoint] : void 0) || swiper.originalParams;
	const wasMultiRow = isGridEnabled(swiper, params);
	const isMultiRow = isGridEnabled(swiper, breakpointParams);
	const wasGrabCursor = swiper.params.grabCursor;
	const isGrabCursor = breakpointParams.grabCursor;
	const wasEnabled = params.enabled;
	if (wasMultiRow && !isMultiRow) {
		el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
		swiper.emitContainerClasses();
	} else if (!wasMultiRow && isMultiRow) {
		el.classList.add(`${params.containerModifierClass}grid`);
		if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") el.classList.add(`${params.containerModifierClass}grid-column`);
		swiper.emitContainerClasses();
	}
	if (wasGrabCursor && !isGrabCursor) swiper.unsetGrabCursor();
	else if (!wasGrabCursor && isGrabCursor) swiper.setGrabCursor();
	[
		"navigation",
		"pagination",
		"scrollbar"
	].forEach((prop) => {
		if (typeof breakpointParams[prop] === "undefined") return;
		const wasModuleEnabled = params[prop] && params[prop].enabled;
		const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
		if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
		if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
	});
	const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
	const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
	const wasLoop = params.loop;
	if (directionChanged && initialized) swiper.changeDirection();
	extend(swiper.params, breakpointParams);
	const isEnabled = swiper.params.enabled;
	const hasLoop = swiper.params.loop;
	Object.assign(swiper, {
		allowTouchMove: swiper.params.allowTouchMove,
		allowSlideNext: swiper.params.allowSlideNext,
		allowSlidePrev: swiper.params.allowSlidePrev
	});
	if (wasEnabled && !isEnabled) swiper.disable();
	else if (!wasEnabled && isEnabled) swiper.enable();
	swiper.currentBreakpoint = breakpoint;
	swiper.emit("_beforeBreakpoint", breakpointParams);
	if (initialized) {
		if (needsReLoop) {
			swiper.loopDestroy();
			swiper.loopCreate(realIndex);
			swiper.updateSlides();
		} else if (!wasLoop && hasLoop) {
			swiper.loopCreate(realIndex);
			swiper.updateSlides();
		} else if (wasLoop && !hasLoop) swiper.loopDestroy();
	}
	swiper.emit("breakpoint", breakpointParams);
}
function getBreakpoint(breakpoints, base = "window", containerEl) {
	if (!breakpoints || base === "container" && !containerEl) return void 0;
	let breakpoint = false;
	const window = getWindow();
	const currentHeight = base === "window" ? window.innerHeight : containerEl.clientHeight;
	const points = Object.keys(breakpoints).map((point) => {
		if (typeof point === "string" && point.indexOf("@") === 0) return {
			value: currentHeight * parseFloat(point.substr(1)),
			point
		};
		return {
			value: point,
			point
		};
	});
	points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
	for (let i = 0; i < points.length; i += 1) {
		const { point, value } = points[i];
		if (base === "window") {
			if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
		} else if (value <= containerEl.clientWidth) breakpoint = point;
	}
	return breakpoint || "max";
}
var breakpoints = {
	setBreakpoint,
	getBreakpoint
};
function prepareClasses(entries, prefix) {
	const resultClasses = [];
	entries.forEach((item) => {
		if (typeof item === "object") Object.keys(item).forEach((classNames) => {
			if (item[classNames]) resultClasses.push(prefix + classNames);
		});
		else if (typeof item === "string") resultClasses.push(prefix + item);
	});
	return resultClasses;
}
function addClasses() {
	const swiper = this;
	const { classNames, params, rtl, el, device } = swiper;
	const suffixes = prepareClasses([
		"initialized",
		params.direction,
		{ "free-mode": swiper.params.freeMode && params.freeMode.enabled },
		{ "autoheight": params.autoHeight },
		{ "rtl": rtl },
		{ "grid": params.grid && params.grid.rows > 1 },
		{ "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column" },
		{ "android": device.android },
		{ "ios": device.ios },
		{ "css-mode": params.cssMode },
		{ "centered": params.cssMode && params.centeredSlides },
		{ "watch-progress": params.watchSlidesProgress }
	], params.containerModifierClass);
	classNames.push(...suffixes);
	el.classList.add(...classNames);
	swiper.emitContainerClasses();
}
function removeClasses() {
	const swiper = this;
	const { el, classNames } = swiper;
	if (!el || typeof el === "string") return;
	el.classList.remove(...classNames);
	swiper.emitContainerClasses();
}
var classes = {
	addClasses,
	removeClasses
};
function checkOverflow() {
	const swiper = this;
	const { isLocked: wasLocked, params } = swiper;
	const { slidesOffsetBefore } = params;
	if (slidesOffsetBefore) {
		const lastSlideIndex = swiper.slides.length - 1;
		const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
		swiper.isLocked = swiper.size > lastSlideRightEdge;
	} else swiper.isLocked = swiper.snapGrid.length === 1;
	if (params.allowSlideNext === true) swiper.allowSlideNext = !swiper.isLocked;
	if (params.allowSlidePrev === true) swiper.allowSlidePrev = !swiper.isLocked;
	if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
	if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
}
var checkOverflow$1 = { checkOverflow };
var defaults = {
	init: true,
	direction: "horizontal",
	oneWayMovement: false,
	swiperElementNodeName: "SWIPER-CONTAINER",
	touchEventsTarget: "wrapper",
	initialSlide: 0,
	speed: 300,
	cssMode: false,
	updateOnWindowResize: true,
	resizeObserver: true,
	nested: false,
	createElements: false,
	eventsPrefix: "swiper",
	enabled: true,
	focusableElements: "input, select, option, textarea, button, video, label",
	width: null,
	height: null,
	preventInteractionOnTransition: false,
	userAgent: null,
	url: null,
	edgeSwipeDetection: false,
	edgeSwipeThreshold: 20,
	autoHeight: false,
	setWrapperSize: false,
	virtualTranslate: false,
	effect: "slide",
	breakpoints: void 0,
	breakpointsBase: "window",
	spaceBetween: 0,
	slidesPerView: 1,
	slidesPerGroup: 1,
	slidesPerGroupSkip: 0,
	slidesPerGroupAuto: false,
	centeredSlides: false,
	centeredSlidesBounds: false,
	slidesOffsetBefore: 0,
	slidesOffsetAfter: 0,
	normalizeSlideIndex: true,
	centerInsufficientSlides: false,
	snapToSlideEdge: false,
	watchOverflow: true,
	roundLengths: false,
	touchRatio: 1,
	touchAngle: 45,
	simulateTouch: true,
	shortSwipes: true,
	longSwipes: true,
	longSwipesRatio: .5,
	longSwipesMs: 300,
	followFinger: true,
	allowTouchMove: true,
	threshold: 5,
	touchMoveStopPropagation: false,
	touchStartPreventDefault: true,
	touchStartForcePreventDefault: false,
	touchReleaseOnEdges: false,
	uniqueNavElements: true,
	resistance: true,
	resistanceRatio: .85,
	watchSlidesProgress: false,
	grabCursor: false,
	preventClicks: true,
	preventClicksPropagation: true,
	slideToClickedSlide: false,
	loop: false,
	loopAddBlankSlides: true,
	loopAdditionalSlides: 0,
	loopPreventsSliding: true,
	rewind: false,
	allowSlidePrev: true,
	allowSlideNext: true,
	swipeHandler: null,
	noSwiping: true,
	noSwipingClass: "swiper-no-swiping",
	noSwipingSelector: null,
	passiveListeners: true,
	maxBackfaceHiddenSlides: 10,
	containerModifierClass: "swiper-",
	slideClass: "swiper-slide",
	slideBlankClass: "swiper-slide-blank",
	slideActiveClass: "swiper-slide-active",
	slideVisibleClass: "swiper-slide-visible",
	slideFullyVisibleClass: "swiper-slide-fully-visible",
	slideNextClass: "swiper-slide-next",
	slidePrevClass: "swiper-slide-prev",
	wrapperClass: "swiper-wrapper",
	lazyPreloaderClass: "swiper-lazy-preloader",
	lazyPreloadPrevNext: 0,
	runCallbacksOnInit: true,
	_emitClasses: false
};
function moduleExtendParams(params, allModulesParams) {
	return function extendParams(obj = {}) {
		const moduleParamName = Object.keys(obj)[0];
		const moduleParams = obj[moduleParamName];
		if (typeof moduleParams !== "object" || moduleParams === null) {
			extend(allModulesParams, obj);
			return;
		}
		if (params[moduleParamName] === true) params[moduleParamName] = { enabled: true };
		if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) params[moduleParamName].auto = true;
		if (["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) params[moduleParamName].auto = true;
		if (!(moduleParamName in params && "enabled" in moduleParams)) {
			extend(allModulesParams, obj);
			return;
		}
		if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
		if (!params[moduleParamName]) params[moduleParamName] = { enabled: false };
		extend(allModulesParams, obj);
	};
}
var prototypes = {
	eventsEmitter,
	update,
	translate,
	transition,
	slide,
	loop,
	grabCursor,
	events: events$1,
	breakpoints,
	checkOverflow: checkOverflow$1,
	classes
};
var extendedDefaults = {};
var Swiper = class Swiper {
	constructor(...args) {
		let el;
		let params;
		if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") params = args[0];
		else [el, params] = args;
		if (!params) params = {};
		params = extend({}, params);
		if (el && !params.el) params.el = el;
		const document = getDocument();
		if (params.el && typeof params.el === "string" && document.querySelectorAll(params.el).length > 1) {
			const swipers = [];
			document.querySelectorAll(params.el).forEach((containerEl) => {
				const newParams = extend({}, params, { el: containerEl });
				swipers.push(new Swiper(newParams));
			});
			return swipers;
		}
		const swiper = this;
		swiper.__swiper__ = true;
		swiper.support = getSupport();
		swiper.device = getDevice({ userAgent: params.userAgent });
		swiper.browser = getBrowser();
		swiper.eventsListeners = {};
		swiper.eventsAnyListeners = [];
		swiper.modules = [...swiper.__modules__];
		if (params.modules && Array.isArray(params.modules)) params.modules.forEach((mod) => {
			if (typeof mod === "function" && swiper.modules.indexOf(mod) < 0) swiper.modules.push(mod);
		});
		const allModulesParams = {};
		swiper.modules.forEach((mod) => {
			mod({
				params,
				swiper,
				extendParams: moduleExtendParams(params, allModulesParams),
				on: swiper.on.bind(swiper),
				once: swiper.once.bind(swiper),
				off: swiper.off.bind(swiper),
				emit: swiper.emit.bind(swiper)
			});
		});
		swiper.params = extend({}, extend({}, defaults, allModulesParams), extendedDefaults, params);
		swiper.originalParams = extend({}, swiper.params);
		swiper.passedParams = extend({}, params);
		if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName) => {
			swiper.on(eventName, swiper.params.on[eventName]);
		});
		if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
		Object.assign(swiper, {
			enabled: swiper.params.enabled,
			el,
			classNames: [],
			slides: [],
			slidesGrid: [],
			snapGrid: [],
			slidesSizesGrid: [],
			isHorizontal() {
				return swiper.params.direction === "horizontal";
			},
			isVertical() {
				return swiper.params.direction === "vertical";
			},
			activeIndex: 0,
			realIndex: 0,
			isBeginning: true,
			isEnd: false,
			translate: 0,
			previousTranslate: 0,
			progress: 0,
			velocity: 0,
			animating: false,
			cssOverflowAdjustment() {
				return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
			},
			allowSlideNext: swiper.params.allowSlideNext,
			allowSlidePrev: swiper.params.allowSlidePrev,
			touchEventsData: {
				isTouched: void 0,
				isMoved: void 0,
				allowTouchCallbacks: void 0,
				touchStartTime: void 0,
				isScrolling: void 0,
				currentTranslate: void 0,
				startTranslate: void 0,
				allowThresholdMove: void 0,
				focusableElements: swiper.params.focusableElements,
				lastClickTime: 0,
				clickTimeout: void 0,
				velocities: [],
				allowMomentumBounce: void 0,
				startMoving: void 0,
				pointerId: null,
				touchId: null
			},
			allowClick: true,
			allowTouchMove: swiper.params.allowTouchMove,
			touches: {
				startX: 0,
				startY: 0,
				currentX: 0,
				currentY: 0,
				diff: 0
			},
			imagesToLoad: [],
			imagesLoaded: 0
		});
		swiper.emit("_swiper");
		if (swiper.params.init) swiper.init();
		return swiper;
	}
	getDirectionLabel(property) {
		if (this.isHorizontal()) return property;
		return {
			"width": "height",
			"margin-top": "margin-left",
			"margin-bottom ": "margin-right",
			"margin-left": "margin-top",
			"margin-right": "margin-bottom",
			"padding-left": "padding-top",
			"padding-right": "padding-bottom",
			"marginRight": "marginBottom"
		}[property];
	}
	getSlideIndex(slideEl) {
		const { slidesEl, params } = this;
		const firstSlideIndex = elementIndex(elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`)[0]);
		return elementIndex(slideEl) - firstSlideIndex;
	}
	getSlideIndexByData(index) {
		return this.getSlideIndex(this.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index));
	}
	getSlideIndexWhenGrid(index) {
		if (this.grid && this.params.grid && this.params.grid.rows > 1) {
			if (this.params.grid.fill === "column") index = Math.floor(index / this.params.grid.rows);
			else if (this.params.grid.fill === "row") index = index % Math.ceil(this.slides.length / this.params.grid.rows);
		}
		return index;
	}
	recalcSlides() {
		const swiper = this;
		const { slidesEl, params } = swiper;
		swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
	}
	enable() {
		const swiper = this;
		if (swiper.enabled) return;
		swiper.enabled = true;
		if (swiper.params.grabCursor) swiper.setGrabCursor();
		swiper.emit("enable");
	}
	disable() {
		const swiper = this;
		if (!swiper.enabled) return;
		swiper.enabled = false;
		if (swiper.params.grabCursor) swiper.unsetGrabCursor();
		swiper.emit("disable");
	}
	setProgress(progress, speed) {
		const swiper = this;
		progress = Math.min(Math.max(progress, 0), 1);
		const min = swiper.minTranslate();
		const current = (swiper.maxTranslate() - min) * progress + min;
		swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
		swiper.updateActiveIndex();
		swiper.updateSlidesClasses();
	}
	emitContainerClasses() {
		const swiper = this;
		if (!swiper.params._emitClasses || !swiper.el) return;
		const cls = swiper.el.className.split(" ").filter((className) => {
			return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
		});
		swiper.emit("_containerClasses", cls.join(" "));
	}
	getSlideClasses(slideEl) {
		const swiper = this;
		if (swiper.destroyed) return "";
		return slideEl.className.split(" ").filter((className) => {
			return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
		}).join(" ");
	}
	emitSlidesClasses() {
		const swiper = this;
		if (!swiper.params._emitClasses || !swiper.el) return;
		const updates = [];
		swiper.slides.forEach((slideEl) => {
			const classNames = swiper.getSlideClasses(slideEl);
			updates.push({
				slideEl,
				classNames
			});
			swiper.emit("_slideClass", slideEl, classNames);
		});
		swiper.emit("_slideClasses", updates);
	}
	slidesPerViewDynamic(view = "current", exact = false) {
		const { params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex } = this;
		let spv = 1;
		if (typeof params.slidesPerView === "number") return params.slidesPerView;
		if (params.centeredSlides) {
			let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
			let breakLoop;
			for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
				slideSize += Math.ceil(slides[i].swiperSlideSize);
				spv += 1;
				if (slideSize > swiperSize) breakLoop = true;
			}
			for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
				slideSize += slides[i].swiperSlideSize;
				spv += 1;
				if (slideSize > swiperSize) breakLoop = true;
			}
		} else if (view === "current") {
			for (let i = activeIndex + 1; i < slides.length; i += 1) if (exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize) spv += 1;
		} else for (let i = activeIndex - 1; i >= 0; i -= 1) if (slidesGrid[activeIndex] - slidesGrid[i] < swiperSize) spv += 1;
		return spv;
	}
	update() {
		const swiper = this;
		if (!swiper || swiper.destroyed) return;
		const { snapGrid, params } = swiper;
		if (params.breakpoints) swiper.setBreakpoint();
		[...swiper.el.querySelectorAll("[loading=\"lazy\"]")].forEach((imageEl) => {
			if (imageEl.complete) processLazyPreloader(swiper, imageEl);
		});
		swiper.updateSize();
		swiper.updateSlides();
		swiper.updateProgress();
		swiper.updateSlidesClasses();
		function setTranslate() {
			const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
			const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
			swiper.setTranslate(newTranslate);
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}
		let translated;
		if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
			setTranslate();
			if (params.autoHeight) swiper.updateAutoHeight();
		} else {
			if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
				const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
				translated = swiper.slideTo(slides.length - 1, 0, false, true);
			} else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
			if (!translated) setTranslate();
		}
		if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
		swiper.emit("update");
	}
	changeDirection(newDirection, needUpdate = true) {
		const swiper = this;
		const currentDirection = swiper.params.direction;
		if (!newDirection) newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
		if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") return swiper;
		swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
		swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
		swiper.emitContainerClasses();
		swiper.params.direction = newDirection;
		swiper.slides.forEach((slideEl) => {
			if (newDirection === "vertical") slideEl.style.width = "";
			else slideEl.style.height = "";
		});
		swiper.emit("changeDirection");
		if (needUpdate) swiper.update();
		return swiper;
	}
	changeLanguageDirection(direction) {
		const swiper = this;
		if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
		swiper.rtl = direction === "rtl";
		swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
		if (swiper.rtl) {
			swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
			swiper.el.dir = "rtl";
		} else {
			swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
			swiper.el.dir = "ltr";
		}
		swiper.update();
	}
	mount(element) {
		const swiper = this;
		if (swiper.mounted) return true;
		let el = element || swiper.params.el;
		if (typeof el === "string") el = document.querySelector(el);
		if (!el) return false;
		el.swiper = swiper;
		if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) swiper.isElement = true;
		const getWrapperSelector = () => {
			return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
		};
		const getWrapper = () => {
			if (el && el.shadowRoot && el.shadowRoot.querySelector) return el.shadowRoot.querySelector(getWrapperSelector());
			return elementChildren(el, getWrapperSelector())[0];
		};
		let wrapperEl = getWrapper();
		if (!wrapperEl && swiper.params.createElements) {
			wrapperEl = createElement("div", swiper.params.wrapperClass);
			el.append(wrapperEl);
			elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
				wrapperEl.append(slideEl);
			});
		}
		Object.assign(swiper, {
			el,
			wrapperEl,
			slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
			hostEl: swiper.isElement ? el.parentNode.host : el,
			mounted: true,
			rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
			rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
			wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
		});
		return true;
	}
	init(el) {
		const swiper = this;
		if (swiper.initialized) return swiper;
		if (swiper.mount(el) === false) return swiper;
		swiper.emit("beforeInit");
		if (swiper.params.breakpoints) swiper.setBreakpoint();
		swiper.addClasses();
		swiper.updateSize();
		swiper.updateSlides();
		if (swiper.params.watchOverflow) swiper.checkOverflow();
		if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
		if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
		else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
		if (swiper.params.loop) swiper.loopCreate(void 0, true);
		swiper.attachEvents();
		const lazyElements = [...swiper.el.querySelectorAll("[loading=\"lazy\"]")];
		if (swiper.isElement) lazyElements.push(...swiper.hostEl.querySelectorAll("[loading=\"lazy\"]"));
		lazyElements.forEach((imageEl) => {
			if (imageEl.complete) processLazyPreloader(swiper, imageEl);
			else imageEl.addEventListener("load", (e) => {
				processLazyPreloader(swiper, e.target);
			});
		});
		preload(swiper);
		swiper.initialized = true;
		preload(swiper);
		swiper.emit("init");
		swiper.emit("afterInit");
		return swiper;
	}
	destroy(deleteInstance = true, cleanStyles = true) {
		const swiper = this;
		const { params, el, wrapperEl, slides } = swiper;
		if (typeof swiper.params === "undefined" || swiper.destroyed) return null;
		swiper.emit("beforeDestroy");
		swiper.initialized = false;
		swiper.detachEvents();
		if (params.loop) swiper.loopDestroy();
		if (cleanStyles) {
			swiper.removeClasses();
			if (el && typeof el !== "string") el.removeAttribute("style");
			if (wrapperEl) wrapperEl.removeAttribute("style");
			if (slides && slides.length) slides.forEach((slideEl) => {
				slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
				slideEl.removeAttribute("style");
				slideEl.removeAttribute("data-swiper-slide-index");
			});
		}
		swiper.emit("destroy");
		Object.keys(swiper.eventsListeners).forEach((eventName) => {
			swiper.off(eventName);
		});
		if (deleteInstance !== false) {
			if (swiper.el && typeof swiper.el !== "string") swiper.el.swiper = null;
			deleteProps(swiper);
		}
		swiper.destroyed = true;
		return null;
	}
	static extendDefaults(newDefaults) {
		extend(extendedDefaults, newDefaults);
	}
	static get extendedDefaults() {
		return extendedDefaults;
	}
	static get defaults() {
		return defaults;
	}
	static installModule(mod) {
		if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
		const modules = Swiper.prototype.__modules__;
		if (typeof mod === "function" && modules.indexOf(mod) < 0) modules.push(mod);
	}
	static use(module) {
		if (Array.isArray(module)) {
			module.forEach((m) => Swiper.installModule(m));
			return Swiper;
		}
		Swiper.installModule(module);
		return Swiper;
	}
};
Object.keys(prototypes).forEach((prototypeGroup) => {
	Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
		Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
	});
});
Swiper.use([Resize, Observer]);
//#endregion
//#region node_modules/swiper/shared/create-element-if-not-defined.mjs
function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
	if (swiper.params.createElements) Object.keys(checkProps).forEach((key) => {
		if (!params[key] && params.auto === true) {
			let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
			if (!element) {
				element = createElement("div", checkProps[key]);
				element.className = checkProps[key];
				swiper.el.append(element);
			}
			params[key] = element;
			originalParams[key] = element;
		}
	});
	return params;
}
//#endregion
//#region node_modules/swiper/modules/navigation.mjs
var arrowSvg = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>`;
function Navigation({ swiper, extendParams, on, emit }) {
	extendParams({ navigation: {
		nextEl: null,
		prevEl: null,
		addIcons: true,
		hideOnClick: false,
		disabledClass: "swiper-button-disabled",
		hiddenClass: "swiper-button-hidden",
		lockClass: "swiper-button-lock",
		navigationDisabledClass: "swiper-navigation-disabled"
	} });
	swiper.navigation = {
		nextEl: null,
		prevEl: null,
		arrowSvg
	};
	function getEl(el) {
		let res;
		if (el && typeof el === "string" && swiper.isElement) {
			res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
			if (res) return res;
		}
		if (el) {
			if (typeof el === "string") res = [...document.querySelectorAll(el)];
			if (swiper.params.uniqueNavElements && typeof el === "string" && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) res = swiper.el.querySelector(el);
			else if (res && res.length === 1) res = res[0];
		}
		if (el && !res) return el;
		return res;
	}
	function toggleEl(el, disabled) {
		const params = swiper.params.navigation;
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			if (subEl) {
				subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
				if (subEl.tagName === "BUTTON") subEl.disabled = disabled;
				if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
			}
		});
	}
	function update() {
		const { nextEl, prevEl } = swiper.navigation;
		if (swiper.params.loop) {
			toggleEl(prevEl, false);
			toggleEl(nextEl, false);
			return;
		}
		toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
		toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
	}
	function onPrevClick(e) {
		e.preventDefault();
		if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
		swiper.slidePrev();
		emit("navigationPrev");
	}
	function onNextClick(e) {
		e.preventDefault();
		if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
		swiper.slideNext();
		emit("navigationNext");
	}
	function init() {
		const params = swiper.params.navigation;
		swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
			nextEl: "swiper-button-next",
			prevEl: "swiper-button-prev"
		});
		if (!(params.nextEl || params.prevEl)) return;
		let nextEl = getEl(params.nextEl);
		let prevEl = getEl(params.prevEl);
		Object.assign(swiper.navigation, {
			nextEl,
			prevEl
		});
		nextEl = makeElementsArray(nextEl);
		prevEl = makeElementsArray(prevEl);
		const initButton = (el, dir) => {
			if (el) {
				if (params.addIcons && el.matches(".swiper-button-next,.swiper-button-prev") && !el.querySelector("svg")) {
					const tempEl = document.createElement("div");
					setInnerHTML(tempEl, arrowSvg);
					el.appendChild(tempEl.querySelector("svg"));
					tempEl.remove();
				}
				el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
			}
			if (!swiper.enabled && el) el.classList.add(...params.lockClass.split(" "));
		};
		nextEl.forEach((el) => initButton(el, "next"));
		prevEl.forEach((el) => initButton(el, "prev"));
	}
	function destroy() {
		let { nextEl, prevEl } = swiper.navigation;
		nextEl = makeElementsArray(nextEl);
		prevEl = makeElementsArray(prevEl);
		const destroyButton = (el, dir) => {
			el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
			el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
		};
		nextEl.forEach((el) => destroyButton(el, "next"));
		prevEl.forEach((el) => destroyButton(el, "prev"));
	}
	on("init", () => {
		if (swiper.params.navigation.enabled === false) disable();
		else {
			init();
			update();
		}
	});
	on("toEdge fromEdge lock unlock", () => {
		update();
	});
	on("destroy", () => {
		destroy();
	});
	on("enable disable", () => {
		let { nextEl, prevEl } = swiper.navigation;
		nextEl = makeElementsArray(nextEl);
		prevEl = makeElementsArray(prevEl);
		if (swiper.enabled) {
			update();
			return;
		}
		[...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.add(swiper.params.navigation.lockClass));
	});
	on("click", (_s, e) => {
		let { nextEl, prevEl } = swiper.navigation;
		nextEl = makeElementsArray(nextEl);
		prevEl = makeElementsArray(prevEl);
		const targetEl = e.target;
		let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
		if (swiper.isElement && !targetIsButton) {
			const path = e.path || e.composedPath && e.composedPath();
			if (path) targetIsButton = path.find((pathEl) => nextEl.includes(pathEl) || prevEl.includes(pathEl));
		}
		if (swiper.params.navigation.hideOnClick && !targetIsButton) {
			if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
			let isHidden;
			if (nextEl.length) isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
			else if (prevEl.length) isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
			if (isHidden === true) emit("navigationShow");
			else emit("navigationHide");
			[...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.toggle(swiper.params.navigation.hiddenClass));
		}
	});
	const enable = () => {
		swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
		init();
		update();
	};
	const disable = () => {
		swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
		destroy();
	};
	Object.assign(swiper.navigation, {
		enable,
		disable,
		update,
		init,
		destroy
	});
}
//#endregion
//#region node_modules/swiper/shared/classes-to-selector.mjs
function classesToSelector(classes = "") {
	return `.${classes.trim().replace(/([\.:!+\/()[\]#>~*^$|=,'"@{}\\])/g, "\\$1").replace(/ /g, ".")}`;
}
//#endregion
//#region node_modules/swiper/modules/pagination.mjs
function Pagination({ swiper, extendParams, on, emit }) {
	const pfx = "swiper-pagination";
	extendParams({ pagination: {
		el: null,
		bulletElement: "span",
		clickable: false,
		hideOnClick: false,
		renderBullet: null,
		renderProgressbar: null,
		renderFraction: null,
		renderCustom: null,
		progressbarOpposite: false,
		type: "bullets",
		dynamicBullets: false,
		dynamicMainBullets: 1,
		formatFractionCurrent: (number) => number,
		formatFractionTotal: (number) => number,
		bulletClass: `${pfx}-bullet`,
		bulletActiveClass: `${pfx}-bullet-active`,
		modifierClass: `${pfx}-`,
		currentClass: `${pfx}-current`,
		totalClass: `${pfx}-total`,
		hiddenClass: `${pfx}-hidden`,
		progressbarFillClass: `${pfx}-progressbar-fill`,
		progressbarOppositeClass: `${pfx}-progressbar-opposite`,
		clickableClass: `${pfx}-clickable`,
		lockClass: `${pfx}-lock`,
		horizontalClass: `${pfx}-horizontal`,
		verticalClass: `${pfx}-vertical`,
		paginationDisabledClass: `${pfx}-disabled`
	} });
	swiper.pagination = {
		el: null,
		bullets: []
	};
	let bulletSize;
	let dynamicBulletIndex = 0;
	function isPaginationDisabled() {
		return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
	}
	function setSideBullets(bulletEl, position) {
		const { bulletActiveClass } = swiper.params.pagination;
		if (!bulletEl) return;
		bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
		if (bulletEl) {
			bulletEl.classList.add(`${bulletActiveClass}-${position}`);
			bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
			if (bulletEl) bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
		}
	}
	function getMoveDirection(prevIndex, nextIndex, length) {
		prevIndex = prevIndex % length;
		nextIndex = nextIndex % length;
		if (nextIndex === prevIndex + 1) return "next";
		else if (nextIndex === prevIndex - 1) return "previous";
	}
	function onBulletClick(e) {
		const bulletEl = e.target.closest(classesToSelector(swiper.params.pagination.bulletClass));
		if (!bulletEl) return;
		e.preventDefault();
		const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
		if (swiper.params.loop) {
			if (swiper.realIndex === index) return;
			const moveDirection = getMoveDirection(swiper.realIndex, index, swiper.slides.length);
			if (moveDirection === "next") swiper.slideNext();
			else if (moveDirection === "previous") swiper.slidePrev();
			else swiper.slideToLoop(index);
		} else swiper.slideTo(index);
	}
	function update() {
		const rtl = swiper.rtl;
		const params = swiper.params.pagination;
		if (isPaginationDisabled()) return;
		let el = swiper.pagination.el;
		el = makeElementsArray(el);
		let current;
		let previousIndex;
		const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
		const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
		if (swiper.params.loop) {
			previousIndex = swiper.previousRealIndex || 0;
			current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
		} else if (typeof swiper.snapIndex !== "undefined") {
			current = swiper.snapIndex;
			previousIndex = swiper.previousSnapIndex;
		} else {
			previousIndex = swiper.previousIndex || 0;
			current = swiper.activeIndex || 0;
		}
		if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
			const bullets = swiper.pagination.bullets;
			let firstIndex;
			let lastIndex;
			let midIndex;
			if (params.dynamicBullets) {
				bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height", true);
				el.forEach((subEl) => {
					subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
				});
				if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
					dynamicBulletIndex += current - (previousIndex || 0);
					if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1;
					else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
				}
				firstIndex = Math.max(current - dynamicBulletIndex, 0);
				lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
				midIndex = (lastIndex + firstIndex) / 2;
			}
			bullets.forEach((bulletEl) => {
				const classesToRemove = [...[
					"",
					"-next",
					"-next-next",
					"-prev",
					"-prev-prev",
					"-main"
				].map((suffix) => `${params.bulletActiveClass}${suffix}`)].map((s) => typeof s === "string" && s.includes(" ") ? s.split(" ") : s).flat();
				bulletEl.classList.remove(...classesToRemove);
			});
			if (el.length > 1) bullets.forEach((bullet) => {
				const bulletIndex = elementIndex(bullet);
				if (bulletIndex === current) bullet.classList.add(...params.bulletActiveClass.split(" "));
				else if (swiper.isElement) bullet.setAttribute("part", "bullet");
				if (params.dynamicBullets) {
					if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
					if (bulletIndex === firstIndex) setSideBullets(bullet, "prev");
					if (bulletIndex === lastIndex) setSideBullets(bullet, "next");
				}
			});
			else {
				const bullet = bullets[current];
				if (bullet) bullet.classList.add(...params.bulletActiveClass.split(" "));
				if (swiper.isElement) bullets.forEach((bulletEl, bulletIndex) => {
					bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
				});
				if (params.dynamicBullets) {
					const firstDisplayedBullet = bullets[firstIndex];
					const lastDisplayedBullet = bullets[lastIndex];
					for (let i = firstIndex; i <= lastIndex; i += 1) if (bullets[i]) bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
					setSideBullets(firstDisplayedBullet, "prev");
					setSideBullets(lastDisplayedBullet, "next");
				}
			}
			if (params.dynamicBullets) {
				const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
				const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
				const offsetProp = rtl ? "right" : "left";
				bullets.forEach((bullet) => {
					bullet.style[swiper.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
				});
			}
		}
		el.forEach((subEl, subElIndex) => {
			if (params.type === "fraction") {
				subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach((fractionEl) => {
					fractionEl.textContent = params.formatFractionCurrent(current + 1);
				});
				subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach((totalEl) => {
					totalEl.textContent = params.formatFractionTotal(total);
				});
			}
			if (params.type === "progressbar") {
				let progressbarDirection;
				if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal";
				else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
				const scale = (current + 1) / total;
				let scaleX = 1;
				let scaleY = 1;
				if (progressbarDirection === "horizontal") scaleX = scale;
				else scaleY = scale;
				subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach((progressEl) => {
					progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
					progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
				});
			}
			if (params.type === "custom" && params.renderCustom) {
				setInnerHTML(subEl, params.renderCustom(swiper, current + 1, total));
				if (subElIndex === 0) emit("paginationRender", subEl);
			} else {
				if (subElIndex === 0) emit("paginationRender", subEl);
				emit("paginationUpdate", subEl);
			}
			if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
		});
	}
	function render() {
		const params = swiper.params.pagination;
		if (isPaginationDisabled()) return;
		const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
		let el = swiper.pagination.el;
		el = makeElementsArray(el);
		let paginationHTML = "";
		if (params.type === "bullets") {
			let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
			if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
			for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
			else paginationHTML += `<${params.bulletElement} ${swiper.isElement ? "part=\"bullet\"" : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
		}
		if (params.type === "fraction") if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
		else paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
		if (params.type === "progressbar") if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
		else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
		swiper.pagination.bullets = [];
		el.forEach((subEl) => {
			if (params.type !== "custom") setInnerHTML(subEl, paginationHTML || "");
			if (params.type === "bullets") swiper.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
		});
		if (params.type !== "custom") emit("paginationRender", el[0]);
	}
	function init() {
		swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, { el: "swiper-pagination" });
		const params = swiper.params.pagination;
		if (!params.el) return;
		let el;
		if (typeof params.el === "string" && swiper.isElement) el = swiper.el.querySelector(params.el);
		if (!el && typeof params.el === "string") el = [...document.querySelectorAll(params.el)];
		if (!el) el = params.el;
		if (!el || el.length === 0) return;
		if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
			el = [...swiper.el.querySelectorAll(params.el)];
			if (el.length > 1) el = el.find((subEl) => {
				if (elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
				return true;
			});
		}
		if (Array.isArray(el) && el.length === 1) el = el[0];
		Object.assign(swiper.pagination, { el });
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			if (params.type === "bullets" && params.clickable) subEl.classList.add(...(params.clickableClass || "").split(" "));
			subEl.classList.add(params.modifierClass + params.type);
			subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
			if (params.type === "bullets" && params.dynamicBullets) {
				subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
				dynamicBulletIndex = 0;
				if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
			}
			if (params.type === "progressbar" && params.progressbarOpposite) subEl.classList.add(params.progressbarOppositeClass);
			if (params.clickable) subEl.addEventListener("click", onBulletClick);
			if (!swiper.enabled) subEl.classList.add(params.lockClass);
		});
	}
	function destroy() {
		const params = swiper.params.pagination;
		if (isPaginationDisabled()) return;
		let el = swiper.pagination.el;
		if (el) {
			el = makeElementsArray(el);
			el.forEach((subEl) => {
				subEl.classList.remove(params.hiddenClass);
				subEl.classList.remove(params.modifierClass + params.type);
				subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
				if (params.clickable) {
					subEl.classList.remove(...(params.clickableClass || "").split(" "));
					subEl.removeEventListener("click", onBulletClick);
				}
			});
		}
		if (swiper.pagination.bullets) swiper.pagination.bullets.forEach((subEl) => subEl.classList.remove(...params.bulletActiveClass.split(" ")));
	}
	on("changeDirection", () => {
		if (!swiper.pagination || !swiper.pagination.el) return;
		const params = swiper.params.pagination;
		let { el } = swiper.pagination;
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.classList.remove(params.horizontalClass, params.verticalClass);
			subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
		});
	});
	on("init", () => {
		if (swiper.params.pagination.enabled === false) disable();
		else {
			init();
			render();
			update();
		}
	});
	on("activeIndexChange", () => {
		if (typeof swiper.snapIndex === "undefined") update();
	});
	on("snapIndexChange", () => {
		update();
	});
	on("snapGridLengthChange", () => {
		render();
		update();
	});
	on("destroy", () => {
		destroy();
	});
	on("enable disable", () => {
		let { el } = swiper.pagination;
		if (el) {
			el = makeElementsArray(el);
			el.forEach((subEl) => subEl.classList[swiper.enabled ? "remove" : "add"](swiper.params.pagination.lockClass));
		}
	});
	on("lock unlock", () => {
		update();
	});
	on("click", (_s, e) => {
		const targetEl = e.target;
		const el = makeElementsArray(swiper.pagination.el);
		if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
			if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
			if (el[0].classList.contains(swiper.params.pagination.hiddenClass) === true) emit("paginationShow");
			else emit("paginationHide");
			el.forEach((subEl) => subEl.classList.toggle(swiper.params.pagination.hiddenClass));
		}
	});
	const enable = () => {
		swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
		let { el } = swiper.pagination;
		if (el) {
			el = makeElementsArray(el);
			el.forEach((subEl) => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass));
		}
		init();
		render();
		update();
	};
	const disable = () => {
		swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
		let { el } = swiper.pagination;
		if (el) {
			el = makeElementsArray(el);
			el.forEach((subEl) => subEl.classList.add(swiper.params.pagination.paginationDisabledClass));
		}
		destroy();
	};
	Object.assign(swiper.pagination, {
		enable,
		disable,
		render,
		update,
		init,
		destroy
	});
}
//#endregion
//#region node_modules/swiper/modules/a11y.mjs
function A11y({ swiper, extendParams, on }) {
	extendParams({ a11y: {
		enabled: true,
		notificationClass: "swiper-notification",
		prevSlideMessage: "Previous slide",
		nextSlideMessage: "Next slide",
		firstSlideMessage: "This is the first slide",
		lastSlideMessage: "This is the last slide",
		paginationBulletMessage: "Go to slide {{index}}",
		slideLabelMessage: "{{index}} / {{slidesLength}}",
		containerMessage: null,
		containerRoleDescriptionMessage: null,
		containerRole: null,
		itemRoleDescriptionMessage: null,
		slideRole: "group",
		id: null,
		scrollOnFocus: true,
		wrapperLiveRegion: true
	} });
	swiper.a11y = { clicked: false };
	let liveRegion = null;
	let preventFocusHandler;
	let focusTargetSlideEl;
	let visibilityChangedTimestamp = (/* @__PURE__ */ new Date()).getTime();
	function notify(message) {
		const notification = liveRegion;
		if (notification.length === 0) return;
		setInnerHTML(notification, message);
	}
	function getRandomNumber(size = 16) {
		const randomChar = () => Math.round(16 * Math.random()).toString(16);
		return "x".repeat(size).replace(/x/g, randomChar);
	}
	function makeElFocusable(el) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("tabIndex", "0");
		});
	}
	function makeElNotFocusable(el) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("tabIndex", "-1");
		});
	}
	function addElRole(el, role) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("role", role);
		});
	}
	function addElRoleDescription(el, description) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-roledescription", description);
		});
	}
	function addElControls(el, controls) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-controls", controls);
		});
	}
	function addElLabel(el, label) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-label", label);
		});
	}
	function addElId(el, id) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("id", id);
		});
	}
	function addElLive(el, live) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-live", live);
		});
	}
	function disableEl(el) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-disabled", true);
		});
	}
	function enableEl(el) {
		el = makeElementsArray(el);
		el.forEach((subEl) => {
			subEl.setAttribute("aria-disabled", false);
		});
	}
	function onEnterOrSpaceKey(e) {
		if (e.keyCode !== 13 && e.keyCode !== 32) return;
		const params = swiper.params.a11y;
		const targetEl = e.target;
		if (swiper.pagination && swiper.pagination.el && (targetEl === swiper.pagination.el || swiper.pagination.el.contains(e.target))) {
			if (!e.target.matches(classesToSelector(swiper.params.pagination.bulletClass))) return;
		}
		if (swiper.navigation && swiper.navigation.prevEl && swiper.navigation.nextEl) {
			const prevEls = makeElementsArray(swiper.navigation.prevEl);
			if (makeElementsArray(swiper.navigation.nextEl).includes(targetEl)) {
				if (!(swiper.isEnd && !swiper.params.loop)) swiper.slideNext();
				if (swiper.isEnd) notify(params.lastSlideMessage);
				else notify(params.nextSlideMessage);
			}
			if (prevEls.includes(targetEl)) {
				if (!(swiper.isBeginning && !swiper.params.loop)) swiper.slidePrev();
				if (swiper.isBeginning) notify(params.firstSlideMessage);
				else notify(params.prevSlideMessage);
			}
		}
		if (swiper.pagination && targetEl.matches(classesToSelector(swiper.params.pagination.bulletClass))) targetEl.click();
	}
	function updateNavigation() {
		if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
		const { nextEl, prevEl } = swiper.navigation;
		if (prevEl) if (swiper.isBeginning) {
			disableEl(prevEl);
			makeElNotFocusable(prevEl);
		} else {
			enableEl(prevEl);
			makeElFocusable(prevEl);
		}
		if (nextEl) if (swiper.isEnd) {
			disableEl(nextEl);
			makeElNotFocusable(nextEl);
		} else {
			enableEl(nextEl);
			makeElFocusable(nextEl);
		}
	}
	function hasPagination() {
		return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
	}
	function hasClickablePagination() {
		return hasPagination() && swiper.params.pagination.clickable;
	}
	function updatePagination() {
		const params = swiper.params.a11y;
		if (!hasPagination()) return;
		swiper.pagination.bullets.forEach((bulletEl) => {
			if (swiper.params.pagination.clickable) {
				makeElFocusable(bulletEl);
				if (!swiper.params.pagination.renderBullet) {
					addElRole(bulletEl, "button");
					addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, elementIndex(bulletEl) + 1));
				}
			}
			if (bulletEl.matches(classesToSelector(swiper.params.pagination.bulletActiveClass))) bulletEl.setAttribute("aria-current", "true");
			else bulletEl.removeAttribute("aria-current");
		});
	}
	const initNavEl = (el, wrapperId, message) => {
		makeElFocusable(el);
		if (el.tagName !== "BUTTON") {
			addElRole(el, "button");
			el.addEventListener("keydown", onEnterOrSpaceKey);
		}
		addElLabel(el, message);
		addElControls(el, wrapperId);
	};
	const handlePointerDown = (e) => {
		if (focusTargetSlideEl && focusTargetSlideEl !== e.target && !focusTargetSlideEl.contains(e.target)) preventFocusHandler = true;
		swiper.a11y.clicked = true;
	};
	const handlePointerUp = () => {
		preventFocusHandler = false;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!swiper.destroyed) swiper.a11y.clicked = false;
			});
		});
	};
	const onVisibilityChange = (e) => {
		visibilityChangedTimestamp = (/* @__PURE__ */ new Date()).getTime();
	};
	const handleFocus = (e) => {
		if (swiper.a11y.clicked || !swiper.params.a11y.scrollOnFocus) return;
		if ((/* @__PURE__ */ new Date()).getTime() - visibilityChangedTimestamp < 100) return;
		const slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
		if (!slideEl || !swiper.slides.includes(slideEl)) return;
		focusTargetSlideEl = slideEl;
		const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
		const isActive = (isVirtual ? parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10) : swiper.slides.indexOf(slideEl)) === swiper.activeIndex;
		const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
		if (isActive || isVisible) return;
		if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
		if (swiper.isHorizontal()) swiper.el.scrollLeft = 0;
		else swiper.el.scrollTop = 0;
		requestAnimationFrame(() => {
			if (preventFocusHandler) return;
			if (swiper.params.loop) swiper.slideToLoop(swiper.getSlideIndexWhenGrid(parseInt(slideEl.getAttribute("data-swiper-slide-index"))), 0);
			else if (isVirtual) swiper.slideTo(swiper.getSlideIndexWhenGrid(parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10)), 0);
			else swiper.slideTo(swiper.getSlideIndexWhenGrid(swiper.slides.indexOf(slideEl)), 0);
			preventFocusHandler = false;
		});
	};
	const initSlides = () => {
		const params = swiper.params.a11y;
		if (params.itemRoleDescriptionMessage) addElRoleDescription(swiper.slides, params.itemRoleDescriptionMessage);
		if (params.slideRole) addElRole(swiper.slides, params.slideRole);
		const slidesLength = swiper.slides.length;
		if (params.slideLabelMessage) swiper.slides.forEach((slideEl, index) => {
			const slideIndex = swiper.params.loop ? parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10) : index;
			addElLabel(slideEl, params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength));
		});
	};
	const init = () => {
		const params = swiper.params.a11y;
		swiper.el.append(liveRegion);
		const containerEl = swiper.el;
		if (params.containerRoleDescriptionMessage) addElRoleDescription(containerEl, params.containerRoleDescriptionMessage);
		if (params.containerMessage) addElLabel(containerEl, params.containerMessage);
		if (params.containerRole) addElRole(containerEl, params.containerRole);
		const wrapperEl = swiper.wrapperEl;
		const wrapperId = params.id || wrapperEl.getAttribute("id") || `swiper-wrapper-${getRandomNumber(16)}`;
		addElId(wrapperEl, wrapperId);
		if (params.wrapperLiveRegion) addElLive(wrapperEl, swiper.params.autoplay && swiper.params.autoplay.enabled ? "off" : "polite");
		initSlides();
		let { nextEl, prevEl } = swiper.navigation ? swiper.navigation : {};
		nextEl = makeElementsArray(nextEl);
		prevEl = makeElementsArray(prevEl);
		if (nextEl) nextEl.forEach((el) => initNavEl(el, wrapperId, params.nextSlideMessage));
		if (prevEl) prevEl.forEach((el) => initNavEl(el, wrapperId, params.prevSlideMessage));
		if (hasClickablePagination()) makeElementsArray(swiper.pagination.el).forEach((el) => {
			el.addEventListener("keydown", onEnterOrSpaceKey);
		});
		getDocument().addEventListener("visibilitychange", onVisibilityChange);
		swiper.el.addEventListener("focus", handleFocus, true);
		swiper.el.addEventListener("pointerdown", handlePointerDown, true);
		swiper.el.addEventListener("pointerup", handlePointerUp, true);
	};
	function destroy() {
		if (liveRegion) liveRegion.remove();
		let { nextEl, prevEl } = swiper.navigation ? swiper.navigation : {};
		nextEl = makeElementsArray(nextEl);
		prevEl = makeElementsArray(prevEl);
		if (nextEl) nextEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
		if (prevEl) prevEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
		if (hasClickablePagination()) makeElementsArray(swiper.pagination.el).forEach((el) => {
			el.removeEventListener("keydown", onEnterOrSpaceKey);
		});
		getDocument().removeEventListener("visibilitychange", onVisibilityChange);
		if (swiper.el && typeof swiper.el !== "string") {
			swiper.el.removeEventListener("focus", handleFocus, true);
			swiper.el.removeEventListener("pointerdown", handlePointerDown, true);
			swiper.el.removeEventListener("pointerup", handlePointerUp, true);
		}
	}
	on("beforeInit", () => {
		liveRegion = createElement("span", swiper.params.a11y.notificationClass);
		liveRegion.setAttribute("aria-live", "assertive");
		liveRegion.setAttribute("aria-atomic", "true");
	});
	on("afterInit", () => {
		if (!swiper.params.a11y.enabled) return;
		init();
	});
	on("slidesLengthChange snapGridLengthChange slidesGridLengthChange", () => {
		if (!swiper.params.a11y.enabled) return;
		initSlides();
	});
	on("fromEdge toEdge afterInit lock unlock", () => {
		if (!swiper.params.a11y.enabled) return;
		updateNavigation();
	});
	on("paginationUpdate", () => {
		if (!swiper.params.a11y.enabled) return;
		updatePagination();
	});
	on("destroy", () => {
		if (!swiper.params.a11y.enabled) return;
		destroy();
	});
}
//#endregion
//#region node_modules/swiper/modules/autoplay.mjs
function Autoplay({ swiper, extendParams, on, emit, params }) {
	swiper.autoplay = {
		running: false,
		paused: false,
		timeLeft: 0
	};
	extendParams({ autoplay: {
		enabled: false,
		delay: 3e3,
		waitForTransition: true,
		disableOnInteraction: false,
		stopOnLastSlide: false,
		reverseDirection: false,
		pauseOnMouseEnter: false
	} });
	let timeout;
	let raf;
	let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
	let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
	let autoplayTimeLeft;
	let autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
	let wasPaused;
	let isTouched;
	let pausedByTouch;
	let touchStartTimeout;
	let pausedByInteraction;
	let pausedByPointerEnter;
	function onTransitionEnd(e) {
		if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
		if (e.target !== swiper.wrapperEl) return;
		swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
		if (pausedByPointerEnter || e.detail && e.detail.bySwiperTouchMove) return;
		resume();
	}
	const calcTimeLeft = () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (swiper.autoplay.paused) wasPaused = true;
		else if (wasPaused) {
			autoplayDelayCurrent = autoplayTimeLeft;
			wasPaused = false;
		}
		const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (/* @__PURE__ */ new Date()).getTime();
		swiper.autoplay.timeLeft = timeLeft;
		emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
		raf = requestAnimationFrame(() => {
			calcTimeLeft();
		});
	};
	const getSlideDelay = () => {
		let activeSlideEl;
		if (swiper.virtual && swiper.params.virtual.enabled) activeSlideEl = swiper.slides.find((slideEl) => slideEl.classList.contains("swiper-slide-active"));
		else activeSlideEl = swiper.slides[swiper.activeIndex];
		if (!activeSlideEl) return void 0;
		return parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
	};
	const getTotalDelay = () => {
		let totalDelay = swiper.params.autoplay.delay;
		const currentSlideDelay = getSlideDelay();
		if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0) totalDelay = currentSlideDelay;
		return totalDelay;
	};
	const run = (delayForce) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		cancelAnimationFrame(raf);
		calcTimeLeft();
		let delay = delayForce;
		if (typeof delay === "undefined") {
			delay = getTotalDelay();
			autoplayDelayTotal = delay;
			autoplayDelayCurrent = delay;
		}
		autoplayTimeLeft = delay;
		const speed = swiper.params.speed;
		const proceed = () => {
			if (!swiper || swiper.destroyed) return;
			if (swiper.params.autoplay.reverseDirection) {
				if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
					swiper.slidePrev(speed, true, true);
					emit("autoplay");
				} else if (!swiper.params.autoplay.stopOnLastSlide) {
					swiper.slideTo(swiper.slides.length - 1, speed, true, true);
					emit("autoplay");
				}
			} else if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
				swiper.slideNext(speed, true, true);
				emit("autoplay");
			} else if (!swiper.params.autoplay.stopOnLastSlide) {
				swiper.slideTo(0, speed, true, true);
				emit("autoplay");
			}
			if (swiper.params.cssMode) {
				autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
				requestAnimationFrame(() => {
					run();
				});
			}
		};
		if (delay > 0) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				proceed();
			}, delay);
		} else requestAnimationFrame(() => {
			proceed();
		});
		return delay;
	};
	const start = () => {
		autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
		swiper.autoplay.running = true;
		run();
		emit("autoplayStart");
	};
	const stop = () => {
		swiper.autoplay.running = false;
		clearTimeout(timeout);
		cancelAnimationFrame(raf);
		emit("autoplayStop");
	};
	const pause = (internal, reset) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		clearTimeout(timeout);
		if (!internal) pausedByInteraction = true;
		const proceed = () => {
			emit("autoplayPause");
			if (swiper.params.autoplay.waitForTransition) swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd);
			else resume();
		};
		swiper.autoplay.paused = true;
		if (reset) {
			proceed();
			return;
		}
		autoplayTimeLeft = (autoplayTimeLeft || swiper.params.autoplay.delay) - ((/* @__PURE__ */ new Date()).getTime() - autoplayStartTime);
		if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
		if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
		proceed();
	};
	const resume = () => {
		if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
		autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
		if (pausedByInteraction) {
			pausedByInteraction = false;
			run(autoplayTimeLeft);
		} else run();
		swiper.autoplay.paused = false;
		emit("autoplayResume");
	};
	const onVisibilityChange = () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		const document = getDocument();
		if (document.visibilityState === "hidden") {
			pausedByInteraction = true;
			pause(true);
		}
		if (document.visibilityState === "visible") resume();
	};
	const onPointerEnter = (e) => {
		if (e.pointerType !== "mouse") return;
		pausedByInteraction = true;
		pausedByPointerEnter = true;
		if (swiper.animating || swiper.autoplay.paused) return;
		pause(true);
	};
	const onPointerLeave = (e) => {
		if (e.pointerType !== "mouse") return;
		pausedByPointerEnter = false;
		if (swiper.autoplay.paused) resume();
	};
	const attachMouseEvents = () => {
		if (swiper.params.autoplay.pauseOnMouseEnter) {
			swiper.el.addEventListener("pointerenter", onPointerEnter);
			swiper.el.addEventListener("pointerleave", onPointerLeave);
		}
	};
	const detachMouseEvents = () => {
		if (swiper.el && typeof swiper.el !== "string") {
			swiper.el.removeEventListener("pointerenter", onPointerEnter);
			swiper.el.removeEventListener("pointerleave", onPointerLeave);
		}
	};
	const attachDocumentEvents = () => {
		getDocument().addEventListener("visibilitychange", onVisibilityChange);
	};
	const detachDocumentEvents = () => {
		getDocument().removeEventListener("visibilitychange", onVisibilityChange);
	};
	on("init", () => {
		if (swiper.params.autoplay.enabled) {
			attachMouseEvents();
			attachDocumentEvents();
			start();
		}
	});
	on("destroy", () => {
		detachMouseEvents();
		detachDocumentEvents();
		if (swiper.autoplay.running) stop();
	});
	on("_freeModeStaticRelease", () => {
		if (pausedByTouch || pausedByInteraction) resume();
	});
	on("_freeModeNoMomentumRelease", () => {
		if (!swiper.params.autoplay.disableOnInteraction) pause(true, true);
		else stop();
	});
	on("beforeTransitionStart", (_s, speed, internal) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (internal || !swiper.params.autoplay.disableOnInteraction) pause(true, true);
		else stop();
	});
	on("sliderFirstMove", () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (swiper.params.autoplay.disableOnInteraction) {
			stop();
			return;
		}
		isTouched = true;
		pausedByTouch = false;
		pausedByInteraction = false;
		touchStartTimeout = setTimeout(() => {
			pausedByInteraction = true;
			pausedByTouch = true;
			pause(true);
		}, 200);
	});
	on("touchEnd", () => {
		if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
		clearTimeout(touchStartTimeout);
		clearTimeout(timeout);
		if (swiper.params.autoplay.disableOnInteraction) {
			pausedByTouch = false;
			isTouched = false;
			return;
		}
		if (pausedByTouch && swiper.params.cssMode) resume();
		pausedByTouch = false;
		isTouched = false;
	});
	on("slideChange", () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (swiper.autoplay.paused) {
			autoplayTimeLeft = getTotalDelay();
			autoplayDelayTotal = getTotalDelay();
		}
	});
	Object.assign(swiper.autoplay, {
		start,
		stop,
		pause,
		resume
	});
}
//#endregion
//#region node_modules/swiper/modules/thumbs.mjs
function Thumb({ swiper, extendParams, on }) {
	extendParams({ thumbs: {
		swiper: null,
		multipleActiveThumbs: true,
		autoScrollOffset: 0,
		slideThumbActiveClass: "swiper-slide-thumb-active",
		thumbsContainerClass: "swiper-thumbs"
	} });
	let initialized = false;
	let swiperCreated = false;
	swiper.thumbs = { swiper: null };
	function isVirtualEnabled() {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return false;
		return thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled;
	}
	function onThumbClick() {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		const clickedIndex = thumbsSwiper.clickedIndex;
		const clickedSlide = thumbsSwiper.clickedSlide;
		if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass)) return;
		if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
		let slideToIndex;
		if (thumbsSwiper.params.loop) slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
		else slideToIndex = clickedIndex;
		if (swiper.params.loop) swiper.slideToLoop(slideToIndex);
		else swiper.slideTo(slideToIndex);
	}
	function init() {
		const { thumbs: thumbsParams } = swiper.params;
		if (initialized) return false;
		initialized = true;
		const SwiperClass = swiper.constructor;
		if (thumbsParams.swiper instanceof SwiperClass) {
			if (thumbsParams.swiper.destroyed) {
				initialized = false;
				return false;
			}
			swiper.thumbs.swiper = thumbsParams.swiper;
			Object.assign(swiper.thumbs.swiper.originalParams, {
				watchSlidesProgress: true,
				slideToClickedSlide: false
			});
			Object.assign(swiper.thumbs.swiper.params, {
				watchSlidesProgress: true,
				slideToClickedSlide: false
			});
			swiper.thumbs.swiper.update();
		} else if (isObject(thumbsParams.swiper)) {
			const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
			Object.assign(thumbsSwiperParams, {
				watchSlidesProgress: true,
				slideToClickedSlide: false
			});
			swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
			swiperCreated = true;
		}
		swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass);
		swiper.thumbs.swiper.on("tap", onThumbClick);
		if (isVirtualEnabled()) swiper.thumbs.swiper.on("virtualUpdate", () => {
			update(false, { autoScroll: false });
		});
		return true;
	}
	function update(initial, p) {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		let thumbsToActivate = 1;
		const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
		if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) thumbsToActivate = swiper.params.slidesPerView;
		if (!swiper.params.thumbs.multipleActiveThumbs) thumbsToActivate = 1;
		thumbsToActivate = Math.floor(thumbsToActivate);
		thumbsSwiper.slides.forEach((slideEl) => slideEl.classList.remove(thumbActiveClass));
		if (thumbsSwiper.params.loop || isVirtualEnabled()) for (let i = 0; i < thumbsToActivate; i += 1) elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i}"]`).forEach((slideEl) => {
			slideEl.classList.add(thumbActiveClass);
		});
		else for (let i = 0; i < thumbsToActivate; i += 1) if (thumbsSwiper.slides[swiper.realIndex + i]) thumbsSwiper.slides[swiper.realIndex + i].classList.add(thumbActiveClass);
		if (p?.autoScroll ?? true) autoScroll(initial ? 0 : void 0);
	}
	function autoScroll(slideSpeed) {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		const slidesPerView = thumbsSwiper.params.slidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
		const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
		const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
		if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
			const currentThumbsIndex = thumbsSwiper.activeIndex;
			let newThumbsIndex;
			let direction;
			if (thumbsSwiper.params.loop) {
				const newThumbsSlide = thumbsSwiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") === `${swiper.realIndex}`);
				newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
				direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
			} else {
				newThumbsIndex = swiper.realIndex;
				direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
			}
			if (useOffset) newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
			if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
				if (thumbsSwiper.params.centeredSlides) if (newThumbsIndex > currentThumbsIndex) newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
				else newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
				else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1);
				thumbsSwiper.slideTo(newThumbsIndex, slideSpeed);
			}
		}
	}
	on("beforeInit", () => {
		const { thumbs } = swiper.params;
		if (!thumbs || !thumbs.swiper) return;
		if (typeof thumbs.swiper === "string" || thumbs.swiper instanceof HTMLElement) {
			const document = getDocument();
			const getThumbsElementAndInit = () => {
				const thumbsElement = typeof thumbs.swiper === "string" ? document.querySelector(thumbs.swiper) : thumbs.swiper;
				if (thumbsElement && thumbsElement.swiper) {
					thumbs.swiper = thumbsElement.swiper;
					init();
					update(true);
				} else if (thumbsElement) {
					const eventName = `${swiper.params.eventsPrefix}init`;
					const onThumbsSwiper = (e) => {
						thumbs.swiper = e.detail[0];
						thumbsElement.removeEventListener(eventName, onThumbsSwiper);
						init();
						update(true);
						thumbs.swiper.update();
						swiper.update();
					};
					thumbsElement.addEventListener(eventName, onThumbsSwiper);
				}
				return thumbsElement;
			};
			const watchForThumbsToAppear = () => {
				if (swiper.destroyed) return;
				if (!getThumbsElementAndInit()) requestAnimationFrame(watchForThumbsToAppear);
			};
			requestAnimationFrame(watchForThumbsToAppear);
		} else {
			init();
			update(true);
		}
	});
	on("slideChange update resize observerUpdate", () => {
		update();
	});
	on("setTransition", (_s, duration) => {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		thumbsSwiper.setTransition(duration);
	});
	on("beforeDestroy", () => {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		if (swiperCreated) thumbsSwiper.destroy();
	});
	Object.assign(swiper.thumbs, {
		init,
		update
	});
}
//#endregion
//#region node_modules/swiper/shared/effect-init.mjs
function effectInit(params) {
	const { effect, swiper, on, setTranslate, setTransition, overwriteParams, perspective, recreateShadows, getEffectParams } = params;
	on("beforeInit", () => {
		if (swiper.params.effect !== effect) return;
		swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
		if (perspective && perspective()) swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
		const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
		Object.assign(swiper.params, overwriteParamsResult);
		Object.assign(swiper.originalParams, overwriteParamsResult);
	});
	on("setTranslate _virtualUpdated", () => {
		if (swiper.params.effect !== effect) return;
		setTranslate();
	});
	on("setTransition", (_s, duration) => {
		if (swiper.params.effect !== effect) return;
		setTransition(duration);
	});
	on("transitionEnd", () => {
		if (swiper.params.effect !== effect) return;
		if (recreateShadows) {
			if (!getEffectParams || !getEffectParams().slideShadows) return;
			swiper.slides.forEach((slideEl) => {
				slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => shadowEl.remove());
			});
			recreateShadows();
		}
	});
	let requireUpdateOnVirtual;
	on("virtualUpdate", () => {
		if (swiper.params.effect !== effect) return;
		if (!swiper.slides.length) requireUpdateOnVirtual = true;
		requestAnimationFrame(() => {
			if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
				setTranslate();
				requireUpdateOnVirtual = false;
			}
		});
	});
}
//#endregion
//#region node_modules/swiper/shared/effect-target.mjs
function effectTarget(effectParams, slideEl) {
	const transformEl = getSlideTransformEl(slideEl);
	if (transformEl !== slideEl) {
		transformEl.style.backfaceVisibility = "hidden";
		transformEl.style["-webkit-backface-visibility"] = "hidden";
	}
	return transformEl;
}
//#endregion
//#region node_modules/swiper/shared/effect-virtual-transition-end.mjs
function effectVirtualTransitionEnd({ swiper, duration, transformElements, allSlides }) {
	const { activeIndex } = swiper;
	const getSlide = (el) => {
		if (!el.parentElement) return swiper.slides.find((slideEl) => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode);
		return el.parentElement;
	};
	if (swiper.params.virtualTranslate && duration !== 0) {
		let eventTriggered = false;
		let transitionEndTarget;
		if (allSlides) transitionEndTarget = transformElements;
		else transitionEndTarget = transformElements.filter((transformEl) => {
			const el = transformEl.classList.contains("swiper-slide-transform") ? getSlide(transformEl) : transformEl;
			return swiper.getSlideIndex(el) === activeIndex;
		});
		transitionEndTarget.forEach((el) => {
			elementTransitionEnd(el, () => {
				if (eventTriggered) return;
				if (!swiper || swiper.destroyed) return;
				eventTriggered = true;
				swiper.animating = false;
				const evt = new window.CustomEvent("transitionend", {
					bubbles: true,
					cancelable: true
				});
				swiper.wrapperEl.dispatchEvent(evt);
			});
		});
	}
}
//#endregion
//#region node_modules/swiper/modules/effect-fade.mjs
function EffectFade({ swiper, extendParams, on }) {
	extendParams({ fadeEffect: { crossFade: false } });
	const setTranslate = () => {
		const { slides } = swiper;
		const params = swiper.params.fadeEffect;
		for (let i = 0; i < slides.length; i += 1) {
			const slideEl = swiper.slides[i];
			let tx = -slideEl.swiperSlideOffset;
			if (!swiper.params.virtualTranslate) tx -= swiper.translate;
			let ty = 0;
			if (!swiper.isHorizontal()) {
				ty = tx;
				tx = 0;
			}
			const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(slideEl.progress), 0) : 1 + Math.min(Math.max(slideEl.progress, -1), 0);
			const targetEl = effectTarget(params, slideEl);
			targetEl.style.opacity = slideOpacity;
			targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
		}
	};
	const setTransition = (duration) => {
		const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
		transformElements.forEach((el) => {
			el.style.transitionDuration = `${duration}ms`;
		});
		effectVirtualTransitionEnd({
			swiper,
			duration,
			transformElements,
			allSlides: true
		});
	};
	effectInit({
		effect: "fade",
		swiper,
		on,
		setTranslate,
		setTransition,
		overwriteParams: () => ({
			slidesPerView: 1,
			slidesPerGroup: 1,
			watchSlidesProgress: true,
			spaceBetween: 0,
			virtualTranslate: !swiper.params.cssMode
		})
	});
}
//#endregion
//#region src/components/layout/slider/slider.js
function ensureHeroVideoLoaded(video) {
	if (video.dataset.loaded === "true") return;
	let shouldLoad = false;
	video.querySelectorAll("source[data-src]").forEach((source) => {
		source.src = source.dataset.src;
		source.removeAttribute("data-src");
		shouldLoad = true;
	});
	if (shouldLoad) video.load();
	video.dataset.loaded = "true";
}
function updateHeroVideoState(swiper, shouldPlay = true) {
	const activeSlide = swiper.slides[swiper.activeIndex];
	swiper.slides.forEach((slide) => {
		slide.querySelectorAll("video").forEach((video) => {
			if (slide === activeSlide && shouldPlay) {
				ensureHeroVideoLoaded(video);
				video.play().catch(() => {});
			} else {
				video.pause();
				video.currentTime = 0;
			}
		});
	});
}
function markSliderReady(slider) {
	slider.classList.add("_slider-ready");
	slider.closest("[data-fls-slider-wrapper]")?.classList.add("_slider-ready");
	slider.closest("[data-fls-hero]")?.classList.add("_slider-ready");
}
function initHeroSliders() {
	document.querySelectorAll("[data-fls-slider=\"hero\"]").forEach((slider) => {
		const section = slider.closest("[data-fls-hero]");
		const navigationRoot = section || slider;
		const prevEl = navigationRoot.querySelector(".swiper-button-prev");
		const nextEl = navigationRoot.querySelector(".swiper-button-next");
		const paginationEl = navigationRoot.querySelector(".swiper-pagination");
		let isSectionVisible = true;
		const heroSwiper = new Swiper(slider, {
			modules: [
				A11y,
				Autoplay,
				Navigation,
				Pagination
			],
			observer: true,
			observeParents: true,
			loop: true,
			speed: 800,
			slidesPerView: 1,
			spaceBetween: 0,
			pagination: paginationEl ? {
				el: paginationEl,
				clickable: true
			} : false,
			navigation: prevEl && nextEl ? {
				prevEl,
				nextEl
			} : false,
			a11y: {
				prevSlideMessage: "Предыдущий слайд",
				nextSlideMessage: "Следующий слайд"
			},
			on: {
				init(swiper) {
					updateHeroVideoState(swiper, isSectionVisible);
				},
				slideChangeTransitionEnd(swiper) {
					updateHeroVideoState(swiper, isSectionVisible);
				},
				transitionEnd(swiper) {
					updateHeroVideoState(swiper, isSectionVisible);
				},
				loopFix(swiper) {
					updateHeroVideoState(swiper, isSectionVisible);
				}
			}
		});
		markSliderReady(slider);
		if (section) new IntersectionObserver(([entry]) => {
			isSectionVisible = entry.isIntersecting;
			updateHeroVideoState(heroSwiper, isSectionVisible);
		}, { threshold: .2 }).observe(section);
		updateHeroVideoState(heroSwiper, isSectionVisible);
	});
}
function initProductsSliders() {
	document.querySelectorAll("[data-fls-slider=\"products\"]").forEach((slider) => {
		const navigationRoot = slider.closest("[data-fls-slider-wrapper]") || slider;
		const prevEl = navigationRoot.querySelector(".swiper-button-prev");
		const nextEl = navigationRoot.querySelector(".swiper-button-next");
		const paginationEl = navigationRoot.querySelector(".swiper-pagination");
		new Swiper(slider, {
			modules: [
				A11y,
				Navigation,
				Pagination
			],
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 8,
			speed: 800,
			pagination: paginationEl ? {
				el: paginationEl,
				clickable: true
			} : false,
			navigation: prevEl && nextEl ? {
				prevEl,
				nextEl
			} : false,
			breakpoints: { 480: { spaceBetween: 16 } }
		});
		markSliderReady(slider);
	});
}
function initSalesSliders() {
	document.querySelectorAll("[data-fls-slider=\"sales\"]").forEach((slider) => {
		const navigationRoot = slider.closest("[data-fls-slider-wrapper]") || slider;
		const prevEl = navigationRoot.querySelector(".swiper-button-prev");
		const nextEl = navigationRoot.querySelector(".swiper-button-next");
		const paginationEl = navigationRoot.querySelector(".swiper-pagination");
		new Swiper(slider, {
			modules: [
				A11y,
				Navigation,
				Pagination
			],
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 8,
			speed: 800,
			pagination: paginationEl ? {
				el: paginationEl,
				clickable: true
			} : false,
			navigation: prevEl && nextEl ? {
				prevEl,
				nextEl
			} : false,
			breakpoints: { 480: { spaceBetween: 16 } }
		});
		markSliderReady(slider);
	});
}
function initProductCardSliders() {
	document.querySelectorAll("[data-fls-slider=\"product-card\"]").forEach((slider) => {
		const paginationEl = slider.querySelector(".swiper-pagination");
		const hoverNav = slider.querySelector(".product-card__gallery-nav");
		const productCardSwiper = new Swiper(slider, {
			modules: [
				A11y,
				EffectFade,
				Pagination
			],
			observer: true,
			observeParents: true,
			nested: true,
			effect: "fade",
			fadeEffect: { crossFade: true },
			slidesPerView: 1,
			spaceBetween: 0,
			speed: 350,
			pagination: paginationEl ? {
				el: paginationEl,
				clickable: true
			} : false
		});
		markSliderReady(slider);
		if (!hoverNav || productCardSwiper.slides.length <= 1) return;
		hoverNav.replaceChildren();
		productCardSwiper.slides.forEach((_, index) => {
			const zone = document.createElement("span");
			zone.className = "product-card__gallery-zone";
			zone.addEventListener("pointerenter", () => productCardSwiper.slideTo(index));
			hoverNav.append(zone);
		});
		slider.addEventListener("pointerleave", () => productCardSwiper.slideTo(0));
	});
}
function initCategoriesSliders() {
	document.querySelectorAll("[data-fls-slider=\"categories\"]").forEach((slider) => {
		const navigationRoot = slider.closest("[data-fls-slider-wrapper]") || slider;
		const prevEl = navigationRoot.querySelector(".swiper-button-prev");
		const nextEl = navigationRoot.querySelector(".swiper-button-next");
		const paginationEl = navigationRoot.querySelector(".swiper-pagination");
		new Swiper(slider, {
			modules: [
				A11y,
				Navigation,
				Pagination
			],
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 8,
			speed: 800,
			pagination: paginationEl ? {
				el: paginationEl,
				clickable: true
			} : false,
			navigation: prevEl && nextEl ? {
				prevEl,
				nextEl
			} : false,
			breakpoints: { 480: { spaceBetween: 16 } }
		});
		markSliderReady(slider);
	});
}
function initOfferClubSliders() {
	document.querySelectorAll("[data-fls-slider=\"offer-club\"]").forEach((slider) => {
		const navigationRoot = slider.closest("[data-fls-slider-wrapper]") || slider;
		const prevEl = navigationRoot.querySelector(".swiper-button-prev");
		const nextEl = navigationRoot.querySelector(".swiper-button-next");
		const paginationEl = navigationRoot.querySelector(".swiper-pagination");
		new Swiper(slider, {
			modules: [
				A11y,
				Navigation,
				Pagination
			],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			speed: 800,
			autoHeight: true,
			pagination: paginationEl ? {
				el: paginationEl,
				clickable: true
			} : false,
			navigation: prevEl && nextEl ? {
				prevEl,
				nextEl
			} : false
		});
		markSliderReady(slider);
	});
}
function initSingleProductSliders() {
	document.querySelectorAll("[data-fls-slider=\"single-product\"]").forEach((slider) => {
		const sliderWrapper = slider.closest("[data-fls-slider-wrapper]") || slider.parentElement;
		const isLayoutTwo = slider.closest(".single-product")?.classList.contains("single-product_second");
		const galleryNav = sliderWrapper.querySelector(".single-product__gallery-nav");
		const thumbsNav = sliderWrapper.querySelectorAll(".single-product__thumbs-nav");
		const prevEl = galleryNav?.querySelector(".swiper-button-prev");
		const nextEl = galleryNav?.querySelector(".swiper-button-next");
		const thumbsEl = sliderWrapper.querySelector("[data-fls-slider=\"single-product-thumbs\"]");
		let productThumbsSwiper = null;
		if (thumbsEl) {
			const thumbsSlidesCount = thumbsEl.querySelectorAll(".swiper-slide").length;
			productThumbsSwiper = new Swiper(thumbsEl, {
				modules: [
					A11y,
					Navigation,
					Thumb
				],
				observer: true,
				observeParents: true,
				slidesPerView: "auto",
				spaceBetween: 8,
				speed: 400,
				watchSlidesProgress: true,
				slideToClickedSlide: true,
				watchOverflow: true,
				a11y: { enabled: false },
				breakpoints: isLayoutTwo ? { 992: {
					direction: "vertical",
					slidesPerView: isLayoutTwo && thumbsSlidesCount <= 4 ? "auto" : 4,
					spaceBetween: 12
				} } : {},
				navigation: isLayoutTwo && thumbsNav.length === 2 ? {
					prevEl: thumbsNav[0].querySelector(".swiper-button-prev"),
					nextEl: thumbsNav[1].querySelector(".swiper-button-next")
				} : false
			});
			if (isLayoutTwo && thumbsNav.length === 2) {
				const thumbsColumn = sliderWrapper.querySelector(".single-product__thumbs-column");
				const updateThumbNavState = () => {
					const isLocked = productThumbsSwiper.isLocked || thumbsSlidesCount <= 4;
					thumbsNav.forEach((nav) => {
						nav.classList.toggle("_hidden", isLocked);
					});
					thumbsColumn?.classList.toggle("_has-nav", !isLocked);
				};
				updateThumbNavState();
				productThumbsSwiper.on("afterInit", updateThumbNavState);
				productThumbsSwiper.on("slideChange", updateThumbNavState);
				productThumbsSwiper.on("reachBeginning", updateThumbNavState);
				productThumbsSwiper.on("reachEnd", updateThumbNavState);
				productThumbsSwiper.on("fromEdge", updateThumbNavState);
				productThumbsSwiper.on("resize", updateThumbNavState);
				productThumbsSwiper.on("lock", updateThumbNavState);
				productThumbsSwiper.on("unlock", updateThumbNavState);
			}
			markSliderReady(thumbsEl);
		}
		new Swiper(slider, {
			modules: [
				A11y,
				Navigation,
				Thumb
			],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 12,
			speed: 800,
			navigation: prevEl && nextEl ? {
				prevEl,
				nextEl
			} : false,
			thumbs: productThumbsSwiper ? { swiper: productThumbsSwiper } : void 0,
			a11y: {
				prevSlideMessage: "Предыдущее изображение",
				nextSlideMessage: "Следующее изображение"
			},
			breakpoints: isLayoutTwo ? {
				768: { slidesPerView: 2 },
				992: { slidesPerView: 1 }
			} : { 768: { slidesPerView: 2 } }
		});
		markSliderReady(slider);
	});
}
function initSliders() {
	initHeroSliders();
	initCategoriesSliders();
	initOfferClubSliders();
	initProductsSliders();
	initSalesSliders();
	initProductCardSliders();
	initSingleProductSliders();
}
if (document.querySelector("[data-fls-slider]")) document.addEventListener("DOMContentLoaded", initSliders);
//#endregion
//#region src/components/layout/popup/popup.js
var Popup = class {
	constructor(options) {
		let config = {
			logging: true,
			init: true,
			attributeOpenButton: "data-fls-popup-link",
			attributeCloseButton: "data-fls-popup-close",
			fixElementSelector: "[data-fls-lp]",
			attributeMain: "data-fls-popup",
			youtubeAttribute: "data-fls-popup-youtube",
			youtubePlaceAttribute: "data-fls-popup-youtube-place",
			setAutoplayYoutube: true,
			classes: {
				popup: "popup",
				popupContent: "data-fls-popup-body",
				popupActive: "data-fls-popup-active",
				bodyActive: "data-fls-popup-open"
			},
			focusCatch: true,
			closeEsc: true,
			bodyLock: true,
			hashSettings: {
				location: true,
				goHash: true
			},
			on: {
				beforeOpen: function() {},
				afterOpen: function() {},
				beforeClose: function() {},
				afterClose: function() {}
			}
		};
		this.youTubeCode;
		this.isOpen = false;
		this.targetOpen = {
			selector: false,
			element: false
		};
		this.previousOpen = {
			selector: false,
			element: false
		};
		this.lastClosed = {
			selector: false,
			element: false
		};
		this._dataValue = false;
		this.hash = false;
		this._reopen = false;
		this._selectorOpen = false;
		this.lastFocusEl = false;
		this._focusEl = [
			"a[href]",
			"input:not([disabled]):not([type=\"hidden\"]):not([aria-hidden])",
			"button:not([disabled]):not([aria-hidden])",
			"select:not([disabled]):not([aria-hidden])",
			"textarea:not([disabled]):not([aria-hidden])",
			"area[href]",
			"iframe",
			"object",
			"embed",
			"[contenteditable]",
			"[tabindex]:not([tabindex^=\"-\"])"
		];
		this.options = {
			...config,
			...options,
			classes: {
				...config.classes,
				...options?.classes
			},
			hashSettings: {
				...config.hashSettings,
				...options?.hashSettings
			},
			on: {
				...config.on,
				...options?.on
			}
		};
		this.bodyLock = false;
		this.options.init && this.initPopups();
	}
	initPopups() {
		this.buildPopup();
		this.eventsPopup();
	}
	buildPopup() {}
	eventsPopup() {
		document.addEventListener("click", function(e) {
			const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
			if (buttonOpen) {
				e.preventDefault();
				this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
				this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
				if (this._dataValue !== "error") {
					if (!this.isOpen) this.lastFocusEl = buttonOpen;
					this.targetOpen.selector = `${this._dataValue}`;
					this._selectorOpen = true;
					this.open();
					return;
				}
				return;
			}
			if (e.target.closest(`[${this.options.attributeCloseButton}]`) || !e.target.closest(`[${this.options.classes.popupContent}]`) && this.isOpen) {
				e.preventDefault();
				this.close();
				return;
			}
		}.bind(this));
		document.addEventListener("keydown", function(e) {
			if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
				e.preventDefault();
				this.close();
				return;
			}
			if (this.options.focusCatch && e.which == 9 && this.isOpen) {
				this._focusCatch(e);
				return;
			}
		}.bind(this));
		if (this.options.hashSettings.goHash) {
			window.addEventListener("hashchange", function() {
				if (window.location.hash) this._openToHash();
				else this.close(this.targetOpen.selector);
			}.bind(this));
			if (window.location.hash) this._openToHash();
		}
	}
	open(selectorValue) {
		if (bodyLockStatus) {
			this.bodyLock = document.documentElement.hasAttribute("data-fls-scrolllock") && !this.isOpen ? true : false;
			if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
				this.targetOpen.selector = selectorValue;
				this._selectorOpen = true;
			}
			if (this.isOpen) {
				this._reopen = true;
				this.close();
			}
			if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
			if (!this._reopen) this.previousActiveElement = document.activeElement;
			this.targetOpen.element = document.querySelector(`[${this.options.attributeMain}=${this.targetOpen.selector}]`);
			if (this.targetOpen.element) {
				const codeVideo = this.youTubeCode || this.targetOpen.element.getAttribute(`${this.options.youtubeAttribute}`);
				if (codeVideo) {
					const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
					const iframe = document.createElement("iframe");
					const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
					iframe.setAttribute("allowfullscreen", "");
					iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
					iframe.setAttribute("src", urlVideo);
					if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector("[data-fls-popup-content]").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
					this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
				}
				if (this.options.hashSettings.location) {
					this._getHash();
					this._setHash();
				}
				this.options.on.beforeOpen(this);
				document.dispatchEvent(new CustomEvent("beforePopupOpen", { detail: { popup: this } }));
				this.targetOpen.element.setAttribute(this.options.classes.popupActive, "");
				document.documentElement.setAttribute(this.options.classes.bodyActive, "");
				if (!this._reopen) !this.bodyLock && bodyLock();
				else this._reopen = false;
				this.targetOpen.element.setAttribute("aria-hidden", "false");
				this.previousOpen.selector = this.targetOpen.selector;
				this.previousOpen.element = this.targetOpen.element;
				this._selectorOpen = false;
				this.isOpen = true;
				setTimeout(() => {
					this._focusTrap();
				}, 50);
				this.options.on.afterOpen(this);
				document.dispatchEvent(new CustomEvent("afterPopupOpen", { detail: { popup: this } }));
			}
		}
	}
	close(selectorValue) {
		if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
		if (!this.isOpen || !bodyLockStatus) return;
		this.options.on.beforeClose(this);
		document.dispatchEvent(new CustomEvent("beforePopupClose", { detail: { popup: this } }));
		if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) setTimeout(() => {
			this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
		}, 500);
		this.previousOpen.element.removeAttribute(this.options.classes.popupActive);
		this.previousOpen.element.setAttribute("aria-hidden", "true");
		if (!this._reopen) {
			document.documentElement.removeAttribute(this.options.classes.bodyActive);
			!this.bodyLock && bodyUnlock();
			this.isOpen = false;
		}
		this._removeHash();
		if (this._selectorOpen) {
			this.lastClosed.selector = this.previousOpen.selector;
			this.lastClosed.element = this.previousOpen.element;
		}
		this.options.on.afterClose(this);
		document.dispatchEvent(new CustomEvent("afterPopupClose", { detail: { popup: this } }));
		setTimeout(() => {
			this._focusTrap();
		}, 50);
	}
	_getHash() {
		if (this.options.hashSettings.location) this.hash = `#${this.targetOpen.selector}`;
	}
	_openToHash() {
		let classInHash = window.location.hash.replace("#", "");
		const openButton = document.querySelector(`[${this.options.attributeOpenButton}="${classInHash}"]`);
		if (openButton) this.youTubeCode = openButton.getAttribute(this.options.youtubeAttribute) ? openButton.getAttribute(this.options.youtubeAttribute) : null;
		if (classInHash) this.open(classInHash);
	}
	_setHash() {
		history.pushState("", "", this.hash);
	}
	_removeHash() {
		history.pushState("", "", window.location.href.split("#")[0]);
	}
	_focusCatch(e) {
		const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
		const focusArray = Array.prototype.slice.call(focusable);
		const focusedIndex = focusArray.indexOf(document.activeElement);
		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			e.preventDefault();
		}
		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus();
			e.preventDefault();
		}
	}
	_focusTrap() {
		const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
		if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus();
		else focusable[0].focus();
	}
};
document.querySelector("[data-fls-popup]") && window.addEventListener("load", () => window.flsPopup = new Popup({}));
//#endregion
//#region src/components/layout/menuhaschildren/menuhaschildren.js
var mql = matchMedia("(min-width: 991.98px)");
var isDesktop = () => mql.matches;
function syncMode() {
	document.querySelectorAll(".menu__item_has-children").forEach((item) => {
		const subList = item.querySelector(".menu__sub-list");
		if (!subList) return;
		subList.style.removeProperty("height");
		subList.style.removeProperty("overflow");
		if (isDesktop()) subList.removeAttribute("hidden");
		else if (!item.classList.contains("_hover")) subList.setAttribute("hidden", "");
	});
}
mql.addEventListener("change", syncMode);
document.addEventListener("DOMContentLoaded", syncMode);
syncMode();
document.addEventListener("pointerover", (e) => {
	if (!isDesktop()) return;
	const item = e.target.closest(".menu__item_has-children");
	if (!item || item.contains(e.relatedTarget)) return;
	item.classList.add("_hover");
});
document.addEventListener("pointerout", (e) => {
	if (!isDesktop()) return;
	const item = e.target.closest(".menu__item_has-children");
	if (!item || item.contains(e.relatedTarget)) return;
	item.classList.remove("_hover");
});
document.addEventListener("click", (e) => {
	const target = e.target;
	if (isDesktop()) {
		const arrow = target.closest(".menu__arrow");
		if (arrow) {
			const item = arrow.closest(".menu__item_has-children");
			const subList = item?.querySelector(".menu__sub-list");
			if (!item || !subList) return;
			e.preventDefault();
			item.classList.toggle("_hover");
			subList.removeAttribute("hidden");
			return;
		}
		if (!target.closest(".menu__item_has-children")) document.querySelectorAll(".menu__item_has-children._hover").forEach((item) => item.classList.remove("_hover"));
		return;
	}
	const trigger = target.closest(".menu__item_has-children > .menu__link, .menu__item_has-children > .menu__arrow");
	if (!trigger) return;
	const item = trigger.closest(".menu__item_has-children");
	const subList = item?.querySelector(".menu__sub-list");
	if (!item || !subList) return;
	e.preventDefault();
	const isOpening = !item.classList.contains("_hover");
	item.classList.toggle("_hover", isOpening);
	if (isOpening) {
		subList.removeAttribute("hidden");
		slideDown(subList, 300);
	} else slideUp(subList, 300);
});
//#endregion
//#region src/components/layout/menu/menu.js
function menuInit() {
	document.addEventListener("click", function(e) {
		if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-menu-open");
		}
	});
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
//#region src/components/layout/header/header-height.js
var inited = false;
var lastHeaderH = -1;
var lastBottomH = -1;
var controller = null;
var ro = null;
function initHeaderHeight() {
	if (inited) return;
	inited = true;
	const root = document.documentElement;
	const headerTop = document.querySelector(".header__top");
	const headerBottom = document.querySelector(".header__bottom");
	if (!headerTop || !headerBottom) return;
	const setVar = () => {
		const topHeight = headerTop.getBoundingClientRect().height || 0;
		const bottomHeight = headerBottom.getBoundingClientRect().height || 0;
		const headerHeight = topHeight + bottomHeight;
		if (headerHeight !== lastHeaderH) {
			lastHeaderH = headerHeight;
			root.style.setProperty("--header-height", `${headerHeight}px`);
		}
		if (bottomHeight !== lastBottomH) {
			lastBottomH = bottomHeight;
			root.style.setProperty("--header-bottom-height", `${bottomHeight}px`);
		}
	};
	setVar();
	controller = new AbortController();
	const { signal } = controller;
	ro = new ResizeObserver(setVar);
	ro.observe(headerTop);
	ro.observe(headerBottom);
	const onResize = () => requestAnimationFrame(setVar);
	window.addEventListener("resize", onResize, {
		passive: true,
		signal
	});
}
//#endregion
//#region src/components/layout/headercatalog/headercatalog.js
initHeaderHeight();
var isMenuOpen$1 = () => document.documentElement.hasAttribute("data-fls-menu-open");
var desktopMedia = window.matchMedia("(min-width: 991.98px)");
var getOptimizedImagePath = (image, targetImage) => {
	if (!image) return "";
	const currentImage = targetImage?.currentSrc || targetImage?.src || "";
	if (/\.webp(?:[?#].*)?$/i.test(currentImage)) return image.replace(/\.(jpe?g|png)([?#].*)?$/i, ".webp$2");
	return image;
};
var setCatalogImage = (imageElement, image, alt = "") => {
	if (!imageElement || !image) return;
	imageElement.src = getOptimizedImagePath(image, imageElement);
	imageElement.removeAttribute("data-src");
	imageElement.removeAttribute("data-fls-lazy");
	imageElement.classList.add("_lazy-loaded");
	if (alt) imageElement.alt = alt;
};
document.querySelectorAll("[data-fls-headercatalog]").forEach((catalog) => {
	const toggle = catalog.querySelector(".header-catalog__toggle");
	const overlay = catalog.querySelector(".header-catalog__overlay");
	const back = catalog.querySelector(".header-catalog__back");
	const mobileTitle = catalog.querySelector(".header-catalog__mobile-title");
	const wrapper = catalog.querySelector(".header-catalog__wrapper");
	const categories = catalog.querySelectorAll(".header-catalog__category");
	const panels = catalog.querySelectorAll(".header-catalog__model-group");
	const previewImage = catalog.querySelector(".header-catalog__preview-image");
	const previewBadge = catalog.querySelector(".header-catalog__preview-badge");
	const productCard = catalog.querySelector(".product-card");
	let productChangeTimer = null;
	const defaultMobileTitle = mobileTitle?.textContent || "Каталог товаров";
	const resetMobileCatalog = () => {
		catalog.classList.remove("_models-active");
		if (mobileTitle) mobileTitle.textContent = defaultMobileTitle;
		if (wrapper) wrapper.scrollTop = 0;
	};
	const fillProduct = (model) => {
		if (!model || !productCard) return;
		const image = model.dataset.image || "";
		const title = model.dataset.title || "";
		const text = model.dataset.text || "";
		const oldPrice = model.dataset.oldPrice || "";
		const price = model.dataset.price || "";
		const badge = (model.dataset.badge || "").toLowerCase();
		setCatalogImage(previewImage, image);
		if (previewBadge) {
			previewBadge.textContent = badge.toUpperCase();
			previewBadge.className = `header-catalog__preview-badge badge${badge ? ` badge_${badge}` : ""}`;
			previewBadge.hidden = !badge;
		}
		const cardImage = productCard.querySelector(".product-card__image img");
		const cardImageLink = productCard.querySelector(".product-card__image");
		const cardTitle = productCard.querySelector(".product-card__title");
		const cardText = productCard.querySelector(".product-card__text");
		const cardOldPrice = productCard.querySelector(".product-card__old-price");
		const cardPrice = productCard.querySelector(".product-card__price");
		const cardBadge = productCard.querySelector(".product-card__badge");
		setCatalogImage(cardImage, image, title);
		if (cardImageLink) cardImageLink.href = "#";
		if (cardTitle) {
			cardTitle.textContent = title;
			cardTitle.href = "#";
		}
		if (cardText) cardText.textContent = text;
		if (cardOldPrice) {
			cardOldPrice.textContent = oldPrice;
			cardOldPrice.hidden = !oldPrice;
		}
		if (cardPrice) cardPrice.textContent = price;
		if (cardBadge) {
			cardBadge.textContent = badge;
			cardBadge.hidden = !badge;
			cardBadge.className = `product-card__badge badge${badge ? ` badge_${badge}` : ""}`;
		}
	};
	const setProduct = (model, animate = true) => {
		if (!model || !productCard) return;
		clearTimeout(productChangeTimer);
		if (!animate) {
			fillProduct(model);
			return;
		}
		catalog.classList.add("_product-changing");
		productChangeTimer = setTimeout(() => {
			fillProduct(model);
			requestAnimationFrame(() => catalog.classList.remove("_product-changing"));
		}, 120);
	};
	const activateFirstModel = (panel) => {
		const models = panel.querySelectorAll(".header-catalog__model");
		models.forEach((model) => model.classList.remove("_item-active"));
		const firstModel = models[0];
		if (!firstModel) return;
		firstModel.classList.add("_item-active");
		if (desktopMedia.matches) setProduct(firstModel);
	};
	const openCatalog = () => {
		if (catalog.classList.contains("_catalog-active")) return;
		document.querySelector(".search._search-active, .search._search-modal-active")?.classList.remove("_search-active", "_search-modal-active");
		if (!desktopMedia.matches) resetMobileCatalog();
		catalog.classList.add("_catalog-active");
		document.documentElement.setAttribute("data-fls-catalog-open", "");
		if (wrapper) wrapper.style.display = "";
		if (!isMenuOpen$1()) bodyLock();
	};
	const closeCatalog = () => {
		if (!catalog.classList.contains("_catalog-active")) return;
		catalog.classList.remove("_catalog-active");
		resetMobileCatalog();
		document.documentElement.removeAttribute("data-fls-catalog-open");
		if (!isMenuOpen$1()) bodyUnlock();
	};
	toggle?.addEventListener("click", () => {
		catalog.classList.contains("_catalog-active") ? closeCatalog() : openCatalog();
	});
	overlay?.addEventListener("click", closeCatalog);
	const goBack = () => {
		if (catalog.classList.contains("_models-active")) {
			resetMobileCatalog();
			return;
		}
		closeCatalog();
	};
	back?.addEventListener("click", goBack);
	mobileTitle?.addEventListener("click", goBack);
	categories.forEach((category) => {
		category.addEventListener("click", () => {
			const target = category.dataset.catalogCategory;
			categories.forEach((item) => item.classList.remove("_item-active"));
			category.classList.add("_item-active");
			panels.forEach((panel) => {
				const isActive = panel.dataset.catalogPanel === target;
				panel.classList.toggle("_item-active", isActive);
				if (isActive) activateFirstModel(panel);
			});
			if (!desktopMedia.matches) {
				catalog.classList.add("_models-active");
				if (wrapper) wrapper.scrollTop = 0;
				if (mobileTitle) mobileTitle.textContent = category.querySelector(".header-catalog__category-title")?.textContent?.trim() || defaultMobileTitle;
			}
		});
	});
	catalog.addEventListener("pointerover", (e) => {
		if (!desktopMedia.matches) return;
		const model = e.target.closest(".header-catalog__model");
		if (!model || !catalog.contains(model)) return;
		if (model.classList.contains("_item-active")) return;
		model.closest(".header-catalog__model-group")?.querySelectorAll(".header-catalog__model").forEach((item) => item.classList.remove("_item-active"));
		model.classList.add("_item-active");
		setProduct(model);
	});
	catalog.addEventListener("click", (e) => {
		const model = e.target.closest(".header-catalog__model");
		if (!model || !catalog.contains(model) || !desktopMedia.matches) return;
		e.preventDefault();
		if (model.classList.contains("_item-active")) return;
		model.closest(".header-catalog__model-group")?.querySelectorAll(".header-catalog__model").forEach((item) => item.classList.remove("_item-active"));
		model.classList.add("_item-active");
		setProduct(model);
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" || e.key === "Esc") closeCatalog();
	});
});
//#endregion
//#region src/components/layout/header/plugins/scroll/scroll.js
function headerScroll() {
	const headers = Array.from(document.querySelectorAll("[data-fls-header-scroll]"));
	if (!headers.length) return;
	const headerShow = headers.some((header) => header.hasAttribute("data-fls-header-scroll-show"));
	const headerWithShowTimer = headers.find((header) => header.dataset.flsHeaderScrollShow);
	const headerShowTimer = headerWithShowTimer ? headerWithShowTimer.dataset.flsHeaderScrollShow : 500;
	let scrollDirection = 0;
	let timer;
	const getStartPoint = (header) => {
		if (header.dataset.flsHeaderScroll) return Number(header.dataset.flsHeaderScroll);
		const rect = header.getBoundingClientRect();
		return Math.max(rect.top + window.scrollY, 1);
	};
	const headerItems = headers.map((header) => ({
		header,
		startPoint: getStartPoint(header)
	}));
	const updateStartPoints = () => {
		headerItems.forEach((item) => {
			item.startPoint = getStartPoint(item.header);
		});
	};
	const toggleHeaderScrollClass = (scrollTop) => {
		headerItems.forEach((item) => {
			const method = scrollTop >= item.startPoint ? "add" : "remove";
			item.header.classList[method]("--header-scroll");
			item.header.closest(".header")?.classList[method]("--header-bottom-scroll");
			if (method === "add") {
				item.header.setAttribute("data-fls-lp", "");
				if (document.documentElement.hasAttribute("data-fls-scrolllock")) item.header.style.paddingRight = document.body.style.paddingRight;
			} else {
				item.header.removeAttribute("data-fls-lp");
				item.header.style.paddingRight = "";
			}
			if (!headerShow || scrollTop >= item.startPoint) return;
			item.header.classList.remove("--header-show");
		});
	};
	const toggleHeaderShowClass = (method) => {
		headerItems.forEach((item) => {
			if (item.header.hasAttribute("data-fls-header-scroll-show")) item.header.classList[method]("--header-show");
		});
	};
	updateStartPoints();
	window.addEventListener("resize", () => {
		requestAnimationFrame(updateStartPoints);
	}, { passive: true });
	document.addEventListener("scroll", function(e) {
		const scrollTop = window.scrollY;
		clearTimeout(timer);
		toggleHeaderScrollClass(scrollTop);
		if (headerShow) {
			if (scrollTop > scrollDirection) toggleHeaderShowClass("remove");
			else toggleHeaderShowClass("add");
			timer = setTimeout(() => {
				toggleHeaderShowClass("add");
			}, headerShowTimer);
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}
document.querySelector("[data-fls-header-scroll]") && window.addEventListener("load", headerScroll);
//#endregion
//#region src/components/layout/dynamic/dynamic.js
var DynamicAdapt = class {
	constructor() {
		this.type = "max";
		this.init();
	}
	init() {
		this.objects = [];
		this.daClassname = "--dynamic";
		this.nodes = [...document.querySelectorAll("[data-fls-dynamic]")];
		this.nodes.forEach((node) => {
			const dataArray = node.dataset.flsDynamic.trim().split(`,`);
			const object = {};
			object.element = node;
			object.parent = node.parentNode;
			object.destinationParent = dataArray[3] ? node.closest(dataArray[3].trim()) || document : document;
			const parentObjectSelector = dataArray[3] ? dataArray[3].trim() : null;
			const objectSelector = dataArray[0] ? dataArray[0].trim() : null;
			if (objectSelector) {
				if (parentObjectSelector) `${parentObjectSelector}${objectSelector}`;
				const foundDestination = object.destinationParent.querySelector(objectSelector);
				if (foundDestination) object.destination = foundDestination;
			}
			object.breakpoint = dataArray[1] ? dataArray[1].trim() : `767.98`;
			object.place = dataArray[2] ? dataArray[2].trim() : `last`;
			object.index = this.indexInParent(object.parent, object.element);
			this.objects.push(object);
		});
		this.arraySort(this.objects);
		this.mediaQueries = this.objects.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`).filter((item, index, self) => self.indexOf(item) === index);
		this.mediaQueries.forEach((media) => {
			const mediaSplit = media.split(",");
			const matchMedia = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];
			const objectsFilter = this.objects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint);
			matchMedia.addEventListener("change", () => {
				this.mediaHandler(matchMedia, objectsFilter);
			});
			this.mediaHandler(matchMedia, objectsFilter);
		});
	}
	mediaHandler(matchMedia, objects) {
		if (matchMedia.matches) objects.forEach((object) => {
			if (object.destination) this.moveTo(object.place, object.element, object.destination);
		});
		else objects.forEach(({ parent, element, index }) => {
			if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
		});
	}
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname);
		const index = place === "last" || place === "first" ? place : parseInt(place, 10);
		if (index === "last" || index >= destination.children.length) destination.append(element);
		else if (index === "first") destination.prepend(element);
		else destination.children[index].before(element);
	}
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== void 0) parent.children[index].before(element);
		else parent.append(element);
	}
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element);
	}
	arraySort(arr) {
		if (this.type === "min") arr.sort((a, b) => {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) return 0;
				if (a.place === "first" || b.place === "last") return -1;
				if (a.place === "last" || b.place === "first") return 1;
				return 0;
			}
			return a.breakpoint - b.breakpoint;
		});
		else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) return 0;
					if (a.place === "first" || b.place === "last") return 1;
					if (a.place === "last" || b.place === "first") return -1;
					return 0;
				}
				return b.breakpoint - a.breakpoint;
			});
			return;
		}
	}
};
if (document.querySelector("[data-fls-dynamic]")) window.addEventListener("load", () => new DynamicAdapt());
//#endregion
//#region src/components/forms/search/search.js
initHeaderHeight();
var isMenuOpen = () => document.documentElement.hasAttribute("data-fls-menu-open");
document.querySelectorAll("[data-fls-search]").forEach((search) => {
	const mobileToggle = search.querySelector(".search__mobile-toggle");
	const modal = search.querySelector(".search__modal");
	const overlay = search.querySelector(".search__overlay");
	const input = search.querySelector(".search__input");
	const closeButton = search.querySelector(".search__close");
	const desktopMedia = window.matchMedia("(min-width: 991.98px)");
	const closeCatalog = () => {
		const activeCatalog = document.querySelector(".header-catalog._catalog-active");
		if (activeCatalog) {
			activeCatalog.classList.remove("_catalog-active");
			document.documentElement.removeAttribute("data-fls-catalog-open");
		}
	};
	const openDesktopSearch = () => {
		if (search.classList.contains("_search-active")) return;
		closeCatalog();
		search.classList.add("_search-active");
		search.closest(".header__bottom")?.classList.add("_search-active");
		modal?.setAttribute("aria-hidden", "false");
		document.documentElement.setAttribute("data-fls-search-open", "");
		if (!isMenuOpen()) bodyLock();
	};
	const openMobileSearch = () => {
		if (search.classList.contains("_search-modal-active")) return;
		closeCatalog();
		search.classList.add("_search-modal-active");
		modal?.setAttribute("aria-hidden", "false");
		document.documentElement.setAttribute("data-fls-search-open", "");
		if (!isMenuOpen()) bodyLock();
		setTimeout(() => input?.focus(), 0);
	};
	const closeSearch = ({ clear = false } = {}) => {
		if (clear) {
			if (input) input.value = "";
		}
		if (!(search.classList.contains("_search-active") || search.classList.contains("_search-modal-active"))) return;
		search.classList.remove("_search-active", "_search-modal-active");
		search.closest(".header__bottom")?.classList.remove("_search-active");
		modal?.setAttribute("aria-hidden", "true");
		document.documentElement.removeAttribute("data-fls-search-open");
		if (!document.querySelector(".header-catalog._catalog-active") && !isMenuOpen()) bodyUnlock();
	};
	const openSearchByInput = () => {
		if (desktopMedia.matches) openDesktopSearch();
	};
	input?.addEventListener("focus", openSearchByInput);
	input?.addEventListener("click", openSearchByInput);
	mobileToggle?.addEventListener("click", openMobileSearch);
	closeButton?.addEventListener("click", () => closeSearch({ clear: true }));
	overlay?.addEventListener("click", () => closeSearch());
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" || e.key === "Esc") closeSearch();
	});
});
//#endregion
//#region src/components/forms/quantity/quantity.js
function formQuantity() {
	document.addEventListener("click", quantityActions);
	document.addEventListener("input", quantityActions);
	function quantityActions(e) {
		const type = e.type;
		const targetElement = e.target;
		if (type === "click") {
			if (targetElement.closest("[data-fls-quantity-plus]") || targetElement.closest("[data-fls-quantity-minus]")) {
				const valueElement = targetElement.closest("[data-fls-quantity]").querySelector("[data-fls-quantity-value]");
				let value = parseInt(valueElement.value);
				if (targetElement.hasAttribute("data-fls-quantity-plus")) {
					value++;
					if (+valueElement.dataset.flsQuantityMax && +valueElement.dataset.flsQuantityMax < value) value = valueElement.dataset.flsQuantityMax;
				} else {
					--value;
					if (+valueElement.dataset.flsQuantityMin) {
						if (+valueElement.dataset.flsQuantityMin > value) value = valueElement.dataset.flsQuantityMin;
					} else if (value < 1) value = 1;
				}
				targetElement.closest("[data-fls-quantity]").querySelector("[data-fls-quantity-value]").value = value;
			}
		} else if (type === "input") {
			if (targetElement.closest("[data-fls-quantity-value]")) {
				const valueElement = targetElement.closest("[data-fls-quantity-value]");
				(valueElement.value == 0 || /[^0-9]/gi.test(valueElement.value)) && (valueElement.value = 1);
			}
		}
	}
}
document.querySelector("[data-fls-quantity]") && window.addEventListener("load", formQuantity);
//#endregion
//#region src/components/effects/lazyload/lazyload.js
var lazySelector = "img[data-fls-lazy][data-src]";
var loadedAttribute = "data-fls-lazy-loaded";
function setLazySource(element, dataKey, attrName) {
	const value = resolveLazySource(element.dataset[dataKey]);
	if (!value) return;
	element.setAttribute(attrName, value);
	element.removeAttribute(`data-${dataKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`);
}
function resolveLazySource(value) {
	if (!value) return "";
	return value.replace(/^\/src\/assets\//, "/assets/").replace(/^src\/assets\//, "/assets/");
}
function loadLazyImage(image) {
	if (image.hasAttribute(loadedAttribute)) return;
	const picture = image.closest("picture");
	if (picture) picture.querySelectorAll("source[data-srcset]").forEach((source) => {
		setLazySource(source, "srcset", "srcset");
	});
	setLazySource(image, "srcset", "srcset");
	setLazySource(image, "src", "src");
	if (image.complete) {
		markLazyImageLoaded(image);
		return;
	}
	image.addEventListener("load", () => {
		markLazyImageLoaded(image);
	}, { once: true });
	image.addEventListener("error", () => {
		markLazyImageLoaded(image);
	}, { once: true });
}
function markLazyImageLoaded(image) {
	image.classList.add("_lazy-loaded");
	image.setAttribute(loadedAttribute, "");
}
function initLazyLoad() {
	const lazyImages = document.querySelectorAll(lazySelector);
	if (!lazyImages.length) return;
	if (!("IntersectionObserver" in window)) {
		lazyImages.forEach(loadLazyImage);
		return;
	}
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			loadLazyImage(entry.target);
			observer.unobserve(entry.target);
		});
	}, {
		rootMargin: "300px 0px",
		threshold: .01
	});
	const observeLazyImages = (scope) => {
		if (!scope) return;
		if (scope.matches?.(lazySelector) && !scope.hasAttribute(loadedAttribute)) imageObserver.observe(scope);
		scope.querySelectorAll?.(lazySelector).forEach((image) => {
			if (image.hasAttribute(loadedAttribute)) return;
			imageObserver.observe(image);
		});
	};
	observeLazyImages(document);
	new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (!(node instanceof HTMLElement)) return;
				observeLazyImages(node);
			});
		});
	}).observe(document.body, {
		childList: true,
		subtree: true
	});
}
document.addEventListener("DOMContentLoaded", initLazyLoad);
//#endregion
//#region src/components/effects/scroll-offset/scroll-offset.js
var scrollContainersSelector = [
	".cart-popup__items",
	".search__modal",
	".header-catalog__wrapper"
].join(",");
var scrollContainers = /* @__PURE__ */ new Set();
var finePointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
var hasVerticalScroll = (element) => element.scrollHeight > element.clientHeight + 1;
var updateScrollOffset = (element) => {
	element.classList.toggle("_has-vertical-scroll", finePointerMedia.matches && hasVerticalScroll(element));
};
var collectScrollContainers = () => {
	document.querySelectorAll(scrollContainersSelector).forEach((element) => {
		if (scrollContainers.has(element)) return;
		scrollContainers.add(element);
		resizeObserver.observe(element);
		updateScrollOffset(element);
	});
};
var updateAllScrollOffsets = () => {
	collectScrollContainers();
	scrollContainers.forEach(updateScrollOffset);
};
var resizeObserver = new ResizeObserver((entries) => {
	entries.forEach(({ target }) => updateScrollOffset(target));
});
var mutationObserver = new MutationObserver(() => {
	requestAnimationFrame(updateAllScrollOffsets);
});
collectScrollContainers();
mutationObserver.observe(document.body, {
	subtree: true,
	childList: true,
	attributes: true,
	attributeFilter: [
		"class",
		"style",
		"data-fls-popup-active",
		"data-fls-menu-open",
		"data-fls-search-open",
		"data-fls-catalog-open"
	]
});
window.addEventListener("resize", updateAllScrollOffsets);
window.addEventListener("load", updateAllScrollOffsets);
finePointerMedia.addEventListener("change", updateAllScrollOffsets);
//#endregion
//#region src/components/effects/sticky-sidebar/sticky-sidebar.js
var stickySidebarSelector = "[data-fls-sticky-sidebar]";
var stickySidebarContentSelector = "[data-fls-sticky-sidebar-content]";
var toNumber = (value, fallback = 0) => {
	const parsedValue = parseFloat(value);
	return Number.isFinite(parsedValue) ? parsedValue : fallback;
};
var clamp = (value, min, max) => Math.min(Math.max(value, min), max);
var getParams = (value) => value.split(",").map((param) => param.trim()).filter(Boolean);
var StickySidebar = class {
	constructor(sidebar) {
		if (sidebar.stickySidebar) return;
		this.sidebar = sidebar;
		this.content = sidebar.querySelector(stickySidebarContentSelector) || sidebar.firstElementChild;
		this.params = getParams(sidebar.dataset.flsStickySidebar || "");
		this.boundary = sidebar.dataset.flsStickySidebarBoundary ? sidebar.closest(sidebar.dataset.flsStickySidebarBoundary) || document.querySelector(sidebar.dataset.flsStickySidebarBoundary) : sidebar.parentElement;
		this.breakpoint = toNumber(this.params[0], 991.98);
		this.gap = toNumber(this.params[1] || sidebar.dataset.flsStickySidebarGap, 24);
		this.offsetVar = sidebar.dataset.flsStickySidebarOffsetVar || "";
		this.media = window.matchMedia(`(min-width: ${this.breakpoint}px)`);
		this.resizeObserver = new ResizeObserver(() => this.requestUpdate());
		this.currentTop = null;
		this.lastScrollY = window.scrollY;
		this.isTicking = false;
		if (!this.content || !this.boundary) return;
		sidebar.stickySidebar = this;
		this.resizeObserver.observe(this.content);
		this.resizeObserver.observe(this.boundary);
		this.media.addEventListener("change", () => this.requestUpdate(true));
		window.addEventListener("resize", () => this.requestUpdate(true));
		window.addEventListener("load", () => this.requestUpdate(true));
		window.addEventListener("scroll", () => this.requestUpdate(), { passive: true });
		this.update(true);
	}
	getOffset() {
		if (!this.offsetVar) return 0;
		return toNumber(getComputedStyle(document.documentElement).getPropertyValue(this.offsetVar));
	}
	requestUpdate(force = false) {
		if (this.isTicking) return;
		this.isTicking = true;
		requestAnimationFrame(() => {
			this.update(force);
			this.isTicking = false;
		});
	}
	reset() {
		this.currentTop = null;
		this.sidebar.classList.remove("_sticky-sidebar-enabled", "_sticky-sidebar-fixed", "_sticky-sidebar-absolute");
		this.sidebar.style.removeProperty("--sticky-sidebar-gap");
		this.sidebar.style.removeProperty("--sticky-sidebar-offset");
		this.sidebar.style.removeProperty("--sticky-sidebar-height");
		this.content.style.removeProperty("position");
		this.content.style.removeProperty("top");
		this.content.style.removeProperty("left");
		this.content.style.removeProperty("width");
	}
	setAbsolute(top) {
		this.sidebar.classList.remove("_sticky-sidebar-fixed");
		this.sidebar.classList.add("_sticky-sidebar-absolute");
		this.content.style.position = "absolute";
		this.content.style.top = `${top}px`;
		this.content.style.left = "0";
		this.content.style.width = "100%";
	}
	setFixed(top) {
		const sidebarRect = this.sidebar.getBoundingClientRect();
		this.sidebar.classList.remove("_sticky-sidebar-absolute");
		this.sidebar.classList.add("_sticky-sidebar-fixed");
		this.content.style.position = "fixed";
		this.content.style.top = `${top}px`;
		this.content.style.left = `${sidebarRect.left}px`;
		this.content.style.width = `${sidebarRect.width}px`;
	}
	update(force = false) {
		if (!this.content || !this.boundary || !this.media.matches) {
			this.reset();
			return;
		}
		const scrollY = window.scrollY;
		const direction = scrollY > this.lastScrollY ? "down" : "up";
		const offset = this.getOffset();
		const contentHeight = this.content.offsetHeight;
		const boundaryTop = this.boundary.getBoundingClientRect().top + scrollY;
		const boundaryHeight = this.boundary.offsetHeight;
		const boundaryBottom = boundaryTop + boundaryHeight;
		const sidebarRect = this.sidebar.getBoundingClientRect();
		const sidebarTop = sidebarRect.top + scrollY;
		const viewportTop = scrollY + offset + this.gap;
		const viewportBottom = scrollY + window.innerHeight - this.gap;
		const minTop = boundaryTop;
		const maxTop = Math.max(boundaryTop, boundaryBottom - contentHeight);
		this.sidebar.classList.add("_sticky-sidebar-enabled");
		this.sidebar.style.setProperty("--sticky-sidebar-gap", `${this.gap}px`);
		this.sidebar.style.setProperty("--sticky-sidebar-offset", `${offset}px`);
		this.sidebar.style.setProperty("--sticky-sidebar-height", `${contentHeight}px`);
		if (boundaryHeight <= contentHeight || sidebarRect.width <= 0) {
			this.setAbsolute(minTop - sidebarTop);
			this.lastScrollY = scrollY;
			return;
		}
		if (force || this.currentTop === null) this.currentTop = clamp(sidebarRect.top + scrollY, minTop, maxTop);
		if (contentHeight <= window.innerHeight - offset - this.gap * 2) this.currentTop = clamp(viewportTop, minTop, maxTop);
		else if (direction === "down") this.currentTop = Math.max(this.currentTop, viewportBottom - contentHeight);
		else this.currentTop = Math.min(this.currentTop, viewportTop);
		this.currentTop = clamp(this.currentTop, minTop, maxTop);
		if (this.currentTop <= minTop || viewportTop <= minTop) this.setAbsolute(minTop - sidebarTop);
		else if (this.currentTop >= maxTop) this.setAbsolute(maxTop - sidebarTop);
		else this.setFixed(this.currentTop - scrollY);
		this.lastScrollY = scrollY;
	}
};
document.querySelector(stickySidebarSelector) && document.querySelectorAll(stickySidebarSelector).forEach((sidebar) => new StickySidebar(sidebar));
//#endregion
//#region src/js/app.js
addLoadedAttr();
//#endregion
export { slideToggle as a, slideDown as i, bodyUnlock as n, slideUp as o, dataMediaQueries as r, bodyLock as t };
