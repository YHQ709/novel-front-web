import request from '../utils/request'

export function register(params) {
    return request.post('/front/user/register', params);
}

export function login(params) {
    return request.post('/front/user/login', params);
}

export function submitFeedBack(params) {
    return request.post('/front/user/feedback', params);
}

export function comment(params) {
    return request.post('/front/user/comment',params);
}

export function deleteComment(id) {
    return request.delete(`/front/user/comment/${id}`);
}

export function updateComment(id,content) {
    return request.putForm(`/front/user/comment/${id}`,content);
}

export function getUserinfo() {
    return request.get('/front/user');
}

export function updateUserInfo(userInfo) {
    return request.put('/front/user',userInfo);
}

export function listComments(params) {
    return request.get('/front/user/comments', { params });
}

export function listBookshelf(params) {
    return request.get('/front/user/bookshelf', { params });
}

export function addBookshelf (data) {
    return request.post('/front/user/bookshelf', data)
}

export function removeBookshelf (bookId) {
    return request.delete(`/front/user/bookshelf/${bookId}`)
}

// 查询书架状态 0-不在书架 1-在书架
export function getBookshelfStatus (params) {
    return request.get('/front/user/bookshelf_status', { params })
}

export function setPassword (data) {
    return request.post('/front/user/password', data)
}

export function listFeedbacks(params) {
    return request.get('/front/user/feedbacks', { params });
}

export function deleteFeedback(id) {
    return request.delete(`/front/user/feedback/${id}`);
}

export function commentReply(params) {
    return request.post('/front/user/comment/reply',params);
}

// 添加或更新阅读历史
export function addReadHistory (data) {
    return request.post('/front/user/addReadHistory', data)
}

export function listPayLogs(params) {
    return request.get('/front/user/payLogs', { params });
}

export function listConsumeLogs(params) {
    return request.get('/front/user/consumeLogs', { params });
}