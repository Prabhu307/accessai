import { TransformedDocument } from '../types/accessibility';

export const INITIAL_DEMO_RESULT: TransformedDocument = {
  title: 'Hospital Discharge Summary: High Blood Pressure & Kidney Care Guide',
  documentType: 'Medical & Pharmacotherapy',
  originalReadingGrade: 'Grade 16+ (Post-Graduate / Clinical)',
  simplifiedReadingGrade: 'Grade 4 (Plain English)',
  readingTimeOriginal: '7.5 min',
  readingTimeSimplified: '1.5 min',
  jargonDensityReduction: '86% simpler vocabulary',
  urgencyLevel: 'High / Immediate Action Required',
  oneSentenceSummary:
    'You are leaving the hospital after an emergency high blood pressure flare-up; you must take your new blood pressure medicines daily and strictly avoid Advil, Motrin, or Aleve to protect your kidneys.',
  keyTakeaways: [
    {
      emoji: '🚨',
      point: 'Never take NSAID pain relievers (like Ibuprofen, Advil, Aleve, or Naproxen). They can cause sudden, dangerous kidney damage.',
    },
    {
      emoji: '💊',
      point: 'Take all four prescribed heart and blood pressure pills as directed. Do not stop suddenly, especially Metoprolol.',
    },
    {
      emoji: '🩺',
      point: 'See your primary doctor within 7 to 10 days for a blood test to check kidney function and potassium levels.',
    },
    {
      emoji: '🧂',
      point: 'Cut back on salt (under 1,500 mg per day—about 2/3 teaspoon of table salt).',
    },
  ],
  actionItems: [
    {
      id: 'act-1',
      step: 'Throw away or lock away all Ibuprofen (Advil/Motrin) and Naproxen (Aleve). If you have aches or pain, only take Tylenol (Acetaminophen) up to 2000mg per day.',
      priority: 'urgent',
      deadlineOrTiming: 'Immediately today',
      tip: 'Check labels on cold/flu multi-symptom medicines too—many hide ibuprofen.',
    },
    {
      id: 'act-2',
      step: 'Call your primary care doctor to schedule your post-discharge appointment and lab blood work.',
      priority: 'urgent',
      deadlineOrTiming: 'Within 7 to 10 days',
      tip: 'Ask the clinic to order your metabolic blood panel before your visit.',
    },
    {
      id: 'act-3',
      step: 'Organize your daily medication pills into a morning and evening pill organizer.',
      priority: 'important',
      deadlineOrTiming: 'Starting tomorrow morning',
      tip: 'Set a daily phone reminder at 8:00 AM and 8:00 PM.',
    },
    {
      id: 'act-4',
      step: 'Reduce sodium (salt) in meals by avoiding canned soups, frozen dinners, and fast food.',
      priority: 'routine',
      deadlineOrTiming: 'Every day ongoing',
      tip: 'Flavor food with lemon juice, garlic, onion powder, and fresh herbs instead of table salt.',
    },
  ],
  easyReadSections: [
    {
      heading: 'Why You Were in the Hospital',
      emoji: '🏥',
      content:
        'You were admitted because your blood pressure climbed dangerously high, causing pressure on your brain and body. This happened after some missed medication doses. The hospital team safely stabilized your vitals.',
      bulletPoints: [
        'Your kidneys are working at about 41% normal speed (Stage 3 Kidney Disease), so they need extra protection.',
        'Your cholesterol and heart rate were also elevated, but stable upon leaving.',
      ],
      importantNotice:
        'If you experience sudden severe headaches, blurred vision, or chest pain, seek emergency medical care immediately.',
    },
    {
      heading: 'Your Daily Medication Schedule',
      emoji: '💊',
      content:
        'You have four daily medicines. Each one protects a specific part of your cardiovascular system.',
      bulletPoints: [
        'Lisinopril (20 mg): Take twice a day (morning and night) to relax your blood vessels.',
        'Metoprolol Succinate (50 mg): Take every morning. Do NOT stop taking this pill suddenly, as your heart rate could spike.',
        'Hydrochlorothiazide (12.5 mg): Take every morning with water. This water pill removes excess fluid.',
        'Atorvastatin (40 mg): Take every night at bedtime to lower cholesterol and protect your arteries.',
      ],
      importantNotice:
        'Report any unexplained muscle pain or tenderness right away to your physician.',
    },
    {
      heading: 'Critical Warning: Pain Relievers to Avoid',
      emoji: '⚠️',
      content:
        'Because your kidneys are weakened, common over-the-counter anti-inflammatory painkillers can permanently damage them.',
      bulletPoints: [
        'DO NOT TAKE: Ibuprofen, Advil, Motrin, Aleve, Naproxen, or high-dose Aspirin.',
        'SAFE ALTERNATIVE: Tylenol (Acetaminophen) for mild headaches or body aches, up to 2,000 mg in 24 hours.',
      ],
      importantNotice:
        'Always ask the pharmacist or doctor before starting any new herbal supplements or over-the-counter medicine.',
    },
  ],
  dyslexiaSupport: {
    syllableBreakdowns: [
      {
        word: 'contraindication',
        phonetic: 'con-tra-in-di-ca-tion',
        definition: 'A specific medical warning that says two medicines should never be used together because they cause harm.',
      },
      {
        word: 'encephalopathy',
        phonetic: 'en-ceph-a-lop-a-thy',
        definition: 'Temporary brain confusion or stress caused by dangerously high blood pressure.',
      },
      {
        word: 'creatinine',
        phonetic: 'cre-at-i-nine',
        definition: 'A natural waste product in your blood. When this number is high, it means the kidneys are filtering more slowly.',
      },
      {
        word: 'atorvastatin',
        phonetic: 'a-tor-va-sta-tin',
        definition: 'A common daily cholesterol-lowering pill (Lipitor) that protects your blood vessels from clogging.',
      },
    ],
    biteSizedSummary: [
      'You had an emergency from high blood pressure.',
      'You are safe now, but must take 4 pills every day.',
      'Never take Advil, Aleve, or Motrin—they hurt your kidneys.',
      'Only use Tylenol for pain.',
      'See your regular doctor within 10 days.',
    ],
  },
  glossary: [
    {
      term: 'Hypertensive Encephalopathy',
      simpleDefinition: 'Brain strain from extremely high blood pressure',
      analogy: 'Like over-pumping a bicycle tire until the rubber bulges under too much air pressure.',
    },
    {
      term: 'Contraindication',
      simpleDefinition: 'A strict rule not to take something',
      analogy: 'Like pouring cold water onto a hot glass baking dish—it causes cracks and damage.',
    },
    {
      term: 'eGFR (41 mL/min)',
      simpleDefinition: 'Kidney filtration speed score',
      analogy: 'Like a water filter that is running at half speed; it still works, but you cannot overload it.',
    },
    {
      term: 'Titrated',
      simpleDefinition: 'Carefully adjusted to the right dose',
      analogy: 'Like tuning a guitar string until it hits the exact right pitch.',
    },
    {
      term: 'Non-Adherence',
      simpleDefinition: 'Missing pills or not following the schedule',
      analogy: 'Skipping routine oil changes in your car until the engine warning light turns on.',
    },
  ],
  qaCards: [
    {
      question: 'What happens if I take an Ibuprofen or Advil for my headache?',
      answer:
        'Because your kidneys are already operating at 41% capacity, NSAID drugs like Ibuprofen can block blood flow inside your kidney filters, causing sudden kidney failure. Please take Tylenol (Acetaminophen) instead.',
    },
    {
      question: 'Can I stop taking Metoprolol if my blood pressure feels normal?',
      answer:
        'No. Never stop Metoprolol suddenly. Stopping abruptly can cause a dangerous rebound where your heart rate shoots up and blood pressure spikes. Only adjust it under your doctor’s direct instruction.',
    },
    {
      question: 'When should I go back to the hospital?',
      answer:
        'Go to the Emergency Room immediately if you get a severe sudden headache, chest tightness, shortness of breath, sudden numbness, or if your vision gets blurry.',
    },
  ],
  visualNodes: [
    {
      id: 'node-heart',
      icon: '❤️',
      label: 'Heart & Blood Pressure',
      relation: 'Controlled by Lisinopril and Metoprolol daily',
      status: 'safe',
    },
    {
      id: 'node-kidneys',
      icon: '🫘',
      label: 'Kidneys (eGFR 41)',
      relation: 'At risk: NSAID pain relievers strictly forbidden',
      status: 'action_needed',
    },
    {
      id: 'node-followup',
      icon: '📅',
      label: 'Doctor Appointment',
      relation: 'Mandatory blood test within 7 to 10 days',
      status: 'action_needed',
    },
    {
      id: 'node-diet',
      icon: '🥗',
      label: 'Low Salt Nutrition',
      relation: 'Limit to under 1,500 mg sodium daily',
      status: 'info',
    },
    {
      id: 'node-lipids',
      icon: '🩸',
      label: 'Cholesterol Protection',
      relation: 'Atorvastatin 40mg each bedtime',
      status: 'safe',
    },
  ],
  audioNarrationScript:
    'Hello. This is your ClarifyAI summary for your hospital discharge. You are heading home after an episode of severely elevated blood pressure. Here is what you need to know today. First: do not take any anti-inflammatory pain medicine like Ibuprofen, Advil, or Aleve, because your kidneys are vulnerable right now. If you have pain, Tylenol is safe. Second: take your four prescribed medications every day without skipping, especially your morning heart medicine. Third: schedule a follow-up visit with your doctor within seven to ten days for a routine blood test. And finally, keep your daily salt intake low. You are in good hands—take it one day at a time.',
};

