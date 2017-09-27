function getEmbedStream(frame) {
  return frame.childFrames().find((f) => f.name() === 'coralStreamEmbed_iframe');
}

module.exports = {
  getEmbedStream
};
