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
    { text: "Find a name in a sorted list of 1000 names?", options: ["Linear Search", "Binary Search", "Random"], domain: "Logic" },
    { text: "What excites you more?", options: ["UI/Design", "Backend/Data", "Security"], domain: "Preference" },
    { text: "Purpose of 'Clean Data'?", options: ["Pretty UI", "Accurate AI/Models", "Save Space"], domain: "Data" },
    { text: "Firewall function?", options: ["Speed Up", "Filter Traffic", "Delete Files"], domain: "Security" },
    { text: "Cloud Computing benefit?", options: ["Brighter Screen", "Remote Servers", "No Internet"], domain: "Cloud" },
    { text: "What is a Variable?", options: ["Store Info", "Fix Hardware", "Close Program"], domain: "Dev" },
    { text: "UI is confusing, who fixes it?", options: ["Backend", "UI/UX Designer", "DBA"], domain: "Design" },
    { text: "What is SQL?", options: ["Styles", "Databases", "Video Editing"], domain: "Database" },
    { text: "Machine Learning?", options: ["Learn from Data", "Metal Robots", "More RAM"], domain: "AI" },
    { text: "Agile methodology?", options: ["Skip Testing", "Iterative/Feedback", "Fast Cable"], domain: "Management" }
];

let currentPhase = "personality"; 
let currentIndex = 0;
let allResponses = { personality: [], technical: [], desiredRole: null };

function loadQuestion() {
    const questionBox = document.getElementById('question-text');
    const optionsBox = document.getElementById('options-container');
    const progress = document.getElementById('progress');
    const total = personalityQuestions.length + technicalQuestions.length;
    
    optionsBox.innerHTML = '';
    
    if (currentPhase === "personality") {
        const q = personalityQuestions[currentIndex];
        questionBox.innerText = `Personality: ${q.text}`;
        progress.style.width = `${((currentIndex + 1) / total) * 100}%`;
        ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].forEach((label, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = label;
            btn.onclick = () => handleAnswer(i + 1);
            optionsBox.appendChild(btn);
        });
    } else {
        const q = technicalQuestions[currentIndex];
        questionBox.innerText = `Technical: ${q.text}`;
        progress.style.width = `${((personalityQuestions.length + currentIndex + 1) / total) * 100}%`;
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
        allResponses.personality.push({ val: answer, trait: personalityQuestions[currentIndex].trait });
        currentIndex++;
        if (currentIndex >= personalityQuestions.length) showChoiceScreen();
        else loadQuestion();
    } else {
        allResponses.technical.push({ q: technicalQuestions[currentIndex].text, ans: answer });
        currentIndex++;
        if (currentIndex >= technicalQuestions.length) submitFinalData();
        else loadQuestion();
    }
}

function showChoiceScreen() {
    document.getElementById('question-card').classList.add('hidden');
    document.getElementById('choice-screen').classList.remove('hidden');
    document.getElementById('progress').style.width = '66%';
}

function beginTech() {
    currentPhase = "technical"; currentIndex = 0;
    document.getElementById('choice-screen').classList.add('hidden');
    document.getElementById('question-card').classList.remove('hidden');
    loadQuestion();
}

function startInterestPath() {
    const role = document.getElementById('desired-role').value;
    if (!role) return alert("Please select a career path from the dropdown!");
    allResponses.desiredRole = role;
    submitFinalData();
}

async function submitFinalData() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('loading-spinner').classList.remove('hidden');
    
    try {
        const res = await fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses: allResponses })
        });
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        let cleanText = data.result.replace(/<thought>[\s\S]*?<\/thought>/g, "").trim();

        // THE ULTIMATE FORMATTER:
        let formatted = cleanText
            // 1. Convert headers
            .replace(/^## (.*$)/gim, '<h3 class="result-header"> $1</h3>')
            .replace(/^### (.*$)/gim, '<h4 class="result-subheader"> $1</h4>')
            
            // 2. Bold tags
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            
            // 3. REMOVE STRAY NUMBERS & DOTS (The 1. 2. 3. issue)
            .replace(/^\s*(\d+\.|[\*\-\•])\s*$/gm, '') 
            .replace(/\s+(\d+\.)\s*$/gm, '')

            // 4. TRANSFORM TERMS INTO DIAMOND BLOCKS
            // This regex captures the Label and the description, putting them in the assessment-item div
            .replace(/(?:\d+\.\s*)?\*?\s*(Current Standing|Key Focus|Short Term|Mid Term|Long Term)[:\s]*(.*)/gim, 
                     '<div class="assessment-item">🔹 <strong>$1:</strong> $2</div>')


        document.getElementById('ai-response').innerHTML = formatted;
        document.getElementById('loading-spinner').classList.add('hidden');
        document.getElementById('result-container').classList.remove('hidden');
    } catch (e) {
        console.error("Submission Error:", e);
        alert("Server Error. Please ensure app.py is running.");
        location.reload();
    }
}

loadQuestion();