export default function decorate(block) {
  const firstDiv = block.querySelector(':scope > div:first-child');
  const videoLink = firstDiv?.querySelector('a[href*=".mp4"], a[href*=".webm"], a[href*="video"]');
  const videoParagraph = firstDiv?.querySelector('p');

  // Check if there's a link to a video
  if (videoLink) {
    const videoUrl = videoLink.href;
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;

    firstDiv.innerHTML = '';
    firstDiv.appendChild(video);
  } else if (videoParagraph) {
    // Check if paragraph contains a video URL
    const text = videoParagraph.textContent.trim();
    if (text.match(/\.(mp4|webm|mov)$/i) || text.includes('video')) {
      const video = document.createElement('video');
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');
      video.innerHTML = `<source src="${text}" type="video/mp4">`;

      firstDiv.innerHTML = '';
      firstDiv.appendChild(video);
    }
  } else if (!firstDiv?.querySelector('picture')) {
    block.classList.add('no-image');
  }
}
