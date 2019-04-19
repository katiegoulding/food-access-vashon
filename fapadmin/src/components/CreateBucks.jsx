import React from 'react';
import ViewBucks from './ViewBucks';

export default class CreateBucks extends React.Component {

    constructor(props) {
        super(props)
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
                        <input type="text" name="DOVE buck number" />
                    </label>
                    <label>
                        VYFS
                        <input type="text" name="VYFS buck number" />
                    </label>
                    <label>
                        La Comunidad
                        <input type="text" name="La Comunidad buck number" />
                    </label>
                    <label>
                        Vashon Household
                        <input type="text" name="Vashon Household buck number" />
                    </label>

                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }

}