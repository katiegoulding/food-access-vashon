import React from 'react';

export default class BuckSetListItem extends React.Component {
    
    render () {
        const {title, subtitle} = this.props.data

        return(
            <div>
                <p className="title">{title}</p>
                <p className="subtitle">{subtitle}</p>
                <button>View</button>
            </div>
        )
    }
}