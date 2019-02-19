const path = require('path');

const { slugify } = require('./scripts/slugify');

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const value = slugify(node.frontmatter.title);

    createNodeField({
      name: 'slug',
      node,
      value,
    });

    createNodeField({
      name: 'author',
      node,
      value: node.frontmatter.author,
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const loadPosts = new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        reject(result.errors);
      }

      // Create blog posts pages.
      const posts = result.data.allMarkdownRemark.edges;
      const postsPerFirstPage = 7;
      const postsPerPage = 6;
      const numPages = Math.ceil(
        posts.slice(postsPerFirstPage).length / postsPerPage,
      );

      // Home page
      createPage({
        path: '/',
        component: path.resolve('./src/templates/index.tsx'),
        context: {
          limit: postsPerFirstPage,
          skip: 0,
          numPages: numPages + 1,
          currentPage: 1,
        },
      });

      // Other pages
      Array.from({ length: numPages }).forEach((_, i) => {
        createPage({
          path: `/${i + 2}/`,
          component: path.resolve('./src/templates/index.tsx'),
          context: {
            limit: postsPerPage,
            skip: i * postsPerPage + postsPerFirstPage,
            numPages: numPages + 1,
            currentPage: i + 2,
          },
        });
      });

      // Posts
      posts.forEach(({ node }, i) => {
        const previous = i === 0 ? null : posts[i - 1].node;
        const next = i === posts.length - 1 ? null : posts[i + 1].node;

        createPage({
          path: `${node.fields.slug}/`,
          component: path.resolve('./src/templates/post.tsx'),
          context: {
            slug: node.fields.slug,
            previous,
            next,
          },
        });
      });

      resolve();
    });
  });

  // tags
  const loadTags = new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
              }
            }
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        reject(result.errors);
      }

      const posts = result.data.allMarkdownRemark.edges;
      const tags = {};

      posts.forEach(({ node }) => {
        const { tags: postTags } = node.frontmatter;

        if (!postTags) {
          return;
        }

        postTags.forEach((tag) => {
          const sluggedTag = slugify(tag);
          const tagObj = tags[sluggedTag];

          if (tagObj) {
            tagObj.posts.push(node.fields.slug);
          } else {
            tags[sluggedTag] = {
              tag,
              posts: [node.fields.slug],
            };
          }
        });
      });

      const postsPerPage = 6;

      Object.entries(tags).forEach(([slug, { tag, posts }]) => {
        const totalPosts = posts.length;
        const numPages = Math.ceil(totalPosts / postsPerPage);

        Array.from({ length: numPages }).forEach((_, i) => {
          createPage({
            path: `/tag/${slug}/${i === 0 ? '' : i + 1}`,
            component: path.resolve('./src/templates/tag.tsx'),
            context: {
              tag,
              slug,
              totalPosts,
              limit: postsPerPage,
              skip: i * postsPerPage,
              numPages: numPages,
              currentPage: i + 1,
            },
          });
        });
      });

      resolve();
    });
  });

  const loadAuthors = new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                author {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        reject(result.errors);
      }

      const posts = result.data.allMarkdownRemark.edges;
      const authors = {};

      posts.forEach(({ node }) => {
        const { author } = node.frontmatter;

        if (!author) {
          return;
        }

        const sluggedAuthor = slugify(author.id);
        const authorObj = authors[sluggedAuthor];

        if (authorObj) {
          authorObj.posts.push(node.fields.slug);
        } else {
          authors[sluggedAuthor] = {
            name: author.name,
            id: author.id,
            posts: [node.fields.slug],
          };
        }
      });

      const postsPerPage = 6;

      Object.entries(authors).forEach(
        ([slug, { id: authorId, name: authorName }]) => {
          const totalPosts = posts.length;
          const numPages = Math.ceil(totalPosts / postsPerPage);

          Array.from({ length: numPages }).forEach((_, i) => {
            createPage({
              path: `/author/${slug}/${i === 0 ? '' : i + 1}`,
              component: path.resolve('./src/templates/author.tsx'),
              context: {
                authorId,
                authorName,
                totalPosts,
                slug,
                limit: postsPerPage,
                skip: i * postsPerPage,
                numPages: numPages,
                currentPage: i + 1,
              },
            });
          });
        },
      );

      resolve();
    });
  });

  return Promise.all([loadPosts, loadTags, loadAuthors]);
};
