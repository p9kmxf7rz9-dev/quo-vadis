const folders = {
    igrejas: {
        title: 'Igrejas',
        path: 'igrejas',
        files: ['IMG_0118.jpg', 'IMG_0119.jpg', 'IMG_0121.jpg', 'IMG_0138.jpg', 'IMG_0146.jpg', 'IMG_0258.jpg', 'IMG_0265.jpg', 'IMG_0327.jpg', 'IMG_1464.jpg', 'IMG_1467.jpg', 'IMG_2060.jpg', 'IMG_2299.heic', 'IMG_2951.heic', 'IMG_3118.jpg', 'IMG_3426.jpg', 'IMG_3814.jpg', 'IMG_3834.jpg', 'IMG_4533.jpg', 'IMG_4742.jpg', 'IMG_4785.jpg', 'IMG_5541.jpg', 'IMG_5648.jpg', 'IMG_9539.jpg']
    },
    jesus: {
        title: 'Jesus',
        path: 'jesus',
        files: ['IMG_0122.jpg', 'IMG_0144.jpg', 'IMG_0321.jpg', 'IMG_2819.heic', 'IMG_5585.jpg']
    },
    'nossa-senhora': {
        title: 'Nossa Senhora',
        path: 'nossa-senhora',
        files: ['IMG_0125.jpg', 'IMG_0148.jpg', 'IMG_0765.jpg', 'IMG_4163.jpg', 'IMG_5597.jpg', 'IMG_9127.jpg']
    },
    'santissimo-sacramento': {
        title: 'Santíssimo Sacramento',
        path: 'santissimo-sacramento',
        files: ['IMG_0384.jpg', 'IMG_3978.heic', 'IMG_4439.jpg', 'IMG_4531.jpg', 'IMG_4670.jpg', 'IMG_5722.jpg']
    },
    santos: {
        title: 'Santos',
        path: 'santos',
        files: ['IMG_0030.jpg', 'IMG_0126.jpg', 'IMG_0263.jpg', 'IMG_1468.jpg', 'IMG_5598.jpg', 'IMG_5671.jpg', 'IMG_5673.jpg']
    },
    outros: {
        title: 'Outras fotografias',
        path: 'outros',
        files: ['IMG_0128.jpg', 'IMG_0680.jpg']
    }
};

const folderKey = new URLSearchParams(window.location.search).get('folder');
const folder = folders[folderKey];
const galleryTitle = document.querySelector('#gallery-title');
const galleryCount = document.querySelector('#gallery-count');
const galleryGrid = document.querySelector('#gallery-grid');
const galleryNote = document.querySelector('#gallery-note');
const galleryEmpty = document.querySelector('#gallery-empty');
const photoViewer = document.querySelector('#photo-viewer');
const viewerImage = document.querySelector('#viewer-image');
const viewerCaption = document.querySelector('#viewer-caption');

if (folder) {
    const previewableFiles = folder.files.filter(fileName => !fileName.toLowerCase().endsWith('.heic'));
    const unsupportedFiles = folder.files.length - previewableFiles.length;
    document.title = `${folder.title} | Acervo`;
    galleryTitle.textContent = folder.title;
    galleryCount.textContent = `${previewableFiles.length} ${previewableFiles.length === 1 ? 'fotografia' : 'fotografias'}`;

    if (unsupportedFiles > 0) {
        galleryNote.hidden = false;
        galleryNote.textContent = `${unsupportedFiles} arquivo(s) HEIC não podem ser pré-visualizados neste navegador. Converta-os para JPG para incluí-los na galeria.`;
    }

    previewableFiles.forEach((fileName, index) => {
        const imagePath = `../assets/images/gallery/${folder.path}/${fileName}`;
        const item = document.createElement('button');
        item.className = 'gallery-item';
        item.type = 'button';
        item.innerHTML = `<img src="${imagePath}" alt="${folder.title}, fotografia ${index + 1}" loading="lazy"><span>${String(index + 1).padStart(2, '0')}</span>`;
        item.addEventListener('click', () => {
            viewerImage.src = imagePath;
            viewerImage.alt = `${folder.title}, fotografia ${index + 1}`;
            viewerCaption.textContent = fileName;
            photoViewer.showModal();
        });
        galleryGrid.append(item);
    });
} else {
    galleryTitle.textContent = 'Pasta não encontrada';
    galleryEmpty.hidden = false;
}

document.querySelector('#viewer-close').addEventListener('click', () => photoViewer.close());
photoViewer.addEventListener('click', event => {
    if (event.target === photoViewer) photoViewer.close();
});