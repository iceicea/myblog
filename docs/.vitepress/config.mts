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
      { text: "面试题", link: "/interview/handwriting" },
      { text: "React相关", link: "" },
      {
        text: "下拉菜单测试",
        items: [
          { text: "Item A", items: [{ text: "嵌套了", link: "/" }] },
          { text: "Item B", link: "/" },
          { text: "Item C", link: "/" },
        ],
      },
    ],

    sidebar: {
      "/interview/": [
        {
          text: "JS相关面试题",
          collapsed: true,
          items: [
            { text: "手写题", link: "/interview/handwriting" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
        {
          text: "CSS相关面试题",
          collapsed: true,
          items: [
            { text: "Markdown Examples", link: "/interview/handwriting" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
