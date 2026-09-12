const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory Database Store
let challenges = [
  {
    id: "CHAL-MH-2026-001",
    department: "Brihanmumbai Municipal Corporation (BMC)",
    title: "AI-Powered Mithi River Flood & Pumping Station Telemetry",
    rawProblem: "Mithi river water levels surge during high tide monsoons, causing severe flooding in Kurla and Dadar.",
    optimizedOutcome: "Deploy IoT radar sensors & AI predictive telemetry to control floodgate pumping stations with 45-minute advance alert, reducing monsoon waterlogging by 40% in Kurla East.",
    category: "Smart Municipal Infrastructure",
    pilotBudget: "₹15,00,000",
    maxDurationDays: 90,
    status: "OPEN",
    createdAt: "2026-08-28",
    dpiitExemptionGranted: true,
    msinsExemptionGranted: true,
    gfrClause: "Maharashtra Startup Policy Sec 4.2 & GFR 2017 Rule 161",
    targetKPIs: [
      "Radar water level accuracy > 98%",
      "Predictive pump activation lead time >= 30 mins",
      "Zero downtime during 48-hour continuous Mumbai monsoon test"
    ]
  },
  {
    id: "CHAL-MH-2026-002",
    department: "Pune Municipal Corporation (PMC) & Health Dept",
    title: "Autonomous Medical Vaccine Logistics for Rural Sub-Districts",
    rawProblem: "Vaccine transportation to remote PHCs experiences thermal degradation in transit.",
    optimizedOutcome: "Deploy autonomous thermal drones maintaining 2°C-8°C cold chain within 35km radius of Pune district hubs.",
    category: "HealthTech & Supply Chain",
    pilotBudget: "₹15,00,000",
    maxDurationDays: 60,
    status: "PILOT_ACTIVE",
    createdAt: "2026-08-20",
    dpiitExemptionGranted: true,
    msinsExemptionGranted: true,
    gfrClause: "Maharashtra Startup Policy Sec 4.2 & GFR 2017 Rule 161",
    targetKPIs: [
      "Maintain 2°C-8°C thermal integrity during 40-min flight",
      "GPS telemetry update rate <= 10 seconds"
    ]
  }
];

let applications = [
  {
    id: "APP-9012",
    challengeId: "CHAL-2026-002",
    startupName: "AeroMed Robotics Pvt Ltd",
    dpiitNumber: "DPIIT89421",
    dpiitVerified: true,
    turnoverWaiverApplied: true,
    solutionSummary: "Custom hybrid-VTOL medical drone equipped with IoT temperature telemetry and fail-safe return-to-home protocols.",
    pitchLink: "https://aeromed.tech/pitch-deck-v2.pdf",
    appliedDate: "2026-08-22",
    scores: [
      { evaluator: "Dr. K. Raman (Tech Expert)", technicalScore: 9, feasibilityScore: 9, securityScore: 8, comments: "Outstanding VTOL stability logs." },
      { evaluator: "S. Meenakshi (Gov Procurement Lead)", technicalScore: 8, feasibilityScore: 9, securityScore: 9, comments: "DPIIT status verified. Risk score low." }
    ],
    averageScore: 8.7,
    status: "SHORTLISTED_FOR_SANDBOX",
    contract: {
      contractId: "AGR-2026-881",
      signedDate: "2026-08-25",
      ipClause: "Background IP retained 100% by Startup. Non-exclusive foreground procurement license granted upon successful scale-up.",
      safeToFailClause: "Approved under State Sandbox Waiver Framework 2026. Department indemnity active.",
      cybersecurityStatus: "CERT-In Pre-screen Checklist Compliant"
    },
    milestones: [
      {
        id: "M1",
        title: "Phase 1: Thermal Container & System Calibration",
        amount: "₹7,50,000",
        status: "COMPLETED",
        disbursed: true,
        disbursedDate: "2026-08-26",
        proofSummary: "Lab test logs verified. 2°C maintained for 3 hours."
      },
      {
        id: "M2",
        title: "Phase 2: Live 30km Field Transit Trial",
        amount: "₹10,00,000",
        status: "IN_PROGRESS",
        disbursed: false,
        disbursedDate: null,
        proofSummary: "Telemetry data being logged live."
      },
      {
        id: "M3",
        title: "Phase 3: Independent Validation & Final Report",
        amount: "₹7,50,000",
        status: "PENDING",
        disbursed: false,
        disbursedDate: null,
        proofSummary: "Awaiting Phase 2 completion."
      }
    ]
  }
];

// --- REST API ENDPOINTS ---

// 1. Get all challenges
app.get('/api/challenges', (req, res) => {
  res.json({ success: true, count: challenges.length, data: challenges });
});

