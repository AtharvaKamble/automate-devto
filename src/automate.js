import axios from "axios";
import chalk from "chalk";
import dotenv from "dotenv";
import request from "request";

dotenv.config();

const API_KEY = process.env.DEVTO_API_DEV;

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
    console.log(data);
  } catch (error) {
    console.log(error);
    return;
  }
}

updatePost();
