const galleryImages = [
  "Jaguar E-type install - fastest car back then.webp",
  "Jaguar E-Type install - interior.webp",
  "Jaguar E-Type install - interior2.webp",
  "Jaguar E-type install circle - fastest car back then.webp",
  "Jaguar E-type install1.webp",
  "Jaguar E-type install10.webp",
  "jump pack ALWAYSTART_STILL_07.webp",
  "Lexus IS install circle.webp",
  "Lexus IS install.webp",
  "Lexus IS install2.webp",
  "Lexus IS install3.webp",
  "Luggage (1024 x 588 px).webp",
  "Mustang install city bkgd.webp",
  "Mustang install city bkgd2.webp",
  "Mustang install guy working.webp",
  "Mustang install under hood.webp",
  "Mustang install under hood2.webp",
  "Mustang install under hood3.webp",
  "Nissan 350Z install on build car.webp",
  "Overland Accessories.webp",
  "Overland ALWAYSTART_STILL_04.webp",
  "overland Jeep checking battery.webp",
  "overlander Jeep install camping site.webp",
  "overlander Jeep install enjoying sunset.webp",
  "Overlander Toyota 4Runner install circle.webp",
  "Overlander Toyota 4Runner install full.webp",
  "Overlander smiling because of AlwayStart.webp",
  "RV install1.webp",
  "RV install2.webp",
  "RV install3.webp",
  "Truck install closer brick wall bkgd.webp",
  "Twisted cablesr1.webp",
];

const galleryVideos = [
  {
    title: "Product overview",
    src: "media/alwaystart-overview.mp4",
    poster: "assets/AS installed BMW2.jpg",
  },
  {
    title: "3D walkthrough",
    src: "media/alwaystart-how-it-works-3d.mp4",
    poster: "assets/AS installed BMW2.jpg",
  },
];

const imagePerPage = 8;
const videoPerPage = 2;
let currentImagePage = 1;
let currentVideoPage = 1;
let activeLightboxType = "image";
let activeLightboxIndex = 0;
let currentImageItems = [];
const imagePageCache = new Map();
const imageExistenceCache = new Map();

function getImagePath(fileName) {
  return "media/Gallery/" + encodeURIComponent(fileName);
}

function resolveImagePath(fileName) {
  const cached = imageExistenceCache.get(fileName);
  if (cached !== undefined) {
    return Promise.resolve(cached);
  }

  const resolvedPath = getImagePath(fileName);
  imageExistenceCache.set(fileName, resolvedPath);
  return Promise.resolve(resolvedPath);
}

function createImageCard(item, index) {
  const card = document.createElement("article");
  card.className = "gallery-card";
  card.addEventListener("click", () => openLightbox("image", index));

  const img = document.createElement("img");
  const displayName = item.fileName
    .replace(/\.(jpe?g|png|webp)$/i, "")
    .replace(/_/g, " ");
  img.alt = displayName;
  img.loading = "lazy";
  img.decoding = "async";
  img.dataset.src = item.src;
  card.appendChild(img);

  const caption = document.createElement("div");
  caption.className = "gallery-caption";
  caption.textContent = displayName;

  card.appendChild(caption);
  return card;
}

function createVideoCard(item, index) {
  const card = document.createElement("article");
  card.className = "gallery-card";
  card.addEventListener("click", () => openLightbox("video", index));

  const preview = document.createElement("img");
  preview.alt = item.title;
  preview.loading = "lazy";
  preview.decoding = "async";
  preview.dataset.src = item.poster;

  card.appendChild(preview);

  const caption = document.createElement("div");
  caption.className = "gallery-caption";
  caption.textContent = item.title;

  card.appendChild(caption);
  return card;
}

function loadVisibleMedia() {
  const imageGrid = document.getElementById("image-gallery-grid");
  const videoGrid = document.getElementById("video-gallery-grid");

  const activateMedia = (element) => {
    if (!element || !element.dataset.src) return;
    element.src = element.dataset.src;
    delete element.dataset.src;
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          activateMedia(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "200px 0px" },
    );

    imageGrid
      ?.querySelectorAll("img[data-src]")
      .forEach((img) => observer.observe(img));
    videoGrid
      ?.querySelectorAll("img[data-src]")
      .forEach((img) => observer.observe(img));
  } else {
    imageGrid?.querySelectorAll("img[data-src]").forEach(activateMedia);
    videoGrid?.querySelectorAll("img[data-src]").forEach(activateMedia);
  }
}

function renderImagePagination(totalPages) {
  const pagination = document.getElementById("image-gallery-pagination");
  if (!pagination) return;

  const buttons = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentImagePage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  buttons.push({
    label: "←",
    page: Math.max(1, currentImagePage - 1),
    disabled: currentImagePage === 1,
  });

  for (let page = startPage; page <= endPage; page += 1) {
    buttons.push({
      label: String(page),
      page,
      disabled: false,
      active: page === currentImagePage,
    });
  }

  buttons.push({
    label: "→",
    page: Math.min(totalPages, currentImagePage + 1),
    disabled: currentImagePage === totalPages,
  });

  pagination.innerHTML = "";

  buttons.forEach((button) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = button.label;
    btn.className = button.active ? "active" : "";
    btn.disabled = button.disabled;
    btn.addEventListener("click", () => {
      currentImagePage = button.page;
      renderImageGallery();
    });
    pagination.appendChild(btn);
  });
}

