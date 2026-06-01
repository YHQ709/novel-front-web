import request from '../utils/request'

export function getImgVerifyCode() {
    return request.get('/front/resource/img_verify_code');
}

export function uploadImg (file) {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/front/resource/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}