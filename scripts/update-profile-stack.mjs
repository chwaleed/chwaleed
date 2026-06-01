const USERNAME = process.env.GITHUB_USERNAME || "chwaleed";
const README_PATH = "README.md";
const START_MARKER = "<!-- START OF PROFILE STACK, DO NOT REMOVE -->";
const END_MARKER = "<!-- END OF PROFILE STACK, DO NOT REMOVE -->";
const MAX_PROJECTS_PER_TECH = Number(process.env.MAX_PROJECTS_PER_TECH || 50);
const MIN_LANGUAGE_SHARE = Number(process.env.MIN_LANGUAGE_SHARE || 0.03);
const LOW_SIGNAL_LANGUAGES = new Set(["Batchfile", "CMake", "Dockerfile", "Shell", "VBScript"]);
const FLUTTER_PLATFORM_LANGUAGES = new Set(["C", "C++", "CMake", "Kotlin", "Objective-C", "Swift"]);
const REPO_TECH_OVERRIDES = new Map([
  ["AdFlow-Pro", "MERN Stack"],
  ["basic-dept-animated-site", "React"],
  ["cold-store-pos-nextjs", "Next.js"],
  ["Full-Stack-Portfolio-Sanity-Backend", "TypeScript"],
  ["Local-Network-Collaborative-Drawing-Pad", "Socket.io"],
  ["LeetCode", "JavaScript"],
  ["Pharmacy-Managment-System", "HTML"],
  ["Quiz-app", "Dart"],
  ["Real-Time-Chat-App", "Socket.io"],
  ["Resturant_Website", "HTML"],
  ["Snake-Game", "JavaScript"],
  ["True-Feedback-Full-Stack-App", "Next.js"],
  ["Verbia-AI", "React"],
  ["flutter-todo", "Dart"],
  ["local-send-clone", "JavaScript"],
]);
const CATEGORY_PRIORITY = [
  "MERN Stack",
  "MEAN Stack",
  "PERN Stack",
  "Next.js",
  "NestJS",
  "Laravel",
  "FastAPI",
  "Django",
  "Flask",
  "Express.js",
  "Node.js API",
  "Socket.io",
  "React",
  "Angular",
  "Vue",
  "Svelte",
  "Nuxt.js",
  "Full Stack",
  "Dart",
  "Mobile App",
  "AI / RAG",
  "Automation",
  "Serverless",
  "Cloudflare Workers",
  "Supabase",
  "WordPress",
  "TypeScript",
  "JavaScript",
  "Python",
  "PHP",
  "Blockchain",
  "C++",
  "SCSS",
  "CSS",
  "HTML",
];

