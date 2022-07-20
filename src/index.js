import { PixabayApi } from './findPicture';
import { createMarkup } from './createMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const gallaryEl = document.querySelector('.gallery');
const btnLoadEl = document.querySelector('.load-more');
let lightbox;
const pixabayApi = new PixabayApi();

formEl.addEventListener('submit', onFormSubmit);
btnLoadEl.addEventListener('click', onBtnLoadClick);

function onFormSubmit(event) {
  event.preventDefault();
  gallaryEl.innerHTML = '';

  if (event.currentTarget.elements['searchQuery'].value.trim() === '') {
    Notify.warning('Відсутня інформація для пошуку');
    gallaryEl.innerHTML = '';
    btnLoadEl.classList.add('is-hidden');
    return;
  }

  pixabayApi.q = event.currentTarget.elements['searchQuery'].value;
  pixabayApi.page = 1;

  pixabayApi
    .findPicture()
    .then(response => {
      console.log(response.data.hits);
      if (response.data.total === 0) {
        Notify.failure(
          'На жаль, немає зображень, які відповідають Вашому пошуковому запиту. Будь ласка, спробуйте ще раз!'
        );
        btnLoadEl.classList.add('is-hidden');
        gallaryEl.innerHTML = '';
        event.target.reset();
        return;
      }

      Notify.success(
        `Вааауу! Ми знайшли ${response.data.totalHits} зображень відповідно до  Вашого пошукового запиту!!!`
      );
      const pictutesMarkup = createMarkup(response.data.hits);
      gallaryEl.insertAdjacentHTML('beforeend', pictutesMarkup);

      lightbox = new SimpleLightbox('.gallery a');
      if (response.data.hits.length < pixabayApi.per_page) {
        btnLoadEl.classList.add('is-hidden');
        return;
      }
      btnLoadEl.classList.remove('is-hidden');
    })
    .catch(err => console.log(err));
}

function onBtnLoadClick() {
  pixabayApi.page += 1;
  pixabayApi
    .findPicture()
    .then(response => {
      if (response.data.hits.length !== pixabayApi.per_page) {
        btnLoadEl.classList.add('is-hidden');
      }

      const pictutesMarkup = createMarkup(response.data.hits);
      gallaryEl.insertAdjacentHTML('beforeend', pictutesMarkup);
      lightbox.refresh();
    })
    .catch(err => console.log(err));
}

const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});