// 2. AI Problem Optimizer Simulation
app.post('/api/ai-optimize-challenge', (req, res) => {
  const { rawProblem, department } = req.body;
  if (!rawProblem) return res.status(400).json({ success: false, error: "Raw problem required" });

  const optimizedOutcome = `Deploy specialized technology solutions to address "${rawProblem.trim()}" in ${department || 'the target district'}, setting a 90-day pilot KPI metric for 35% efficiency improvement and 99% operational SLA compliance under zero-turnover innovator exemptions.`;
  
  res.json({
    success: true,
    optimizedOutcome,
    suggestedKPIs: [
      "KPI 1: Operational response time reduction by >= 30%",
      "KPI 2: Zero high-severity cybersecurity vulnerabilities detected",
      "KPI 3: 95% user satisfaction metric during pilot sandbox period"
    ]
  });
});

// 3. Post a new challenge
app.post('/api/challenges', (req, res) => {
  const { department, title, rawProblem, optimizedOutcome, category, pilotBudget, targetKPIs } = req.body;
  
  const newChallenge = {
    id: `CHAL-2026-00${challenges.length + 1}`,
    department: department || "State Public Works Dept",
    title: title || "New Innovation Challenge",
    rawProblem: rawProblem || "",
    optimizedOutcome: optimizedOutcome || rawProblem,
    category: category || "Civic Tech",
    pilotBudget: pilotBudget || "₹10,00,000",
    maxDurationDays: 90,
    status: "OPEN",
    createdAt: new Date().toISOString().split('T')[0],
    dpiitExemptionGranted: true,
    gfrClause: "GFR 2017 Rule 161 (Innovator Exemption)",
    targetKPIs: targetKPIs || ["Target KPI 1: 30% performance boost"]
  };

  challenges.unshift(newChallenge);
  res.json({ success: true, message: "Challenge posted successfully!", challenge: newChallenge });
});

// 4. Instant DPIIT Verification endpoint
app.post('/api/verify-dpiit', (req, res) => {
  const { dpiitNumber } = req.body;
  if (!dpiitNumber) return res.status(400).json({ success: false, error: "DPIIT number required" });

  const isValid = dpiitNumber.toUpperCase().startsWith("DPIIT") && dpiitNumber.length >= 7;
  
  if (isValid) {
    res.json({
      success: true,
      verified: true,
      dpiitNumber: dpiitNumber.toUpperCase(),
      entityName: "DPIIT Registered Innovator Entity",
      gfrWaiverEligible: true,
      waiverMessage: "Eligible for GFR 2017 Rule 161 Turnover & Experience Waiver"
    });
  } else {
    res.status(400).json({
      success: false,
      verified: false,
      error: "Invalid DPIIT format. Must start with DPIIT followed by numbers (e.g. DPIIT123456)."
    });
  }
});

// 5. Submit Startup Application
app.post('/api/apply', (req, res) => {
  const { challengeId, startupName, dpiitNumber, solutionSummary, pitchLink } = req.body;
  
  const newApp = {
    id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
    challengeId,
    startupName: startupName || "Innovator Startup",
    dpiitNumber: dpiitNumber || "DPIIT123456",
    dpiitVerified: true,
    turnoverWaiverApplied: true,
    solutionSummary,
    pitchLink: pitchLink || "https://example.com/pitch.pdf",
    appliedDate: new Date().toISOString().split('T')[0],
    scores: [],
    averageScore: 0,
    status: "UNDER_EXPERT_REVIEW",
    contract: null,
    milestones: [
      { id: "M1", title: "Phase 1: Prototype Setup & Initial Test", amount: "₹3,00,000", status: "PENDING", disbursed: false },
      { id: "M2", title: "Phase 2: Live Field Trial", amount: "₹4,00,000", status: "PENDING", disbursed: false },
      { id: "M3", title: "Phase 3: Final KPI Report & Validation", amount: "₹3,00,000", status: "PENDING", disbursed: false }
    ]
  };

  applications.unshift(newApp);
  res.json({ success: true, message: "Application submitted with DPIIT GFR 2017 Waiver!", application: newApp });
});

// 6. Get Applications for Evaluation
app.get('/api/applications', (req, res) => {
  res.json({ success: true, data: applications });
});

