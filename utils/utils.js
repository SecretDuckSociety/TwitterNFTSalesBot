import axios from 'axios';

export async function fetchImageUri(uri) {
    return await axios.get(uri).then(response => response.data.image)
}

export async function getBase64(url) {
    return axios.get(url, { responseType: 'arraybuffer'}).then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

export async function sleep(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}
