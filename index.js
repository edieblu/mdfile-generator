const puppeteer = require("puppeteer");
const changeCase = require("change-case");
const fs = require("fs");

const courseUrl = process.argv[2];
const category = process.argv[3];

const dir = './tmp'
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

const notes = {
  // Creates chapter file with the link to the video
  createChapterMarkdownFile: (title, url, i) => {
    const paramsCaseTitle = changeCase.paramCase(title);
    const number = i < 10 ? `0${i + 1}` : i + 1;
    const fileName = `${number}-${paramsCaseTitle}.md`;
    let stream = fs.createWriteStream(`${dir}/${fileName}`);
    stream.once("open", function (fd) {
      stream.write(`# ${title}\n\n`);
      stream.write(`**[📹 Video](${url})**\n`);
      stream.end();
    });
    notes.addChapterFiletoTOC(title, fileName, i);
    const randomEmoji =
      HAPPY_EMOJI[Math.floor(Math.random() * HAPPY_EMOJI.length)];
    console.log(`Notes for chapter ${title} created ${randomEmoji}`);
  },

    // Creates a table of contents with a link to the file
    addChapterFiletoTOC: async(title, fileName, i) => {
      let stream = fs.createWriteStream(`${dir}/README.md`, { flags: "a" });
      const number = i < 9 ? `0${i+1}` : i+1
      await stream.once("open", function (fd) {
        stream.write(`- [${number}-${title}](${fileName})\n\n`);
        stream.end();
      });
    },

  // creates a README file
  initializeTOC: () => {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
    let stream = fs.createWriteStream(`${dir}/README.md`);
    stream.once("open", function (fd) {
      stream.write(`## Table of Contents\n\n`);
      stream.end();
    });
    console.log("Creating notes! This should only take a couple of seconds 💪");
  },

  // create the intro file
  initializeIntro: () => {
    notes.createChapterMarkdownFile('Intro and Welcome', courseUrl, -1);
}
};

notes.initializeTOC();
notes.initializeIntro();

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
  });
  // await page.goto(urlToken);
  await page.goto(courseUrl);
  // All playlist chapters have this same classname
  await page.waitForSelector(".fw4.lh-title.white");

  const chapters = await page.evaluate((category) => {
    const headings = [];
    const nodes = document.querySelectorAll(".fw4.lh-title");
    nodes.forEach((node) => {
    const title = node.textContent.trim()
    const paramsCaseTitle = title.replace(/\s+/g, '-').toLowerCase();
    const baseUrl = 'https://egghead.io/lessons'
      headings.push({
        title: title,
        url: `${baseUrl}/${category}-${paramsCaseTitle}`,
      });
    });
    return headings;
  }, category);
  chapters.forEach((chapter, i) => {
    notes.createChapterMarkdownFile(chapter.title, chapter.url, i);
  });
  browser.close();
})();