// One repo is assigned to one row. The decision order is:
// repo override -> GitHub topics -> repo name/description keywords -> primary language.
const CATEGORY_RULES = [
  {
    technology: "MERN Stack",
    topics: ["mern", "mern-stack"],
    keywords: [/\bmern\b/i, /\bmongodb\b[\s\S]*\bexpress\b[\s\S]*\breact\b[\s\S]*\bnode\b/i],
  },
  {
    technology: "MEAN Stack",
    topics: ["mean", "mean-stack"],
    keywords: [/\bmean\b/i, /\bmongodb\b[\s\S]*\bexpress\b[\s\S]*\bangular\b[\s\S]*\bnode\b/i],
  },
  {
    technology: "PERN Stack",
    topics: ["pern", "pern-stack"],
    keywords: [/\bpern\b/i, /\bpostgres(?:ql)?\b[\s\S]*\bexpress\b[\s\S]*\breact\b[\s\S]*\bnode\b/i],
  },
  {
    technology: "Full Stack",
    topics: ["fullstack", "full-stack", "full-stack-app", "full-stack-project"],
    keywords: [/\bfull.?stack\b/i],
  },
  {
    technology: "Next.js",
    topics: ["nextjs", "next-js", "next"],
    keywords: [/\bnext(?:\.js|js)?\b/i],
  },
  {
    technology: "NestJS",
    topics: ["nestjs", "nest-js"],
    keywords: [/\bnest(?:\.js|js)?\b/i],
  },
  {
    technology: "Laravel",
    topics: ["laravel"],
    languages: ["PHP"],
    keywords: [/\blaravel\b/i],
  },
  {
    technology: "FastAPI",
    topics: ["fastapi", "fast-api"],
    languages: ["Python"],
    keywords: [/\bfastapi\b/i, /\bfast api\b/i],
  },
  {
    technology: "Django",
    topics: ["django"],
    languages: ["Python"],
    keywords: [/\bdjango\b/i],
  },
  {
    technology: "Flask",
    topics: ["flask"],
    languages: ["Python"],
    keywords: [/\bflask\b/i],
  },
  {
    technology: "Express.js",
    topics: ["express", "expressjs", "express-js"],
    languages: ["JavaScript", "TypeScript"],
    keywords: [/\bexpress(?:\.js|js)?\b/i],
  },
  {
    technology: "Node.js API",
    topics: ["node-api", "nodejs-api", "rest-api", "api", "backend"],
    languages: ["JavaScript", "TypeScript"],
    keywords: [/\brest(?:ful)? api\b/i, /\bbackend\b/i, /\bapi\b/i],
  },
  {
    technology: "Socket.io",
    topics: ["socketio", "socket-io", "websocket", "websockets", "real-time", "realtime"],
    keywords: [/\bsocket(?:\.io)?\b/i, /\bwebsockets?\b/i, /\breal.?time\b/i, /\bcollaborative\b/i, /\bchat\b/i],
  },
  {
    technology: "React",
    topics: ["react", "reactjs", "vite"],
    keywords: [/\breact(?:\.js|js)?\b/i, /\bvite\b/i],
  },
  {
    technology: "Angular",
    topics: ["angular", "angularjs"],
    keywords: [/\bangular(?:js)?\b/i],
  },
  {
    technology: "Vue",
    topics: ["vue", "vuejs", "vue-js"],
    keywords: [/\bvue(?:\.js|js)?\b/i],
  },
  {
    technology: "Svelte",
    topics: ["svelte", "sveltekit"],
    keywords: [/\bsvelte(?:kit)?\b/i],
  },
  {
    technology: "Nuxt.js",
    topics: ["nuxt", "nuxtjs", "nuxt-js"],
    keywords: [/\bnuxt(?:\.js|js)?\b/i],
  },
  {
    technology: "Dart",
    topics: ["dart", "flutter"],
    languages: ["Dart"],
    keywords: [/\bflutter\b/i, /\bdart\b/i],
  },
  {
    technology: "Mobile App",
    topics: ["mobile", "mobile-app", "android", "ios", "react-native"],
    keywords: [/\bmobile\b/i, /\bandroid\b/i, /\bios\b/i, /\breact native\b/i],
  },
  {
    technology: "AI / RAG",
    topics: ["ai", "artificial-intelligence", "rag", "llm", "openai", "machine-learning", "ml"],
    languages: ["Python", "TypeScript", "JavaScript"],
    keywords: [/\bai\b/i, /\brag\b/i, /\bllm\b/i, /\bopenai\b/i, /\bmachine learning\b/i],
  },
  {
    technology: "Automation",
    topics: ["automation", "bot", "n8n", "scraper", "workflow"],
    languages: ["Python", "JavaScript", "TypeScript"],
    keywords: [/\bautomation\b/i, /\bbot\b/i, /\bn8n\b/i, /\bscraper\b/i, /\bworkflow\b/i],
  },
  {
    technology: "Serverless",
    topics: ["serverless", "aws-lambda", "lambda"],
    keywords: [/\bserverless\b/i, /\blambda\b/i],
  },
  {
    technology: "Cloudflare Workers",
    topics: ["cloudflare", "cloudflare-workers", "workers"],
    keywords: [/\bcloudflare\b/i, /\bworkers?\b/i],
  },
  {
    technology: "Supabase",
    topics: ["supabase"],
    keywords: [/\bsupabase\b/i],
  },
  {
    technology: "WordPress",
    topics: ["wordpress"],
    languages: ["PHP"],
    keywords: [/\bwordpress\b/i],
  },
  {
    technology: "TypeScript",
    topics: ["typescript"],
    languages: ["TypeScript"],
  },
  {
    technology: "JavaScript",
    topics: ["javascript"],
    languages: ["JavaScript"],
  },
  {
    technology: "Python",
    topics: ["python"],
    languages: ["Python"],
  },
  {
    technology: "PHP",
    topics: ["php", "laravel"],
    languages: ["PHP"],
  },
  {
    technology: "Blockchain",
    topics: ["solidity", "ethereum", "blockchain"],
    languages: ["Solidity"],
    keywords: [/\bethereum\b/i, /\bblockchain\b/i, /\bsmart contract/i],
  },
  {
    technology: "C++",
    topics: ["cpp", "c-plus-plus"],
    languages: ["C++"],
  },
  {
    technology: "SCSS",
    topics: ["scss", "sass"],
    languages: ["SCSS"],
  },
  {
    technology: "CSS",
    topics: ["css"],
    languages: ["CSS"],
  },
  {
    technology: "HTML",
    topics: ["html"],
    languages: ["HTML"],
  },
];

