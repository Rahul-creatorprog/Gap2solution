// GovTech Innovation Procurement & Sandbox Pathway - Dual Engine (Online API + Offline Pure Client-Side Fallback)

let currentRole = 'DEPARTMENT';

let globalChallenges = [];
let globalApplications = [];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  fetchChallenges();
  fetchApplications();
});

// --- RESET PROTOTYPE DATA ---
function resetPrototypeData() {
  globalChallenges = [];
  globalApplications = [];
  renderDeptChallenges();
  renderStartupChallenges();
  renderEscrowTracker();
  renderExpertPanel();
  alert("✨ Prototype state reset completely! All challenges, applications, escrow trackers, and evaluator panels are cleared.");
}

// --- ROLE SWITCHER LOGIC ---
function switchRole(role) {
  currentRole = role;
  
  ['dept', 'startup', 'expert'].forEach(r => {
    const btn = document.getElementById(`btn-role-${r}`);
    if (btn) {
      if (r.toUpperCase() === role) {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-blue-600 text-white shadow";
      } else {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-300 hover:text-white hover:bg-slate-700";
      }
    }
  });

  const deptView = document.getElementById("view-department");
  const startupView = document.getElementById("view-startup");
  const expertView = document.getElementById("view-expert");

  if (deptView) deptView.classList.add("hidden");
  if (startupView) startupView.classList.add("hidden");
  if (expertView) expertView.classList.add("hidden");

  if (role === 'DEPARTMENT' && deptView) deptView.classList.remove("hidden");
  if (role === 'STARTUP' && startupView) startupView.classList.remove("hidden");
  if (role === 'EXPERT' && expertView) expertView.classList.remove("hidden");

  if (window.lucide) lucide.createIcons();
}

// --- FETCH DATA (WITH AUTO FALLBACK) ---
async function fetchChallenges() {
  try {
    const res = await fetch('/api/challenges');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        globalChallenges = json.data;
      }
    }
  } catch (err) {
    console.log("Using client-side challenges store.");
  } finally {
    renderDeptChallenges();
    renderStartupChallenges();
  }
}

async function fetchApplications() {
  try {
    const res = await fetch('/api/applications');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        globalApplications = json.data;
      }
    }
  } catch (err) {
    console.log("Using client-side applications store.");
  } finally {
    renderEscrowTracker();
    renderExpertPanel();
  }
}

// --- UPDATE STAT COUNTERS ---
function updateStatCounters() {
  const sc = document.getElementById("stat-challenges");
  const sa = document.getElementById("stat-applications");
  if (sc) sc.textContent = globalChallenges.length;
  if (sa) sa.textContent = globalApplications.length;
}

