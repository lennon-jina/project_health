// board-interaction.js

document.addEventListener('DOMContentLoaded', function() {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    
    // 좋아요 버튼 처리
    const likeButton = document.querySelector('.btn-like');
    if (likeButton) {
        likeButton.addEventListener('click', function() {
            const boardId = this.getAttribute('data-id');
            
            fetch(`/board/like/${boardId}`, {
                method: 'POST',
                headers: {
                    [csrfHeader]: csrfToken
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 좋아요 상태에 따라 버튼 클래스 토글
                    if (data.liked) {
                        this.classList.add('active');
                    } else {
                        this.classList.remove('active');
                    }
                    
                    // 좋아요 수 업데이트
                    const likeCountElement = document.querySelector('.board-info span:nth-child(4)');
                    if (likeCountElement) {
                        likeCountElement.textContent = `좋아요: ${data.likeCount}`;
                    }
                } else {
                    alert(data.message || '좋아요 처리 중 오류가 발생했습니다.');
                }
            })
            .catch(error => {
                console.error('좋아요 처리 중 오류:', error);
                alert('좋아요 처리 중 오류가 발생했습니다.');
            });
        });
    }
    
    // 북마크 버튼 처리
    const bookmarkButton = document.querySelector('.btn-bookmark');
    if (bookmarkButton) {
        bookmarkButton.addEventListener('click', function() {
            const boardId = this.getAttribute('data-id');
            
            fetch(`/board/bookmark/${boardId}`, {
                method: 'POST',
                headers: {
                    [csrfHeader]: csrfToken
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 북마크 상태에 따라 버튼 클래스 토글
                    if (data.bookmarked) {
                        this.classList.add('active');
                    } else {
                        this.classList.remove('active');
                    }
                } else {
                    alert(data.message || '북마크 처리 중 오류가 발생했습니다.');
                }
            })
            .catch(error => {
                console.error('북마크 처리 중 오류:', error);
                alert('북마크 처리 중 오류가 발생했습니다.');
            });
        });
    }
});