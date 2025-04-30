const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("unlocked") === "true") {
    localStorage.setItem("unlocked", "true");
}

if (localStorage.getItem("unlocked") !== "true" && localStorage.getItem('remainingAnalyses') === null) {
    localStorage.setItem('remainingAnalyses', '2');
}

function updateRemainingUI() {
    const count = localStorage.getItem('remainingAnalyses');
    const remainingDisplay = document.getElementById('remaining-analyses');
    if (remainingDisplay) {
        remainingDisplay.innerText = count;
    }
}

updateRemainingUI();

async function analyzeCode() {
    const isUnlocked = localStorage.getItem("unlocked") === "true";
    const remaining = parseInt(localStorage.getItem('remainingAnalyses'));
    const resultPlaceholder = document.getElementById('result-placeholder');

    if (!isUnlocked && remaining <= 0) {
        resultPlaceholder.innerHTML = `
            <p>You’ve used all 2 free analyses. Please upgrade to unlock unlimited access.</p>
            <a href="signup.html" class="btn primary-btn" style="margin-top: 10px; display: inline-block;">Upgrade Now</a>
        `;
        return;
    }

    const codeInput = document.getElementById('codeInput').value;
    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;

    if (!codeInput.trim()) {
        resultPlaceholder.innerText = "Please paste or upload some code first.";
        return;
    }

    resultPlaceholder.innerText = "Analyzing code... please wait.";

    try {
        const response = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: codeInput, language: selectedLanguage })
        });

        const data = await response.json();

        if (data.analysis) {
            const langMap = {
                "JavaScript": "javascript",
                "Python": "python",
                "Java": "java",
                "C++": "cpp",
                "TypeScript": "typescript",
                "Go": "go",
                "Ruby": "ruby",
                "PHP": "php",
                "C#": "csharp",
                "Swift": "swift",
                "HTML": "markup",
                "CSS": "css",
                "React": "jsx"
            };

            const langClass = langMap[selectedLanguage] || "javascript";

            resultPlaceholder.innerHTML = `
                <pre><code class="language-${langClass}">${Prism.highlight(data.analysis, Prism.languages[langClass] || Prism.languages.javascript, langClass)}</code></pre>
            `;

            if (!isUnlocked) {
                localStorage.setItem('remainingAnalyses', (remaining - 1).toString());
                updateRemainingUI();
            }

        } else if (data.error) {
            resultPlaceholder.innerText = `Error: ${data.error}`;
        } else {
            resultPlaceholder.innerText = "Unexpected response from server.";
        }

    } catch (error) {
        resultPlaceholder.innerText = "Failed to connect to the server. Is your backend running?";
        console.error(error);
    }
}

function clearCode() {
    document.getElementById('codeInput').value = '';
    document.getElementById('result-placeholder').innerText = '';
    document.getElementById('codeUpload').value = '';
    document.getElementById('codeInput').focus();
}

function handleFileUpload() {
    const fileInput = document.getElementById('codeUpload');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById('codeInput').value = e.target.result;
    };

    if (file) {
        reader.readAsText(file);
    }
}