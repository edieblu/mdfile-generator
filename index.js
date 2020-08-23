const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

// get user input
const courseUrl = process.argv[2];
const githubUsername = process.argv[3];

// handle bad user input
if (!courseUrl && !githubUsername) {
  console.error(
    "Error:\n\tPlease provide an EggHead.io course URL adn GitHub username"
  );
  console.error(
    "\t\tnpm start https://egghead.io/courses/data-structures-and-algorithms-in-javascript dijonmusters"
  );

  return 1;
}

if (!courseUrl) {
  console.error("Error:\n\tPlease provide an EggHead.io course URL");
  console.error(
    "\t\te.g. https://egghead.io/courses/data-structures-and-algorithms-in-javascript"
  );

  return 1;
}

if (!githubUsername) {
  console.error("Error:\n\tPlease provide a GitHub username");

  return 1;
}

const baseUrl = "https://egghead.io";
const baseLessonUrl = `${baseUrl}/lessons/`;
const baseCourseUrl = `${baseUrl}/courses/`;
const courseSlug = courseUrl.replace(baseCourseUrl, "");
const getPrevious = (lessons, i) => (i === 0 ? null : lessons[i - 1].url);
const getNext = (lessons, i) =>
  i === lessons.length - 1 ? null : lessons[i + 1].url;
const getLessonNumber = (i) => (i < 9 ? `0${i + 1}` : `${i + 1}`);

const readmeContent = ({ title, about, lessons, instructor, img, user }) =>
  `
# [${title}](${courseUrl}˜)

<p align="center"><img src="${img}" width="300" />

## About 🔍

${about}

## Instructor 👨‍💻

[${instructor.name}](${instructor.url}). ${instructor.bio}

[${instructor.first}'s courses at egghead.](${instructor.url})

## Table of Contents 📜

${lessons
  .map(
    (lesson, i) =>
      `- [${getLessonNumber(i)} - ${lesson.title}](${lesson.filename})`
  )
  .join("\n")}

## Emoji Legend 🧠
| emoji |        explanation        |
| ----- | :-----------------------: |
| 📹    | links to the course video |
| 💻    |     course repository     |
| ⌨️     |     keyboard shortcut     |
| 🤔    |   additional resources    |
| 👍    |       good practice       |
| ❗    |    significant change     |

## Contributors ✨

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/${user.username}">
        <img
          src="${user.img}"
          width="100px;"
          alt="${user.name}'s profile picture"
        />
        <br />
        <sub><b>${user.name}</b></sub>
      </a>
      <br />
      <a
        href="https://github.com/eggheadio/eggheadio-course-notes/${courseSlug}/notes"
        title="Content">
        🖋
      </a>
    </td>
  </tr>
</table>

[✏️ Edit on GitHub](https://github.com/eggheadio/eggheadio-course-notes/tree/master/${courseSlug}/notes)
`.trimStart();

const lessonContent = ({ title, url, prev, next }) =>
  `
# ${title}

**[📹 Video](${url})**

## TODO

${(prev || next) && `---`}

${prev ? `📹 [Go to Previous Lesson](${prev})` : ""}
${next ? `📹 [Go to Next Lesson](${next})` : ""}

`.trim() + "\n";

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

const getPageData = async () => {
  // get data from course page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  await page.goto(courseUrl);

  const data = await page.evaluate(() => {
    const contains = (selector, text) => {
      const collection = Array.from(document.querySelectorAll(selector));
      return collection.filter((item) => item.innerText.includes(text))[0];
    };

    const lessons = Array.from(
      document.querySelectorAll(
        "a.index__hoverListItem__5b00de116ebc92ec28e53feb410bf6a5"
      )
    ).map((a) => {
      const title = a.children[0].textContent;
      return {
        title,
        url: a.href,
      };
    });

    const about = Array.from(
      document
        .querySelector("h1")
        .parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.querySelectorAll(
          "p"
        )
    )
      .map((p) => p.textContent)
      .join("\n\n");

    const title = document.querySelector("h1").textContent;
    const by = contains("span", "By");
    const instructor = {
      name: by.nextElementSibling.innerText,
      first: by.nextElementSibling.innerText.split(" ")[0],
      url: by.parentElement.href,
      bio: by.parentElement.nextElementSibling.querySelector("p").innerText,
    };
    const img = document.querySelector(`img[alt="illustration for ${title}"]`)
      .src;

    return {
      title,
      about,
      lessons,
      instructor,
      img,
    };
  });

  browser.close();

  return data;
};

const getLessonData = (lessons) =>
  lessons.map((lesson, i) => {
    const prev = getPrevious(lessons, i);
    const next = getNext(lessons, i);
    const filename = `notes/${lesson.url.replace(
      baseLessonUrl,
      `${getLessonNumber(i)}-`
    )}.md`;

    return {
      ...lesson,
      filename,
      prev,
      next,
    };
  });

const createDirectories = (dir) => {
  const notesDir = `${dir}/notes`;

  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
  }
};

const createReadme = (dir, data) => {
  const stream = fs.createWriteStream(`${dir}/README.md`);

  stream.once("open", () => {
    const content = readmeContent(data);
    stream.write(content);
    stream.end();
  });
};

const createLesson = (dir, lesson) => {
  const { filename, title } = lesson;
  let stream = fs.createWriteStream(`${dir}/${filename}`);
  stream.once("open", () => {
    const content = lessonContent(lesson);
    stream.write(content);
    stream.end();
  });

  const randomEmoji =
    HAPPY_EMOJI[Math.floor(Math.random() * HAPPY_EMOJI.length)];
  console.log(`Notes for lesson ${title} created ${randomEmoji}`);
};

const getGithubUser = async () => {
  const {
    data: { name, avatar_url },
  } = await axios.get(`https://api.github.com/users/${githubUsername}`);

  return {
    username: githubUsername,
    name,
    img: avatar_url,
  };
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

createNotes();

// TODO: Fix shortened instructor bio
// TODO: Move some stuff into util files
// TODO: Update README
// TODO: Fork
// TODO: Open PR
