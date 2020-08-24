## Hi and welcome! 💃

The purpose of this project is to help Egghead learner advocates create their course notes faster and more efficiently by doing all the boring stuff for you.

Essentially, you will run a script which will generate a skeleton for the notes, including:

* a README.md with
  * course info
  * author info
  * table of contents linking to each lesson
  * contribution info (for all your hard work! ✨)
* a markdown file for each lesson with
  * the title of the lesson
  * a current video link
  * a previous video link (if exists)
  * a next video link (if exists)

## Inspiration 💡

There were two events that inspired the creation of this project:

1. I've created my first Egghead course notes [Develop Accessible Webapps with React](https://github.com/eggheadio-projects/develop-accessible-web-apps-with-react-notes), and I found the process of creating files and linking to Egghead videos tedious and error-prone.

2. I watched John's [Automate Everything](https://egghead.io/playlists/john-lindquist-s-ultra-advanced-yak-shaved-lesson-creation-process-dd3b) playlist, which gave me some ideas on how to automate this.

## How do you actually use this? 🤔

To use this for your own notetaking project, do the following:

1. `clone` this repository
2. run `npm install`
3. run `npm start`

Boom 💣 almost there!

Now, to generate the notes, you'll need two things:

1. The course URL
   e.g. `https://egghead.io/courses/data-structures-and-algorithms-in-javascript`

2. Your GitHub username

That's it! 🎉

Now you should have a `tmp` directory with a course folder full of auto-generated files! Copy this course folder to your cloned [Egghead course notes directory](https://github.com/eggheadio/eggheadio-course-notes), and just focus on writing those really good notes! 📝

## Personalization

Everyone has their own personal flair when writing notes, which is awesome! The `templates/lesson.js` and `templates/readme.js` files are used to generate the boilerplate. Feel free to modify these in any way to fit your particular style. If you have a recommendation for how these could be improved or want to contribute additional templates that could help others, get in touch!

## Notes from the author ✏️

* if you are writing notes for a course that hasn't been published yet, you might have to provide an extra configuration
* the template here is primarily based on my first course notes, and I'll probably change it as I write more course notes in the future
* I intentionally didn't provide too much auto-generated content - we are all different and will ultimately create different types of notes and that's how it should be!

## Bugs? Ideas for improvements?

This is my first file generator project and automation project, and I'm sure it could be better. It took me a day to write and has saved me 2-3 hours of my time so far (I've used it for two notetaking projects), but nonetheless, it has already been worth it. I enjoyed writing it, and I hope some of you find it useful too!

If you have ideas on how to improve this generator, get in touch! 👍
