const fs = require('fs');
const path = require('path');

// Define paths
const baseDir = path.join(__dirname, 'albums');
const outputFilePath = path.join(__dirname, 'script.js');

// Function to generate the characters array
function generateCharactersArray(dir = baseDir) {
    const characters = [];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    fs.readdirSync(dir).forEach(item => {
        const itemPath = path.join(dir, item);

        if (fs.statSync(itemPath).isDirectory()) {
            characters.push(...generateCharactersArray(itemPath)); // Recurse into subdirectories
        } else {
            if (item.toLowerCase().startsWith('thumb') && /\.(jpg|jpeg|png|gif)$/i.test(item)) {
                const characterName = path.basename(path.dirname(itemPath));
                const thumbPath = path.relative(__dirname, itemPath).replace(/\\/g, '/');

                characters.push({
                    name: characterName,
                    path: thumbPath,
                    page: `${characterName.toLowerCase().replace(/ /g, '_')}.html`
                });
            }
        }
    });

    return characters;
}

// Function to write the generated characters array to script.js
function writeCharactersArrayToFile() {
    const charactersArray = generateCharactersArray();

    const scriptContent = `
document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById("content");

    const characters = ${JSON.stringify(charactersArray, null, 4)};

    characters.forEach(character => {
        const container = document.createElement("div");
        container.className = "button-container";

        const button = document.createElement("button");
        button.style.backgroundImage = \`url('\${character.path}')\`;

        const span = document.createElement("span");
        span.innerText = character.name;

        button.appendChild(span);
        container.appendChild(button);
        contentDiv.appendChild(container);

        button.addEventListener('click', function() {
            window.open(character.page, '_blank');
        });
    });
});
`;

    fs.writeFileSync(outputFilePath, scriptContent, 'utf8');
    console.log(`Characters array written to ${outputFilePath}`);
}

writeCharactersArrayToFile();
