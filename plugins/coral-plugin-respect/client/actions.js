const buttonClicked = () => ({type: 'BUTTON_CLICKED'});

export const clickButton = () => dispatch => {
  console.log('here');
  dispatch(buttonClicked());
};

