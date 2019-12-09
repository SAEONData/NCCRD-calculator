import React from 'react';
import { Calculator, CheckUserLevel, GenerateTable } from './HelperFunctions.jsx';
import { Dropdown, Button, Label } from './Controls.jsx';
import { Row } from 'mdbreact'
import { connect } from 'react-redux'
import { DateRange } from 'react-date-range';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import {EditableTableComponent, EnergyTableComponent, EmissionsTableComponent} from './EditableTableComponent.jsx';
//import {EnergyTableComponent, EmissionsTableComponent} from './TestClass.jsx';

import "./shared.css"
import "./kendo.css"

const mapStateToProps = (state, props) => {
  let { projectData: { projectDetails } } = state
  let { lookupData: { projectStatus } } = state
  return { projectStatus, projectDetails }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

class EmissionsCalculatorStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          enabled: false,
          calcType: "Energy"
      };
    }

    checkState() {
      if (this.state.calcType == "Energy")
        return <EnergyData/>;
      else if (this.state.calcType == "Emissions")
        return <EmissionsData/>;
    }

    render() {
        return (
          <>
            <div className="vertical-spacer"/>

            <Row>
              <h4>Please report annual project data below :</h4>
              <p> 1. Annual quantity of electricity generated from renewable sources (kWh)</p>
              <p> 2. Annual Emissions Reductions (CO2e)</p>
            </Row>

            <div className="vertical-spacer"/>

            <Row>
                <button onClick={ () => {this.setState({ calcType: "Energy" })} }>
                  If You Have Energy Data
                </button>
            </Row>
    
            <div className="vertical-spacer" />
                
            <Row>
                <button onClick={ () => {this.setState({ calcType: "Emissions" })}}>
                  If You Have Emissions Data
                </button>
            </Row>

            <div className="vertical-spacer" />
            {
              this.checkState()
            }
          </>
        )
      }
}


class EmissionsData extends React.Component {
    
  constructor(props) {
      super(props)
      this.state = {
        table : false,
        startDate: null,
        endDate: null,
        source: ['Combustion', 'Process', 'Fugitive emissions', 'Agriculture, Forestry and Fisheries, Waste'],
        selectedSource: '',
        emssionsSource: ['Carbon dioxide', 'Methane', 'Nitrous oxide', 'Sulfur hexafluoride', 'HFC-125a', 'HFC-32', 'HFC-125', 'HFC-143a', 'HFC-23', 'PFC-14', 'PFC-218', 'PFC-31-10', 'PFC-41-12', 'PFC-51-14', 'PFC-318', 'PFC-116'],
        selectedEmssions: []
      }
      this.renderHandler = this.renderHandler.bind(this);
      this.Simple = this.Simple.bind(this);
      this.Advanced = this.Advanced.bind(this);
      // this.componentWillUpdate = this.componentDidUpdate.bind(this);
  }    

  // componentDidUpdate() {
  //   this.forceUpdate()
  // }
  
  handleChange = range => {
    this.setState({
      startDate: range.startDate.year().toString(),
      endDate: range.endDate.year().toString()
    });
  };
   
  renderHandler() {
    return(CheckUserLevel() ? <this.Advanced /> : <this.Simple />)
  }

  setTypes = (event) => {
    this.setState({
      selectedEmssions: [ ...event.target.value ]
    });
  }
  
  setSource = (event) => {
    this.setState({
      selectedSource : [ ...event.target.value ]
    });
  }

  generateTableData() { 
    
    alert(` Emissions Data | Start Date : ${this.state.startDate} | End Date : ${this.state.endDate}`)

    const records = [];
    this.state.selectedEmssions.forEach(element => {
      for (let i = 0; i < ((this.state.endDate - this.state.startDate) + 1); i++) {
        records.push({
          year: (parseInt(this.state.startDate) + i),
          chemical: element,
          TPY: '',
          notes: ''
        });
      }  
    });

    // for (let i = 0; i < ((this.state.endDate - this.state.startDate) + 1); i++) {
    //   records.push({
    //     year: (parseInt(this.state.startDate) + i),
    //     chemical: this.state.selectedEmssions.toString(),//.replace(',', ', '),
    //     TPY: '',
    //     notes: ''
    //   });
    // }
    
    this.setState({ data: records})
    // var asdasd = JSON.parse(
    //   `[
    //     {
    //       "year":"NewData",
    //       "chemical":"CO2",
    //       "TPY":8,
    //       "notes":"relationship"
    //     }
    //   ]`);
    // this.setState({data: asdasd})
    
    alert(`Records : ${JSON.stringify(records)}`)

    if (this.state.startDate != null && this.state.endDate != null) {
      this.setState({ table : true });
    }
  }

  //#region Form section
 
