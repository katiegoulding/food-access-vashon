import React from 'react';
import ViewBucks from './ViewBucks';

export default class CreateBucks extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            doveCount: 0,
            vyfsCount: 0,
            lacomunidadCount: 0,
            vashonhouseholdCount: 0
        };
    }

    collectBuckCount(event) {

    }

    render() {
        return (
            <div> 
                <form>
                    <label>
                        Name of Buck Set:
                        <input type="text" name="buck set name" />
                    </label>
                    <p>Organization Buck Counts</p>
                    <label>
                        Dove
                        <input type="text" name="DOVE buck number" placeholder="number of bucks"/>
                    </label>
                    <br />
                    <label>
                        VYFS
                        <input type="text" name="VYFS buck number" placeholder="number of bucks"/>
                    </label>
                    <br />
                    <label>
                        La Comunidad
                        <input type="text" name="La Comunidad buck number" placeholder="number of bucks"/>
                    </label>
                    <br />
                    <label>
                        Vashon Household
                        <input type="text" name="Vashon Household buck number" placeholder="number of bucks"/>
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }

}