// 7. Expert Panel Scoring
app.post('/api/evaluate', (req, res) => {
  const { applicationId, evaluatorName, technicalScore, feasibilityScore, securityScore, comments } = req.body;
  const appItem = applications.find(a => a.id === applicationId);
  if (!appItem) return res.status(404).json({ success: false, error: "Application not found" });

  const scoreObj = {
    evaluator: evaluatorName || "Independent Technical Expert",
    technicalScore: Number(technicalScore) || 8,
    feasibilityScore: Number(feasibilityScore) || 8,
    securityScore: Number(securityScore) || 8,
    comments: comments || "Feasible pilot design."
  };

  appItem.scores.push(scoreObj);
  const totalAvg = appItem.scores.reduce((acc, s) => acc + (s.technicalScore + s.feasibilityScore + s.securityScore) / 3, 0) / appItem.scores.length;
  appItem.averageScore = parseFloat(totalAvg.toFixed(1));

  if (appItem.averageScore >= 7.5 && appItem.status === "UNDER_EXPERT_REVIEW") {
    appItem.status = "SHORTLISTED_FOR_SANDBOX";
    appItem.contract = {
      contractId: `AGR-2026-${Math.floor(100 + Math.random() * 900)}`,
      signedDate: new Date().toISOString().split('T')[0],
      ipClause: "Background IP retained 100% by Startup. Non-exclusive foreground procurement license granted upon successful scale-up.",
      safeToFailClause: "Approved under State Sandbox Waiver Framework 2026. Department indemnity active.",
      cybersecurityStatus: "CERT-In Pre-screen Checklist Compliant"
    };
  }

  res.json({ success: true, message: "Evaluation score submitted successfully!", application: appItem });
});

// 8. Update Milestone Status & Trigger Escrow Release
app.post('/api/update-milestone', (req, res) => {
  const { applicationId, milestoneId, action, proofSummary } = req.body;
  const appItem = applications.find(a => a.id === applicationId);
  if (!appItem) return res.status(404).json({ success: false, error: "Application not found" });

  const milestone = appItem.milestones.find(m => m.id === milestoneId);
  if (!milestone) return res.status(404).json({ success: false, error: "Milestone not found" });

  if (action === "COMPLETE_AND_DISBURSE") {
    milestone.status = "COMPLETED";
    milestone.disbursed = true;
    milestone.disbursedDate = new Date().toISOString().split('T')[0];
    if (proofSummary) milestone.proofSummary = proofSummary;
  }

  // Check if all milestones completed -> Grant Scale-Up Passport
  const allCompleted = appItem.milestones.every(m => m.status === "COMPLETED");
  if (allCompleted) {
    appItem.status = "SCALE_UP_APPROVED";
  }

  res.json({ success: true, message: `Milestone ${milestoneId} updated!`, application: appItem });
});

// 9. Generate 1-Click CAG Audit Trail PDF/JSON Data
app.get('/api/audit-trail/:applicationId', (req, res) => {
  const appItem = applications.find(a => a.id === req.params.applicationId);
  if (!appItem) return res.status(404).json({ success: false, error: "Application not found" });

  const challenge = challenges.find(c => c.id === appItem.challengeId) || challenges[0];

  const auditReport = {
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
    overallEvaluationAverage: appItem.averageScore,
    contractRef: appItem.contract,
    milestonePaymentAudit: appItem.milestones.map(m => ({
      milestone: m.title,
      amount: m.amount,
      status: m.status,
      disbursedDate: m.disbursedDate,
      proofVerified: !!m.proofSummary
    })),
    cagComplianceDeclaration: "This innovation pilot was conducted under pre-approved Sandbox Framework Rules 2026 and GFR 2017 Rule 161. Zero audit liability incurred."
  };

  res.json({ success: true, auditReport });
});

// 10. Scale-Up Passport Verification Endpoint
app.get('/api/scaleup-passport/:applicationId', (req, res) => {
  const appItem = applications.find(a => a.id === req.params.applicationId);
  if (!appItem) return res.status(404).json({ success: false, error: "Application not found" });
  const challenge = challenges.find(c => c.id === appItem.challengeId) || challenges[0];

  const passport = {
    passportId: `SCALEUP-PASS-${appItem.id}`,
    issueDate: new Date().toISOString().split('T')[0],
    verifiedStartup: appItem.startupName,
    dpiitRef: appItem.dpiitNumber,
    hostDepartment: challenge.department,
    validatedSolution: challenge.title,
    pilotScoreAchieved: `${appItem.averageScore} / 10`,
    scaleUpRecommendation: "APPROVED FOR DIRECT CROSS-DISTRICT & CROSS-DEPARTMENT PROCUREMENTS WITHOUT RE-PILOTING",
    qrVerificationHash: `SHA256-${Math.random().toString(36).substring(2, 15).toUpperCase()}`
  };

  res.json({ success: true, passport });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`🚀 GovTech Procurement Pathway App running on http://localhost:${PORT}`);
  console.log(`===========================================================`);
});

module.exports = app;
