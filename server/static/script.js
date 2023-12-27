const BASE_URL = "http://127.0.0.1:5000"

// TODO: Fetch from a file instead?
const DEFAULT_CONTENT = `
    <div class="centered-container">
        <img src="/static/matrix-room-qr-code.jpeg" alt="QR Code" class="qr-code">
        <div class="text">Join #beerroom:datanauten.de.<br/>Get Beer!</div>
    </div>
`;

const FAIL_CONTENT = `
    <div class="container">
        <div class="text">Incorrect!</div>
    </div>
`;

const SUCCESS_CONTENT = `
    <div class="container">
        <div class="text">Success!<br/><br/>Enjoy beer!</div>
    </div>
`;

async function queryForGrid() {
    const emoji = await getEmoji();
    if (emoji === undefined) {
        // Bail out if no emoji has been picked.
        return;
    }

    // An emoji has been picked!
    // Show a grid of emoji, with one cell being the chosen emoji, and the rest
    // being random ones.
    showGrid(emoji);
}

// Query for an emoji to pick.
// If one is available, it will be returned. Otherwise return `undefined`.
async function getEmoji() {
    try {
        const response = await fetch(BASE_URL + '/getEmoji');
        if (!response.ok) {
            throw new Error(`Error calling /getEmoji! Status: ${response.status}`);
        }

        // Parse the response.
        const data = await response.json();
        if (!data.emoji) {
            // There is no emoji to get currently.
            return undefined;
        }

        // Return the selected emoji!
        return data.emoji;
    } catch (error) {
        console.error('There was a problem with requesting GET /getEmoji:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Show the initial content.
    const grid = document.getElementById('mainContent');
    grid.innerHTML = DEFAULT_CONTENT;

    // Poll an endpoint every one second to see if an emoji has been selected.
    // If so, show the grid.
    setInterval(queryForGrid, 1000);
});

function showGrid(selectedEmoji) {
    // TODO: Use a wider range of emoji
    const emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
        '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚',
        '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫',
        '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
        '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢',
        '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎',
        '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺',
        '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
        '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
        '👿', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹'
        // ... add more emojis as needed
    ];
    const mainContent = document.getElementById('mainContent');

    const grid = document.createElement("div");
    grid.className = "grid";

    // Add the grid to the mainContent.
    mainContent.innerHTML = '';
    mainContent.appendChild(grid);

    // Determine where to place the correct emoji.
    const correctEmojiIndex = Math.floor(Math.random() * 9);

    // Create the cells of the grid.
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');

        if (i === correctEmojiIndex) {
            // Place the correct emoji.
            cell.textContent = selectedEmoji;

            // Pour beer when tapped.
            cell.addEventListener('click', function () {
                pourBeer();
            });
        } else {
            // Place a random emoji.
            cell.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            // Show an error when tapped.
            cell.addEventListener('click', function () {
                showError();
            });
        }

        grid.appendChild(cell);
    }
}

function showHome() {
    const grid = document.getElementById('mainContent');
    grid.innerHTML = DEFAULT_CONTENT;
}

async function pourBeer() {
    try {
        const response = await fetch(BASE_URL + '/pour', { "method": "POST" });
        if (!response.ok) {
            throw new Error(`Error calling /pour! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('There was a problem with requesting /pour:', error);
    }

    // Show the success page.
    const grid = document.getElementById('mainContent');
    grid.innerHTML = SUCCESS_CONTENT;

    // Reset back to the home screen after one second.
    setTimeout(() => {
        showHome();
    }, 3000);
}

function showError() {
    // Show the failure page.
    const grid = document.getElementById('mainContent');
    grid.innerHTML = FAIL_CONTENT;

    // Reset back to the home screen after one second.
    setTimeout(() => {
        showHome();
    }, 1000);
}
