import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";

dotenv.config();

const app = express();
const API_KEY = process.env.DEVTO_API_DEV;
const port = process.env.PORT || 3000;

app.use(cors());

async function retrievePosts() {
  const names = [];
  const url = "https://dev.to/api/articles/me/unpublished";

  return axios
    .get(url, {
      headers: {
        "api-key": API_KEY,
      },
    })
    .then((response) => {
      response.data.map((item) =>
        names.push({
          id: item.id,
          title: item.title,
          body_markdown: item.body_markdown,
          published: item.published,
        })
      );
      return names;
    });
}

async function updatePost() {
  const unpublishedPosts = await retrievePosts();
  const nextLinedUpArticle = unpublishedPosts[unpublishedPosts.length - 1];
  const payload = {
    article: {
      title: nextLinedUpArticle.title,
      body_markdown: nextLinedUpArticle.body_markdown,
      published: true,
      series: null,
      tags: [],
    },
  };

  try {
    const { data } = await axios({
      method: "PUT",
      url: `https://dev.to/api/articles/${nextLinedUpArticle.id}`,
      data: payload,
      headers: {
        "api-key": API_KEY,
      },
    });

    const outputString = `Published post: ${chalk.yellow(
      data.title
    )}\nYou can check the post at ${chalk.cyan(data.url)}`;

    console.log(outputString);

    return outputString;
  } catch (error) {
    console.log(error);
    return;
  }
}

app.get("/", (req, res) => {
  const htmlMessage =
    "<h3>Automate dev.to blogs</h3><style>@import url('https://fonts.googleapis.com/css2?family=Karla:wght@600&display=swap'); h3 {font-family: 'Karla', sans-serif;}</style>";
  res.send(htmlMessage).status(200);
});

app.post("/updatePost", async (req, res) => {
  try {
    await updatePost();
    res.status(200).send({ status: "OK" });
  } catch (e) {
    res.send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is up and running on ${chalk.yellow(port)}`);
});
