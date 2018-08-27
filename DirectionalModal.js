import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated } from 'react-native';

/**
 * PROPS
 * 
 * direction: {top, bottom, left, right} REQUIRED
 * visible: {true, false} REQUIRED
 * transparent: {true, false} SET DEFAULT
 * animated: {true, false}  SET DEFAULT
 * 		animationTime: X ms SET DEFAULT
 * orientation: {'PORTRAIT', 'LANDSCAPE'} SET DEFAULT
 */

 /**
  * STATE MANAGEMENT 
  *
  * visible
  * animation
  * orientation
  */

const ANIMATED_DEFAULT = true;
const ANIMATION_VALUE_HORIZONTAL = Dimensions.get('window').width*2;
const ANIMATION_VALUE_VERTICAL = Dimensions.get('window').height*2;
const ANIMATION_TIME_DEFAULT = 500;
const ORIENTATION_DEFAULT = 'PORTRAIT'; // Values can be 'PORTRATIN' or 'LANDSCAPE'
const TRANSPARENT_DEFAULT = false;
const defaultProps = {
	transparent: TRANSPARENT_DEFAULT,
	animated: ANIMATED_DEFAULT,
	animationTime: ANIMATION_TIME_DEFAULT,
	orientation: ORIENTATION_DEFAULT
};

export default class DirectionalModal extends Component {

	/**
	 * Property to determine whether the direction is 'VERTICAL' or 'HORIZONTAL'
	 */
	static linearDirection = null;


	constructor(props) {
		super(props);
		this.state = this.initializeState(props);
	}

	/**
	 * Initializes the state based on the properties given.
	 */
	initializeState(props) {

		/**
		 * DirectionalModal must have 'direction' property.
		 * This property defines which direction the modal will slide to if animated. 
		 */
		if (props.direction == null) {
		 	throw new Error("DirectionalModal: 'direction' property is required.");
		}

		/**
		 * DirectionalModal must have 'visible' property 
		 */
		if (props.visible == null) {
		 	throw new Error("DirectionalModal: 'visible' property is required.");
		}

		var initialState = {
			direction: props.direction,
			visible: props.visible,
			...defaultProps,
		}

		/**
		 * Set transparent value if property is given.
		 */
		if (props.transparent != null && props.transparent != defaultProps.transparent) {
			initialState.transparent = props.transparent;
		}

		/**
		 * Set aniamted value if property is given.
		 */
		if (props.animated != null && props.animated != defaultProps.animated) {
			initialState.animated = props.animated;
		}

		/**
		 * Set animationTime value if property is given.
		 */
		if (props.animationTime != null && props.animationTime != defaultProps.animationTime) {
			initialState.animationTime = props.animationTime;
		}

		/**
		 * Set orientation value if property is given.
		 */
		if (props.orientation != null && props.orientation != defaultProps.orientation) {
			initialState.orientation = props.orientation;
		}

		/**
		 * Set the animated value for the slide animation to ANIMATION_VALUE_VERTICAL 
		 * if the direction is 'top' or 'bottom'
		 *
		 * Set linearDirection property.
		 */
		if (initialState.direction == 'top' || initialState.direction == 'bottom') {
			initialState.slideAnimation = new Animated.Value(ANIMATION_VALUE_VERTICAL);
			linearDirection = 'VERTICAL';
		}

		/**
		 * Set the animated value for the slide animation to ANIMATION_VALUE_HORIZONTAL 
		 * if the direction is 'left' or 'right'. 
		 *
		 * Set linearDirection property.
		 */
		if (initialState.direction == 'left' || initialState.direction == 'right') {
			initialState.slideAnimation = new Animated.Value(ANIMATION_VALUE_HORIZONTAL);
			linearDirection = 'HORIZONTAL'
		}

		return initialState;

	}

