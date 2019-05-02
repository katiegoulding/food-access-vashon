import React from 'react'
import BuckSetListItem from './BuckSetListItem.jsx'
import { Header, Container } from 'semantic-ui-react'

export default class ViewBucks extends React.Component {

    render () {
        let localBuckSet = [{title: "2018-2019 Buck Set", subtitle: "Created on 12/23/17 by Juniper R."}, 
            {title: "2017-2018 Buck Set", subtitle: "Created on 6/6/15 by August C."}, 
            {title: "2016-2017 Buck Set", subtitle: "Created on 8/14/13 by Katie G."}]
        
            return(
            <div class="four wide column">
                <Container>
                <Header as='h2'>Existing Farm Buck Sets</Header>
                <div class="ui cards">
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
                </Container>
            </div>
        )
    }

}