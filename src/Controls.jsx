import React from 'react';
import './Controls.css'

export class Dropdown extends React.Component {

    constructor(props) {
        super(props)
        this.state = { listOpen: false }
    }
 
    //#region Functions

    handleClickOutside() {
        this.setState({ listOpen: false })
    }

    toggleList() {
        this.setState(prevState => ({ listOpen: !prevState.listOpen }))
    }

    toggleSelected(id, key){
        let temp = this.state[key]
        temp[id].selected = !temp[id].selected
        this.setState({
          [key]: temp
        })
      }

      //#endregion  

    render() {
        const{list, headerTitle} = this.props
        const{listOpen} = this.state 

        return (
            <label className="dropdown" onClick={ () => this.toggleList() }>
                <div className="dd-button"> { headerTitle } </div>
                {/* { listOpen ? <div name="angle-up" size="2x"/> : <div name="angle-down" size="2x"/> } */}
                {   
                    listOpen && 
                    <ul className="dd-menu">
                    { 
                        list.map((item) => ( <li key={item.id} >{item.title}</li> ))
                    }
                    </ul>
                }
            </label>
            );
    }
}

export class Button extends React.Component {
    
    constructor(props) {
        super(props)
    }

    render() {

        const{btnText, onClick} = this.props

        return(
            <button type="submit" className="btn btn-success" onClick={onClick}>
                <i className="fa fa-arrow-circle-right fa-lg"></i> {btnText}
            </button>
        )
    }
}

export class Label extends React.Component {
    render(){
        return(<div></div>);  
    }
}

export class Date extends React.Component {
    render(){
         return(<div></div>);   
        }
}