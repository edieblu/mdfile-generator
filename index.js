const puppeteer = require("puppeteer");
const changeCase = require("change-case");
const fs = require("fs");

const url = process.argv[2];
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
    const paramsCase = changeCase.paramCase(title);
    const number = i < 10 ? `0${i + 1}` : i + 1;
    const fileName = `${number}-${paramsCase}.md`;
    let stream = fs.createWriteStream(fileName);
    stream.once("open", function (fd) {
      stream.write(`# ${title}\n\n`);
      stream.write(`**[📹 Video](${url})**\n`);
      stream.end();
    });
    notes.addChapterFiletoTOC(title, fileName);
    const randomEmoji =
      HAPPY_EMOJI[Math.floor(Math.random() * HAPPY_EMOJI.length)];
    console.log(`Notes for chapter ${title} created ${randomEmoji}`);
  },

    // Creates a table of contents with a link to the file
    addChapterFiletoTOC: (title, fileName) => {
      let stream = fs.createWriteStream("README.md", { flags: "a" });
      stream.once("open", function (fd) {
        stream.write(`- [${title}](${fileName})\n\n`);
        stream.end();
      });
    },

  // creates a README file
  initializeTOC: () => {
    let stream = fs.createWriteStream(`README.md`);
    stream.once("open", function (fd) {
      stream.write(`## Table of Contents\n\n`);
      stream.end();
    });
    console.log("Creating notes! This should only take a couple of seconds 💪");
  },

  // create the intro file
  initializeIntro: () => {
    notes.createChapterMarkdownFile('intro-and-welcome', url, -1);
}
};

notes.initializeTOC();
notes.initializeIntro();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
  });
  await page.goto(url);
  await page.waitForSelector(".fw4.lh-title.white");

  const chapters = await page.evaluate(() => {
    const headings = [];
    const nodes = document.querySelectorAll(".fw4.lh-title");
    nodes.forEach((node) => {
      headings.push({
        title: node.textContent.trim(),
        url: node.baseURI,
      });
    });
    return headings;
  });
  chapters.forEach((chapter, i) => {
    notes.createChapterMarkdownFile(chapter.title, chapter.url, i);
  });
  browser.close();
})();
