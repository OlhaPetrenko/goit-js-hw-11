import axios from 'axios';

export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28740623-faa9572de77969117d7ae64be';
  constructor() {
    this.page = 1;
    this.q = null;
    this.per_page = 30;
  }

  findPicture() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        q: this.q,
        page: this.page,
        per_page: this.per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        key: this.#API_KEY,
      },
    });
  }
}
