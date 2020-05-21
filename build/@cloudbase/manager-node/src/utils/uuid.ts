// 环境 uuid
export function guid6() {
    return Math.floor((1 + Math.random()) * 0x1000000)
        .toString(16)
        .substring(1)
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
