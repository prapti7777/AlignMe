// --- QUESTION DATA ---
const personalityQuestions = [
    { text: "I am the life of the party.", trait: "Extraversion" },
    { text: "I sympathize with others' feelings.", trait: "Agreeableness" },
    { text: "I get chores done right away.", trait: "Conscientiousness" },
    { text: "I have frequent mood swings.", trait: "Neuroticism" },
    { text: "I have a vivid imagination.", trait: "Openness" },
    { text: "I don't talk a lot.", trait: "Extraversion", reverse: true },
    { text: "I am not interested in other people's problems.", trait: "Agreeableness", reverse: true },
    { text: "I often forget to put things back in their proper place.", trait: "Conscientiousness", reverse: true },
    { text: "I am relaxed most of the time.", trait: "Neuroticism", reverse: true },
    { text: "I am not interested in abstract ideas.", trait: "Openness", reverse: true },
    { text: "I talk to a lot of different people at parties.", trait: "Extraversion" },
    { text: "I feel others' emotions.", trait: "Agreeableness" },
    { text: "I like order.", trait: "Conscientiousness" },
    { text: "I get upset easily.", trait: "Neuroticism" },
    { text: "I have difficulty understanding abstract ideas.", trait: "Openness", reverse: true },
    { text: "I keep in the background.", trait: "Extraversion", reverse: true },
    { text: "I am not really interested in others.", trait: "Agreeableness", reverse: true },
    { text: "I make a mess of things.", trait: "Conscientiousness", reverse: true },
    { text: "I seldom feel blue.", trait: "Neuroticism", reverse: true },
    { text: "I do not have a good imagination.", trait: "Openness", reverse: true }
];

const technicalQuestions = [
    { 
        text: "If you have a list of 1000 sorted names and need to find one specific name, which method is most efficient?", 
        options: ["Checking every name from start to finish", "Splitting the list in half repeatedly (Binary Search)", "Randomly picking names until found"],
        domain: "Logic"
    },
    { 
        text: "When building an app, which part excites you more?", 
        options: ["Designing the buttons, colors, and layout", "Connecting the app to a database and handling data", "Ensuring the app is unhackable and secure"],
        domain: "Preference"
    },
    { 
        text: "What is the primary purpose of 'Clean Data' in a project?", 
        options: ["To make the database look pretty", "To ensure AI models or charts are accurate and not misleading", "To save space on the hard drive"],
        domain: "Data"
    },
    { 
        text: "What does a 'Firewall' primarily do?", 
        options: ["Speeds up the internet connection", "Monitors and filters incoming/outgoing network traffic", "Deletes old files automatically"],
        domain: "Security"
    },
    { 
        text: "What is the main benefit of 'Cloud Computing' (like AWS or Google Cloud)?", 
        options: ["It makes the computer screen brighter", "It allows accessing servers and storage over the internet instead of owning hardware", "It works without any internet connection"],
        domain: "Cloud"
    },
    { 
        text: "In programming, what is a 'Variable' used for?", 
        options: ["To store information that can be used and changed", "To fix a physical hardware error", "To close the program immediately"],
        domain: "Dev"
    },
    { 
        text: "If a user finds a website 'confusing to navigate', whose primary job is it to fix the flow?", 
        options: ["Backend Developer", "UI/UX Designer", "Database Administrator"],
        domain: "Design"
    },
    { 
        text: "What is SQL used for?", 
        options: ["Styling a webpage with colors", "Managing and querying data in a database", "Editing video and image files"],
        domain: "Database"
    },
    { 
        text: "What is 'Machine Learning'?", 
        options: ["Teaching computers to learn from data without being explicitly programmed for every task", "Building a physical robot with metal parts", "Increasing the physical RAM of a computer"],
        domain: "AI"
    },
    { 
        text: "What is the 'Agile' methodology?", 
        options: ["A way to code faster by skipping testing", "A project management style focused on small, iterative updates and team feedback", "A specific type of high-speed internet cable"],
        domain: "Management"
    }
];

// --- STATE MANAGEMENT ---
let currentPhase = "personality"; 
let currentIndex = 0;
let allResponses = { personality: [], technical: [] };

// --- CORE FUNCTIONS ---
function loadQuestion() {
    const questionBox = document.getElementById('question-text');
    const optionsBox = document.getElementById('options-container');
    const progress = document.getElementById('progress');
    
    const totalQuestions = personalityQuestions.length + technicalQuestions.length;
    optionsBox.innerHTML = '';
    
    if (currentPhase === "personality") {
        const q = personalityQuestions[currentIndex];
        questionBox.innerText = `Phase 1: ${q.text}`;
        
        const currentProgress = ((currentIndex + 1) / totalQuestions) * 100;
        progress.style.width = `${currentProgress}%`;

        const labels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
        labels.forEach((label, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = label;
            btn.onclick = () => handleAnswer(index + 1);
            optionsBox.appendChild(btn);
        });

    } else {
        const q = technicalQuestions[currentIndex];
        questionBox.innerText = `Phase 2: ${q.text}`;
        
        const currentProgress = ((personalityQuestions.length + currentIndex + 1) / totalQuestions) * 100;
        progress.style.width = `${currentProgress}%`;
        
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => handleAnswer(opt);
            optionsBox.appendChild(btn);
        });
    }
}

function handleAnswer(answer) {
    if (currentPhase === "personality") {
        allResponses.personality.push({
            q: personalityQuestions[currentIndex].text,
            val: answer,
            trait: personalityQuestions[currentIndex].trait
        });
        currentIndex++;
        
        if (currentIndex >= personalityQuestions.length) {
            startTechnicalPhase();
        } else {
            loadQuestion();
        }
    } else {
        allResponses.technical.push({
            q: technicalQuestions[currentIndex].text,
            ans: answer
        });
        currentIndex++;
        
        if (currentIndex >= technicalQuestions.length) {
            submitFinalData();
        } else {
            loadQuestion();
        }
    }
}

function startTechnicalPhase() {
    const questionBox = document.getElementById('question-text');
    const optionsBox = document.getElementById('options-container');
    
    questionBox.innerText = "Personality Profile Complete!";
    optionsBox.innerHTML = `<button class="option-btn selected" onclick="beginTech()">Start Technical Round </button>`;
}

function beginTech() {
    currentPhase = "technical";
    currentIndex = 0;
    loadQuestion();
}

async function submitFinalData() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('loading-spinner').classList.remove('hidden');

    try {
        const response = await fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses: allResponses })
        });

        const data = await response.json();
        let rawText = data.result;

        // 1. Markdown to HTML Header/Bold replacements
        let formatted = rawText
            .replace(/^## (.*$)/gim, '<h3 class="result-header"> $1</h3>')
            .replace(/^### (.*$)/gim, '<h4 class="result-subheader"> $1</h4>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/^\* (.*$)/gim, '<li class="result-list-item">$1</li>');

        // 2. Split by double newlines to find paragraphs
        // We wrap blocks that don't already have HTML tags into <p> tags
        let finalHtml = formatted.split('\n\n').map(block => {
            if (block.trim() && !block.trim().startsWith('<')) {
                return `<p class="result-paragraph">${block.trim()}</p>`;
            }
            return block;
        }).join('');

        document.getElementById('loading-spinner').classList.add('hidden');
        document.getElementById('result-container').classList.remove('hidden');
        document.getElementById('ai-response').innerHTML = finalHtml;

    } catch (error) {
        console.error(error);
        alert("Make sure your Python backend is running!");
    }
}

loadQuestion();