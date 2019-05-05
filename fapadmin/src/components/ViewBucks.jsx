import React from 'react'
import BuckSetListItem from './BuckSetListItem.jsx'
import { Header, Container, Grid } from 'semantic-ui-react'
import firebase from 'firebase/app'

export default class ViewBucks extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            firebaseBuckSet: []
        }
    }

    componentDidMount() {
        let firebaseBuckSet = []

        let buckSetsRef = firebase.database().ref('buckSets')
        buckSetsRef.on('child_added', (snapshot) => {
            const value = snapshot.val()
            // sort by newest
            firebaseBuckSet.unshift({
                title: value.name,
                subtitle: value.createBy
            })
            this.setState({
                firebaseBuckSet
            })
        });

    }

    render () {
            return (
            <Grid.Column width={6}>
                <Container>
                <Header as='h2'>Existing Farm Buck Sets</Header>
                <div class="ui cards">
                    {
                        //for each item in the data provided, map will create a BuckSetListItem
                        //that has the respective title and subtitle
                        this.state.firebaseBuckSet.map(
                            (element) => {
                                return (
                                    <BuckSetListItem key={element.title + element.subtitle} data={element}/>
                                )
                            }
                        )
                    }
                </div>
                </Container>
            </Grid.Column>
        )
    }

}