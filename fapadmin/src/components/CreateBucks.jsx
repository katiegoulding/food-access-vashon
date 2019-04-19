import React from 'react'
import BuckSetListItem from './BuckSetListItem.jsx'

export default class CreateBucks extends React.Component {

    createBuckSet() {
        return "hello"
    }




    render () {
        let localBuckSet = [{title: "2018-2019 Buck Set", subtitle: "Created on 12/23/17 by Juniper R."}, 
            {title: "2017-2018 Buck Set", subtitle: "Created on 6/6/15 by August C."}, 
            {title: "2016-2017 Buck Set", subtitle: "Created on 8/14/13 by Katie G."}]
        
            return(
            <div>
                <button onClick={this.createBuckSet} type="submit">
                    Create New Buck Set
                </button>

                <h2>Existing VIGA Farm Buck Sets</h2>

                <div>
                    {
                        //for each item in the data provided, map will create a BuckSetListItem
                        //that has the respective title and subtitle
                        localBuckSet.map(
                            element => {
                                return (
                                    <BuckSetListItem key={element.title + element.subtitle} data={element}/>
                                )
                            }
                        )
                    }
                </div>
            </div>
        )
    }

}