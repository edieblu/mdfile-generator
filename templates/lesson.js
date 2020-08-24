const getLessonContent = ({ title, url, prev, next }) =>
  `
# ${title}

**[📹 Video](${url})**

TODO

${(prev || next) && `---`}
${prev ? `\n📹 [Go to Previous Lesson](${prev})` : ""}
${next ? `📹 [Go to Next Lesson](${next})` : ""}

`.trim() + "\n";

module.exports = getLessonContent;
