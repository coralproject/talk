#!/bin/bash

set -e

# Inspired by https://segment.com/blog/ci-at-segment/

deploy_tag() {
  # Find our individual versions from the tags. If the tag contains prerelease
  # tag, it will fall back to the next step which will just tag it as is. For
  # Example:
  #
  # v5.0.0-beta.1 will be tagged with 5.0.0-beta.1
  # v5.0.0 will be tagged with 5, 5.0, 5.0.0
  #
  if echo "${CIRCLE_TAG}" | grep -qE '^v[0-9]+\.[0-9]+\.[0-9]+$'
  then
    major=$(echo "${CIRCLE_TAG/#v}" | cut -d. -f1)
    minor=$(echo "${CIRCLE_TAG/#v}" | cut -d. -f2)
    patch=$(echo "${CIRCLE_TAG/#v}" | cut -d. -f3)

    major_version_tag="${major}"
    minor_version_tag="${major}.${minor}"
    patch_version_tag="${major}.${minor}.${patch}"

    tag_list="${major_version_tag} ${minor_version_tag} ${patch_version_tag}"
  else
    tag_list="${CIRCLE_TAG/#v}"
  fi

  # Tag the new image with major, minor and patch version tags.
  for version in ${tag_list}
  do
      echo "==> tagging ${version}"
      docker tag coralproject/talk:latest "coralproject/talk:${version}"
  done

  # Push each of the tags to dockerhub, including latest
  for version in ${tag_list}
  do
      echo "==> pushing ${version}"
      docker push "coralproject/talk:${version}"
  done
}

deploy_latest() {
  echo "==> pushing latest"
  docker push coralproject/talk:latest
}

deploy_branch() {
  echo "==> tagging branch ${CIRCLE_BRANCH}"
  docker tag "coralproject/talk:latest" "coralproject/talk:${CIRCLE_BRANCH}"

  echo "==> pushing branch ${CIRCLE_BRANCH}"
  docker push "coralproject/talk:${CIRCLE_BRANCH}"
}

deploy_commit() {
  SHORT_GIT_HASH=$(echo $CIRCLE_SHA1 | cut -c -6)
  SHORT_GIT_HASH="${CIRCLE_BRANCH}-${SHORT_GIT_HASH}"
  echo "==> tagging commit ${SHORT_GIT_HASH}"
  docker tag "coralproject/talk:latest" "${GCR_IMAGE_NAME}:${SHORT_GIT_HASH}"

  echo "==> pushing commit ${SHORT_GIT_HASH}"
  docker push "${GCR_IMAGE_NAME}:${SHORT_GIT_HASH}"
}

deploy_develop_commit() {
  LATEST_TAG="develop-latest"
  echo "==> tagging ${GCR_IMAGE_NAME}:${LATEST_TAG}"
  docker tag "coralproject/talk:latest" "${GCR_IMAGE_NAME}:${LATEST_TAG}"

  echo "==> pushing ${GCR_IMAGE_NAME}:${LATEST_TAG}"
  docker push "${GCR_IMAGE_NAME}:${LATEST_TAG}"
}

ARGS=""

if [[ -n "${CIRCLE_SHA1}" ]]
then
  ARGS="--build-arg REVISION_HASH=${CIRCLE_SHA1}"
fi

# build the repo, including the onbuild tagged versions.
docker build -t coralproject/talk:latest ${ARGS} -f Dockerfile .

if [ "$1" = "deploy" ]
then

  if [[ -n "${DOCKER_USER}" && -n "${DOCKER_PASS}" ]]
  then

    # Log the Docker Daemon in
    docker login -u "${DOCKER_USER}" -p "${DOCKER_PASS}"
  fi

  # deploy based on the env
  if [ -n "${CIRCLE_TAG}" ]
  then
    deploy_tag
  else
    if [ "${CIRCLE_BRANCH}" = "main" ]
    then
      deploy_latest
    else
      deploy_branch
    fi
  fi
fi

if [ "$1" = "deploy-commit" ]
then
  if [[ -n "${CIRCLE_SHA1}" && -n "${GCR_IMAGE_NAME}" ]]
  then
    deploy_commit
  fi
fi

if [ "$1" = "deploy-develop-commit" ]
then
  if [[ -n "${CIRCLE_SHA1}" && -n "${GCR_IMAGE_NAME}" ]]
  then
    deploy_develop_commit
  fi
fi
