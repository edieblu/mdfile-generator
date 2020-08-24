const baseUrl = "https://egghead.io";
const baseLessonUrl = `${baseUrl}/lessons/`;
const baseCourseUrl = `${baseUrl}/courses/`;
const getCourseSlug = () => courseUrl.replace(baseCourseUrl, "");

module.exports = { baseUrl, baseLessonUrl, baseCourseUrl, getCourseSlug };
