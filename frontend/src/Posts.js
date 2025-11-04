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
            deletingId: null,
            editingId: null,
            editValue: ''
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

    setDislike(post) {
        postService.setDislikePost(post.id)
        .then(result => {
            post.dislikesCount = result.dislikesCount || post.dislikesCount + 1
            this.forceUpdate()
        })
        .catch(error => {
            console.error('Error setting dislike:', error)
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

    startEdit(post) {
        this.setState({
            editingId: post.id,
            editValue: post.text
        });
    }

    cancelEdit() {
        this.setState({
            editingId: null,
            editValue: ''
        });
    }

    handleEditChange(event) {
        this.setState({editValue: event.target.value});
    }

    saveEdit(postId) {
        if (this.state.editValue.trim()) {
            postService.updatePost(postId, this.state.editValue)
                .then(() => {
                    this.getData();
                    this.setState({
                        editingId: null,
                        editValue: ''
                    });
                })
                .catch(error => {
                    console.error('Error updating post:', error);
                    alert('Ошибка при обновлении поста');
                });
        } else {
            alert('Текст поста не может быть пустым');
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
                                className={`post-card ${this.state.deletingId === post.id ? 'deleting' : ''} ${this.state.editingId === post.id ? 'editing' : ''}`}
                                id={`post_${post.id}`}
                            >
                                <div className="post-content">
                                    {this.state.editingId === post.id ? (
                                        <div className="edit-container">
                                            <textarea 
                                                className="edit-input"
                                                value={this.state.editValue}
                                                onChange={(e) => this.handleEditChange(e)}
                                                rows="3"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && e.ctrlKey) {
                                                        this.saveEdit(post.id);
                                                    }
                                                    if (e.key === 'Escape') {
                                                        this.cancelEdit();
                                                    }
                                                }}
                                            />
                                            <div className="edit-actions">
                                                <button 
                                                    className="save-button"
                                                    onClick={() => this.saveEdit(post.id)}
                                                    title="Сохранить (Ctrl+Enter)"
                                                >
                                                    ✓ Сохранить
                                                </button>
                                                <button 
                                                    className="cancel-button"
                                                    onClick={() => this.cancelEdit()}
                                                    title="Отменить (Esc)"
                                                >
                                                    ✕ Отменить
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="post-text">{post.text}</p>
                                    )}
                                </div>
                                
                                {this.state.editingId !== post.id && (
                                    <div className="post-footer">
                                        <div className="post-meta">
                                            <span className="post-date">
                                                {this.formatDate(post.date)}
                                            </span>
                                        </div>
                                        
                                        <div className="post-actions">
                                            <button 
                                                className="like-button"
                                                onClick={() => this.setLike(post)}
                                                title="Лайкнуть"
                                            >
                                                ❤️ {post.likesCount || 0}
                                            </button>
                                            <button 
                                                className="dislike-button"
                                                onClick={() => this.setDislike(post)}
                                                title="Дизлайкнуть"
                                            >
                                                💔 {post.dislikesCount || 0}
                                            </button>
                                            <button 
                                                className="edit-button"
                                                onClick={() => this.startEdit(post)}
                                                title="Редактировать пост"
                                            >
                                                ✏️
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
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        )
    }
}