export function addDownloadButton(resultDiv, username) {

    const existingDownloadBtn = document.getElementById('downloadButton');
    if (existingDownloadBtn) {
        existingDownloadBtn.parentNode.removeChild(existingDownloadBtn);
    }

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.id = 'downloadButton';
    downloadBtn.classList.add('download');
    downloadBtn.addEventListener('click', () => {
        const img = resultDiv.querySelector('img');
        if (img) {
            const imageUrl = img.src;
            downloadImage(imageUrl, `${username}.png`);
        } else {
            console.error('Image not found in resultDiv.');
        }
    });

    const downloadDiv = document.getElementById('download');
    downloadDiv.appendChild(downloadBtn);

    downloadBtn.style.display = 'inline-block';
}

export function downloadImage(imageUrl, filename) {
    fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
    .catch(error => console.error('Error downloading image:', error));
}

