const fs = require('fs');
const path = require('path');

// Define paths
const baseDir = path.join(__dirname, 'albums');
const outputDir = __dirname; // Output HTML files in the root directory

// Template for the character page
function generateCharacterPage(characterName, imagePaths) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${characterName}</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .character-images {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }
        .character-images img {
            max-width: 300px;
            max-height: 300px;
            object-fit: contain;
            cursor: pointer;
            border: none;
            border-radius: 10px;
            transition: transform 0.2s ease;
        }
        .character-images img:hover {
            transform: scale(1.05);
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            justify-content: center;
            align-items: center;
        }
        .modal img {
            max-width: 90%;
            max-height: 90%;
        }
        .modal .close {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 40px;
            color: white;
            cursor: pointer;
        }
        .modal .arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 60px;
            color: white;
            cursor: pointer;
            user-select: none;
        }
        .modal .arrow.left {
            left: 20px;
        }
        .modal .arrow.right {
            right: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <label>${characterName}</label>
    </div>

    <div class="content character-images">
        ${imagePaths.map((img, index) => `<img src="${img}" alt="${characterName} image" data-index="${index}">`).join('\n')}
    </div>

    <div id="imageModal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="modalImage">
        <div class="arrow left" id="prev">&#10094;</div>
        <div class="arrow right" id="next">&#10095;</div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('.character-images img');
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const closeBtn = document.querySelector('.close');
            const prevBtn = document.getElementById('prev');
            const nextBtn = document.getElementById('next');
            let currentIndex = 0;

            function openModal(index) {
                currentIndex = index;
                modal.style.display = 'flex';
                modalImg.src = images[currentIndex].src;
            }

            function closeModal() {
                modal.style.display = 'none';
            }

            function showPrev() {
                currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
                modalImg.src = images[currentIndex].src;
            }

            function showNext() {
                currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
                modalImg.src = images[currentIndex].src;
            }

            images.forEach((img, index) => {
                img.addEventListener('click', () => openModal(index));
            });

            closeBtn.addEventListener('click', closeModal);
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);

            window.addEventListener('keydown', (e) => {
                if (modal.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') showPrev();
                    if (e.key === 'ArrowRight') showNext();
                    if (e.key === 'Escape') closeModal();
                }
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        });
    </script>
</body>
</html>
    `;
}

// Function to recursively find all character folders and generate HTML files
function generateCharacterFiles(dir = baseDir) {
    fs.readdirSync(dir).forEach(item => {
        const itemPath = path.join(dir, item);

        if (fs.statSync(itemPath).isDirectory()) {
            generateCharacterFiles(itemPath); // Recurse into subdirectories
        } else {
            if (item.toLowerCase().startsWith('thumb') && /\.(jpg|jpeg|png|gif|webp)$/i.test(item)) {
                const characterName = path.basename(path.dirname(itemPath));
                const characterDir = path.dirname(itemPath);
                const images = fs.readdirSync(characterDir)
                    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
                    .map(file => path.join(characterDir, file).replace(__dirname + '/', '').replace(/\\/g, '/'));

                const characterPage = generateCharacterPage(characterName, images);
                const outputFilePath = path.join(outputDir, `${characterName.toLowerCase().replace(/ /g, '_')}.html`);

                fs.writeFileSync(outputFilePath, characterPage, 'utf8');
                console.log(`Generated ${outputFilePath}`);
            }
        }
    });
}

generateCharacterFiles();
