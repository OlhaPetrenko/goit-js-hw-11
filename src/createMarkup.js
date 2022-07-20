export function createMarkup(pictures) {
  return pictures
    .map(picture => {
      return `<div class="photo-card">
      
    <a class='gallery__link' href="${picture.largeImageURL}" >
        <img class="gallery__image" src="${picture.webformatURL}" alt="${picture.tags}" width='380' height="260"
        loading="lazy" />
     </a>

  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${picture.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${picture.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${picture.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${picture.downloads}
    </p>
   
  </div>
  
</div>`;
    })
    .join('');
}
