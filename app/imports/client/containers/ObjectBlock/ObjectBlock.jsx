import React, { Component, PropTypes } from 'react';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import R from 'ramda';
import { RedirectTo } from '/client/main'

// Import models
import { Objects } from '/imports/api/objects.js'; 

// Import components
import Block from '../../components/Block/Block';
// import CheckInOutProperties from '../../components/CheckInOutProperties/CheckInOutProperties';

class ObjectBlock extends Component {

  constructor(props) {
    super(props);
    
    this.state = props.item
  }
    
  //+handleChange :: Event -> StateChange
  handleChange(e) {
    this.state.title = e.target.value;
    
    Meteor.call('objects.update', this.props.item._id, this.state);
  }

  // newAvatar :: Event -> NO PURE FUNCTION
  newAvatar(e) {
    if( ! this.props.isEditable) return;

    var imageUrl =
      prompt('Wat is de URL van de nieuwe avatar? Wil je geen nieuwe avatar toevoegen, klik dan op Annuleren/Cancel')

    if(imageUrl) {
      this.state.imageUrl = imageUrl;
      Meteor.call('objects.update', this.props.item._id, this.state);
    }
  }

  // RedirectTo('/bike/details/' + this.props.item._id) }
  viewItem() { RedirectTo((this.props.isEditable ? '/admin/bike/details/' : '/bike/details/') + this.props.item._id) }

  deleteItem() {
    if( ! confirm('Weet je zeker dat je de fiets "'+this.props.item.title+'" wilt verwijderen?') || ! confirm('Sure? If not sure: don\'t') )
      return;

    Meteor.call('objects.remove', this.props.item._id);
  }

  render() {
    return (
      <Block
        item={this.props.item}
        showState={this.props.showState}
        showPrice={this.props.showPrice}
        showRentalDetails={this.props.showRentalDetails}
        showLockDetails={this.props.showLockDetails}
        isEditable={this.props.isEditable}
        newAvatar={this.newAvatar.bind(this)}
        handleChange={this.handleChange.bind(this)}
        deleteItem={this.deleteItem.bind(this)}
        viewItem={this.viewItem.bind(this)}
        onClick={ ! this.props.isEditable ? this.viewItem.bind(this) : null} />
    );
  }

}

var s = {
  base: {
    background: '#fff',
    display: 'flex',
    fontWeight: 'normal',
    lineHeight: 'normal',
    padding: '10px',
    maxWidth: '100%',
    width: '400px',
    margin: '20px auto',
    borderBottom: 'solid 5px #bc8311',
    textAlign: 'left',
  },
  avatar: {
    flex: 1,
    maxHeight: '148px'
  },
  title: {
    flex: 2,
    fontSize: '1.2em',
    margin: '0 10px',
    fontWeight: 500
  },
  deleteButton: {
    cursor: 'cross',
    ':hover': {
      color: '#f00',
    }
  },
  infoButton: {
    marginLeft: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
}

ObjectBlock.propTypes = {
  item: PropTypes.object.isRequired,
  isEditable: PropTypes.any,
  showPrice: PropTypes.any,
  showState: PropTypes.any,
  showRentalDetails: PropTypes.any,
  showLockDetails: PropTypes.any,
  onClick: PropTypes.any,
};

ObjectBlock.defaultProps = {
  item: {},
  showPrice: false,
  showState: false,
  showRentalDetails: false,
  showLockDetails: false,
  isEditable: false
}

export default Radium(ObjectBlock);
