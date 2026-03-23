function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/sysytem|systm|sysstem/g, "system")
    .replace(/feautre|feture|feaature|fitcha/g, "feature")
    .replace(/logn|log in/g, "login")
    .replace(/dashboad|dashbord|dashbodi/g, "dashboard")
    .replace(/kiswhili|kiswahli|swahli/g, "swahili")
    .replace(/prio?rity/g, "priority")
    .replace(/statuz|statu?s/g, "status")
    .replace(/nifanyaje|nafanyaje/g, "how do i")
    .replace(/hii page|page hii|uku ndani|hapa ndani/g, "this page")
    .replace(/req\b/g, "request")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesPhrase(input, phrase) {
  return input.includes(normalize(phrase));
}

function scoreIntent(input, keywords = []) {
  return keywords.reduce((score, keyword) => {
    if (includesPhrase(input, keyword)) {
      return score + (keyword.includes(" ") ? 3 : 2);
    }

    const parts = normalize(keyword).split(" ").filter(Boolean);
    const matchedParts = parts.filter((part) => input.includes(part)).length;
    return score + matchedParts;
  }, 0);
}

function getContextTopic(pathname = "/") {
  if (pathname.startsWith("/admin/users")) return "admin-users";
  if (pathname.startsWith("/admin/features")) return "admin-requests";
  if (pathname.startsWith("/admin")) return "admin-dashboard";
  if (pathname.startsWith("/features")) return "features-workspace";
  if (pathname.startsWith("/login")) return "login";
  if (pathname.startsWith("/register")) return "register";
  if (pathname.startsWith("/forgot-password")) return "forgot-password";
  if (pathname.startsWith("/reset-password")) return "reset-password";
  return "home";
}

function getContextExplanation(topic, language, role = "user") {
  const content = {
    en: {
      home: role === "admin"
        ? "You are on the public landing page. From here you can move into the admin workspace, review the system overview, or switch language before continuing your work."
        : "You are on the public landing page. This page introduces the system, explains the workflow at a high level, and helps users sign in or create an account.",
      "features-workspace": role === "admin"
        ? "You are in the Feature Requests workspace. Even as an admin, this view is useful for experiencing the normal user flow: creating requests, filtering the list, and reviewing how requests appear before admin review."
        : "You are in the Feature Requests workspace. This page lets users create new requests, filter the list, review priorities and statuses, and track who created each item.",
      "admin-dashboard": "You are on the Admin Dashboard. It summarizes total requests, status counts, priority distribution, and recent request activity for quick oversight.",
      "admin-requests": "You are in the admin request management area. Here, admins can search requests, update priorities, change statuses, and delete requests when necessary.",
      "admin-users": "You are in user management. Here, admins can search users, change roles, reset passwords, and activate or suspend accounts.",
      login: "You are on the login page. Users can sign in here to access the protected workspace, and admins are redirected to the admin area after a successful login.",
      register: "You are on the registration page. New users can create an account here and then continue directly into the feature request workspace.",
      "forgot-password": "You are on the password recovery page. Users can request a reset link here if they cannot access their account.",
      "reset-password": "You are on the password reset page. Users can set a new password here after opening a valid reset link.",
    },
    sw: {
      home: role === "admin"
        ? "Upo kwenye ukurasa wa mwanzo wa umma. Kutoka hapa unaweza kwenda kwenye admin workspace, kukagua overview ya mfumo, au kubadili lugha kabla ya kuendelea na kazi."
        : "Upo kwenye ukurasa wa mwanzo wa umma. Ukurasa huu unaanzisha mfumo, unaeleza workflow kwa juu, na unasaidia user kuingia au kutengeneza akaunti.",
      "features-workspace": role === "admin"
        ? "Upo kwenye workspace ya Feature Requests. Hata ukiwa admin, sehemu hii ni nzuri kuona normal user flow: kutengeneza maombi, kuchuja orodha, na kuona maombi yanavyoonekana kabla ya admin review."
        : "Upo kwenye workspace ya Feature Requests. Hapa user anaweza kutengeneza maombi mapya, kuchuja orodha, kukagua priorities na statuses, na kuona nani ametengeneza kila item.",
      "admin-dashboard": "Upo kwenye Admin Dashboard. Hapa kuna muhtasari wa jumla ya maombi, idadi kwa kila status, mgawanyo wa priority, na shughuli za maombi ya karibuni.",
      "admin-requests": "Upo kwenye eneo la admin la kusimamia maombi. Hapa admin anaweza kutafuta maombi, kubadili priority, kubadili status, na kufuta maombi inapohitajika.",
      "admin-users": "Upo kwenye usimamizi wa watumiaji. Hapa admin anaweza kutafuta users, kubadili roles, kubadili manenosiri, na kuwasha au kusimamisha akaunti.",
      login: "Upo kwenye ukurasa wa login. User anaweza kuingia hapa ili kupata sehemu zilizolindwa, na admin hupelekwa moja kwa moja kwenye admin area baada ya login kufanikiwa.",
      register: "Upo kwenye ukurasa wa kujisajili. User mpya anaweza kutengeneza akaunti hapa na kuendelea moja kwa moja kwenye workspace ya feature requests.",
      "forgot-password": "Upo kwenye ukurasa wa kurejesha nenosiri. User anaweza kuomba reset link hapa akishindwa kuingia kwenye akaunti yake.",
      "reset-password": "Upo kwenye ukurasa wa kubadili nenosiri. User anaweza kuweka nenosiri jipya hapa baada ya kufungua reset link halali.",
    },
  };

  return content[language]?.[topic] || content.en[topic] || content.en.home;
}

