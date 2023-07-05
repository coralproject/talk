// By @loganfsmyth on https://stackoverflow.com/questions/37234191/how-do-you-implement-a-racetosuccess-helper-given-a-list-of-promises
function getFirstResolvingPromise<T>(promises: Array<Promise<T>>) {
  return Promise.all(
    promises.map((p) => {
      // If a request fails, count that as a resolution so it will keep
      // waiting for other possible successes. If a request succeeds,
      // treat it as a rejection so Promise.all immediately bails out.
      return p.then(
        (val) => Promise.reject(val),
        (err) => Promise.resolve(err)
      );
    })
  ).then(
    // If '.all' resolved, we've just got an array of errors.
    (errors) => Promise.reject(errors),
    // If '.all' rejected, we've got the result we wanted.
    (val) => Promise.resolve(val)
  );
}

export default getFirstResolvingPromise;
