import React from 'react';
import './toolbar-button.styles.scss';

export default function ToolbarButton(props) {
    const { icon } = props;
    return (
      <i className={`toolbar-button ${icon} ${props.color}`} onClick={()=> props.func()} />
    );
}