import React from "react";
import {
    Image,
    Container,
    Header,
    Icon,
    Label,
    Menu,
    Segment,
    Responsive
  } from "semantic-ui-react";

export default class Faq extends React.Component {

    render() {
        return(
            <Container>
                <Segment
                className="graph_container"
                raised>
                <Header as="h1">How to use the dasboard</Header>
                    {(() => {
                        switch (this.props.role) {
                        case "admin":
                        return (
                            <div>

                            </div>
                        );
                        case "caseworker":
                        return (
                            <div>
                                
                            </div>
                        );
                        default:
                            return null;
                        }
                    })()}
                </Segment>
            </Container>
        )
    }
}