export const PRECOMPUTED_DEMOS: Record<string, TransformedDocument> = {
  'medical-discharge': INITIAL_DEMO_RESULT,
  'legal-tos': {
    title: 'Terms of Service Guide: Arbitration, Auto-Renewal & Biometric Data',
    documentType: 'Legal & Privacy Agreement',
    originalReadingGrade: 'Grade 17+ (Law School / Contract)',
    simplifiedReadingGrade: 'Grade 4 (Plain English)',
    readingTimeOriginal: '6 min',
    readingTimeSimplified: '1.2 min',
    jargonDensityReduction: '89% simpler vocabulary',
    urgencyLevel: 'Moderate / Action Before Deadlines',
    oneSentenceSummary:
      'By using this app, you give up your right to sue in court, your subscription automatically renews every 12 months unless cancelled 60 days ahead, and your voice/face data is shared with AI companies.',
    keyTakeaways: [
      {
        emoji: '⚖️',
        point: 'No Court or Class Action: You cannot join other users in a lawsuit. All disputes must go through private arbitration.',
      },
      {
        emoji: '💳',
        point: '60-Day Renewal Trap: Your card will be charged for another full year unless you cancel at least 60 days before your year ends.',
      },
      {
        emoji: '👁️',
        point: 'Biometric Licensing: Using face or voice unlock lets the company share your voice and face scans with outside AI companies.',
      },
    ],
    actionItems: [
      {
        id: 'tos-1',
        step: 'Set a calendar reminder for 70 days before your subscription ends to decide whether to cancel.',
        priority: 'urgent',
        deadlineOrTiming: 'At least 60 days prior to renewal',
        tip: 'Send cancellation via certified electronic mail as required by Section 18.',
      },
      {
        id: 'tos-2',
        step: 'Consider turning off Face or Voice unlock in settings if you do not want your biometric data licensed to AI developers.',
        priority: 'important',
        deadlineOrTiming: 'Immediate',
        tip: 'Use standard password or PIN instead.',
      },
    ],
    easyReadSections: [
      {
        heading: 'What You Are Giving Up in Court',
        emoji: '🏛️',
        content:
          'Section 14 says you cannot take this company to a regular public court. If you have an argument or claim, it must go to a private arbitrator. You also cannot join a class action lawsuit with other customers.',
        bulletPoints: [
          'Arbitration is private and final.',
          'You cannot have a jury trial.',
        ],
      },
      {
        heading: 'Subscription & Renewal Terms',
        emoji: '🔄',
        content:
          'Your plan auto-renews for 12 months at full price. To stop the renewal charge, you must give written notice at least 60 days in advance. All charges are non-refundable.',
      },
      {
        heading: 'Your Face & Voice Data',
        emoji: '👤',
        content:
          'If you use facial recognition or voice unlock, you grant a permanent global license for the company to give that data to AI development groups.',
      },
    ],
    dyslexiaSupport: {
      syllableBreakdowns: [
        {
          word: 'arbitration',
          phonetic: 'ar-bi-tra-tion',
          definition: 'A way to resolve a dispute outside of court with a private referee.',
        },
        {
          word: 'subcontract',
          phonetic: 'sub-con-tract',
          definition: 'Hiring another company to do part of the work.',
        },
      ],
      biteSizedSummary: [
        'You cannot sue this company in court.',
        'Subscription renews automatically every year.',
        'Cancel 60 days before the renewal date.',
        'Face and voice data can be shared with AI firms.',
      ],
    },
    glossary: [
      {
        term: 'Binding Arbitration',
        simpleDefinition: 'Settling arguments privately without a judge or jury',
        analogy: 'Like letting a hired referee make the final decision with no appeals.',
      },
      {
        term: 'Class Action Waiver',
        simpleDefinition: 'Giving up the right to team up with others to sue',
        analogy: 'Having to fight a giant alone rather than joining the whole village.',
      },
    ],
    qaCards: [
      {
        question: 'Can I get a refund if I cancel 10 days late?',
        answer: 'No. The agreement explicitly states all remittances are strictly non-refundable.',
      },
      {
        question: 'Can I opt out of sharing my voice and face data?',
        answer: 'Yes, by turning off biometric unlock features and using a traditional password.',
      },
    ],
    visualNodes: [
      { id: 'v1', icon: '⚖️', label: 'Arbitration', relation: 'Disputes handled privately without court', status: 'info' },
      { id: 'v2', icon: '💳', label: '60-Day Notice', relation: 'Must cancel before 60-day deadline', status: 'action_needed' },
      { id: 'v3', icon: '👤', label: 'Biometrics', relation: 'Voice/face data shared with AI models', status: 'action_needed' },
    ],
    audioNarrationScript:
      'This terms of service document contains three main rules. First, you agree to resolve disputes in private arbitration instead of a court of law. Second, your annual subscription renews automatically unless you cancel at least 60 days early. Third, activating facial or voice unlock allows the company to share your biometric representations with AI model developers. You can protect your privacy by using a PIN instead of facial recognition.',
  },
  'tax-notice': {
    title: 'IRS Tax Notice Guide: Form LT11 Notice of Intent to Levy',
    documentType: 'Government & Tax Notice',
    originalReadingGrade: 'Grade 15+ (Statutory Administrative)',
    simplifiedReadingGrade: 'Grade 4 (Plain English)',
    readingTimeOriginal: '5 min',
    readingTimeSimplified: '1.1 min',
    jargonDensityReduction: '88% simpler vocabulary',
    urgencyLevel: 'High / Immediate Action Required',
    oneSentenceSummary:
      'The IRS intends to seize your wages or bank accounts for an unpaid balance of $4,812.63 within 30 days unless you pay, set up a plan, or file Form 12153 for an appeal hearing.',
    keyTakeaways: [
      {
        emoji: '⚠️',
        point: 'Strict 30-Day Deadline: You have exactly 30 days from the notice date to respond before asset seizure can begin.',
      },
      {
        emoji: '💰',
        point: 'Amount Claimed: $4,812.63 including penalties and interest for the 2024 tax period.',
      },
      {
        emoji: '🛡️',
        point: 'Appeal Rights: Filing Form 12153 puts a legal hold on seizure and gives you an independent hearing.',
      },
    ],
    actionItems: [
      {
        id: 'tax-1',
        step: 'Fill out and mail IRS Form 12153 (Request for a Collection Due Process Hearing) via certified mail with tracking.',
        priority: 'urgent',
        deadlineOrTiming: 'Within exactly 30 days',
        tip: 'Keep the post office certified receipt as proof of postmark.',
      },
      {
        id: 'tax-2',
        step: 'If you cannot pay the full $4,812.63, request an installment agreement or offer-in-compromise.',
        priority: 'urgent',
        deadlineOrTiming: 'Immediately',
        tip: 'The IRS has online payment plans that can be set up in 10 minutes.',
      },
    ],
    easyReadSections: [
      {
        heading: 'What This Notice Means',
        emoji: '🏛️',
        content:
          'This is a final warning from the Internal Revenue Service. It means they claim you owe $4,812.63 from 2024. If they do not hear from you within 30 days, they have legal power to take money directly from your wages or bank account.',
      },
      {
        heading: 'How to Protect Yourself Immediately',
        emoji: '🛡️',
        content:
          'You have the legal right to ask for a Collection Due Process hearing by filing Form 12153. Filing this form temporarily halts bank or paycheck seizures while your case is reviewed.',
      },
    ],
    dyslexiaSupport: {
      syllableBreakdowns: [
        {
          word: 'garnishment',
          phonetic: 'gar-nish-ment',
          definition: 'Taking money directly from your paycheck before you get it.',
        },
        {
          word: 'statutory',
          phonetic: 'stat-u-to-ry',
          definition: 'Required or permitted by formal written law.',
        },
      ],
      biteSizedSummary: [
        'The IRS says you owe $4,812.63.',
        'You have 30 days to act.',
        'They can take money from wages or bank accounts.',
        'File Form 12153 to stop seizure and request a hearing.',
      ],
    },
    glossary: [
      {
        term: 'Levy',
        simpleDefinition: 'Legal seizure of your money or property',
        analogy: 'Like the bank automatically taking money from your wallet to pay an overdue fine.',
      },
      {
        term: 'Collection Due Process (CDP)',
        simpleDefinition: 'An independent appeal hearing with the IRS',
        analogy: 'Calling a neutral mediator to review your payment options before any action is taken.',
      },
    ],
    qaCards: [
      {
        question: 'Will they take my money tomorrow?',
        answer: 'No. By law, they must give you 30 days from the notice date before starting a levy.',
      },
      {
        question: 'What if I cannot afford to pay $4,812.63 right now?',
        answer: 'You can apply for a monthly payment plan or ask to be placed in currently not collectible status.',
      },
    ],
    visualNodes: [
      { id: 'tax-n1', icon: '💵', label: '$4,812.63 Balance', relation: '2024 tax, penalties, and interest', status: 'action_needed' },
      { id: 'tax-n2', icon: '⏰', label: '30-Day Window', relation: 'Strict statutory clock running', status: 'action_needed' },
      { id: 'tax-n3', icon: '📝', label: 'Form 12153', relation: 'Files appeal to pause seizure', status: 'safe' },
    ],
    audioNarrationScript:
      'Urgent IRS notice summary. The IRS has issued a Notice of Intent to Levy for an unpaid balance of $4,812.63. You have thirty days from the notice date to take action. You can prevent wage or bank garnishment by setting up a payment plan or by submitting Form 12153 to request an administrative Collection Due Process hearing. We recommend contacting a tax professional or visiting IRS.gov right away.',
  },
  'tenant-lease': {
    title: 'Tenant Lease Guide: Joint Liability, Repairs & 48-Hour Cure Notices',
    documentType: 'Housing & Tenancy Contract',
    originalReadingGrade: 'Grade 16+ (Legal Real Estate)',
    simplifiedReadingGrade: 'Grade 4 (Plain English)',
    readingTimeOriginal: '5.5 min',
    readingTimeSimplified: '1.2 min',
    jargonDensityReduction: '87% simpler vocabulary',
    urgencyLevel: 'Moderate / Know Your Rights',
    oneSentenceSummary:
      'You are 100% responsible for the full rent even if your roommate refuses to pay, repair fees will be deducted from your $2,400 deposit at $85/hr, and utility shutoffs can trigger an eviction lockout in 48 hours.',
    keyTakeaways: [
      {
        emoji: '👥',
        point: 'Joint Liability: If your roommate skips rent, the landlord can demand the entire rent sum from you alone.',
      },
      {
        emoji: '🔨',
        point: 'High Repair Deductions: Repairs deducted from deposit cost $85 per hour plus a 25% materials fee for small wall holes or carpet spots.',
      },
      {
        emoji: '⚡',
        point: '48-Hour Utility Warning: If electricity or water is turned off, the landlord can demand it fixed within 48 hours or pursue lockout.',
      },
    ],
    actionItems: [
      {
        id: 'lease-1',
        step: 'Take detailed photos and video of all walls, hardwood floors, and carpets before moving in.',
        priority: 'urgent',
        deadlineOrTiming: 'Move-in day',
        tip: 'Save photos with timestamp metadata in cloud storage.',
      },
      {
        id: 'lease-2',
        step: 'Put all utility bills on automatic payment to ensure electricity and water are never disconnected.',
        priority: 'important',
        deadlineOrTiming: 'Immediately',
        tip: 'Prevents 48-hour habitability breach notices.',
      },
    ],
    easyReadSections: [
      {
        heading: 'Roommate Payment Rule (Joint and Several Liability)',
        emoji: '🏠',
        content:
          'Under Clause 7, you and your roommates are treated as one single unit. If your roommate leaves town or does not pay their share, the landlord can legally demand that you pay the full rent yourself.',
      },
      {
        heading: 'Your $2,400 Security Deposit',
        emoji: '💵',
        content:
          'Normal wear and tear is covered, but small carpet spots or unpainted nail holes will be billed at $85 per hour plus 25% for supplies. Take photos when you move in so you are not charged unfairly.',
      },
    ],
    dyslexiaSupport: {
      syllableBreakdowns: [
        {
          word: 'habitability',
          phonetic: 'hab-it-a-bil-i-ty',
          definition: 'Whether a home is safe, clean, and livable with heat, water, and power.',
        },
        {
          word: 'liquidated',
          phonetic: 'liq-ui-dat-ed',
          definition: 'A pre-set dollar amount agreed in a contract for damages.',
        },
      ],
      biteSizedSummary: [
        'You must pay full rent if your roommate quits.',
        'Deposit is $2,400.',
        'Repairs cost $85 per hour plus 25%.',
        'Keep electric and water bills paid at all times.',
      ],
    },
    glossary: [
      {
        term: 'Joint and Several Liability',
        simpleDefinition: 'Each tenant is 100% on the hook for everything',
        analogy: 'If three friends order dinner, the waiter can demand the whole bill from whichever person stays at the table.',
      },
    ],
    qaCards: [
      {
        question: 'Can the landlord sue just me if my roommate does not pay?',
        answer: 'Yes. Under joint and several liability, the landlord can collect the entire rent from either one of you.',
      },
    ],
    visualNodes: [
      { id: 'ln-1', icon: '🏠', label: 'Rent Liability', relation: '100% on you if roommate fails to pay', status: 'action_needed' },
      { id: 'ln-2', icon: '💰', label: '$2,400 Deposit', relation: 'Subject to $85/hr repair rate', status: 'info' },
      { id: 'ln-3', icon: '⚡', label: 'Utilities', relation: 'Must maintain uninterrupted service', status: 'safe' },
    ],
    audioNarrationScript:
      'Lease agreement guide. This tenancy agreement has three critical clauses to remember. First, you and your roommates are jointly liable, meaning you can be held responsible for the entire rent if someone else defaults. Second, repairs to carpets or walls will be deducted from your deposit at eighty-five dollars an hour plus twenty-five percent for materials. Third, utilities must remain connected at all times to prevent 48-hour cure notices.',
  },
  'science-abstract': {
    title: 'CRISPR Gene Editing Guide: Off-Target Cutting & Precision Delivery',
    documentType: 'Biomedical & Genomic Research',
    originalReadingGrade: 'Grade 18+ (PhD / Molecular Genetics)',
    simplifiedReadingGrade: 'Grade 5 (Plain English)',
    readingTimeOriginal: '6 min',
    readingTimeSimplified: '1.2 min',
    jargonDensityReduction: '91% simpler vocabulary',
    urgencyLevel: 'Educational / High Interest',
    oneSentenceSummary:
      'Scientists tested an improved version of molecular gene scissors (SpCas9-HF1) that cuts the exact target DNA 88% of the time while almost completely stopping accidental cuts in the wrong parts of human stem cells.',
    keyTakeaways: [
      {
        emoji: '✂️',
        point: 'High-Precision Molecular Scissors: The new engineered Cas9 stops accidental cuts in human DNA that cause harmful mutations.',
      },
      {
        emoji: '🩸',
        point: 'Stem Cell Breakthrough: Tested directly on primary blood stem cells, showing strong promise for curing genetic blood diseases.',
      },
      {
        emoji: '🔬',
        point: 'Fewer Dangerous Rearrangements: Chromosome mix-ups and translocations were reduced significantly (p < 0.001).',
      },
    ],
    actionItems: [
      {
        id: 'sci-1',
        step: 'Understand that CRISPR is like a find-and-replace tool for DNA code inside cells.',
        priority: 'routine',
        deadlineOrTiming: 'Concept learning',
        tip: 'Think of SpCas9-HF1 as a laser-guided scalpel instead of a butter knife.',
      },
    ],
    easyReadSections: [
      {
        heading: 'What Problem Did the Scientists Solve?',
        emoji: '🧬',
        content:
          'Original CRISPR scissors sometimes made mistakes and cut human DNA in places they were not supposed to (called "off-target cuts"). This could damage healthy genes. The researchers engineered an upgraded enzyme called SpCas9-HF1 that checks the DNA code much more carefully.',
        bulletPoints: [
          'Normal Cas9: High power, but made accidental cuts.',
          'Upgraded Cas9-HF1: Stopped nearly all accidental cuts while keeping 88% editing power.',
        ],
      },
    ],
    dyslexiaSupport: {
      syllableBreakdowns: [
        {
          word: 'endonuclease',
          phonetic: 'en-do-nu-cle-ase',
          definition: 'A microscopic protein that cuts DNA like biological scissors.',
        },
        {
          word: 'translocation',
          phonetic: 'trans-lo-ca-tion',
          definition: 'When broken pieces of two different chromosomes accidentally glue together incorrectly.',
        },
      ],
      biteSizedSummary: [
        'CRISPR is a tool that edits DNA.',
        'Old CRISPR sometimes cut the wrong spots.',
        'New CRISPR (HF1) is super accurate.',
        'It keeps human stem cells safe from accidental gene damage.',
      ],
    },
    glossary: [
      {
        term: 'CRISPR-Cas9',
        simpleDefinition: 'Molecular scissors for editing genes',
        analogy: 'Like the backspace key on your computer keyboard for correcting a spelling mistake in DNA.',
      },
      {
        term: 'Off-Target Cleavage',
        simpleDefinition: 'Cutting DNA at the wrong location',
        analogy: 'Like aiming an arrow at a target and accidentally hitting the wall next to it.',
      },
    ],
    qaCards: [
      {
        question: 'Why does this research matter for patients?',
        answer: 'Because eliminating accidental DNA cuts is essential before gene therapies can be safely injected into humans to cure sickle cell anemia or leukemia.',
      },
    ],
    visualNodes: [
      { id: 'sc-1', icon: '✂️', label: 'Cas9-HF1', relation: 'High-fidelity precision gene scissors', status: 'safe' },
      { id: 'sc-2', icon: '🎯', label: '88% On-Target', relation: 'High editing efficiency maintained', status: 'safe' },
      { id: 'sc-3', icon: '🩸', label: 'Stem Cells', relation: 'Tested in human CD34+ blood stem cells', status: 'info' },
    ],
    audioNarrationScript:
      'Scientific research summary. This paper examines an improved gene-editing enzyme called SpCas9-HF1. In the past, molecular gene scissors could accidentally cut unintended areas of DNA. The researchers found that this engineered version nearly eliminated accidental off-target cuts while maintaining eighty-eight percent editing efficiency in human blood stem cells. This brings safe gene therapies one step closer to clinical reality.',
  },
};
