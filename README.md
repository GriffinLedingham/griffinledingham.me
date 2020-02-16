# node-blog-starter
A barebones, no-bloat starter blog in Node, using Markdown to format posts, and Handlebars to server-side render. Posts are created and accessed through the `/posts` folder in Markdown format. 

The blog has 2 simple endpoints with accompanying views:

- `/` 
  - Home view, for displaying your blog posts to viewers.

- `/post/<POST>` 
  - Post view, for displaying a Markdown post to viewers.

## Setup

```yarn install```

## Usage

### Development
Run the blog using Nodemon and livereload.js for development.

```yarn dev```

### Build
Build the blog into a static directory using `wget` magic.

```yarn build```
