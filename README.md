## Hi and welcome! 💃

The purpose of this project is to help Egghead learner advocates create their course notes faster and more efficiently by doing all the boring stuff for you.

Essentially, you will run a script which will generate a skeleton for the notes, including:

* a file for each course video with an Egghead video link at the top
* a table of contents linking back to each of these files
* an additional "00-intro-and-welcome.md" where you can provide optional explanations
* a `tmp` directory where all of the above is going to be stored (so you can move it easily)

## Inspiration 💡

There were two events that inspired the creation of this project:
1. I've created my first Egghead course notes [Develop Accessible Webapps with React](https://github.com/eggheadio-projects/develop-accessible-web-apps-with-react-notes), and I found the process of creating files and linking to Egghead videos tedious and error-prone.

2. I watched John's [Automate Everything](https://egghead.io/playlists/john-lindquist-s-ultra-advanced-yak-shaved-lesson-creation-process-dd3b) playlist, which gave me some ideas on how to automate this.

## How do you actually use this? 🤔

To use this for your own notetaking project, do the following:
1. `clone` this repository
2. run `npm install`

Boom 💣 almost there!

Now, to generate the notes, you'll need two things:

1. The playlist URL
  * Once you're assigned a course, click on **Start watching**, which should give you a url like this: `https://egghead.io/lessons/react-set-up-eslint-to-audit-accessibility-issues-in-react`. This is your `courseUrl` (copy it as you'll need in a moment)

Notice that the title of the first video is **Set up ESLint to Audit Accessibility Issues in React**, but its url is `https://egghead.io/lessons/react-set-up-eslint-to-audit-accessibility-issues-in-react` - so the title is prefixed with `react` which is the Egghead category for this course.

2 The `category` is the second argument that you'll need

Note that sometimes (like in Erin's course above), the videos for a single course will be stored in different categories. Unfortunately that means that you'll still have to manually check that all the links are valid and fix those that aren't (for example, in the course above, some videos urls started with `chrome-` instead of `react-`).

OK, now that we have everything we need, we can run the notes generator by going to the root of our project and running:
* `npm start courseUrl category`

Example:
* `npm start https://egghead.io/lessons/react-set-up-eslint-to-audit-accessibility-issues-in-react react`

That's it! 🎉

Now you should have a `tmp` file with lots of auto-generated files!

## Notes from the author ✏️

* you might need to reorder some files in the Table of contents (I should be able to fix that soon)
* if you are writing notes for a course that hasn't been published yet, you might have to provide an extra configuration
* the template here is primarily based on my first course notes, and I'll probably change it as I write more course notes in the future
* I intentionally didn't provide too much auto-generated content - we are all different and will ultimately create different types of notes and that's how it should be!

## Bugs? Ideas for improvements?

This is my first file generator project and automation project, and I'm sure it could be better. It took me a day to write and has saved me 2-3 hours of my time so far (I've used it for two notetaking projects), but nonetheless, it has already been worth it. I enjoyed writing it, and I hope some of you find it useful too!

If you have ideas on how to improve this generator, get in touch! 👍