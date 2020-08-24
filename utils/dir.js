const fs = require("fs");
const getReadmeContent = require("../templates/readme");
const getLessonContent = require("../templates/lesson");
const { getLessonData } = require("./lesson");
const { getPageData } = require("./browser");

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

const getGithubUser = require("./github");

const createDirectories = (dir) => {
  const notesDir = `${dir}/notes`;

  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
  }
};

const createReadme = (dir, data) => {
  const stream = fs.createWriteStream(`${dir}/README.md`);

  stream.once("open", () => {
    const content = getReadmeContent(data);
    stream.write(content);
    stream.end();
  });
};

const createLesson = (dir, lesson) => {
  const { filename, title } = lesson;
  let stream = fs.createWriteStream(`${dir}/${filename}`);
  stream.once("open", () => {
    const content = getLessonContent(lesson);
    stream.write(content);
    stream.end();
  });

  const randomEmoji =
    HAPPY_EMOJI[Math.floor(Math.random() * HAPPY_EMOJI.length)];
  console.log(`Notes for lesson ${title} created ${randomEmoji}`);
};

const createNotes = async () => {
  console.log("Creating notes! This should only take a couple of seconds 💪");

  const data = await getPageData();
  const { title } = data;
  const slug = title.toLowerCase().replace(/\W+/g, "-");
  const dir = `./tmp/${slug}`;
  const user = await getGithubUser();

  const lessons = getLessonData(data.lessons);

  createDirectories(dir);
  createReadme(dir, { ...data, lessons, user });

  lessons.forEach((lesson) => {
    createLesson(dir, lesson);
  });
};

module.exports = {
  createDirectories,
  createReadme,
  createLesson,
  createNotes,
};
