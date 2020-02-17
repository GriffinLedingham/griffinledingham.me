# griffinledingham.me
My personal blog, based on my [Node.js blog template](https://github.com/GriffinLedingham/node-blog-starter/).

[Check it out!](https://griffinledingham.me)

## Setup

```yarn install```

## Usage

### Development
Run the blog using Nodemon and livereload.js for development.

```yarn dev```

### Build
Build the blog into a static directory using `wget` magic.

```yarn build```

## Github Actions
On push to `master` Github Actions will trigger a deploy to my gh-pages for this repository. This means that the blog may be managed entirely through Github's Markdown editor if desired, simply adding new blog posts in the `posts/` directory, which triggers the Github Action CI flow to build static content and deploy to gh-pages.