  Simple (){
    return ( !this.state.table ? 
              <div>
                <div className="vertical-spacer" />

                {/* <Row>
                  <Dropdown id="ddlEmissionsSource" type="textbox" list={this.state.source} headerTitle="Source : " onChange={event => this.setState({[event.target.id]: event.target.value})} />
                </Row> */}
                
                <div className="vertical-spacer" />
                <Row>
                  <div className="example-wrapper">
                      <div>
                          <div>Source : </div>
                          <MultiSelect data={this.state.source}  onChange={event => this.setState({selectedSource: [ ...event.target.value ]})} value={this.state.selectedSource} />
                      </div>
                  </div>
                </Row>

                <div className="vertical-spacer" />
                <Row>
                  <div className="example-wrapper">
                      <div>
                          <div>Applicable Emissions : </div>
                          <MultiSelect data={this.state.emssionsSource}  onChange={event => this.setState({selectedEmssions: [ ...event.target.value ]})} value={this.state.selectedEmssions} />
                      </div>
                  </div>
                </Row>

                <div className="vertical-spacer" />
                <Row>
                  <DateRange id="dpProjectLifetime" onInit={this.handleChange} onChange={this.handleChange} />
                </Row>

                {/* <div className="vertical-spacer" />
                <Row>
                  <EmissionsTableComponent />
                </Row> */}

                <div className="vertical-spacer" />
                <Row>
                  <Button btnText={"Generate Table"} onClick={ () => { this.generateTableData() } } />
                </Row>
              </div>
              :
              <EmissionsTableComponent data={this.state.data} />
            ); 
  }

  Advanced (){
      
      let testVar = Calculator(this.props)

      return (<div>
          Emissions Advance Form
          { testVar }
      </div>)
  }

  //#endregion

  render() { return (this.renderHandler(CheckUserLevel())); }
}

class EnergyData extends React.Component {
  
  constructor(props) {
      super(props)
      this.state = {
        table : false,
        startDate: null,
        endDate: null,
        source: ['Bio/Waste Gas', 'Geothermal', 'Hydro', 'Solar', 'Tidal', 'Wind'],
        selectedTypes: []
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      
      this.Simple = this.Simple.bind(this);
      this.Advanced = this.Advanced.bind(this);
  }
  
  handleChange = range => {
    this.setState({
      startDate: range.startDate.year().toString(),
      endDate: range.endDate.year().toString()
    });
  };

  setTypes = (event) => {
    this.setState({
      selectedTypes: [ ...event.target.value ]
    });
  }

  renderHandler() {
      return(CheckUserLevel() ? <this.Advanced /> : <this.Simple />)
  }

  handleSubmit() { 
      alert(this.state.selectedTypes.toString())
  }
  
  calculate() { 

    alert('EngergyData | Start Date : ' + this.state.startDate + ' | ' + 'End Date : ' + this.state.endDate)

    if (this.state.startDate != null && this.state.endDate != null) {
      this.setState({ table : true });
    }
    
    const records = [];
    for (let i = 0; i < (this.state.endDate - this.state.startDate); i++) {
      //alert(`Start Date : ${this.state.startDate} | End Date : ${this.state.endDate} | Index : ${i}`)
      records.push({
        year: (parseInt(this.state.startDate) + i),
        types: this.state.selectedTypes.toString().replace(',', ', '),
        notes: '',
        individual: {
          totalkwh: 15321,
          purchasedtotalkwh: 1598732,
        },
        projectTotal: {
          totalkwh: 984321,
          purchasedtotalkwh: 23
        }
      });
    }

    this.setState({ data: records})
  }

  //#region Form section

  Simple (){
    return ( !this.state.table ? 
              <div>
                <div className="vertical-spacer" />

                <Row>
                  {/* <Dropdown id="ddlRenewableType" type="textbox" list={this.state.source} headerTitle="Renewable Type : " onChange={event => this.setState({[event.target.id]: event.target.value})} /> */}
                  {/* <MultiSelect data={this.state.source} onChange={this.setTypes} value={this.state.source} /> */}
                  
                  <div className="example-wrapper">
                      <div>
                          <div>Renewable Types :</div>
                          <MultiSelect
                              data={this.state.source}
                              onChange={this.setTypes}
                              value={this.state.selectedTypes}
                          />
                      </div>
                  </div>
                </Row>

                <div className="vertical-spacer" />
                <Row>
                  {/* <DatePicker id="dpProjectLifetime" selected={this.state.startDate} onChange={this.handleChange} /> */}
                  <DateRange id="dpProjectLifetime" onInit={this.handleChange} onChange={this.handleChange} />
                </Row>

                <div className="vertical-spacer" />
                <Row>
                  <Button btnText={"Generate Table"} onClick={ () => { this.calculate() } } />
                </Row>
              </div>
              :
              <EnergyTableComponent startDate={ this.state.startDate } endDate={ this.state.endDate } energyType={ this.state.selectedTypes } />
            );
  }

  Advanced (){
      const styleVar = {  position: 'absolute',
                          width: '300px',
                          height: '200px',
                          zindex: '15',
                          top: '50%',
                          left: '50%',
                          margin: '-100px 0 0 -150px',
                          background: 'none'
                       }

      return (<div style={ styleVar }>
                {/* <Date type="yearRange"></Date> Year Range */}
                <Dropdown type="textbox" list={this.state.source} headerTitle="Year"></Dropdown> {/* <--- Date range, 20000 - 2060 Needs to expand into a dropdown with 10 textbox's for the year range, when the first is filled the remainders should update with the same result  */}
                <Button btnText="Tonnes" disabled/>
                <Label title="Select source" headerTitle={"Gas Type"}  list={this.state.source} toggleItem={this.toggleSelected} />
                <Button btnText={"Submit"} onClick={ this.handleSubmit }/>
              </div>)
  }

  //#endregion

  render() { return (this.renderHandler(CheckUserLevel())); }
}

export default EmissionsCalculatorStep;