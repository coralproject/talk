export default function fetcher(query) {
  return fetch(`${window.location.origin}/api/v1/graph/ql`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  }).then(res => res.json());
}