const TECHNOLOGY_META = {
  "C++": { color: "00599C", logo: "C%2B%2B", url: "https://isocpp.org/" },
  "AI / RAG": { color: "412991", logo: "OpenAI", url: "https://platform.openai.com/" },
  Angular: { color: "DD0031", logo: "Angular", url: "https://angular.dev/" },
  Automation: { color: "EA4B71", logo: "n8n", url: "https://n8n.io/" },
  Blockchain: { color: "3C3C3D", logo: "Ethereum", url: "https://ethereum.org/" },
  "Cloudflare Workers": { color: "F38020", logo: "Cloudflare", url: "https://workers.cloudflare.com/" },
  CSS: { color: "1572B6", logo: "CSS3", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  Dart: { color: "0175C2", logo: "Dart", url: "https://dart.dev/" },
  Django: { color: "092E20", logo: "Django", url: "https://www.djangoproject.com/" },
  Docker: { color: "2496ED", logo: "Docker", url: "https://www.docker.com/" },
  "Express.js": { color: "000000", logo: "Express", url: "https://expressjs.com/" },
  FastAPI: { color: "009688", logo: "FastAPI", url: "https://fastapi.tiangolo.com/" },
  Flask: { color: "000000", logo: "Flask", url: "https://flask.palletsprojects.com/" },
  "Full Stack": { color: "4B5563", logo: "StackBlitz", url: "https://github.com/chwaleed" },
  GSAP: { color: "88CE02", logo: "GreenSock", url: "https://gsap.com/" },
  HTML: { color: "E34F26", logo: "HTML5", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  JavaScript: { color: "F7DF1E", logo: "JavaScript", logoColor: "000000", url: "https://javascript.info/" },
  Laravel: { color: "FF2D20", logo: "Laravel", url: "https://laravel.com/" },
  "MEAN Stack": { color: "DD0031", logo: "Angular", url: "https://www.mongodb.com/resources/languages/mean-stack" },
  "MERN Stack": { color: "3C873A", logo: "mongodb", url: "https://www.mongodb.com/mern-stack" },
  "Mobile App": { color: "02569B", logo: "Flutter", url: "https://flutter.dev/" },
  MongoDB: { color: "47A248", logo: "MongoDB", url: "https://www.mongodb.com/" },
  "NestJS": { color: "E0234E", logo: "NestJS", url: "https://nestjs.com/" },
  "Next.js": { color: "000000", logo: "Next.js", url: "https://nextjs.org/" },
  "Node.js": { color: "339933", logo: "Node.js", url: "https://nodejs.org/" },
  "Node.js API": { color: "339933", logo: "Node.js", url: "https://nodejs.org/" },
  "Nuxt.js": { color: "00DC82", logo: "Nuxt", url: "https://nuxt.com/" },
  "PERN Stack": { color: "336791", logo: "PostgreSQL", url: "https://www.postgresql.org/" },
  PHP: { color: "777BB4", logo: "PHP", url: "https://www.php.net/" },
  PLpgSQL: { color: "336791", logo: "PostgreSQL", url: "https://www.postgresql.org/" },
  Python: { color: "3776AB", logo: "Python", url: "https://www.python.org/" },
  React: { color: "61DAFB", logo: "React", logoColor: "000000", url: "https://react.dev/" },
  SCSS: { color: "CC6699", logo: "Sass", url: "https://sass-lang.com/" },
  Serverless: { color: "FD5750", logo: "Serverless", url: "https://www.serverless.com/" },
  "Socket.io": { color: "010101", logo: "Socket.io", url: "https://socket.io/" },
  Supabase: { color: "3ECF8E", logo: "Supabase", url: "https://supabase.com/" },
  Svelte: { color: "FF3E00", logo: "Svelte", url: "https://svelte.dev/" },
  "Tailwind CSS": { color: "06B6D4", logo: "Tailwind%20CSS", url: "https://tailwindcss.com/" },
  TypeScript: { color: "3178C6", logo: "TypeScript", url: "https://www.typescriptlang.org/" },
  Vue: { color: "4FC08D", logo: "Vue.js", url: "https://vuejs.org/" },
  WordPress: { color: "21759B", logo: "WordPress", url: "https://wordpress.org/" },
};

const TOPIC_TECH = new Map([
  ["ai", "AI / RAG"],
  ["angular", "Angular"],
  ["angularjs", "Angular"],
  ["api", "Node.js API"],
  ["artificial-intelligence", "AI / RAG"],
  ["automation", "Automation"],
  ["aws-lambda", "Serverless"],
  ["backend", "Node.js API"],
  ["blockchain", "Blockchain"],
  ["bot", "Automation"],
  ["cloudflare", "Cloudflare Workers"],
  ["cloudflare-workers", "Cloudflare Workers"],
  ["docker", "Docker"],
  ["django", "Django"],
  ["express", "Express.js"],
  ["expressjs", "Express.js"],
  ["fast-api", "FastAPI"],
  ["fastapi", "FastAPI"],
  ["flask", "Flask"],
  ["framer-motion", "React"],
  ["full-stack", "Full Stack"],
  ["fullstack", "Full Stack"],
  ["gsap", "GSAP"],
  ["laravel", "Laravel"],
  ["llm", "AI / RAG"],
  ["mean", "MEAN Stack"],
  ["mean-stack", "MEAN Stack"],
  ["nestjs", "NestJS"],
  ["nest-js", "NestJS"],
  ["mern", "MERN Stack"],
  ["mern-stack", "MERN Stack"],
  ["mobile", "Mobile App"],
  ["mobile-app", "Mobile App"],
  ["mongodb", "MongoDB"],
  ["n8n", "Automation"],
  ["nuxt", "Nuxt.js"],
  ["nuxtjs", "Nuxt.js"],
  ["nextjs", "Next.js"],
  ["next-js", "Next.js"],
  ["nodejs", "Node.js"],
  ["node-api", "Node.js API"],
  ["node-js", "Node.js"],
  ["openai", "AI / RAG"],
  ["pern", "PERN Stack"],
  ["pern-stack", "PERN Stack"],
  ["php", "PHP"],
  ["rag", "AI / RAG"],
  ["react", "React"],
  ["react-native", "Mobile App"],
  ["reactjs", "React"],
  ["rest-api", "Node.js API"],
  ["sass", "SCSS"],
  ["scss", "SCSS"],
  ["serverless", "Serverless"],
  ["solidity", "Blockchain"],
  ["socketio", "Socket.io"],
  ["socket-io", "Socket.io"],
  ["supabase", "Supabase"],
  ["svelte", "Svelte"],
  ["sveltekit", "Svelte"],
  ["tailwind", "Tailwind CSS"],
  ["tailwindcss", "Tailwind CSS"],
  ["typescript", "TypeScript"],
  ["vue", "Vue"],
  ["wordpress", "WordPress"],
]);

const NAME_TECH = [
  [/mern|mongo.*express.*react.*node/i, "MERN Stack"],
  [/mean|mongo.*express.*angular.*node/i, "MEAN Stack"],
  [/pern|postgres.*express.*react.*node/i, "PERN Stack"],
  [/full.?stack/i, "Full Stack"],
  [/next/i, "Next.js"],
  [/nest/i, "NestJS"],
  [/laravel/i, "Laravel"],
  [/fast.?api/i, "FastAPI"],
  [/django/i, "Django"],
  [/flask/i, "Flask"],
  [/express/i, "Express.js"],
  [/rest.?api|backend|api/i, "Node.js API"],
  [/react/i, "React"],
  [/angular/i, "Angular"],
  [/vue/i, "Vue"],
  [/svelte/i, "Svelte"],
  [/nuxt/i, "Nuxt.js"],
  [/socket|chat|real.?time|collaborative/i, "Socket.io"],
  [/flutter|mobile|android|ios/i, "Mobile App"],
  [/ai|rag|llm|openai|machine.?learning/i, "AI / RAG"],
  [/automation|bot|n8n|scraper|workflow/i, "Automation"],
  [/serverless|lambda/i, "Serverless"],
  [/cloudflare|workers/i, "Cloudflare Workers"],
  [/supabase/i, "Supabase"],
  [/wordpress/i, "WordPress"],
  [/ethereum|blockchain|smart.?contract|solidity/i, "Blockchain"],
  [/tailwind/i, "Tailwind CSS"],
  [/docker/i, "Docker"],
];

async function github(path) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": `${USERNAME}-profile-readme-generator`,
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com${path}`, { headers });

  if (!response.ok) {
    if (response.status === 403 && !process.env.GITHUB_TOKEN) {
      throw new Error(
        `GitHub API rate limit hit for ${path}. Run locally with a token, for example: GITHUB_TOKEN=<token> node scripts/update-profile-stack.mjs. GitHub Actions provides this token automatically.`
      );
    }

    throw new Error(`GitHub API ${response.status} for ${path}: ${await response.text()}`);
  }

  return response.json();
}

async function fetchRepos() {
  const repos = [];

  for (let page = 1; page <= 10; page += 1) {
    const batch = await github(`/users/${USERNAME}/repos?type=owner&sort=updated&direction=desc&per_page=100&page=${page}`);
    repos.push(...batch);

    if (batch.length < 100) {
      break;
    }
  }

  return repos
    .filter((repo) => !repo.private && !repo.fork && !repo.archived && repo.name !== USERNAME)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description || "",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.watchers_count || 0,
      pushedAt: repo.pushed_at,
      updatedAt: repo.updated_at,
      topics: repo.topics || [],
      language: repo.language,
      languagesUrl: repo.languages_url,
    }));
}

async function fetchLanguages(repo) {
  const path = new URL(repo.languagesUrl).pathname;
  const languages = await github(path);
  const totalBytes = Object.values(languages).reduce((total, bytes) => total + bytes, 0);

  return Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([language, bytes], index) => ({
      name: normalizeLanguage(language),
      bytes,
      isPrimary: index === 0,
      share: totalBytes ? bytes / totalBytes : 0,
    }));
}

function normalizeLanguage(language) {
  if (language === "C++") return "C++";
  if (language === "SCSS" || language === "Sass") return "SCSS";
  return language;
}

function inferTechnologies(repo, languages) {
  const override = REPO_TECH_OVERRIDES.get(repo.name);
  if (override) {
    return [override];
  }

  const hasDart = languages.some((language) => language.name === "Dart");
  const meaningfulLanguages = languages
    .filter((language) => language.isPrimary || language.share >= MIN_LANGUAGE_SHARE)
    .filter((language) => !LOW_SIGNAL_LANGUAGES.has(language.name))
    .filter((language) => !(hasDart && FLUTTER_PLATFORM_LANGUAGES.has(language.name)))
    .map((language) => language.name);

  const technologies = new Set(meaningfulLanguages);

  for (const topic of repo.topics) {
    const mapped = TOPIC_TECH.get(topic.toLowerCase());
    if (mapped) {
      technologies.add(mapped);
    }
  }

  const searchable = `${repo.name} ${repo.description} ${repo.topics.join(" ")}`;
  for (const [pattern, technology] of NAME_TECH) {
    if (pattern.test(searchable)) {
      technologies.add(technology);
    }
  }

  if (technologies.size === 0 && repo.language) {
    technologies.add(normalizeLanguage(repo.language));
  }

  return [...technologies].filter(Boolean).sort();
}

function chooseBestTechnology(repo, technologies, languages) {
  const override = REPO_TECH_OVERRIDES.get(repo.name);
  if (override) {
    return override;
  }

  const searchable = `${repo.name} ${repo.description} ${repo.topics.join(" ")}`;
  const topics = new Set(repo.topics.map((topic) => topic.toLowerCase()));
  const languageMap = new Map(languages.map((language) => [language.name, language]));
  const candidates = new Set(technologies);

  const scored = CATEGORY_RULES.map((rule) => {
    let score = 0;

    if (candidates.has(rule.technology)) {
      score += 20;
    }

    if (rule.topics?.some((topic) => topics.has(topic))) {
      score += 80;
    }

    if (rule.keywords?.some((pattern) => pattern.test(searchable))) {
      score += 45;
    }

    for (const language of rule.languages || []) {
      const match = languageMap.get(language);
      if (match?.isPrimary) {
        score += 35;
      } else if (match) {
        score += Math.round(match.share * 25);
      }
    }

    return { technology: rule.technology, score };
  }).filter((result) => result.score > 0);

  if (scored.length === 0) {
    return technologies[0] || "JavaScript";
  }

  return scored.sort((a, b) => b.score - a.score || categoryRank(a.technology) - categoryRank(b.technology))[0].technology;
}

function categoryRank(technology) {
  const rank = CATEGORY_PRIORITY.indexOf(technology);
  return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
}

function scoreRepo(repo) {
  const pushedAt = new Date(repo.pushedAt || repo.updatedAt || 0).getTime();
  const ageInDays = Math.max(1, (Date.now() - pushedAt) / 86_400_000);
  const recency = Math.max(0, 365 - ageInDays);
  return repo.stars * 100 + repo.forks * 30 + repo.watchers * 10 + recency;
}

function badge(label, meta) {
  const logo = meta.logo || encodeURIComponent(label);
  const logoColor = meta.logoColor || "FFFFFF";
  return `[![${label}](https://img.shields.io/static/v1?label=&message=${encodeURIComponent(label)}&color=${meta.color || "555555"}&logo=${logo}&logoColor=${logoColor})](${meta.url || "https://github.com/"})`;
}

function projectBadge(repo) {
  return `[![${repo.name}](https://img.shields.io/static/v1?label=&message=${encodeURIComponent(repo.name)}&color=000605&logo=github&logoColor=FFFFFF&labelColor=000605)](${repo.url})`;
}

function renderTable(grouped) {
  const rows = [...grouped.entries()]
    .map(([technology, projects]) => ({
      technology,
      projects: projects
        .sort((a, b) => scoreRepo(b) - scoreRepo(a) || a.name.localeCompare(b.name))
        .slice(0, MAX_PROJECTS_PER_TECH),
      totalScore: projects.reduce((total, repo) => total + scoreRepo(repo), 0),
    }))
    .filter((row) => row.projects.length > 0)
    .sort((a, b) => b.projects.length - a.projects.length || b.totalScore - a.totalScore || a.technology.localeCompare(b.technology));

  return [
    START_MARKER,
    "| Technology | Ranked Projects |",
    "| - | - |",
    ...rows.map((row) => {
      const meta = TECHNOLOGY_META[row.technology] || {};
      return `| ${badge(row.technology, meta)} | ${row.projects.map(projectBadge).join(" ")} |`;
    }),
    END_MARKER,
  ].join("\n");
}

async function main() {
  const { readFile, writeFile } = await import("node:fs/promises");
  const repos = await fetchRepos();
  const grouped = new Map();

  for (const repo of repos) {
    const languages = await fetchLanguages(repo);
    const fallbackLanguages = [repo.language]
      .filter(Boolean)
      .map((language) => ({ name: normalizeLanguage(language), bytes: 0, isPrimary: true, share: 1 }));
    const technologies = inferTechnologies(repo, languages.length ? languages : fallbackLanguages);
    const technology = chooseBestTechnology(repo, technologies, languages.length ? languages : fallbackLanguages);

    if (!grouped.has(technology)) {
      grouped.set(technology, []);
    }
    grouped.get(technology).push(repo);
  }

  const readme = await readFile(README_PATH, "utf8");
  const nextStack = renderTable(grouped);
  const markerPattern = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);

  if (!markerPattern.test(readme)) {
    throw new Error(`Could not find profile stack markers in ${README_PATH}`);
  }

  await writeFile(README_PATH, readme.replace(markerPattern, nextStack));
  console.log(`Updated ${README_PATH} with ${repos.length} ranked repositories across ${grouped.size} technologies.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