function renderVideoPagination(totalPages) {
  const pagination = document.getElementById("video-gallery-pagination");
  if (!pagination) return;

  const buttons = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentVideoPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  buttons.push({
    label: "←",
    page: Math.max(1, currentVideoPage - 1),
    disabled: currentVideoPage === 1,
  });

  for (let page = startPage; page <= endPage; page += 1) {
    buttons.push({
      label: String(page),
      page,
      disabled: false,
      active: page === currentVideoPage,
    });
  }

  buttons.push({
    label: "→",
    page: Math.min(totalPages, currentVideoPage + 1),
    disabled: currentVideoPage === totalPages,
  });

  pagination.innerHTML = "";

  buttons.forEach((button) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = button.label;
    btn.className = button.active ? "active" : "";
    btn.disabled = button.disabled;
    btn.addEventListener("click", () => {
      currentVideoPage = button.page;
      renderVideoGallery();
    });
    pagination.appendChild(btn);
  });
}

async function getImagePageItems(pageNumber) {
  if (imagePageCache.has(pageNumber)) {
    return imagePageCache.get(pageNumber);
  }

  const start = (pageNumber - 1) * imagePerPage;
  const end = start + imagePerPage;
  const pageFiles = galleryImages.slice(start, end);
  const items = [];

  for (const fileName of pageFiles) {
    const resolvedSrc = await resolveImagePath(fileName);
    if (resolvedSrc) {
      items.push({ fileName, src: resolvedSrc });
    }
  }

  imagePageCache.set(pageNumber, items);
  return items;
}

async function renderImageGallery() {
  const grid = document.getElementById("image-gallery-grid");
  const count = document.getElementById("image-gallery-count");

  if (!grid || !count) return;

  const totalPages = Math.ceil(galleryImages.length / imagePerPage);
  const start = (currentImagePage - 1) * imagePerPage;
  const end = start + imagePerPage;
  const pageItems = await getImagePageItems(currentImagePage);

  currentImageItems = pageItems;
  grid.innerHTML = "";
  pageItems.forEach((item, index) => {
    grid.appendChild(createImageCard(item, start + index));
  });

  count.textContent = `Showing ${start + 1}-${Math.min(end, galleryImages.length)} of ${galleryImages.length} images`;
  renderImagePagination(totalPages);
  loadVisibleMedia();
}

function renderVideoGallery() {
  const grid = document.getElementById("video-gallery-grid");
  const count = document.getElementById("video-gallery-count");
  const totalPages = Math.ceil(galleryVideos.length / videoPerPage);

  if (!grid || !count) return;

  const start = (currentVideoPage - 1) * videoPerPage;
  const end = start + videoPerPage;
  const pageItems = galleryVideos.slice(start, end);

  grid.innerHTML = "";
  pageItems.forEach((item, index) => {
    grid.appendChild(createVideoCard(item, start + index));
  });

  count.textContent = `Showing ${start + 1}-${Math.min(end, galleryVideos.length)} of ${galleryVideos.length} videos`;
  renderVideoPagination(totalPages);
  loadVisibleMedia();
}

function openLightbox(type, index) {
  activeLightboxType = type;
  activeLightboxIndex = index;
  const overlay = document.getElementById("gallery-lightbox");
  const media = document.getElementById("gallery-lightbox-media");
  const title = document.getElementById("gallery-lightbox-title");

  if (!overlay || !media || !title) return;

  media.innerHTML = "";

  if (type === "video") {
    const item = galleryVideos[index];
    if (!item) return;

    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.poster = item.poster;

    const source = document.createElement("source");
    source.src = item.src;
    source.type = "video/mp4";
    video.appendChild(source);
    media.appendChild(video);
    title.textContent = item.title;
  } else {
    const item = currentImageItems[index];
    if (!item) return;

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.fileName
      .replace(/\.(jpe?g|png|webp)$/i, "")
      .replace(/_/g, " ");
    media.appendChild(img);
    title.textContent = img.alt;
  }

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const overlay = document.getElementById("gallery-lightbox");
  const media = document.getElementById("gallery-lightbox-media");

  if (!overlay || !media) return;

  const activeVideo = media.querySelector("video");
  if (activeVideo) {
    activeVideo.pause();
    activeVideo.currentTime = 0;
  }

  media.innerHTML = "";
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

function changeLightbox(step) {
  const nextIndex = activeLightboxIndex + step;
  const totalItems =
    activeLightboxType === "video"
      ? galleryVideos.length
      : currentImageItems.length;
  if (nextIndex < 0 || nextIndex >= totalItems) return;
  openLightbox(activeLightboxType, nextIndex);
}

function addLightboxEvents() {
  const overlay = document.getElementById("gallery-lightbox");
  const closeButton = document.getElementById("gallery-lightbox-close");
  const prevButton = document.getElementById("gallery-lightbox-prev");
  const nextButton = document.getElementById("gallery-lightbox-next");

  if (!overlay || !closeButton || !prevButton || !nextButton) return;

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => changeLightbox(-1));
  nextButton.addEventListener("click", () => changeLightbox(1));

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") changeLightbox(-1);
    if (event.key === "ArrowRight") changeLightbox(1);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderImageGallery();
  renderVideoGallery();
  addLightboxEvents();
});
