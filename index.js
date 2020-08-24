const inquirer = require("inquirer");
const { createNotes } = require("./utils/dir");

const questions = [
  {
    type: "input",
    name: "courseUrl",
    message: "What's the Egghead course url:",
  },
  {
    type: "input",
    name: "githubUsername",
    message: "What's your GitHub username:",
  },
];

(async () => {
  const { courseUrl, githubUsername } = await inquirer.prompt(questions);
  global.courseUrl = courseUrl;
  global.githubUsername = githubUsername;
  await createNotes();
})();
