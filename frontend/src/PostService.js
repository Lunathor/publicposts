import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class PostService {
    constructor() {}

    getPosts(){
        const url = `${API_URL}/api/posts/`;;
        return axios.get(url).then(response => response.data);
    }

    setLikePost(id) {
        const url = `${API_URL}/api/like_post/` + id;
        return axios.get(url).then(response => response.data);
    }

    createPost(text) {
        const url = `${API_URL}/api/posts/`;
        return axios.post(url, text);
    }
}