export const getStates = (state) => state?.states?.states?.sort((a, b) => a.positionIndex - b.positionIndex) || [];
