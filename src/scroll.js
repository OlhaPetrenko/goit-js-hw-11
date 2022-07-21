import { PixabayApi } from './findPicture';
import { createMarkup } from './createMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const gallaryEl = document.querySelector('.gallery');
const helperEl = document.querySelector('.helper');
const lightbox = new SimpleLightbox('.gallery a');
const pixabayApi = new PixabayApi();

formEl.addEventListener('submit', onFormSubmit);

const observer = new IntersectionObserver(infScroll, {
  root: null,
  rootMargin: '500px',
  threshold: 0,
});

function infScroll(entries, observer) {
  if (entries[0].isIntersecting) {
    loadMoreData();
  }
}

async function onFormSubmit(event) {
  event.preventDefault();
  gallaryEl.innerHTML = '';

  if (event.currentTarget.elements['searchQuery'].value.trim() === '') {
    Notify.warning('Відсутня інформація для пошуку');
    return;
  }

  pixabayApi.q = event.currentTarget.elements['searchQuery'].value;
  pixabayApi.page = 1;

  const response = await pixabayApi.findPicture();

  try {
    if (response.data.total === 0) {
      Notify.failure(
        'На жаль, немає зображень, які відповідають Вашому пошуковому запиту. Будь ласка, спробуйте ще раз!'
      );
      event.target.reset();
      return;
    }

    Notify.success(
      `Вааауу! Ми знайшли ${response.data.totalHits} зображень відповідно до  Вашого пошукового запиту!!!`
    );
    const pictutesMarkup = createMarkup(response.data.hits);
    gallaryEl.insertAdjacentHTML('beforeend', pictutesMarkup);

    observer.observe(helperEl);
  } catch (error) {
    console.log(error);
  }
}

async function loadMoreData() {
  pixabayApi.page += 1;

  const response = await pixabayApi.findPicture();
  try {
    const pictutesMarkup = createMarkup(response.data.hits);
    gallaryEl.insertAdjacentHTML('beforeend', pictutesMarkup);
    lightbox.refresh();
    scroll();
  } catch (error) {
    console.log(error);
  }
}

function scroll() {
  const { height: cardHeight } =
    gallaryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
