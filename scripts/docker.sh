#!/bin/bash

set -e

# Inspired by https://segment.com/blog/ci-at-segment/

deploy_tag() {
  # Find our individual versions from the tags
  if [ -n "$(echo $CIRCLE_TAG | grep -E 'v.*\..*\..*')" ]
  then
    major=$(echo ${CIRCLE_TAG//v} | cut -d. -f1)
    minor=$(echo ${CIRCLE_TAG//v} | cut -d. -f2)
    patch=$(echo ${CIRCLE_TAG//v} | cut -d. -f3)

    major_version_tag=$major
    minor_version_tag=$major.$minor
    patch_version_tag=$major.$minor.$patch

    tag_list="$major_version_tag $minor_version_tag $patch_version_tag"
  else
    tag_list=$CIRCLE_TAG
  fi

  # Tag the new image with major, minor and patch version tags.
  for version in $tag_list
  do
      echo "==> tagging $version"
      docker tag coralproject/talk:latest coralproject/talk:$version
      docker tag coralproject/talk:latest-onbuild coralproject/talk:$version-onbuild
  done

  # Push each of the tags to dockerhub, including latest
  for version in $tag_list latest
  do
      echo "==> pushing $version"
      docker push coralproject/talk:$version
      docker push coralproject/talk:$version-onbuild
  done
}

deploy_latest() {
  echo "==> pushing latest"
  docker push coralproject/talk:latest
  docker push coralproject/talk:latest-onbuild
}

deploy_branch() {
  echo "==> tagging branch $CIRCLE_BRANCH"
  docker tag coralproject/talk:latest coralproject/talk:$CIRCLE_BRANCH
  docker tag coralproject/talk:latest-onbuild coralproject/talk:$CIRCLE_BRANCH-onbuild

  echo "==> pushing branch $CIRCLE_BRANCH"
  docker push coralproject/talk:$CIRCLE_BRANCH
  docker push coralproject/talk:$CIRCLE_BRANCH-onbuild
}

# build the repo, including the onbuild tagged versions.
docker build -t coralproject/talk:latest -f Dockerfile .
docker build -t coralproject/talk:latest-onbuild -f Dockerfile.onbuild .

if [ "$1" = "deploy" ]
then

  if [[ -n "$DOCKER_EMAIL" && -n "$DOCKER_USER" && -n "$DOCKER_PASS" ]]
  then

    # Log the Docker Daemon in
    docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS
  fi

  # deploy based on the env
  if [ -n "$CIRCLE_TAG" ]
  then
    deploy_tag
  else
    if [ "$CIRCLE_BRANCH" = "master" ]
    then
      deploy_latest
    else
      deploy_branch
    fi
  fi
fi