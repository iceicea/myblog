import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Projet",
  description: "A VitePress e",
  markdown: {
    lineNumbers: true,
  },
  // lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      src: "https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408200029564.png",
      alt: "logo",
    },
    siteTitle: "Hello World",
    nav: [
      { text: "首页", link: "/" },
      { text: "面试题", link: "/markdown-examples" },
      { text: "React相关", link: "" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
