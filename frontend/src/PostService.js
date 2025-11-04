import axios from 'axios';
const API_URL = 'http://localhost:8000';

// Настройка axios для работы с CSRF
axios.defaults.withCredentials = true;

// Получаем CSRF токен при инициализации
let csrfToken = null;

const getCsrfToken = async () => {
    if (!csrfToken) {
        try {
            const response = await axios.get(`${API_URL}/api/csrf-token/`);
            csrfToken = response.data.csrfToken;
            // Устанавливаем токен в заголовок по умолчанию
            axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    }
    return csrfToken;
};

// Получаем токен при загрузке модуля
getCsrfToken();

export default class PostService {
    constructor() {
        // Обновляем токен при создании экземпляра
        getCsrfToken();
    }

    getPosts(){
        const url = `${API_URL}/api/posts/`;;
        return axios.get(url).then(response => response.data);
    }

    setLikePost(id) {
        const url = `${API_URL}/api/like_post/${id}/`;
        return axios.get(url).then(response => response.data);
    }

    setDislikePost(id) {
        const url = `${API_URL}/api/dislike_post/${id}/`;
        return axios.get(url).then(response => response.data);
    }

    createPost(text) {
        const url = `${API_URL}/api/posts/`;
        return axios.post(url, text);
    }

    deletePost(id) {
        const url = `${API_URL}/api/posts/${id}/`;
        return axios.delete(url).then(response => response.data);
    }

    updatePost(id, text) {
        const url = `${API_URL}/api/posts/${id}/update/`;
        return axios.put(url, { text: text }).then(response => response.data);
    }
}