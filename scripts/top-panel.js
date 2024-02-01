// ===================================================
const topMainPanelElement = document.getElementById("top-main-panel");
const topMainPanelBufferElement = document.getElementById("top-main-panel-buffer");

const topMiniPanelElement = document.getElementById("top-mini-panel-options");
const topMiniPanelShowElement = document.getElementById("top-mini-panel-show");
const topMiniPanelHideElement = document.getElementById("top-mini-panel-hide");
// ===================================================
const pageMainPanelElement = document.getElementById("page-main-panel");
const pageMainOverlayElement = document.getElementById("page-main-overlay");

let isScreenTransitioning = false;
let isBlurActive = false;
// ===================================================
export function loadTopPage() {
  if (topMainPanelBufferElement !== null) {
    const topElementHeight = topMainPanelElement.offsetHeight + 
      topMainPanelElement.getBoundingClientRect().top;
    topMainPanelBufferElement.style.paddingTop = (topElementHeight/2).toString() + "px";
    topMainPanelBufferElement.style.paddingBottom = (topElementHeight/2).toString() + "px";
  }

  topMainPanelElement.style.position = "fixed";
}
// ===================================================
export function showTopPanelOptions() {
  if (isScreenTransitioning || isBlurActive)
    return;

  const newYOffset = (topMainPanelElement.offsetHeight + 
                      topMainPanelElement.getBoundingClientRect().top).toString() + "px";
  topMiniPanelElement.style.top = newYOffset;

  // Debug
  //console.log("[Expand] New Y Offset: " + newYOffset);

  topMiniPanelShowElement.classList.remove("d-block");
  topMiniPanelShowElement.classList.add("d-none");

  topMiniPanelHideElement.classList.add("d-block");
  topMiniPanelHideElement.classList.remove("d-none");

  pageMainPanelElement.classList.remove("put-to-foreground-effect");
  pageMainPanelElement.classList.add("put-to-background-effect");

  pageMainOverlayElement.style.opacity = 0.2;
  pageMainOverlayElement.style.display = "block";
  isBlurActive = true;
}

export function hideTopPanelOptions() {
  if (isScreenTransitioning || !isBlurActive)
    return;

  // "offsetHeight" returns zero when element is being adjusted by Bootstrap during screen resize.
  // For now, use hardcoded value from the ideal element's offsetHeight.
  //const newYOffset = (-topMiniPanelElement.offsetHeight).toString() + "px";
  const newYOffset = "-105px";
  topMiniPanelElement.style.top = newYOffset;

  // Debug
  //console.log("[Hide] New Y Offset: " + newYOffset);

  topMiniPanelShowElement.classList.add("d-block");
  topMiniPanelShowElement.classList.remove("d-none");

  topMiniPanelHideElement.classList.remove("d-block");
  topMiniPanelHideElement.classList.add("d-none");

  pageMainPanelElement.classList.add("put-to-foreground-effect");
  pageMainPanelElement.classList.remove("put-to-background-effect");

  pageMainOverlayElement.style.opacity = 0;
  isScreenTransitioning = true;
  setTimeout(() => {
    pageMainOverlayElement.style.display = "none";
    isScreenTransitioning = false;
    isBlurActive = false;
  }, 500);
}
// ===================================================
