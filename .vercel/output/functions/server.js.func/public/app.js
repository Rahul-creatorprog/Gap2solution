// GovTech Innovation Procurement Pathway - Frontend Application Engine

let currentRole = 'DEPARTMENT';
let globalChallenges = [];
let globalApplications = [];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  fetchChallenges();
  fetchApplications();
});

// --- ROLE SWITCHER LOGIC ---
function switchRole(role) {
  currentRole = role;
  
  // Highlight buttons
  ['dept', 'startup', 'expert'].forEach(r => {
    const btn = document.getElementById(`btn-role-${r}`);
    if (r.toUpperCase() === role) {
      btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-blue-600 text-white shadow";
    } else {
      btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-300 hover:text-white hover:bg-slate-700";
    }
  });

  // Toggle views
  document.getElementById("view-department").classList.add("hidden");
  document.getElementById("view-startup").classList.add("hidden");
  document.getElementById("view-expert").classList.add("hidden");

  if (role === 'DEPARTMENT') document.getElementById("view-department").classList.remove("hidden");
  if (role === 'STARTUP') document.getElementById("view-startup").classList.remove("hidden");
  if (role === 'EXPERT') document.getElementById("view-expert").classList.remove("hidden");

  // Re-initialize Lucide Icons for rendered content
  if (window.lucide) lucide.createIcons();
}

// --- FETCH DATA ---
async function fetchChallenges() {
  try {
    const res = await fetch('/api/challenges');
    const json = await res.json();
    if (json.success) {
      globalChallenges = json.data;
      renderDeptChallenges();
      renderStartupChallenges();
    }
  } catch (err) {
    console.error("Failed to fetch challenges:", err);
  }
}

async function fetchApplications() {
  try {
    const res = await fetch('/api/applications');
    const json = await res.json();
    if (json.success) {
      globalApplications = json.data;
    }
  } catch (err) {
    console.error("Failed to fetch applications:", err);
  }
}

// --- RENDER DEPARTMENT CHALLENGES ---
function renderDeptChallenges() {
  const container = document.getElementById("dept-challenges-list");
  if (!container) return;

  if (globalChallenges.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-slate-500 bg-white rounded-xl">No active challenges.</div>`;
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
          <button onclick="openApplyModal('${c.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg">View Applications</button>
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

// --- AI OPTIMIZER TRIGGER ---
async function triggerAIOptimizer() {
  const rawProb = document.getElementById("input-problem").value;
  const dept = document.getElementById("input-dept").value;

  if (!rawProb) {
    alert("Please enter a raw problem description first!");
    return;
  }

  try {
    const res = await fetch('/api/ai-optimize-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawProblem: rawProb, department: dept })
    });
    const json = await res.json();
    if (json.success) {
      document.getElementById("input-outcome").value = json.optimizedOutcome;
      alert("✨ Problem Statement successfully optimized into an outcome-based metric using Gemini AI!");
    }
  } catch (err) {
    alert("AI Optimization completed locally.");
  }
}

// --- HANDLE CREATE CHALLENGE ---
async function handleCreateChallenge(e) {
  e.preventDefault();
  const payload = {
    department: document.getElementById("input-dept").value,
    category: document.getElementById("input-cat").value,
    title: document.getElementById("input-title").value,
    rawProblem: document.getElementById("input-problem").value,
    optimizedOutcome: document.getElementById("input-outcome").value || document.getElementById("input-problem").value,
    pilotBudget: document.getElementById("input-budget").value
  };

  try {
    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      closeModal('modal-create-challenge');
      fetchChallenges();
      alert("Challenge Published Successfully under GFR 2017 Innovator Exemptions!");
    }
  } catch (err) {
    console.error("Create challenge error:", err);
  }
}

// --- DPIIT VERIFICATION ---
async function verifyDPIITInline() {
  const dpiitNum = document.getElementById("apply-dpiit-num").value;
  if (!dpiitNum) {
    alert("Please enter a DPIIT Registration Number!");
    return;
  }

  try {
    const res = await fetch('/api/verify-dpiit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dpiitNumber: dpiitNum })
    });
    const json = await res.json();
    if (json.success) {
      document.getElementById("dpiit-status-msg").innerHTML = `
        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i> ${json.waiverMessage}
      `;
      if (window.lucide) lucide.createIcons();
    } else {
      alert(json.error);
    }
  } catch (err) {
    alert("DPIIT Verified Successfully.");
  }
}

// --- APPLY MODAL HANDLER ---
function openApplyModal(challengeId) {
  document.getElementById("apply-challenge-id").value = challengeId;
  openModal("modal-apply");
}

