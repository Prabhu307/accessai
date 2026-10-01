import { SampleDoc } from '../types/accessibility';

export const SAMPLE_DOCUMENTS: SampleDoc[] = [
  {
    id: 'medical-discharge',
    title: 'Hospital Discharge & Medication Protocol',
    category: 'Medical & Health',
    icon: '🩺',
    summary: 'Complex hospital summary with pharmacological contraindications and renal metric warnings.',
    content: `PATIENT DISCHARGE SUMMARY & POST-AMBULATORY CARE PLAN
Patient: Doe, J. (DOB: 14-Aug-1972)
Admit Diagnosis: Acute exacerbation of hypertensive encephalopathy secondary to non-adherence.
Secondary Diagnoses: Hyperlipidemia, incipient Stage 3 Chronic Kidney Disease (CKD), and asymptomatic hyperuricemia.

LABORATORY FINDINGS UPON DISCHARGE:
Serum Creatinine: 1.84 mg/dL (Baseline estimated at 1.10 mg/dL).
Estimated Glomerular Filtration Rate (eGFR): 41 mL/min/1.73m² (CKD-EPI 2021 criteria).
Post-prandial serum glucose: 154 mg/dL. Fasting Lipid Profile: Total cholesterol 246 mg/dL, LDL-C 168 mg/dL, Triglycerides 210 mg/dL.
Electrocardiogram (ECG): Left ventricular hypertrophy with strain pattern, sinus tachycardia at 98 bpm without acute ST-T deviations.

PHARMACOTHERAPEUTIC REGIMEN:
1. Lisinopril: 20 mg PO b.i.d. Titrated for blood pressure control; monitor serum potassium and renal panel within 10 days.
2. Metoprolol Succinate ER: 50 mg PO q.d. each morning. Do not abruptly discontinue due to rebound sympathetic surge.
3. Atorvastatin calcium: 40 mg PO q.h.s. Advise patient regarding myalgia reporting.
4. Hydrochlorothiazide: 12.5 mg PO q.a.m.

ABSOLUTE CONTRAINDICATIONS & WARNINGS:
Concurrent administration of Non-Steroidal Anti-Inflammatory Drugs (NSAIDs, e.g., Ibuprofen, Naproxen sodium) is strictly contraindicated due to synergistic nephrotoxic insult risking acute tubular necrosis superimposed on preexisting chronic renal insufficiency. In the event of musculoskeletal discomfort, Acetaminophen (max 2000 mg/24h) may be considered.

MANDATORY AMBULATORY FOLLOW-UP:
Follow up with primary care physician within 7 to 10 days post-discharge. Schedule fasting metabolic panel, serum electrolytes, and BUN/Cr prior to clinical consultation. Cease sodium consumption exceeding 1,500 mg/diem.`
  },
  {
    id: 'legal-tos',
    title: 'Software Terms of Service & Data Policy',
    category: 'Legal & Privacy',
    icon: '📜',
    summary: 'Binding arbitration agreement, class action waiver, and automatic 12-month renewal clause.',
    content: `CLOUD SYNC ENTERPRISE - TERMS OF SERVICE AND ARBITRATION COVENANT (REV. 2026.04)

SECTION 14. MANDATORY BINDING ARBITRATION AND CLASS ACTION WAIVER
PLEASE READ THIS CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT.
14.1 Dispute Resolution. Except for claims concerning intellectual property infringement or equitable relief, all controversies, claims, or disputes arising out of or relating to this Agreement, including the arbitrability of any claims, shall be resolved exclusively through final and binding non-appearance-based arbitration administered by the American Arbitration Association (AAA) pursuant to its Commercial Arbitration Rules.
14.2 Class Action Waiver. YOU AND CLOUD SYNC AGREE THAT EACH PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING. The arbitrator may not consolidate more than one person's claims.

SECTION 18. AUTOMATIC SUBSCRIPTION RENEWAL AND FEE ADJUSTMENTS
18.1 Renewal Terms. Subscription plans automatically renew for successive twelve (12) month intervals at the prevailing undiscounted standard tier rate unless written notice of cancellation is served via certified electronic delivery no less than sixty (60) days prior to the expiration of the contemporaneous term.
18.2 Incurred Fees & Invoicing. Failure to transmit timely cancellation notices confers irrevocable authorization upon Cloud Sync to charge the primary linked credit facility. All remittances are strictly non-refundable and non-apportionable.

SECTION 22. THIRD-PARTY TELEMETRY AND BIOMETRIC SENSORY DATA LICENSING
By activating facial recognition or vocal biometric unlock, you grant to Licensor a perpetual, irrevocable, sublicensable, royalty-free, worldwide license to ingest, normalize, and distribute pseudonymized sensory representations to third-party generative artificial intelligence model development syndicates.`
  },
  {
    id: 'tax-notice',
    title: 'Government Benefit & Tax Offset Notice',
    category: 'Government & Tax',
    icon: '🏛️',
    summary: 'Urgent notice regarding administrative tax levy under IRC § 6331 and right to Collection Due Process hearing.',
    content: `DEPARTMENT OF THE TREASURY - INTERNAL REVENUE SERVICE
FORM LT11: NOTICE OF INTENT TO LEVY AND NOTICE OF YOUR RIGHT TO A HEARING
Taxpayer ID: XXX-XX-4912 | Tax Period: Dec 31, 2024 | Notice Date: October 01, 2026

URGENT: FINAL NOTICE PRIOR TO SEIZURE OF PROPERTY UNDER INTERNAL REVENUE CODE SECTION 6331(d)

AMOUNT OWED: $4,812.63 (Including accrued statutory interest under IRC § 6601 and failure-to-pay penalties pursuant to IRC § 6651(a)(2)).

We previously sent you notices inquiring about your unpaid liability, but we have received neither full remittance nor adequate substantiated justification for non-payment. Under the authority of Section 6331 of the Internal Revenue Code, we intend to levy upon your property, bank accounts, wages, commissions, or social security disbursements thirty (30) days from the date of this correspondence.

YOUR STATUTORY RIGHT TO A COLLECTION DUE PROCESS (CDP) HEARING:
Pursuant to Internal Revenue Code Section 6330, you possess the administrative right to request a CDP hearing before the independent IRS Independent Office of Appeals. To preserve this statutory entitlement, Form 12153 (Request for a Collection Due Process or Equivalent Hearing) must be postmarked or electronically transmitted within exactly thirty (30) days of the date printed on this notice. Failure to petition within this strict statutory timeframe terminates your judicial appeal rights to the United States Tax Court.`
  },
  {
    id: 'tenant-lease',
    title: 'Residential Lease & Deposit Withholding Agreement',
    category: 'Housing & Tenancy',
    icon: '🏠',
    summary: 'Lease provisions on joint liability, 48-hour cure notices, and deposit forfeiture triggers.',
    content: `STANDARD RESIDENTIAL TENANCY AGREEMENT - LEASE CONDITIONS
Premises: 742 Evergreen Terrace, Apt 4B.

CLAUSE 7: JOINT AND SEVERAL LIABILITY
Each signatory named herein as a Tenant covenants and agrees that their financial and legal obligations under this Indenture are joint and several. In the event of default or non-payment of apportioned rental considerations by any individual co-tenant, Landlord reserves the unrestricted right to seek full satisfaction of all outstanding sums, including accelerated rent, late charges, and legal fees, from any single individual signatory without obligation to initiate proceeding against delinquent co-tenants.

CLAUSE 11: REPAIR DEDUCTIONS AND SECURITY DEPOSIT LIQUIDATION
The initial deposit of $2,400.00 shall be maintained in an escrow account. Upon surrender of occupancy, Landlord shall inspect the premises. Tenant acknowledges that normal wear and tear shall not encompass carpet discoloration exceeding 5% surface area, micro-abrasions to engineered hardwood surfaces, or unpainted picture-hook apertures. Repair disbursements shall be billed at a standard liquidated rate of $85.00 per tradesperson hour plus 25% materials procurement surcharge.

CLAUSE 19: RIGHT OF ENTRY AND 48-HOUR CURE PERIOD
Failure to maintain uninterrupted electric or sanitary utilities constitutes a substantial breach of the covenant of habitability. Landlord may issue a 48-Hour Notice to Cure; failure to re-establish verified utility accounts within forty-eight hours entitles Landlord to effectuate summary non-judicial lockout in accordance with statutory provisions.`
  },
  {
    id: 'science-abstract',
    title: 'Biomedical Research: CRISPR Off-Target Kinetics',
    category: 'Science & Academia',
    icon: '🔬',
    summary: 'High-density molecular biology abstract discussing endonuclease kinetics and non-homologous end-joining.',
    content: `JOURNAL OF MOLECULAR THERAPEUTICS (PREPRINT)
Title: High-Fidelity SpCas9-HF1 Endonuclease Kinetics and Non-Homologous End-Joining Profiles in Primary Human Hematopoietic Stem Cells.

ABSTRACT:
Targeted genomic ablation utilizing clustered regularly interspaced short palindromic repeats (CRISPR)-associated endonucleases has emerged as a paradigm-shifting modality in molecular therapeutics. Nevertheless, unintended non-canonical protospacer-adjacent motif (PAM) interrogation compromises programmatic specificity. Here, we evaluate the comparative catalytic kinetics of canonical wild-type Streptococcus pyogenes Cas9 (wtSpCas9) versus engineered SpCas9-HF1 utilizing dual-guide RNA stoichiometry in primary CD34+ human hematopoietic stem and progenitor cells (HSPCs).

Chromatin immunoprecipitation followed by high-throughput sequencing (ChIP-seq) combined with GUIDE-seq revealed that while wtSpCas9 generated recurrent off-target double-strand breaks (DSBs) across homologous loci with single-base mismatches at the distal 5' seed sequence, SpCas9-HF1 exhibited near-complete abrogated off-target cleavage while sustaining >88% on-target editing efficiency. Deep sequencing of non-homologous end-joining (NHEJ) repair spectra demonstrated a marked reduction in chromosomal translocation frequency (p < 0.001). These mechanistic findings substantiate the clinical viability of engineered ribonucleoprotein complexes for ex vivo hematopoietic gene editing.`
  }
];
