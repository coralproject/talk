const comments: string[] = [];
let currentIndex = -1;

const KeyedComments = {
  comments,
  setCurrentIndex: (value: number) => (currentIndex = value),
  currentIndex: () => currentIndex,
  register: (commentID: string) => {
    comments.push(commentID);
  },
};

Object.freeze(KeyedComments);
export default KeyedComments;