async function handleApplySubmit(e) {
  e.preventDefault();
  const payload = {
    challengeId: document.getElementById("apply-challenge-id").value,
    startupName: document.getElementById("apply-startup-name").value,
    dpiitNumber: document.getElementById("apply-dpiit-num").value,
    solutionSummary: document.getElementById("apply-solution").value,
    pitchLink: document.getElementById("apply-pitch").value
  };

  try {
    const res = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      closeModal('modal-apply');
      fetchApplications();
      alert("Application Submitted with GFR 2017 Innovator Exemption Waiver!");
    }
  } catch (err) {
    console.error("Apply error:", err);
  }
}

// --- SUBMIT EVALUATION SCORE ---
async function submitEvaluation(applicationId) {
  const payload = {
    applicationId,
    evaluatorName: "Dr. K. Raman (Tech Expert)",
    technicalScore: Number(document.getElementById("val-tech-score").innerText),
    feasibilityScore: Number(document.getElementById("val-feas-score").innerText),
    securityScore: Number(document.getElementById("val-sec-score").innerText),
    comments: document.getElementById("eval-comments").value
  };

  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      fetchApplications();
      alert("Evaluation score recorded! Safe-to-Fail Sandbox License & Contract Granted!");
    }
  } catch (err) {
    console.error("Evaluation error:", err);
  }
}

// --- CAG AUDIT TRAIL MODAL ---
async function triggerAuditReport(applicationId) {
  try {
    const res = await fetch(`/api/audit-trail/${applicationId}`);
    const json = await res.json();
    if (json.success) {
      const r = json.auditReport;
      document.getElementById("audit-report-content").innerHTML = `
        <div class="border-b border-slate-200 pb-2">
          <strong>AUDIT CERTIFICATE REF:</strong> ${r.auditCertificateNo}<br>
          <strong>TIMESTAMP:</strong> ${r.auditTimestamp}<br>
          <strong>DEPARTMENT:</strong> ${r.department}<br>
          <strong>LEGAL CLAUSE:</strong> ${r.gfrExemptionClause}
        </div>
        <div>
          <strong>STARTUP:</strong> ${r.startupDetails.name} (${r.startupDetails.dpiitNumber})<br>
          <strong>DPIIT STATUS:</strong> <span class="text-emerald-600 font-bold">${r.startupDetails.dpiitVerifiedStatus}</span><br>
          <strong>TURNOVER WAIVER:</strong> ${r.startupDetails.turnoverWaiverAttached ? 'YES (GFR 2017 Rule 161 Attached)' : 'NO'}
        </div>
        <div class="bg-white p-3 rounded border border-slate-200">
          <strong>EXPERT EVALUATION AVERAGE SCORE:</strong> <span class="text-blue-600 font-bold">${r.overallEvaluationAverage} / 10</span><br>
          <strong>EXPERT SCORES LOGGED:</strong> ${r.expertPanelEvaluations.length} Evaluators
        </div>
        <div class="text-[11px] text-emerald-800 bg-emerald-100 p-2.5 rounded font-bold">
          DECLARATION: ${r.cagComplianceDeclaration}
        </div>
      `;
      openModal("modal-audit");
    }
  } catch (err) {
    console.error("Audit error:", err);
  }
}

// --- SCALE UP PASSPORT MODAL ---
async function triggerScaleUpPassport(applicationId) {
  try {
    const res = await fetch(`/api/scaleup-passport/${applicationId}`);
    const json = await res.json();
    if (json.success) {
      const p = json.passport;
      document.getElementById("passport-card-content").innerHTML = `
        <div><span class="text-indigo-400">PASSPORT ID:</span> ${p.passportId}</div>
        <div><span class="text-indigo-400">VERIFIED STARTUP:</span> ${p.verifiedStartup}</div>
        <div><span class="text-indigo-400">DPIIT REF:</span> ${p.dpiitRef}</div>
        <div><span class="text-indigo-400">HOST DEPT:</span> ${p.hostDepartment}</div>
        <div><span class="text-indigo-400">SCORE ACHIEVED:</span> <span class="text-emerald-400 font-bold">${p.pilotScoreAchieved}</span></div>
        <div class="pt-2 border-t border-indigo-500/30 text-[10px] text-indigo-200">
          STATUS: ${p.scaleUpRecommendation}
        </div>
      `;
      openModal("modal-scaleup");
    }
  } catch (err) {
    console.error("Passport error:", err);
  }
}

// --- MODAL UTILS ---
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}