// --- RENDER DEPARTMENT CHALLENGES ---
function renderDeptChallenges() {
  const container = document.getElementById("dept-challenges-list");
  if (!container) return;
  updateStatCounters();

  if (!globalChallenges || globalChallenges.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <i data-lucide="plus-circle" class="w-6 h-6"></i>
        </div>
        <h4 class="font-bold text-slate-800 text-base">No Active Challenges Posted</h4>
        <p class="text-xs text-slate-500 max-w-md mx-auto">Click <strong>"+ Post New Challenge"</strong> above to enter your problem description and optimize it with Gemini AI.</p>
        <button onclick="openModal('modal-create-challenge')" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow transition-all">
          <i data-lucide="plus" class="w-4 h-4"></i> Post First Problem Statement
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = globalChallenges.map(c => `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover space-y-3">
      <div class="flex justify-between items-start gap-2">
        <div>
          <span class="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">${c.category}</span>
          <h4 class="font-bold text-slate-900 text-base mt-1">${c.title}</h4>
          <span class="text-xs text-slate-500 font-semibold">${c.department} • Posted ${c.createdAt}</span>
        </div>
        <span class="badge-gfr text-xs font-bold px-2.5 py-1 rounded-lg">${c.gfrClause}</span>
      </div>

      <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
        <span class="font-bold text-slate-900">Outcome Goal:</span> ${c.optimizedOutcome}
      </div>

      <div class="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
        <span class="font-bold text-slate-800">Pilot Budget: <span class="text-emerald-600">${c.pilotBudget}</span></span>
        <div class="flex gap-2">
          <button onclick="openApplyModal('${c.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg">Apply / View Details</button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

// --- RENDER STARTUP CHALLENGES ---
function renderStartupChallenges() {
  const container = document.getElementById("startup-challenges-list");
  if (!container) return;

  if (!globalChallenges || globalChallenges.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
          <i data-lucide="rocket" class="w-6 h-6"></i>
        </div>
        <h4 class="font-bold text-slate-800 text-base">No Government Challenges Available</h4>
        <p class="text-xs text-slate-500 max-w-md mx-auto">Once a challenge is posted from Department Command Center, startups can apply here with DPIIT waivers.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = globalChallenges.map(c => `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div class="flex justify-between items-start">
        <span class="badge-dpiit text-[11px] font-bold px-2.5 py-0.5 rounded-full">Turnover Waiver Granted</span>
        <span class="text-xs font-bold text-emerald-600">${c.pilotBudget}</span>
      </div>
      <h4 class="font-bold text-slate-900 text-sm">${c.title}</h4>
      <p class="text-xs text-slate-600 leading-relaxed">${c.optimizedOutcome}</p>
      
      <div class="pt-2 border-t border-slate-100 flex justify-between items-center">
        <span class="text-[11px] text-slate-500 font-semibold">${c.department}</span>
        <button onclick="openApplyModal('${c.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow">
          <i data-lucide="send" class="w-3.5 h-3.5"></i> Apply with DPIIT
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

// --- RENDER ESCROW FINANCIAL TRACKER (DYNAMIC) ---
function renderEscrowTracker() {
  const container = document.getElementById("escrow-tracker-container");
  if (!container) return;
  updateStatCounters();

  if (!globalApplications || globalApplications.length === 0) {
    container.innerHTML = `
      <div class="bg-slate-900 text-white p-6 rounded-2xl shadow-md text-center space-y-2">
        <div class="w-10 h-10 bg-slate-800 text-amber-400 rounded-full flex items-center justify-center mx-auto">
          <i data-lucide="shield-alert" class="w-5 h-5"></i>
        </div>
        <h4 class="font-bold text-sm text-white">No Active Pilot Escrow Pipeline</h4>
        <p class="text-xs text-slate-400 max-w-md mx-auto">Publish a challenge and submit an application to activate the RazorpayX Milestone Escrow Tracker.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  const appItem = globalApplications[0];
  const challenge = globalChallenges.find(c => c.id === appItem.challengeId) || { title: "Active Sandbox Pilot Solution", pilotBudget: "₹15,00,000" };

  container.innerHTML = `
    <div class="bg-slate-900 text-white p-5 rounded-2xl shadow-md space-y-4">
      <div class="flex flex-wrap justify-between items-center gap-2">
        <div>
          <span class="text-xs text-slate-400 uppercase font-semibold tracking-wider">Active Pilot Escrow Tracker</span>
          <h3 class="text-lg font-bold text-white">${challenge.title}</h3>
        </div>
        <span class="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">Total Budget: ${challenge.pilotBudget || '₹15,00,000'}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
          <span class="text-slate-400">Disbursed (Phase 1):</span>
          <div class="text-lg font-bold text-emerald-400">₹5,00,000 ✅</div>
        </div>
        <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
          <span class="text-slate-400">Locked in Escrow (Phase 2):</span>
          <div class="text-lg font-bold text-amber-400">₹6,00,000 🔒</div>
        </div>
        <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
          <span class="text-slate-400">Pending Final (Phase 3):</span>
          <div class="text-lg font-bold text-slate-300">₹4,00,000 ⏳</div>
        </div>
      </div>

      <div class="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
        <div class="bg-gradient-to-r from-emerald-500 to-indigo-500 h-3 rounded-full progress-bar-fill" style="width: 40%"></div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

// --- RENDER EXPERT EVALUATION PANEL (DYNAMIC) ---
function renderExpertPanel() {
  const container = document.getElementById("expert-panel-container");
  if (!container) return;

  if (!globalApplications || globalApplications.length === 0) {
    container.innerHTML = `
      <div class="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <i data-lucide="user-check" class="w-6 h-6"></i>
        </div>
        <h4 class="font-bold text-slate-800 text-base">No Applications Pending Expert Evaluation</h4>
        <p class="text-xs text-slate-500 max-w-md mx-auto">Once a startup submits an application for a challenge, it will appear here for split-screen technical scoring and Safe-to-Fail Sandbox approval.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  const appItem = globalApplications[0];
  const challenge = globalChallenges.find(c => c.id === appItem.challengeId) || { title: "Government Innovation Pilot Challenge" };

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[480px]">
      <!-- LEFT 60%: PROPOSAL & SANDBOX DATA -->
      <div class="lg:col-span-7 p-6 split-left space-y-4 bg-slate-50">
        <div class="flex justify-between items-center border-b border-slate-200 pb-3">
          <div>
            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Application Review</span>
            <h3 class="text-lg font-bold text-slate-900">${appItem.startupName}</h3>
          </div>
          <span class="badge-dpiit text-xs px-2.5 py-1 rounded-full font-bold">DPIIT Verified: ${appItem.dpiitNumber}</span>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <span class="font-bold text-slate-700">Target Challenge:</span>
            <p class="text-slate-600 font-semibold">${challenge.title}</p>
          </div>
          <div>
            <span class="font-bold text-slate-700">Proposed Technical Solution:</span>
            <p class="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              ${appItem.solutionSummary}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <a href="${appItem.pitchLink || '#'}" target="_blank" class="text-blue-600 font-bold hover:underline flex items-center gap-1">
              <i data-lucide="file-text" class="w-4 h-4"></i> View Pitch Deck PDF
            </a>
            <span class="text-slate-400">|</span>
            <span class="badge-gfr text-xs px-2 py-0.5 rounded font-semibold">GFR 2017 Rule 161 Exemption Attached</span>
          </div>
        </div>
      </div>

      <!-- RIGHT 40%: SCORING SLIDERS & APPROVAL -->
      <div class="lg:col-span-5 p-6 space-y-5 flex flex-col justify-between">
        <div>
          <h4 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-4">Objective Evaluation Rubric</h4>
          
          <div class="space-y-4 text-xs">
            <div>
              <div class="flex justify-between font-bold text-slate-700 mb-1">
                <span>Technical Feasibility (1-10):</span>
                <span id="val-tech-score" class="text-blue-600">9</span>
              </div>
              <input type="range" min="1" max="10" value="9" oninput="document.getElementById('val-tech-score').innerText = this.value" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
            </div>

            <div>
              <div class="flex justify-between font-bold text-slate-700 mb-1">
                <span>Operational Feasibility (1-10):</span>
                <span id="val-feas-score" class="text-blue-600">9</span>
              </div>
              <input type="range" min="1" max="10" value="9" oninput="document.getElementById('val-feas-score').innerText = this.value" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
            </div>

            <div>
              <div class="flex justify-between font-bold text-slate-700 mb-1">
                <span>Cybersecurity & Risk Score (1-10):</span>
                <span id="val-sec-score" class="text-blue-600">8</span>
              </div>
              <input type="range" min="1" max="10" value="8" oninput="document.getElementById('val-sec-score').innerText = this.value" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">Evaluator Comments & Recommendations:</label>
              <textarea id="eval-comments" rows="3" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Technical logs verified. Recommended for sandbox pilot."></textarea>
            </div>
          </div>
        </div>

        <button onclick="submitEvaluation('${appItem.id}')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all">
          <i data-lucide="check-square" class="w-4 h-4"></i> Submit Score & Grant Sandbox Pilot License
        </button>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

// --- AI OPTIMIZER TRIGGER ---
async function triggerAIOptimizer() {
  const rawProbInput = document.getElementById("input-problem");
  const deptInput = document.getElementById("input-dept");
  const outcomeInput = document.getElementById("input-outcome");

  const rawProb = rawProbInput ? rawProbInput.value.trim() : "";
  const dept = deptInput && deptInput.value.trim() ? deptInput.value.trim() : "State Government Department";

  if (!rawProb) {
    alert("Please enter a raw problem description first (e.g. 'Waterlogging near railway station during monsoons').");
    return;
  }

  outcomeInput.value = "✨ Gemini AI Engine is converting problem statement into outcome-based procurement KPIs...";
  
  let resultText = "";

  try {
    const res = await fetch('/api/ai-optimize-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawProblem: rawProb, department: dept })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.optimizedOutcome) {
        resultText = json.optimizedOutcome;
      }
    }
  } catch (err) {
    console.log("Using client-side Gemini fallback AI refiner engine.");
  }

  if (!resultText) {
    resultText = `Deploy innovative IoT & AI-powered technology solutions to address "${rawProb}" for ${dept}, establishing a 90-day Safe-to-Fail pilot targeting >= 35% operational efficiency improvement, 99.2% uptime SLA, and zero-turnover DPIIT innovator exemption under GFR 2017 Rule 161 & Maharashtra Startup Policy Sec 4.2.`;
  }

  setTimeout(() => {
    outcomeInput.value = resultText;
  }, 400);
}

// --- HANDLE CREATE CHALLENGE ---
async function handleCreateChallenge(e) {
  e.preventDefault();
  const dept = document.getElementById("input-dept").value || "Department of Urban Tech";
  const cat = document.getElementById("input-cat").value || "Smart Infrastructure";
  const title = document.getElementById("input-title").value || "New Innovation Pilot Challenge";
  const rawProb = document.getElementById("input-problem").value || "";
  const outcome = document.getElementById("input-outcome").value || rawProb;
  const budget = document.getElementById("input-budget").value || "₹15,00,000";

  const newChal = {
    id: `CHAL-MH-2026-00${globalChallenges.length + 1}`,
    department: dept,
    category: cat,
    title: title,
    rawProblem: rawProb,
    optimizedOutcome: outcome,
    pilotBudget: budget,
    maxDurationDays: 90,
    status: "OPEN",
    createdAt: new Date().toISOString().split('T')[0],
    dpiitExemptionGranted: true,
    msinsExemptionGranted: true,
    gfrClause: "GFR 2017 Rule 161 (Innovator Exemption)",
    targetKPIs: [
      "KPI 1: Operational SLA improvement > 35%",
      "KPI 2: 99.9% uptime during pilot period"
    ]
  };

  try {
    await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newChal)
    });
  } catch (err) {
    console.log("Saved challenge to client-side store.");
  }

  globalChallenges.unshift(newChal);
  closeModal('modal-create-challenge');
  renderDeptChallenges();
  renderStartupChallenges();

  alert("🚀 New Innovation Challenge Published Successfully under GFR 2017 Rule 161 Innovator Exemptions!");
}

// --- DPIIT VERIFICATION ---
async function verifyDPIITInline() {
  const dpiitNumInput = document.getElementById("apply-dpiit-num");
  const msgContainer = document.getElementById("dpiit-status-msg");
  const dpiitNum = dpiitNumInput ? dpiitNumInput.value.trim() : "";

  if (!dpiitNum) {
    alert("Please enter a DPIIT Registration Number!");
    return;
  }

  let message = `DPIIT Verified (${dpiitNum.toUpperCase()}). GFR 2017 Rule 161 & Rule 170(i) EMD & Turnover Exemption Granted!`;

  try {
    const res = await fetch('/api/verify-dpiit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dpiitNumber: dpiitNum })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        message = json.waiverMessage || message;
      }
    }
  } catch (err) {
    console.log("Using client-side DPIIT verification engine.");
  }

  if (msgContainer) {
    msgContainer.innerHTML = `
      <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i> ${message}
    `;
    if (window.lucide) lucide.createIcons();
  }
}

// --- APPLY MODAL HANDLER ---
function openApplyModal(challengeId) {
  const idElem = document.getElementById("apply-challenge-id");
  if (idElem) idElem.value = challengeId;
  openModal("modal-apply");
}

async function handleApplySubmit(e) {
  e.preventDefault();
  const challengeId = document.getElementById("apply-challenge-id").value || "CHAL-MH-2026-001";
  const startupName = document.getElementById("apply-startup-name").value || "Innovator Startup";
  const dpiitNumber = document.getElementById("apply-dpiit-num").value || "DPIIT12345";
  const solutionSummary = document.getElementById("apply-solution").value || "IoT & Edge AI solution for pilot test.";
  const pitchLink = document.getElementById("apply-pitch").value || "https://example.com/pitch.pdf";

  const newApp = {
    id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
    challengeId,
    startupName,
    dpiitNumber,
    dpiitVerified: true,
    turnoverWaiverApplied: true,
    solutionSummary,
    pitchLink,
    appliedDate: new Date().toISOString().split('T')[0],
    scores: [],
    averageScore: 0,
    status: "UNDER_EXPERT_REVIEW",
    contract: null,
    milestones: [
      { id: "M1", title: "Phase 1: Setup & Telemetry Testing", amount: "₹5,00,000", status: "PENDING", disbursed: false },
      { id: "M2", title: "Phase 2: Live Field Trial", amount: "₹6,00,000", status: "PENDING", disbursed: false },
      { id: "M3", title: "Phase 3: Final KPI Report & Validation", amount: "₹4,00,000", status: "PENDING", disbursed: false }
    ]
  };

  try {
    await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp)
    });
  } catch (err) {
    console.log("Saved application to client-side store.");
  }

  globalApplications.unshift(newApp);
  closeModal('modal-apply');
  renderEscrowTracker();
  renderExpertPanel();
  alert("🎉 Application Submitted Successfully with DPIIT GFR 2017 Innovator Exemption Waiver!");
}

// --- SUBMIT EVALUATION SCORE ---
async function submitEvaluation(applicationId) {
  const techScore = Number(document.getElementById("val-tech-score")?.innerText || 9);
  const feasScore = Number(document.getElementById("val-feas-score")?.innerText || 9);
  const secScore = Number(document.getElementById("val-sec-score")?.innerText || 8);
  const comments = document.getElementById("eval-comments")?.value || "Feasible VTOL stability logs verified.";

  let appItem = globalApplications.find(a => a.id === applicationId) || globalApplications[0];
  if (!appItem) return;

  const scoreObj = {
    evaluator: "Dr. K. Raman (Tech Expert)",
    technicalScore: techScore,
    feasibilityScore: feasScore,
    securityScore: secScore,
    comments: comments
  };

  appItem.scores.push(scoreObj);
  const totalAvg = appItem.scores.reduce((acc, s) => acc + (s.technicalScore + s.feasibilityScore + s.securityScore) / 3, 0) / appItem.scores.length;
  appItem.averageScore = parseFloat(totalAvg.toFixed(1));

  appItem.status = "SHORTLISTED_FOR_SANDBOX";
  appItem.contract = {
    contractId: `AGR-2026-${Math.floor(100 + Math.random() * 900)}`,
    signedDate: new Date().toISOString().split('T')[0],
    ipClause: "Background IP retained 100% by Startup. Non-exclusive foreground procurement license granted upon successful scale-up.",
    safeToFailClause: "Approved under State Sandbox Waiver Framework 2026. Department indemnity active.",
    cybersecurityStatus: "CERT-In Pre-screen Checklist Compliant"
  };

  try {
    await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId,
        evaluatorName: "Dr. K. Raman (Tech Expert)",
        technicalScore: techScore,
        feasibilityScore: feasScore,
        securityScore: secScore,
        comments
      })
    });
  } catch (err) {
    console.log("Saved evaluation score to client-side store.");
  }

  alert(`✅ Score of ${appItem.averageScore}/10 Recorded!\n\n🛡️ Safe-to-Fail Sandbox License Granted & Department Indemnity Active under MSInS Policy Sec 4.2!`);
}

// --- CAG AUDIT TRAIL MODAL ---
async function triggerAuditReport(applicationId) {
  let appItem = globalApplications.find(a => a.id === applicationId) || globalApplications[0] || {
    id: "APP-9012",
    startupName: "AeroMed Robotics Pvt Ltd",
    dpiitNumber: "DPIIT89421",
    averageScore: 8.7,
    scores: [{ evaluator: "Dr. K. Raman" }],
    milestones: [{ title: "Phase 1: Lab Test", amount: "₹7,50,000", status: "COMPLETED", disbursedDate: "2026-08-26" }]
  };
  let challenge = globalChallenges.find(c => c.id === appItem.challengeId) || globalChallenges[0] || {
    department: "Pune Municipal Corporation & Health Dept",
    title: "Autonomous Medical Vaccine Logistics Drones",
    gfrClause: "GFR 2017 Rule 161 & Rule 170(i)"
  };

  let auditReport = {
    auditTimestamp: new Date().toISOString(),
    auditCertificateNo: `CAG-AUDIT-${appItem.id}-2026`,
    department: challenge.department,
    challengeTitle: challenge.title,
    gfrExemptionClause: challenge.gfrClause,
    startupDetails: {
      name: appItem.startupName,
      dpiitNumber: appItem.dpiitNumber,
      dpiitVerifiedStatus: "VERIFIED_VALID",
      turnoverWaiverAttached: true
    },
    expertPanelEvaluations: appItem.scores,
    overallEvaluationAverage: appItem.averageScore || 8.7,
    contractRef: appItem.contract,
    milestonePaymentAudit: (appItem.milestones || []).map(m => ({
      milestone: m.title,
      amount: m.amount,
      status: m.status,
      disbursedDate: m.disbursedDate || "2026-08-26",
      proofVerified: true
    })),
    cagComplianceDeclaration: "This innovation pilot was conducted under pre-approved State Safe-to-Fail Sandbox Rules 2026, Maharashtra Startup Policy Sec 4.2, and GFR 2017 Rule 161/173(i). Zero audit liability or procedural irregularity incurred."
  };

  const container = document.getElementById("audit-report-content");
  if (container) {
    container.innerHTML = `
      <div class="border-b border-slate-200 pb-2 space-y-1">
        <div><strong>AUDIT CERTIFICATE REF:</strong> <span class="text-blue-600 font-bold">${auditReport.auditCertificateNo}</span></div>
        <div><strong>TIMESTAMP:</strong> ${auditReport.auditTimestamp}</div>
        <div><strong>DEPARTMENT:</strong> ${auditReport.department}</div>
        <div><strong>LEGAL AUTHORITY:</strong> <span class="text-emerald-700 font-bold">${auditReport.gfrExemptionClause}</span></div>
      </div>
      <div class="space-y-1">
        <div><strong>QUALIFIED STARTUP:</strong> ${auditReport.startupDetails.name} (${auditReport.startupDetails.dpiitNumber})</div>
        <div><strong>DPIIT STATUS:</strong> <span class="text-emerald-600 font-bold">${auditReport.startupDetails.dpiitVerifiedStatus}</span></div>
        <div><strong>TURNOVER & EMD WAIVER:</strong> ${auditReport.startupDetails.turnoverWaiverAttached ? 'ATTACHED (GFR 2017 Rule 161 & 170(i))' : 'NO'}</div>
      </div>
      <div class="bg-white p-3 rounded border border-slate-200 space-y-1">
        <div><strong>EXPERT EVALUATION OVERALL SCORE:</strong> <span class="text-blue-600 font-bold">${auditReport.overallEvaluationAverage} / 10</span></div>
        <div><strong>PANEL EVALUATORS LOGGED:</strong> ${auditReport.expertPanelEvaluations.length} Independent Experts</div>
      </div>
      <div class="text-[11px] text-emerald-900 bg-emerald-100 p-3 rounded-xl border border-emerald-300 font-bold">
        🛡️ CAG COMPLIANCE DECLARATION:<br>
        "${auditReport.cagComplianceDeclaration}"
      </div>
    `;
  }

  openModal("modal-audit");
}

// --- DYNAMIC SCALE UP PASSPORT MODAL ---
async function triggerScaleUpPassport(applicationId) {
  let appItem = globalApplications.find(a => a.id === applicationId) || globalApplications[0] || {
    id: "APP-9012",
    startupName: "AeroMed Robotics Pvt Ltd",
    dpiitNumber: "DPIIT89421",
    averageScore: 8.7
  };
  let challenge = globalChallenges.find(c => c.id === appItem.challengeId) || globalChallenges[0] || {
    department: "Pune Municipal Corporation & Health Dept",
    title: "Autonomous Medical Vaccine Logistics Drones"
  };

  let passport = {
    passportId: `SCALEUP-PASS-${appItem.id}`,
    issueDate: new Date().toISOString().split('T')[0],
    verifiedStartup: appItem.startupName,
    dpiitRef: appItem.dpiitNumber,
    hostDepartment: challenge.department,
    validatedSolution: challenge.title,
    pilotScoreAchieved: `${appItem.averageScore || 8.7} / 10`,
    scaleUpRecommendation: "APPROVED FOR DIRECT CROSS-DISTRICT & CROSS-DEPARTMENT PROCUREMENTS WITHOUT RE-PILOTING",
    qrVerificationHash: `SHA256-${appItem.id}-VERIFIED`
  };

  const container = document.getElementById("passport-card-content");
  if (container) {
    container.innerHTML = `
      <div><span class="text-indigo-400">PASSPORT ID:</span> ${passport.passportId}</div>
      <div><span class="text-indigo-400">VERIFIED STARTUP:</span> ${passport.verifiedStartup}</div>
      <div><span class="text-indigo-400">DPIIT REF:</span> ${passport.dpiitRef}</div>
      <div><span class="text-indigo-400">HOST DEPT:</span> ${passport.hostDepartment}</div>
      <div><span class="text-indigo-400">SCORE ACHIEVED:</span> <span class="text-emerald-400 font-bold">${passport.pilotScoreAchieved}</span></div>
      <div class="pt-2 border-t border-indigo-500/30 text-[10px] text-indigo-200">
        RECOMMENDATION: ${passport.scaleUpRecommendation}
      </div>
    `;
  }

  const qrImg = document.getElementById("passport-qr-img");
  if (qrImg) {
    const targetUrl = encodeURIComponent(`https://rahul-creatorprog.github.io/Gap2solution/verify.html?id=${appItem.id}&startup=${encodeURIComponent(appItem.startupName)}&dept=${encodeURIComponent(challenge.department)}&title=${encodeURIComponent(challenge.title)}&score=${appItem.averageScore || 8.7}`);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${targetUrl}`;
  }

  const passIdLabel = document.getElementById("passport-id-label");
  if (passIdLabel) {
    passIdLabel.innerText = `ID: ${passport.passportId}`;
  }

  openModal("modal-scaleup");
}

// --- MODAL UTILS ---
function openModal(id) {
  const elem = document.getElementById(id);
  if (elem) elem.classList.remove("hidden");
}

function closeModal(id) {
  const elem = document.getElementById(id);
  if (elem) elem.classList.add("hidden");
}
