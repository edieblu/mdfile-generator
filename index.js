const puppeteer = require("puppeteer");
const fs = require("fs");

const courseUrl = process.argv[2];
const category = process.argv[3];

const dir = "./tmp";
const HAPPY_EMOJI = [
  "💃",
  "🎉",
  "💪",
  "✅",
  "🤸‍♀️",
  "👍",
  "🍾",
  "🤠",
  "🔥",
  "👏",
];

const baseUrl = "https://egghead.io/lessons";
const getSlug = (title) => title.toLowerCase().replace(/\W+/g, "-");
const buildUrl = (slug) => `${baseUrl}/${category}-${slug}`;

const getPrevious = (titles, i) => {
  if (i === 0) return null;
  const slug = getSlug(titles[i - 1]);
  return buildUrl(slug);
};

const getNext = (titles, i) => {
  if (i === titles.length - 1) return null;
  const slug = getSlug(titles[i + 1]);
  return buildUrl(slug);
};

const getLessons = (titles) =>
  titles.map((title, i) => {
    const slug = getSlug(title);
    const url = buildUrl(slug);
    const prev = getPrevious(titles, i);
    const next = getNext(titles, i);

    return {
      title,
      url,
      prev,
      next,
    };
  });

const notes = {
  // Creates lesson file with the link to the video
  createLessonMarkdownFile: (lesson, i) => {
    const { title, url, prev, next } = lesson;
    const slug = getSlug(title);
    const number = i < 9 ? `0${i + 1}` : i + 1;
    const fileName = `${number}-${slug}.md`;
    let stream = fs.createWriteStream(`${dir}/${fileName}`);
    stream.once("open", () => {
      stream.write(`# ${title}\n\n`);
      stream.write(`**[📹 Video](${url})**\n\n`);
      stream.write(`## TODO\n\n`);
      stream.write(`---\n\n`);
      prev && stream.write(`📹 [Go to Previous Lesson](${prev})\n`);
      next && stream.write(`📹 [Go to Next Lesson](${next})\n`);
      stream.end();
    });
    notes.addLessonFiletoTOC(title, fileName, i);
    const randomEmoji =
      HAPPY_EMOJI[Math.floor(Math.random() * HAPPY_EMOJI.length)];
    console.log(`Notes for lesson ${title} created ${randomEmoji}`);
  },

  // Creates a table of contents with a link to the file
  addLessonFiletoTOC: async (title, fileName, i) => {
    let stream = fs.createWriteStream(`${dir}/README.md`, { flags: "a" });
    const number = i < 9 ? `0${i + 1}` : i + 1;
    await stream.once("open", () => {
      stream.write(`- [${number}-${title}](${fileName})\n\n`);
      stream.end();
    });
  },

  // creates a README file
  initializeTOC: () => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let stream = fs.createWriteStream(`${dir}/README.md`);
    stream.once("open", () => {
      stream.write(`## Table of Contents\n\n`);
      stream.end();
    });
    console.log("Creating notes! This should only take a couple of seconds 💪");
  },

  // create the intro file
  initializeIntro: () => {
    const lesson = {
      title: "Intro and Welcome",
      url: courseUrl,
      next: null,
      prev: null,
    };
    notes.createLessonMarkdownFile(lesson, -1);
  },
};

notes.initializeTOC();
notes.initializeIntro();

const getLessonData = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
  });
  // await page.goto(urlToken);
  await page.goto(courseUrl);

  // all playlist lessons have this same classname
  await page.waitForSelector(".fw4.lh-title.white");

  const data = await page.evaluate(() => {
    const titles = Array.from(
      document.querySelectorAll(".fw4.lh-title")
    ).map((c) => c.textContent.trim());

    return {
      titles,
    };
  });

  browser.close();

  return data;
};

(async () => {
  const { titles } = await getLessonData();

  const lessons = getLessons(titles);

  lessons.forEach((lesson, i) => {
    notes.createLessonMarkdownFile(lesson, i);
  });
})();
