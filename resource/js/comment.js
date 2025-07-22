// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 게시글 ID 가져오기
    const boardId = document.getElementById('boardId')?.value;
    
    if (boardId) {
        // 댓글 목록 로드
        loadComments(boardId);
        
        // 댓글 작성 폼 이벤트 리스너 등록
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', handleCommentSubmit);
        }
    }
});

// 댓글 목록 로드 함수
function loadComments(boardId) {
    fetch(`/comment/list/${boardId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('댓글을 불러오는데 실패했습니다.');
            }
            return response.json();
        })
        .then(comments => {
            displayComments(comments);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('commentList').innerHTML = 
                `<div class="error-message">댓글을 불러오는데 문제가 발생했습니다: ${error.message}</div>`;
        });
}

// 댓글 목록 표시 함수
function displayComments(comments) {
    const commentListElement = document.getElementById('commentList');
    
    // 댓글이 없는 경우
    if (comments.length === 0) {
        commentListElement.innerHTML = '<div class="no-comments">등록된 댓글이 없습니다.</div>';
        return;
    }
    
    // 댓글 목록 HTML 생성
    let commentsHtml = '';
    
    comments.forEach(comment => {
        const createdDate = new Date(comment.createdAt).toLocaleString();
        const updatedDate = comment.updatedAt ? new Date(comment.updatedAt).toLocaleString() : null;
        const displayDate = updatedDate ? `${updatedDate} (수정됨)` : createdDate;
        
        commentsHtml += `
            <div class="comment-item" data-id="${comment.commentId}">
                <div class="comment-header">
                    <div class="comment-author">${comment.nickname}</div>
                    <div class="comment-date">${displayDate}</div>
                </div>
                <div class="comment-content">${comment.content}</div>
                
                ${comment.author ? `
                    <div class="comment-actions">
                        <button class="edit-comment-btn" onclick="showEditForm(${comment.commentId})">수정</button>
                        <button class="delete-comment-btn" onclick="deleteComment(${comment.commentId})">삭제</button>
                    </div>
                    <div class="comment-edit-form" id="editForm-${comment.commentId}">
                        <textarea id="editContent-${comment.commentId}">${comment.content}</textarea>
                        <div>
                            <button class="btn" onclick="updateComment(${comment.commentId})">저장</button>
                            <button class="btn btn-cancel" onclick="hideEditForm(${comment.commentId})">취소</button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    commentListElement.innerHTML = commentsHtml;
}

// CSRF 토큰 가져오기 함수
function getCsrfTokenHeaders() {
    const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (csrfToken && csrfHeader) {
        headers[csrfHeader] = csrfToken;
    }
    
    return headers;
}

// 댓글 작성 제출 처리
function handleCommentSubmit(event) {
    event.preventDefault();
    
    const boardId = document.getElementById('boardId').value;
    const content = document.getElementById('commentContent').value.trim();
    
    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }
    
    // 댓글 작성 API 호출
    fetch('/comment/write', {
        method: 'POST',
        headers: getCsrfTokenHeaders(),
        body: JSON.stringify({
            boardId: boardId,
            content: content
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('댓글 등록에 실패했습니다.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 댓글 작성 성공 시 폼 초기화 및 댓글 목록 새로고침
            document.getElementById('commentContent').value = '';
            loadComments(boardId);
        } else {
            alert(data.message || '댓글 등록에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('댓글 등록 중 오류가 발생했습니다.');
    });
}

// 댓글 수정 폼 표시
function showEditForm(commentId) {
    const editForm = document.getElementById(`editForm-${commentId}`);
    if (editForm) {
        editForm.style.display = 'block';
    }
}

// 댓글 수정 폼 숨기기
function hideEditForm(commentId) {
    const editForm = document.getElementById(`editForm-${commentId}`);
    if (editForm) {
        editForm.style.display = 'none';
    }
}

// 댓글 수정
function updateComment(commentId) {
    const content = document.getElementById(`editContent-${commentId}`).value.trim();
    const boardId = document.getElementById('boardId').value;
    
    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }
    
    // 댓글 수정 API 호출
    fetch(`/comment/update/${commentId}`, {
        method: 'PUT',
        headers: getCsrfTokenHeaders(),
        body: JSON.stringify({
            boardId: boardId,
            content: content
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('댓글 수정에 실패했습니다.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 댓글 수정 성공 시 폼 숨김 및 댓글 목록 새로고침
            hideEditForm(commentId);
            loadComments(boardId);
        } else {
            alert(data.message || '댓글 수정에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('댓글 수정 중 오류가 발생했습니다.');
    });
}

// 댓글 삭제
function deleteComment(commentId) {
    if (!confirm('정말로 댓글을 삭제하시겠습니까?')) {
        return;
    }
    
    const boardId = document.getElementById('boardId').value;
    
    // 댓글 삭제 API 호출
    fetch(`/comment/delete/${commentId}`, {
        method: 'DELETE',
        headers: getCsrfTokenHeaders()
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('댓글 삭제에 실패했습니다.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 댓글 삭제 성공 시 댓글 목록 새로고침
            loadComments(boardId);
        } else {
            alert(data.message || '댓글 삭제에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('댓글 삭제 중 오류가 발생했습니다.');
    });
}