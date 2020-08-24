const puppeteer = require("puppeteer");

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

  await page.goto(data.instructor.url);

  const bio = await page.evaluate(() => {
    return document.querySelector("p").textContent;
  });

  browser.close();

  const instructor = {
    ...data.instructor,
    bio,
  };

  return {
    ...data,
    instructor,
  };
};

module.exports = { getPageData };
