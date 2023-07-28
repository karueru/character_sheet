const APIKey = '56e91d6353434b87af0026a146697fc9';

function uploadImage(callback, ...args) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (ev) => imgbbUpload(ev, callback, ...args);
    fileInput.click();
}

function imgbbUpload(event, callback, ...args) {
    const file = event.target.files[0];

    if (!file) {
        alert('Please select an image to upload.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const url = `https://api.imgbb.com/1/upload?key=${APIKey}`;

    fetch(url, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.url) {
                const imageUrl = data.data.url;
                callback(imageUrl, ...args);
            }
            else {
                window.alert('Image upload failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error occurred:', error);
            window.alert('Image upload failed. Please try again.');
        });
}

function uploadImageToCharacterUrlList(url) {
    const urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search));

    sendPOSTRequest("character/upload_image", { ...urlParams, 'url': url })
        .then(responseData => {
            if (responseData) {
                window.location.reload();
            }
            else {
                console.warn('Failed to get a valid response from image API.');
            }
        })
        .catch(error => {
            console.error('Error while processing the request:', error);
        });
}

function uploadItemImageUrl(url, id) {
    updateItemData(id, { 'image': url }, {})
    window.location.reload();
}