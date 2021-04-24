# Contributing

## Local Development
You can use the examples folder for local development.  To do so, run the following:
```bash
npm install
npm link
cd example
npm install
npm link redux-injectors

# The following two commands are required so react 
# doesn't complain about multiple copies being loaded
rm -rf node_modules/react
rm -rf node_modules/react-dom
rm -rf node_modules/react-redux

npm start
```

## Pull requests

Good pull requests - patches, improvements, new features - are a fantastic
help. They should remain focused in scope and avoid containing unrelated
commits.

**Please ask first** before embarking on any significant pull request (e.g.
implementing features, refactoring code, porting to a different language),
otherwise you risk spending a lot of time working on something that the
project's developers might not want to merge into the project.

Please adhere to the coding conventions used throughout a project (indentation,
accurate comments, etc.) and any other requirements (such as test coverage).

Since the `master` branch is what people actually use in production, we have a
`dev` branch that unstable changes get merged into first. Only when we
consider that stable we merge it into the `master` branch and release the
changes for real.

Adhering to the following process is the best way to get your work
included in the project:

1.  [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone your fork, and configure the remotes:

    ```bash
    # Clone your fork of the repo into the current directory
    git clone https://github.com/<your-username>/redux-injectors.git
    # Navigate to the newly cloned directory
    cd redux-injectors
    # Assign the original repo to a remote called "upstream"
    git remote add upstream https://github.com/react-boilerplate/redux-injectors.git
    ```

2.  If you cloned a while ago, get the latest changes from upstream:

    ```bash
    git checkout dev
    git pull upstream dev
    ```

3.  Create a new topic branch (off the `dev` branch) to contain your feature, change, or fix:

    ```bash
    git checkout -b <topic-branch-name>
    ```

4.  Commit your changes in logical chunks. Please adhere to these [git commit message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) or your code is unlikely be merged into the main project. Use Git's [interactive rebase](https://help.github.com/articles/about-git-rebase/) feature to tidy up your commits before making them public.

5.  Locally merge (or rebase) the upstream dev branch into your topic branch:

    ```bash
    git pull [--rebase] upstream dev
    ```

6.  Push your topic branch up to your fork:

    ```bash
    git push origin <topic-branch-name>
    ```

7.  [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
    with a clear title and description.

**IMPORTANT**: By submitting a patch, you agree to allow the project
owners to license your work under the terms of the [MIT License](https://github.com/react-boilerplate/redux-injectors/blob/master/LICENSE.md).

## Tips
- When changing the API, including the jsdoc comments, please remember to update the typings file: [index.d.ts](index.d.ts)
