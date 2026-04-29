import "./app.min.js";
/* empty css                    */
/* empty css         */
//#region src/components/sections/hero/hero.js
function getMatchedHeroSource(video) {
	return [...video.querySelectorAll("source")].find((source) => {
		const media = source.getAttribute("media");
		return !media || window.matchMedia(media).matches;
	}) || null;
}
function getFallbackHeroPoster(section) {
	const image = section.querySelector(".hero__slide:not(:has(video)) .hero__media img") || section.querySelector(".hero__media img");
	return image?.currentSrc || image?.getAttribute("src") || "";
}
function syncHeroVideoPoster(section) {
	const fallbackPoster = getFallbackHeroPoster(section);
	section.querySelectorAll(".hero__media video").forEach((video) => {
		const poster = getMatchedHeroSource(video)?.dataset.poster || fallbackPoster;
		if (poster && video.getAttribute("poster") !== poster) video.setAttribute("poster", poster);
	});
}
function syncHeroVideoSource(video) {
	const matchedSource = getMatchedHeroSource(video);
	if (!matchedSource) return;
	const matchedSourceSrc = matchedSource.dataset.src || matchedSource.getAttribute("src") || "";
	if (!matchedSourceSrc) return;
	if ((video.currentSrc || video.getAttribute("src") || "").includes(matchedSourceSrc)) return;
	if (video.dataset.loaded === "true") video.load();
}
function initHeroAdaptiveVideo(section) {
	syncHeroVideoPoster(section);
	[...new Set([...section.querySelectorAll(".hero__media video source[media]")].map((source) => source.getAttribute("media")))].forEach((media) => {
		const mediaQuery = window.matchMedia(media);
		const handleChange = () => {
			syncHeroVideoPoster(section);
			section.querySelectorAll(".hero__media video").forEach((video) => {
				syncHeroVideoSource(video);
			});
		};
		if (mediaQuery.addEventListener) mediaQuery.addEventListener("change", handleChange);
		else mediaQuery.addListener(handleChange);
	});
}
function initHeroAdaptiveVideos() {
	document.querySelectorAll("[data-fls-hero]").forEach((section) => {
		initHeroAdaptiveVideo(section);
	});
}
document.addEventListener("DOMContentLoaded", initHeroAdaptiveVideos);
//#endregion
