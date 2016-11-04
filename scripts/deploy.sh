#!/bin/bash

set -e

docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS

# Sourced from https://segment.com/blog/ci-at-segment/

deploy_tag() {
  # Find our individual versions from the tags
  if [ -n "$(echo $CIRCLE_TAG | grep -E '.*\..*\..*')" ]
  then
    major=$(echo $CIRCLE_TAG | cut -d. -f1)
    minor=$(echo $CIRCLE_TAG | cut -d. -f2)
    patch=$(echo $CIRCLE_TAG | cut -d. -f3)

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
  done

  # Push each of the tags to docker hub, including latest
  for version in $tag_list latest
  do
      echo "==> pushing $version"
      docker push coralproject/talk:$version
  done
}

deploy_latest() {
  echo "==> pushing latest"
  docker push coralproject/talk:latest
}

# build the repo
docker build -t coralproject/talk .

# deploy based on the env
if [ -n "$CIRCLE_TAG" ]
then
  deploy_tag
else
  deploy_latest
fi
