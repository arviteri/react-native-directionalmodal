# react-native-directionalmodal
Modal for react native which slides out in any direction.

In failed efforts to find a modal component for react native which would slide down from the top, or slide out from the left or right... I decided to make my own.

## Usage

Clone the repository and copy the component into your react native app's component folder.

Import the component.

Example of usage:

     <DirectionalModal visible={this.state.visible} direction="left">
        // View content 
     </DirectionalModal>
     
#### Directional Properties 

The `direction` property takes values `top`, `bottom`, `left`, or `right`.

## DISCLAIMER (In The Works)
This project is currently a work in progress. Many features are currently not working such as `transparency` and `orientation` properties. 
I look forward to publishing this on NPM after many issues are fixed. 

