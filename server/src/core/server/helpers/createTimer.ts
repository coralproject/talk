/**
 * createTimer will create a new timer that can be called again to get the
 * milliseconds since the timer was created.
 *
 */
const createTimer = () => {
  const start = Date.now();
  return () => {
    const finish = Date.now();
    return finish - start;
  };
};

export default createTimer;
