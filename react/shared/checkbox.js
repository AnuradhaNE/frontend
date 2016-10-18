import React from 'react';
//have to go into react-checkbox-list node_module and manually alter checkboxes to match style
class Checkbox extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      Clicked: this.props.isClicked
    }
  }



  render(){
    let checkedValue = false;
    let styles = this.props.style ? this.props.style : {};
    if(this.props.isClicked != null){
      checkedValue = this.props.isClicked;
    }
    else{
      checkedValue = this.state.Clicked;
    }

    return(<div className={checkedValue ? "checkbox checked" : "checkbox"}  style={styles} onClick={(e) => {
      e.preventDefault();
      this.setState({
        Clicked: this.state.Clicked ? false: true
      });
      if(this.props.click){
        this.props.click();
      }
    }}>

    </div>)
  }
}

export default Checkbox;