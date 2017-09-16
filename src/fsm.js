class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config){ throw(new Error('there is no config passed')); }

        this.config = config;
        this.initialState = config.initial;
        this.activeState = this.initialState;
        this.statesObj = config.states;
        this.statesArr = Object.keys(config.states);
        this.stateHistArr = [this.initialState];
        this.statePosition = this.stateHistArr.indexOf(this.initialState);
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.activeState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if( !this.statesArr.includes(state) ){
            throw(new Error('there is no such state in config'));
        }

        this.activeState = state;
        if( this.stateHistArr.indexOf(this.activeState) === -1 )this.stateHistArr.push(state);
        this.statePosition = this.stateHistArr.indexOf(this.activeState);
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if( !this.statesObj[this.activeState].transitions[event] ){
            throw(new Error('there is no such event in current state'));
        }

        this.activeState = this.statesObj[this.activeState].transitions[event];
        if( this.stateHistArr.indexOf(this.activeState) === -1 )this.stateHistArr.push(this.activeState);
        this.statePosition = this.stateHistArr.indexOf(this.activeState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.initialState);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        return this.statesArr.filter((item) => {
            if(!event) return [];

            return this.statesObj[item].transitions[event];
        });
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if( this.activeState === this.initialState ) return false;

        this.statePosition--;
        this.activeState = this.stateHistArr[this.statePosition];

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if( !this.stateHistArr[this.statePosition+1] || this.stateHistArr.length === 1 )return false;

        this.statePosition++;
        this.activeState = this.stateHistArr[this.statePosition];

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.activeState = this.initialState;
        this.stateHistArr = [this.initialState];
        this.statePosition = this.stateHistArr.indexOf(this.initialState);
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