const knowledgeBase = [
  {
    id: "overview",
    keywords: [
      "what is this system",
      "what does this system do",
      "system overview",
      "hii system",
      "mfumo huu",
      "project hii",
      "inafanya nini",
      "purpose",
      "overview",
      "help me understand",
    ],
    answer: {
      en: "This is a feature request tracking system. Users can create requests with a title, description, priority, status, and created date. Admins can review requests, update priorities and statuses, monitor recent activity, and manage user accounts from the admin panel.",
      sw: "Huu ni mfumo wa kufuatilia maombi ya maboresho. User anaweza kutengeneza ombi lenye kichwa, maelezo, kipaumbele, hali, na tarehe ya kutengenezwa. Admin anaweza kukagua maombi, kubadili priority na status, kuona shughuli za karibuni, na kusimamia akaunti za watumiaji kupitia admin panel.",
    },
    followUp: {
      en: "If you want, I can also explain the user flow, admin flow, or how to prepare a professional submission.",
      sw: "Nikisaidia zaidi, naweza kueleza user flow, admin flow, au jinsi ya kuandaa submission ya kitaalamu.",
    },
  },
  {
    id: "create-request",
    keywords: [
      "create request",
      "how do i create",
      "submit request",
      "new feature",
      "add request",
      "tengeneza ombi",
      "ninawekaje ombi",
      "na submit vipi",
      "naongeza request wapi",
      "ombi jipya",
    ],
    answer: {
      en: "Open the Feature Requests workspace, fill in the title, description, and priority, then submit the form. The request appears immediately in the shared list so the team can review it.",
      sw: "Fungua workspace ya Feature Requests, jaza title, description, na priority, halafu wasilisha fomu. Ombi linaonekana mara moja kwenye orodha ya pamoja ili timu ilikague.",
    },
    followUp: {
      en: "A strong request clearly explains the need, expected outcome, and why it matters.",
      sw: "Ombi bora linaeleza hitaji, matokeo yanayotarajiwa, na kwa nini ni muhimu.",
    },
  },
  {
    id: "request-fields",
    keywords: [
      "fields",
      "required fields",
      "what should a request include",
      "request format",
      "title description priority",
      "feature fields",
      "ombi lina nini",
      "linatakiwa nini",
      "field gani",
      "vitu vya kujaza",
    ],
    answer: {
      en: "Each feature request should include five key fields: Title, Description, Priority, Status, and Created Date. In practice, users provide the title, description, and priority; status and created date are then tracked by the system.",
      sw: "Kila feature request linapaswa kuwa na fields tano kuu: Title, Description, Priority, Status, na Created Date. Kwa kawaida user hujaza title, description, na priority; status pamoja na created date hufuatiliwa na mfumo.",
    },
  },
  {
    id: "priority",
    keywords: [
      "priority",
      "priorities",
      "priority meaning",
      "low medium high",
      "priority gani",
      "kipaumbele",
      "low",
      "medium",
      "high",
    ],
    answer: {
      en: "Priority shows business urgency. Low is useful but not urgent, Medium is important and should be planned soon, and High needs faster attention because it has stronger impact or urgency.",
      sw: "Priority inaonyesha uzito wa kibiashara. Low ni muhimu lakini si ya haraka, Medium ni muhimu na inahitaji kupangwa mapema, na High inahitaji kushughulikiwa kwa haraka kwa sababu ina impact au urgency kubwa zaidi.",
    },
  },
  {
    id: "status",
    keywords: [
      "status",
      "statuses",
      "open in progress completed",
      "status meaning",
      "hali",
      "open",
      "in progress",
      "completed",
      "maana ya status",
    ],
    answer: {
      en: "Status tracks delivery stage. Open means the request has been logged and is waiting for action, In Progress means work is actively underway, and Completed means the request has been delivered or fully resolved.",
      sw: "Status inafuatilia hatua ya utekelezaji. Open maana yake ombi limesajiliwa na linasubiri kushughulikiwa, In Progress maana yake kazi inaendelea, na Completed maana yake ombi limetekelezwa au limetatuliwa kikamilifu.",
    },
  },
  {
    id: "admin",
    keywords: [
      "admin",
      "admin panel",
      "what can admin do",
      "manage requests",
      "dashboard",
      "admin anaweza",
      "kazi za admin",
      "simamia",
      "admin work",
    ],
    answer: {
      en: "Admins can access the dashboard, review recent requests, monitor counts by status, check priority distribution, update request priority and status, delete requests when necessary, and manage users by changing roles, resetting passwords, or activating and suspending accounts.",
      sw: "Admin anaweza kufungua dashboard, kukagua maombi ya karibuni, kuona idadi kwa kila status, kuona mgawanyo wa priorities, kubadili priority na status za maombi, kufuta maombi inapohitajika, na kusimamia watumiaji kwa kubadili roles, kubadili manenosiri, au kuwasha na kusimamisha akaunti.",
    },
  },
  {
    id: "auth",
    keywords: [
      "login",
      "register",
      "password",
      "forgot password",
      "reset password",
      "signin",
      "signup",
      "ingia",
      "jisajili",
      "nenosiri",
      "forgot",
      "reset",
    ],
    answer: {
      en: "Users can create an account, sign in, request a password reset link, and set a new password. Protected areas require authentication, and admins are routed to the admin workspace after login.",
      sw: "User anaweza kutengeneza akaunti, kuingia, kuomba link ya kubadili nenosiri, na kuweka nenosiri jipya. Sehemu zilizolindwa zinahitaji authentication, na admin hupelekwa kwenye admin workspace baada ya login.",
    },
  },
  {
    id: "language",
    keywords: [
      "language",
      "english",
      "swahili",
      "kiswahili",
      "change language",
      "lugha",
      "badili lugha",
      "switch language",
    ],
    answer: {
      en: "The interface supports two languages: English and Kiswahili. Users can switch language from the navbar or the admin topbar, and the preference is saved locally in the browser.",
      sw: "Interface ina lugha mbili: English na Kiswahili. User anaweza kubadili lugha kutoka navbar au admin topbar, na chaguo hilo huhifadhiwa ndani ya browser.",
    },
  },
  {
    id: "submission",
    keywords: [
      "submission",
      "screenshots",
      "video",
      "readme",
      "sql",
      "portfolio",
      "github",
      "send work",
      "kutuma kazi",
      "demo",
      "screenshot",
    ],
    answer: {
      en: "For a strong submission, provide the GitHub repository, your GitHub profile or portfolio, screenshots of the working application, a short demo video, a README with setup steps, and the SQL file for database setup. It also helps to show clear commit history and a clean project structure.",
      sw: "Kwa submission nzuri, toa GitHub repository, GitHub profile au portfolio yako, screenshots za app inayofanya kazi, demo video fupi, README yenye hatua za setup, na SQL file ya kuandaa database. Pia inasaidia kuonyesha commit history iliyo wazi na project structure safi.",
    },
    followUp: {
      en: "I can also suggest what screenshots to capture or what to say in a short demo video.",
      sw: "Naweza pia kupendekeza screenshots za kupiga au maneno ya kutumia kwenye demo video fupi.",
    },
  },
  {
    id: "screenshots",
    keywords: [
      "screenshots",
      "what screenshots",
      "screenshot gani",
      "capture screens",
      "screens za demo",
      "screenshots za kutuma",
    ],
    answer: {
      en: "For screenshots, capture at least these views: the landing page, login page, feature request workspace with sample data, admin dashboard, admin request management table, and user management page. Clear, populated screens look more professional than empty states.",
      sw: "Kwa screenshots, piga angalau hizi views: landing page, login page, feature request workspace yenye sample data, admin dashboard, admin request management table, na user management page. Screens zilizo wazi na zenye data huonekana professional zaidi kuliko empty states.",
    },
    followUp: {
      en: "If needed, I can also suggest the best order for the screenshots in your submission.",
      sw: "Nikihitajika, naweza pia kupendekeza mpangilio bora wa screenshots kwenye submission yako.",
    },
  },
  {
    id: "demo-video",
    keywords: [
      "demo video",
      "video script",
      "what to say in video",
      "record video",
      "short video",
      "video ya demo",
      "niseme nini kwenye video",
      "recording ya demo",
    ],
    answer: {
      en: "A strong demo video can be under one minute. Start with the landing page, show login, create a feature request, open the admin dashboard, update a request status, and briefly show user management. Keep the narration focused on workflow, validation, and admin control.",
      sw: "Demo video nzuri inaweza kuwa chini ya dakika moja. Anza na landing page, onyesha login, tengeneza feature request, fungua admin dashboard, badili status ya ombi, kisha onyesha user management kwa kifupi. Simulizi ibaki kwenye workflow, validation, na admin control.",
    },
    followUp: {
      en: "I can also generate a short spoken script you can read while recording.",
      sw: "Naweza pia kukuandikia script fupi ya kusoma wakati wa kurekodi.",
    },
  },
  {
    id: "readme-sql",
    keywords: [
      "readme",
      "sql file",
      "database setup",
      "setup instructions",
      "readme and sql",
      "sql setup",
      "readme file",
      "maelekezo ya setup",
      "db setup",
    ],
    answer: {
      en: "Your README should cover project purpose, prerequisites, environment setup, database import, backend start, frontend start, and admin credentials for testing. The SQL file should create the database and required tables so the reviewer can run the project locally without guesswork.",
      sw: "README yako inapaswa kufunika purpose ya project, prerequisites, environment setup, database import, kuanzisha backend, kuanzisha frontend, na admin credentials za testing. SQL file inapaswa kuunda database na tables zote muhimu ili reviewer aweze ku-run project local bila kubahatisha.",
    },
  },
  {
    id: "company-brief",
    keywords: [
      "company requirement",
      "requirements",
      "brief",
      "deadline",
      "stack",
      "react node mysql",
      "company wants",
      "maelekezo ya kampuni",
      "wanataka nini",
      "brief yao",
    ],
    answer: {
      en: "The company brief expects a clean feature request system using React on the frontend, Node and Express on the backend, and MySQL for the database. They also expect clean API structure, validation, error handling, a README, a SQL setup file, screenshots, a short video, and a GitHub repository with organized commits.",
      sw: "Brief ya kampuni inahitaji feature request system safi inayotumia React frontend, Node na Express backend, na MySQL kama database. Pia wanatarajia clean API structure, validation, error handling, README, SQL setup file, screenshots, demo video fupi, na GitHub repository yenye commits zilizopangwa vizuri.",
    },
  },
  {
    id: "interview-prep",
    keywords: [
      "interview",
      "interview prep",
      "what can they ask",
      "why this stack",
      "problem solving",
      "what should i explain",
      "maswali ya interview",
      "nijiandae vipi kwa interview",
      "wanweza kuuliza nini",
    ],
    answer: {
      en: "For interview prep, be ready to explain why you used React, Express, and MySQL, how you structured routes and validation, how authentication works, how admins differ from normal users, and how you handled the feature request workflow end to end. You should also be ready to justify UI choices, database design, and error handling.",
      sw: "Kwa interview prep, jiandae kueleza kwa nini umetumia React, Express, na MySQL, jinsi ulivyopanga routes na validation, authentication inavyofanya kazi, tofauti kati ya admin na user wa kawaida, na jinsi ulivyoshughulikia workflow ya feature requests kutoka mwanzo hadi mwisho. Pia uwe tayari kueleza chaguo za UI, design ya database, na error handling.",
    },
    followUp: {
      en: "If you want, I can suggest likely interview questions with strong sample answers.",
      sw: "Ukitaka, naweza kupendekeza maswali ya interview yanayowezekana pamoja na sample answers nzuri.",
    },
  },
  {
    id: "best-practice",
    keywords: [
      "best practice",
      "professional request",
      "how to write request",
      "good request",
      "proffesional",
      "professional",
      "andika vizuri",
      "ombi bora",
      "eleza vizuri",
    ],
    answer: {
      en: "A professional feature request should state the problem clearly, describe the expected result, mention who benefits, and explain the urgency. Short, specific requests are easier to review and prioritize than vague requests.",
      sw: "Feature request ya kitaalamu inapaswa kueleza tatizo kwa uwazi, kufafanua matokeo yanayotarajiwa, kutaja nani atanufaika, na kueleza urgency. Maombi mafupi lakini yenye specifics huwa rahisi kukaguliwa na kupewa priority kuliko maombi yasiyoeleweka.",
    },
  },
  {
    id: "dashboard-help",
    keywords: [
      "explain dashboard",
      "dashboard ina nini",
      "dashboard help",
      "dashboard inaonyesha nini",
      "what is on dashboard",
      "dashboard meaning",
    ],
    answer: {
      en: "The dashboard gives admins a fast operational summary. It shows total requests, counts by status, the priority mix, and recent requests so admins can spot backlog, progress, and urgent work quickly.",
      sw: "Dashboard inampa admin muhtasari wa haraka wa uendeshaji. Inaonyesha jumla ya maombi, idadi kwa kila status, mgawanyo wa priority, na maombi ya karibuni ili admin aone backlog, maendeleo, na kazi za haraka kwa urahisi.",
    },
  },
  {
    id: "admin-tools",
    keywords: [
      "explain admin tools",
      "admin tools",
      "admin controls",
      "tools za admin",
      "admin features",
      "admin options",
    ],
    answer: {
      en: "Admin tools in this system cover three main areas: dashboard monitoring, request management, and user management. Together they help admins organize work, control access, and keep request data clean and current.",
      sw: "Admin tools kwenye mfumo huu zinagawanyika katika maeneo matatu makuu: ufuatiliaji wa dashboard, usimamizi wa maombi, na usimamizi wa watumiaji. Kwa pamoja zinamsaidia admin kupanga kazi, kudhibiti upatikanaji, na kuweka data ya maombi ikiwa safi na ya sasa.",
    },
  },
];