	/**
	 * Set configuration values based on the next properties.
	 */
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.direction !== nextProps.direction) {
			linearDirection = this.getLinearDirection(nextProps.direction);
		}

		return true;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.visible === false) {
			this.close();
		} else if (this.props.visible === true) {
			this.open();
		}
	}

	/**
	 * Determines the linear direction based on the direction property enum value 
	 * 
	 * @THROWS Error - Throws error if the direction property is not a valid enum value or orientation value is incorrect. 
	 */
	getLinearDirection(direction) {
		if (this.state.orientation != 'PORTRAIT' && this.state.orientation != 'LANDSCAPE') {
			throw new Error("DirectionalModal: Orientation value is incorrect. The value must be 'PORTRAIT' or 'LANDSCAPE'.");
		}

		if (direction == 'top' || direction == 'bottom') {
			if (this.state.orientation == 'PORTRAIT') {
				return 'VERTICAL';
			} else if (this.state.orientation == 'LANDSCAPE') {
				return 'HORIZONTAL';
			}
		} else if (direction == 'left' || direction == 'right') {
			if (this.state.orientation == 'PORTRAIT') {
				return 'HORIZONTAL';
			} else if (this.state.orientation == 'LANDSCAPE') {
				return 'VERTICAL';
			}
		} else {
			throw new Error("DirectionalModal: Incorrect value given for 'direction' property.");
		}
	}

	/**
	 * Determines the animation value based on the given 'linearDirection' value
	 * 
	 * @THROWS Error - Throws error if the linearDirection property is not a valid enum value or orientation value is incorrect
	 */
	getAnimationValue(linearDirection) {
		if (this.state.orientation != 'PORTRAIT' && this.state.orientation != 'LANDSCAPE') {
			throw new Error("DirectionalModal: Orientation value is incorrect. The value must be 'PORTRAIT' or 'LANDSCAPE'.");
		}

		if (linearDirection == 'VERTICAL') {
			if (this.state.orientation == 'PORTRAIT') {
				return ANIMATION_VALUE_VERTICAL;
			} else if (this.state.orientation == 'LANDSCAPE') {
				return ANIMATION_VALUE_HORIZONTAL;
			}
		} else if (linearDirection == 'HORIZONTAL') {
			if (this.state.orientation == 'PORTRAIT') {
				return ANIMATION_VALUE_HORIZONTAL;
			} else if (this.state.orientation == 'LANDSCAPE') {
				return ANIMATION_VALUE_VERTICAL;
			}
		} else {
			throw new Error("DirectionalModal: Incorrect value given for 'linearDirection' property.");
		}
	}


	open() {
		Animated.timing(
			this.state.slideAnimation, 
			{
		    	toValue: 0,                   
		        duration: this.state.animationTime,           
		    }
    	).start();

		if (this.props.visible === true && this.state.visible !== true) {
			this.setState({ visible: true });
		}

	}

	close() {
		Animated.timing(
			this.state.slideAnimation, 
			{
		    	toValue: this.getAnimationValue(linearDirection),            
		        duration: this.state.animationTime,            
		    }
    	).start();

		if (this.props.visible === false && this.state.visible !== false) {
	    	setTimeout(() => {
				this.setState({ visible: false });
			}, this.state.animationTime);
    	}
	}

	render() {

		let { slideAnimation } = this.state;

		if (this.state.visible === false ) {
			return null;
		}

		return(
			<View style={styles.outer_container}>
				<Animated.View style={{
					justifyContent: 'center',
			        alignItems: 'center',
			        height: Dimensions.get('window').height,
			        width: Dimensions.get('window').width,
			        marginLeft: this.props.direction == 'left' ? slideAnimation : 0,
			        marginRight: this.props.direction == 'right' ? slideAnimation : 0,
			        marginTop: this.props.direction == 'top' ? slideAnimation : 0,
			        marginBottom: this.props.direction == 'bottom' ? slideAnimation : 0,
			        backgroundColor: 'white',
			        shadowColor: 'black',
			        shadowOpacity: 0.2,
			        shadowOffset: {width: 12 ,height: 0},
			        shadowRadius: 12,
				}}>
					{this.props.children}
				</Animated.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	outer_container: {
		height: 'auto',
		position: 'absolute',
		zIndex: 1000
	}
});