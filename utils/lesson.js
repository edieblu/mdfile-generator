const { baseLessonUrl } = require("./url");

const getPrevious = (lessons, i) => (i === 0 ? null : lessons[i - 1].url);
const getNext = (lessons, i) =>
  i === lessons.length - 1 ? null : lessons[i + 1].url;
const getLessonNumber = (i) => (i < 9 ? `0${i + 1}` : `${i + 1}`);

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

module.exports = { getPrevious, getNext, getLessonNumber, getLessonData };
