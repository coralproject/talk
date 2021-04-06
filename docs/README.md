# docs

Documentation **heavily** inspired by https://github.com/leerob/leerob.io and
the work by Hashicorp.

## Development

You can begin developing on the documentation by running:

```sh
npm run watch docs
```

Or alongside the rest of the Coral when you run:

```sh
MOUNT_DOCUMENTATION=true npm run watch
```

Navigate over to http://localhost:8080/docs to see documentation.

## Contributing

The documentation is a [NextJS](https://nextjs.org) application that is mounted
by the Coral express server when enabled. At the moment, we have all of the
documentation files within `/docs`, but hopefully we can move these into
`/src/docs` in the future and replace the existing MDX files that we have in
there.

New documentation should be created as `.mdx` files within the `/docs/content`
folder. Currently, it does not support nested folders, so files should be
created at the root of that content directory. Once you've added a new `.mdx`
file there, you should add it to the sidebar navigation at `/docs/data/nav.yml`.

When you're creating a new `.mdx` file for a document, it must contain
frontmatter (the YAML within the `--- ... ---` that you can see on existing
files). The current set of fields supported by these documents are:

- `title` - (**required**) the title to be displayed at the top of the page
- `description` - (**required**) the description to be displayed below the title
