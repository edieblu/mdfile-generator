const { getCourseSlug } = require("../utils/url");
const { getLessonNumber } = require("../utils/lesson");

const getReadmeContent = ({ title, about, lessons, instructor, img, user }) =>
  `
# [${title}](${courseUrl})

<p align="center"><img src="${img}" width="300" /></p>

## About 🔍

${about}

## Instructor 🎓

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
        href="https://github.com/eggheadio/eggheadio-course-notes/${getCourseSlug()}/notes"
        title="Content">
        🖋
      </a>
    </td>
  </tr>
</table>

[✏️ Edit on GitHub](https://github.com/eggheadio/eggheadio-course-notes/tree/master/${getCourseSlug()}/notes)
`.trimStart();

module.exports = getReadmeContent;
