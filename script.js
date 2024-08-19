
document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById("content");

    const characters = [
    {
        "name": "MidNight",
        "path": "albums/Anime/MHA/MidNight/thumb.jpeg",
        "page": "midnight.html"
    },
    {
        "name": "Mina ashido",
        "path": "albums/Anime/MHA/Mina ashido/thumb.jpeg",
        "page": "mina_ashido.html"
    },
    {
        "name": "Momo Yaoyorozu",
        "path": "albums/Anime/MHA/Momo Yaoyorozu/thumb.jpeg",
        "page": "momo_yaoyorozu.html"
    },
    {
        "name": "Mt.Lady",
        "path": "albums/Anime/MHA/Mt.Lady/thumb.jpeg",
        "page": "mt.lady.html"
    },
    {
        "name": "Nejire Hado",
        "path": "albums/Anime/MHA/Nejire Hado/thumb.gif",
        "page": "nejire_hado.html"
    }
];

    characters.forEach(character => {
        const container = document.createElement("div");
        container.className = "button-container";

        const button = document.createElement("button");
        button.style.backgroundImage = `url('${character.path}')`;

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
