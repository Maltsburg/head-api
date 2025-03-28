import { addDownloadButton } from './download.js';

document.addEventListener('DOMContentLoaded', () => {
    const getPlayerHeadBtn = document.getElementById('getPlayerHeadBtn');
    getPlayerHeadBtn.addEventListener('click', () => {
        getHead();
    });
});

async function getHead() {
    const username = document.getElementById('username').value;
    const edition = document.getElementById('edition').value;
    const resultDiv = document.getElementById('result');
    const nameDiv = document.getElementById('name');
    const downloadDiv = document.getElementById('download');

    nameDiv.innerHTML = '';
    resultDiv.innerHTML = '';
    downloadDiv.innerHTML = '';

    try {
        if (!username) {
            resultDiv.innerHTML = 'Please enter a username.';
            return;
        }

        const name = edition === 'bedrock' ? `.${username}` : username;
        const imageUrl = `../head/${name}/128`;
        
        displayHeadImage(imageUrl, resultDiv, nameDiv, username);
        addDownloadButton(downloadDiv, username);

    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = error.message;
    }

    document.getElementById("username").value = "";
}

function displayHeadImage(imageUrl, resultDiv, nameDiv, username) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = username;

    resultDiv.appendChild(img);


    img.onload = function() {
        nameDiv.innerHTML = username;

        addDownloadButton(resultDiv, username);
    };
}
