const fetchMachine = Machine({
  id: 'counter',
  initial: 'Available',
  states: {
    Available: {
      on: {
        INCREMENT: 'Available',
        DECREMENT: 'Available',
        INCREMENT_IF_ODD: 'Available',
        BUMP: 'Available',
        RESET: 'Busy',
      }
    },
    Busy: {
      on: {
        FINISH_RESET: 'Available'
      }
    }
  }
});