const greetingPatterns = ["hello", "hi", "hey", "mambo", "habari", "hujambo", "vipi"];

function detectLanguage(input, fallbackLanguage) {
  const swahiliSignals = ["nina", "vipi", "mfumo", "ombi", "lugha", "admin anaweza", "maana", "status", "priority"];
  const normalized = normalize(input);
  return swahiliSignals.some((term) => normalized.includes(term)) ? "sw" : fallbackLanguage;
}

export function getAssistantSuggestions(language) {
  if (language === "sw") {
    return [
      "Mfumo huu unafanya nini?",
      "Ninawezaje kutengeneza ombi?",
      "Admin anaweza kusimamia nini?",
      "Priority na status zina maana gani?",
    ];
  }

  return [
    "What does this system do?",
    "How do I create a request?",
    "What can an admin manage?",
    "What do priority and status mean?",
  ];
}

export function getAssistantQuickActions(language, pathname = "/", role = "user") {
  const topic = getContextTopic(pathname);

  if (language === "sw") {
    if (role === "admin") {
      return [
        "Dashboard inaonyesha nini?",
        "Admin anaweza kusimamia nini?",
        "Ni screenshots gani nipige?",
        "Nijiandae vipi kwa interview?",
      ];
    }

    return [
      "Mfumo huu unafanya nini?",
      topic.startsWith("admin") ? "Dashboard inaonyesha nini?" : "Ninawezaje kutengeneza ombi?",
      topic.startsWith("admin") ? "Admin anaweza kusimamia nini?" : "Priority na status zina maana gani?",
      "Nijiandae vipi kwa submission?",
    ];
  }

  if (role === "admin") {
    return [
      "What does the dashboard show?",
      "What can an admin manage?",
      "Which screenshots should I capture?",
      "How should I prepare for the interview?",
    ];
  }

  return [
    "What does this system do?",
    topic.startsWith("admin") ? "What does the dashboard show?" : "How do I create a request?",
    topic.startsWith("admin") ? "What can an admin manage?" : "What do priority and status mean?",
    "How should I prepare the submission?",
  ];
}

