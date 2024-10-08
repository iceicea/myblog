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
      { text: "面试题", link: "/interview/js/handwriting" },
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
            { text: "手写题", link: "/interview/js/handwriting" },
            { text: "文章", link: "/typescript/importtype" },
          ],
        },
        {
          text: "CSS相关面试题",
          collapsed: true,
          items: [
            {
              text: "BFE.dev上的一些CSS题目",
              link: "/interview/css/BFEdev",
            },
          ],
        },
        {
          text: "每日一问",
          collapsed: true,
          items: [
            { text: "虚拟DOM相关", link: "/interview/everyday/20240821" },
            {
              text: "二叉树的最近公共祖先",
              link: "/interview/everyday/20240822",
            },
            {
              text: "DOM树",
              link: "/interview/everyday/20240823",
            },
            {
              text: "什么是Fiber",
              link: "/interview/everyday/20240824",
            },
            {
              text: "软链接和硬链接",
              link: "/interview/everyday/20240826",
            },
            {
              text: "点访问和括号访问",
              link: "/interview/everyday/20240827",
            },
            {
              text: "TS装饰器和依赖注入",
              link: "/interview/everyday/20240828",
            },
            {
              text: "变量遮蔽",
              link: "/interview/everyday/20240829",
            },
            {
              text: "Promise A+规范",
              link: "/interview/everyday/20240830",
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
