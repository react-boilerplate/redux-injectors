#!/bin/sh

# Check to make sure we are on the master branch
# See: https://stackoverflow.com/a/34658774/3006989
current_branch=$(git branch | grep '*');

if [ "$current_branch" != "* (HEAD detached at origin/master)" -a "$current_branch" != "* master" ]; then
    echo "Not on master - cannot proceed, please change to master by using:\n\n     git checkout master\n"
    exit 1
fi
