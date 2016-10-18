/* This component will hold the user-made problem. It is shown during all stages after create-problem.
* It only makes one GET request to get the problem stored in the database.
*/
import React from 'react';
import request from 'request';
import Rater from 'react-rater';
import ErrorComponent from './errorComponent';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
/**** PROPS:
    TaskData,
    TaskActivityFields,
    ComponentTitle
    Instructions,
    Rubric

*/

class SuperViewComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      ShowContent: true,
      TaskData:{},
      ShowRubric: false,
      FieldRubrics: [],
      TaskActivityFields:{},
      Error: false
    };
  }

  toggleContent(){
    const bool = this.state.ShowContent ? false : true;

    this.setState({
      ShowContent: bool
    });
  }

  toggleRubric(){
    //shows or hides the task activity rubric
    const bool = this.state.ShowRubric ? false : true;

    this.setState({
      ShowRubric: bool
    });
  }

  toggleFieldRubric(index){
    //shows or hides the indivual fields' rubrics
        if(this.state.FieldRubrics[index] === []){
          let newFieldRubrics = this.state.FieldRubrics;
          newFieldRubrics[index] = true;
          this.setState({
            FieldRubrics: newFieldRubrics
          });
        }
        else{
          let bool = this.state.FieldRubrics[index] ? false: true;
          let newFieldRubrics = this.state.FieldRubrics;
          newFieldRubrics[index] = bool;
          this.setState({
            FieldRubrics: newFieldRubrics
          });
        }
      }

  componentWillMount(){
    let tdata = this.props.TaskData;
    let tAdata = this.props.TaskActivityFields;
    if(!tdata || tdata == "{}" || !tAdata || tAdata == "{}" || Object.keys(tdata).length === 0 && tdata.constructor === Object ){
      // this checks to make sure all the necessary data isn't empty. If it is, it will cause errors, so set the Error state to true
      // to prevent rendering
      this.setState({Error: true});
      return ;
    }
    else {
      if(tdata.constructor !== Object){ //if the TaskData is not an object, it mut be a JSON, so parse it before continuing
        tdata = JSON.parse(this.props.TaskData)
      }
      if(tAdata.constructor !== Object){
        tAdata = JSON.parse(this.props.TaskActivityFields)
      }


      for(let i = 0; i< tAdata.number_of_fields;i++){
        if(tdata[i] == null){       //make sure that the number of fields in the Task matches the number of fields in the Task activity
          this.setState({Error: true});
          return;
        }
      }
      this.setState({
        TaskData: tdata,
        TaskActivityFields: tAdata
      });
    }
  }


  render(){
    let content = null;
    let TA_rubric = null;
    let TA_instructions = null;
    let TA_rubricButtonText = this.state.ShowRubric ? "Hide Task Rubric" : "Show Task Rubric";



    if(this.state.Error){ // if there was an error loading the data, show an Error component
        return(<ErrorComponent />);
    }

    if(this.props.Rubric  != null && this.props.Rubric != ''){ //if no Rubric
      let TA_rubric_content = null;
      if(this.state.ShowRubric){
          TA_rubric_content = (<div className="regular-text" key={"rubric"}> {this.props.Rubric }</div>);

        }

        TA_rubric = ( <div key={"rubric"}>
            <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)}  key={"button"}> {TA_rubricButtonText}</button>
            <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionName="example" transitionAppear={false} transitionEnter={true} transitionLeave={true}>
            {TA_rubric_content}
          </ReactCSSTransitionGroup>

          </div>);
    }

    if(this.props.Instructions != null && this.props.Instructions != '' ){
      TA_instructions = (<div className="regular-text instructions">
            <b>Task Insructions</b>: {this.props.Instructions}

      </div>);
    }



    let fields = this.state.TaskActivityFields.field_titles.map(function(title, idx){ //go over the fields and display the data appropriately
      // this is a bunch of conditionals that check the fields in the TA fields object.
      let justification = null;
      let fieldTitle = '';
      let rubricView = null;
      let instructions = null;

      if(this.state.TaskActivityFields[idx].show_title){ // fieldTitle is shown next to the field, so only show if instructor sets show_title to true
        if(this.state.TaskActivityFields[idx].assessment_type != null){ //if it's  grade task, simply add 'Grade' to make it prettier
          fieldTitle = title +" Grade";
        }
        else{
          fieldTitle = title;
        }
      }

      if(this.state.TaskActivityFields[idx].rubric != ''){ //if Rubric is empty, don't show anything
        let rubric_content = null;
        let buttonTextHelper = this.state.TaskActivityFields[idx].show_title ? field : '';
        let rubricButtonText = this.state.FieldRubrics[idx] ? ("Hide " + buttonTextHelper + " Rubric") : ("Show " + buttonTextHelper + " Rubric");
        if(this.state.FieldRubrics[idx]){
          rubric_content = (<div className="regular-text" key={this.state.TaskActivityFields[idx].title}><b>{fieldTitle} Rubric: </b> {this.state.TaskActivityFields[idx].rubric}</div>);
        }

        rubricView = ( <div key={1200}>
            <button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,idx)}> {rubricButtonText}</button>
            <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={false} transitionEnter={true} transitionLeave={true}>
              {rubric_content}
            </ReactCSSTransitionGroup>

          </div>
        );

      }


      if(this.state.TaskActivityFields[idx].instructions != ''){ //if instructions are empty, don't display anything
        instructions = (
          <div key ={1100}>
            <br />
            <div className="regular-text"><b>{fieldTitle} Instructions:</b> {this.state.TaskActivityFields[idx].instructions}</div>
            <br />
          </div>
        );
      }




      if(this.state.TaskActivityFields[idx].requires_justification){
        if(this.state.TaskData[idx][1] == ''){
          justification = (<div key={idx + 655}></div>);
        }
        else{
          justification = (<div key={idx + 655} className="faded-big">{this.state.TaskData[idx][1]}</div>)
        }
      }

      if(this.state.TaskActivityFields[idx].field_type == "text"){
        let fieldView = (<div key={idx + 1000}>
          <div key={idx + 600}><b>{fieldTitle}</b></div>

            {instructions}
            {rubricView}

          <div key={idx} className="faded-big"> {this.state.TaskData[idx][0]}
          </div>
          <br key={idx+550}/>
          {justification}
        </div>);


        return (<div key={idx+200}>
          {fieldView}
          <br key={idx+500}/>
        </div>
        );

      }
      else if(this.state.TaskActivityFields[idx].field_type== "assessment" || this.state.TaskActivityFields[idx].field_type == "self assessment"){

        if(this.state.TaskActivityFields[idx].assessment_type == "grade"){
          let fieldView = (<div key={idx + 1000}>
            <div key={idx + 600}><b>{fieldTitle}</b></div>
              {instructions}
              {rubricView}

            <div key={idx} className="faded-small"> {this.state.TaskData[idx][0]}
            </div>
            <br key={idx+550}/>
            {justification}
          </div>);


          return (<div key={idx+200}>
              {fieldView}
              <br key={idx+500}/>
            </div>
          );
        }
        else if(this.state.TaskActivityFields[idx].assessment_type == "rating"){
          let val = (this.state.TaskData[idx][0] == null || this.state.TaskData[idx][0] == '') ? 0 : this.state.TaskData[idx][0];
          let fieldView = (<div key={idx + 1000}>
            {instructions}
            {rubricView}


            <div key={idx + 600}><b>{fieldTitle}   </b>
               <Rater total={this.state.TaskActivityFields[idx].rating_max} rating={val} interactive={false} />
            </div>
            <br key={idx+550}/>
            {justification}
          </div>);


          return (<div key={idx+200}>
              {fieldView}
              <br key={idx+500}/>
            </div>
          );
        }
        else if(this.state.TaskActivityFields[idx].assessment_type == "pass"){
          let fieldView = (<div key={idx + 1000}>
            <div key={idx + 600}><b>{fieldTitle}</b></div>
              {instructions}
              {rubricView}


            <div key={idx} className="faded-small"> {this.state.TaskData[idx][0]}
            </div>
            <br key={idx+550}/>
            {justification}
          </div>);


          return (<div key={idx+200}>
              {fieldView}
              <br key={idx+500}/>
            </div>
          );
        }
        else if(this.state.TaskActivityFields[idx].assessment_type == "evaluation"){
          let fieldView = (<div key={idx + 1000}>
            <div key={idx + 600}><b>{fieldTitle}</b></div>
              {instructions}
              {rubricView}


            <div key={idx} className="faded-big"> {this.state.TaskData[idx][0]}
            </div>
            <br key={idx+550}/>
            {justification}
          </div>);


          return (<div key={idx+200}>
              {fieldView}
              <br key={idx+500}/>
            </div>
          );
        }
        else{
          return(<div key={idx + 1000}> Hi</div>);
        }
      }
      else if(this.state.TaskActivityFields[idx].field_type == "numeric"){

          let fieldView = (<div key={idx + 1000}>
            <div key={idx + 600}><b>{fieldTitle}</b></div>
              {instructions}
              {rubricView}


            <div key={idx} className="faded-small"> {this.state.TaskData[idx][0]}
            </div>
            <br key={idx+550}/>
            {justification}
          </div>);


          return (<div key={idx+200}>
              {fieldView}
              <br key={idx+500}/>
            </div>
          );
        }
      else{
        return (<div></div>);
      }

    }, this);



      if(this.state.ShowContent){ //if the title is clicked on, this will be false and the content won't be shown
        content = (<div key={this.props.index + 2003} className="section-content">
                      {TA_instructions}
                      {TA_rubric}
                      <div key={this.props.index + 2004} name="problem-text" >{fields}</div>
                      <br key={this.props.index + 2005}/>
                    </div>);
      }
      else{
        content=(<div key={this.props.index + 2003}></div>);
      }

      return (
        <div key={this.props.index + 2001}className="section card-2" >
          <h2 key={this.props.index + 2002}className="title" onClick={this.toggleContent.bind(this)}>{this.props.ComponentTitle}:</h2>
            {content}
        </div>
    );

  }

}
export default SuperViewComponent;