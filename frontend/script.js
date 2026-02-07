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
    // 1. Logic & Problem Solving (General Aptitude)
    { 
        text: "If you have a list of 1000 sorted names and need to find one specific name, which method is most efficient?", 
        options: ["Checking every name from start to finish", "Splitting the list in half repeatedly (Binary Search)", "Randomly picking names until found"],
        domain: "Logic"
    },
    // 2. Frontend vs Backend (Development Preference)
    { 
        text: "When building an app, which part excites you more?", 
        options: ["Designing the buttons, colors, and layout", "Connecting the app to a database and handling data", "Ensuring the app is unhackable and secure"],
        domain: "Preference"
    },
    // 3. Data & Patterns (Data Science/AI)
    { 
        text: "What is the primary purpose of 'Clean Data' in a project?", 
        options: ["To make the database look pretty", "To ensure AI models or charts are accurate and not misleading", "To save space on the hard drive"],
        domain: "Data"
    },
    // 4. Cybersecurity (Security)
    { 
        text: "What does a 'Firewall' primarily do?", 
        options: ["Speeds up the internet connection", "Monitors and filters incoming/outgoing network traffic", "Deletes old files automatically"],
        domain: "Security"
    },
    // 5. Cloud/Infrastructure (DevOps/Cloud)
    { 
        text: "What is the main benefit of 'Cloud Computing' (like AWS or Google Cloud)?", 
        options: ["It makes the computer screen brighter", "It allows accessing servers and storage over the internet instead of owning hardware", "It works without any internet connection"],
        domain: "Cloud"
    },
    // 6. Coding Fundamentals (Software Engineering)
    { 
        text: "In programming, what is a 'Variable' used for?", 
        options: ["To store information that can be used and changed", "To fix a physical hardware error", "To close the program immediately"],
        domain: "Dev"
    },
    // 7. Creative/User-Centric (UI/UX)
    { 
        text: "If a user finds a website 'confusing to navigate', whose primary job is it to fix the flow?", 
        options: ["Backend Developer", "UI/UX Designer", "Database Administrator"],
        domain: "Design"
    },
    // 8. Database (Backend/Data)
    { 
        text: "What is SQL used for?", 
        options: ["Styling a webpage with colors", "Managing and querying data in a database", "Editing video and image files"],
        domain: "Database"
    },
    // 9. Emerging Tech (AI/ML)
    { 
        text: "What is 'Machine Learning'?", 
        options: ["Teaching computers to learn from data without being explicitly programmed for every task", "Building a physical robot with metal parts", "Increasing the physical RAM of a computer"],
        domain: "AI"
    },
    // 10. Project Management (Management/Analyst)
    { 
        text: "What is the 'Agile' methodology?", 
        options: ["A way to code faster by skipping testing", "A project management style focused on small, iterative updates and team feedback", "A specific type of high-speed internet cable"],
        domain: "Management"
    }
];

// --- STATE MANAGEMENT ---
let currentPhase = "personality"; // "personality" or "technical"
let currentIndex = 0;
let allResponses = { personality: [], technical: [] };

// --- CORE FUNCTIONS ---
function loadQuestion() {
    const questionBox = document.getElementById('question-text');
    const optionsBox = document.getElementById('options-container');
    const progress = document.getElementById('progress');
    
    // Calculate total progress across both phases (20 + 10 = 30)
    const totalQuestions = personalityQuestions.length + technicalQuestions.length;
    
    // Clear previous options
    optionsBox.innerHTML = '';
    
    if (currentPhase === "personality") {
        const q = personalityQuestions[currentIndex];
        questionBox.innerText = `Phase 1: ${q.text}`;
        
        // Update Progress Bar (1 to 20)
        const currentProgress = ((currentIndex + 1) / totalQuestions) * 100;
        progress.style.width = `${currentProgress}%`;

        // Create 1-5 Rating Buttons
        const labels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
        labels.forEach((label, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = label;
            btn.onclick = () => handleAnswer(index + 1); // Scores 1 through 5
            optionsBox.appendChild(btn);
        });

    } else {
        const q = technicalQuestions[currentIndex];
        questionBox.innerText = `Phase 2: ${q.text}`;
        
        // Update Progress Bar (21 to 30)
        const currentProgress = ((personalityQuestions.length + currentIndex + 1) / totalQuestions) * 100;
        progress.style.width = `${currentProgress}%`;
        
        // Create Multiple Choice Buttons
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
    // Small transition
    const questionBox = document.getElementById('question-text');
    const optionsBox = document.getElementById('options-container');
    
    questionBox.innerText = "Personality Profile Complete!";
    optionsBox.innerHTML = `<button class="option-btn selected" onclick="beginTech()">Start Technical Round 🚀</button>`;
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
        
        // STABLE FORMATTING LOGIC
        let formattedText = data.result
            .replace(/^## (.*$)/gim, '<h3>$1</h3>')
            .replace(/^### (.*$)/gim, '<h4>$1</h4>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/\n/g, '<br>'); 

        document.getElementById('loading-spinner').classList.add('hidden');
        document.getElementById('result-container').classList.remove('hidden');
        document.getElementById('ai-response').innerHTML = formattedText;

    } catch (error) {
        alert("Make sure your Python backend is running!");
    }
}
loadQuestion();