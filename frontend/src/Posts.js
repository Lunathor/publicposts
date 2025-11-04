import React, {Component} from "react";
import PostService from "./PostService";
import './Posts.css';

const postService = new PostService();

export default class Posts extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data : [],
            inputValue: '',
            deletingId: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({inputValue: event.target.value});
    }

    handleSubmit(event) {
        if (this.state.inputValue.trim()) {
            postService.createPost({'text' : this.state.inputValue})
                .then(() => {
                    this.getData();
                    this.setState({inputValue : ''});
                })
                .catch(error => {
                    console.error('Error creating post:', error);
                });
        }
    }

    getData() {
        postService.getPosts().then(result => {
            this.setState({data: result.data})
        }).catch(error => {
            console.error('Error fetching posts:', error);
        });
    }

    componentDidMount() {
        this.getData()
    }

    setLike(post) {
        postService.setLikePost(post.id)
            .then(result => {
                post.likesCount = result.likesCount || post.likesCount + 1
                this.forceUpdate()
            })
            .catch(error => {
                console.error('Error setting like:', error)
            })
    }

    deletePost(postId) {
        if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
            this.setState({deletingId: postId});
            postService.deletePost(postId)
                .then(() => {
                    this.getData();
                    this.setState({deletingId: null});
                })
                .catch(error => {
                    console.error('Error deleting post:', error);
                    this.setState({deletingId: null});
                    alert('Ошибка при удалении поста');
                });
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    render() {
        return (
            <div className="posts-container">
                <div className="posts-header">
                    <h1>📝 Анонимный Твиттер</h1>
                    <p className="subtitle">Поделитесь своими мыслями</p>
                </div>
                
                <div className="create-post-section">
                    <div className="input-container">
                        <textarea 
                            className="post-input"
                            placeholder="Что у вас на уме?"
                            onChange={this.handleChange}
                            value={this.state.inputValue}
                            rows="3"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    this.handleSubmit();
                                }
                            }}
                        />
                        <button 
                            className="send-button"
                            onClick={this.handleSubmit}
                            disabled={!this.state.inputValue.trim()}
                        >
                            Отправить
                        </button>
                    </div>
                    <p className="hint">Нажмите Ctrl+Enter для отправки</p>
                </div>

                <div className="posts-list">
                    {this.state.data.length === 0 ? (
                        <div className="empty-state">
                            <p>Пока нет постов. Будьте первым!</p>
                        </div>
                    ) : (
                        this.state.data.map(post =>
                            <div 
                                key={post.id}
                                className={`post-card ${this.state.deletingId === post.id ? 'deleting' : ''}`}
                                id={`post_${post.id}`}
                            >
                                <div className="post-content">
                                    <p className="post-text">{post.text}</p>
                                </div>
                                
                                <div className="post-footer">
                                    <div className="post-meta">
                                        <span className="post-date">
                                            📅 {this.formatDate(post.date)}
                                        </span>
                                    </div>
                                    
                                    <div className="post-actions">
                                        <button 
                                            className="like-button"
                                            onClick={() => this.setLike(post)}
                                            title="Лайкнуть"
                                        >
                                            ❤️ {post.likesCount}
                                        </button>
                                        <button 
                                            className="delete-button"
                                            onClick={() => this.deletePost(post.id)}
                                            disabled={this.state.deletingId === post.id}
                                            title="Удалить пост"
                                        >
                                            {this.state.deletingId === post.id ? '⏳' : '🗑️'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        )
    }
}