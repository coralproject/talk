FROM coralproject/talk:latest

# Setup the build arguments
ONBUILD ARG TALK_ADDTL_COMMENTS_ON_LOAD_MORE=10
ONBUILD ARG TALK_ASSET_COMMENTS_LOAD_DEPTH=10
ONBUILD ARG TALK_REPLY_COMMENTS_LOAD_DEPTH=3
ONBUILD ARG TALK_ADDTL_REPLIES_ON_LOAD_MORE=999999
ONBUILD ARG TALK_THREADING_LEVEL=3
ONBUILD ARG TALK_DEFAULT_STREAM_TAB=all
ONBUILD ARG TALK_DISABLE_EMBED_POLYFILL=FALSE
ONBUILD ARG TALK_DEFAULT_LANG=en
ONBUILD ARG TALK_WHITELISTED_LANGUAGES
ONBUILD ARG TALK_PLUGINS_JSON
ONBUILD ARG TALK_WEBPACK_SOURCE_MAP
ONBUILD ARG TALK_DEFAULT_LAZY_RENDER

# Bundle app source
ONBUILD COPY . /usr/src/app

# At this stage, we need to install the development dependencies again because
# we need to have webpack available. We then build the new dependencies and
# clear out the development dependencies again. After this we of course need to
# clear out the yarn cache, this saves quite a lot of size.
ONBUILD RUN cli plugins reconcile && \
            yarn && \
            yarn build && \
            yarn cache clean
