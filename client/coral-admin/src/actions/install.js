import * as actions from '../constants/install';

export const nextStep = () => ({type: actions.NEXT_STEP});
export const previousStep = () => ({type: actions.PREVIOUS_STEP});