export function getAssistantReply(message, language = "en", options = {}) {
  const input = normalize(message);
  const responseLanguage = detectLanguage(message, language);
  const topic = getContextTopic(options.pathname);
  const role = options.role || "user";
  const isContextQuestion = ["this page", "hapa", "here", "what can i do here", "help here"].some((item) =>
    input.includes(normalize(item))
  );
  const isRoleQuestion = ["my role", "as admin", "as user", "kama admin", "kama user", "role yangu", "what can i do"].some((item) =>
    input.includes(normalize(item))
  );
  const wantsMore = ["more", "details", "endelea", "zaidi", "then", "next", "sasa", "how"].includes(input);

  if (!input) {
    return {
      text: responseLanguage === "sw"
        ? "Andika swali lako kuhusu mfumo huu. Naweza kusaidia kueleza workflow, roles, priorities, statuses, au hatua za submission."
        : "Ask any question about this system. I can explain the workflow, roles, priorities, statuses, or submission steps.",
      intent: "empty",
    };
  }

  if (greetingPatterns.some((item) => input.includes(item))) {
    return {
      text: responseLanguage === "sw"
        ? "Nipo tayari kusaidia. Uliza kuhusu jinsi mfumo unavyofanya kazi, jinsi ya kutengeneza feature request, kazi za admin, au maandalizi ya submission."
        : "I am ready to help. Ask about how the system works, how to create a feature request, what admins can do, or how to prepare your submission.",
      intent: "greeting",
    };
  }

  if (isRoleQuestion) {
    return {
      text: responseLanguage === "sw"
        ? role === "admin"
          ? "Kwa role ya admin, unaweza kuona dashboard, kusimamia maombi ya maboresho, kubadili priority na status, kufuta maombi inapohitajika, na kusimamia users kwa kubadili roles, reset password, au activate na suspend accounts."
          : "Kwa role ya user, unaweza kutengeneza feature requests, kuona orodha ya maombi, kuchuja maombi kwa search, priority, au status, na kufuatilia yaliyotengenezwa ndani ya workspace."
        : role === "admin"
          ? "As an admin, you can view the dashboard, manage feature requests, update priorities and statuses, delete requests when needed, and manage users by changing roles, resetting passwords, or activating and suspending accounts."
          : "As a user, you can create feature requests, review the request list, filter requests by search, priority, or status, and follow activity inside the workspace.",
      intent: `role-${role}`,
    };
  }

  if (isContextQuestion) {
    return {
      text: getContextExplanation(topic, responseLanguage, role),
      intent: topic,
    };
  }

  if (wantsMore && options.lastIntent) {
    const previous = knowledgeBase.find((entry) => entry.id === options.lastIntent);
    if (previous?.followUp?.[responseLanguage]) {
      return {
        text: previous.followUp[responseLanguage],
        intent: previous.id,
      };
    }
  }

  const scored = knowledgeBase
    .map((entry) => ({ entry, score: scoreIntent(input, entry.keywords) }))
    .sort((a, b) => b.score - a.score);

  const bestMatch = scored[0];

  if (bestMatch && bestMatch.score >= 2) {
    const main = bestMatch.entry.answer[responseLanguage] || bestMatch.entry.answer.en;
    const followUp = bestMatch.entry.followUp?.[responseLanguage] || "";
    return {
      text: followUp ? `${main} ${followUp}` : main,
      intent: bestMatch.entry.id,
    };
  }

  return {
    text: responseLanguage === "sw"
      ? "Naelewa kuwa unauliza kuhusu mfumo huu, lakini swali halijalingana moja kwa moja na topic maalum. Naweza kusaidia kuhusu overview ya mfumo, kutengeneza feature request, priority, status, admin panel, login/reset password, language switch, au submission checklist."
      : "I understand that you are asking about this system, but the question did not match a specific topic directly. I can still help with the system overview, creating feature requests, priorities, statuses, the admin panel, login or password reset, language switching, the submission checklist, screenshots, demo video prep, or interview prep.",
    intent: "fallback",
  };
}
