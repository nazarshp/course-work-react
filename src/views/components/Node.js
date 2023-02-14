import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TweenMax } from 'gsap';

import './Styles/Node.css';

const SLOT_SIZE = 70;

class Node extends Component{

    static get SIZE() { return 50; }
    static get RED() { return '#f45a67'; } 
    static get BLACK() { return '#332425'; } 

    constructor(props) {
        super(props);
        this.color = Node.RED;
    }

    get idTextColor() { return ''; }

    get dataTextColor() { return ''; } 

    componentDidUpdate(prevProps, prevState) {
        const el = this.container;
        const halfSize = Node.SIZE/2;
        var prevLeft = this.props.prevX - halfSize;
        var prevTop = this.props.prevY - halfSize;
        var left = this.props.x - halfSize;
        var top = this.props.y - halfSize;
        TweenMax.fromTo(el, 0.3, 
            {x: prevLeft, y: prevTop},
            {x: left, y: top});
    }

    componentDidMount() {
        const el = this.container;
        const halfSize = Node.SIZE/2;
        var left = this.props.x - halfSize;
        var top = this.props.y - halfSize;
        TweenMax.fromTo(el, 0.3, 
            {x: left, y: top, width: 0, height:0},
            {x: left, y: top, width: Node.SIZE, height: Node.SIZE});

    }

    render() {

        var styles = {
            position: 'absolute',
            //left: left + 'px',
            //top: top + 'px',
            width: Node.SIZE,
            height: Node.SIZE,
            backgroundColor: this.props.color,
            zIndex: 99
        };

        if (this.props.look) {
            styles.border = '10px solid green';
        } else if (this.props.compare) {
            styles.border = '10px solid blue';
        } else if (this.props.error) {
            styles.border = '10px solid coral';
        }

        return (
            <div className='node'
            ref={c => this.container = c}
            style={styles}>
            <div className='nodeDataContainer'>
                <div className='nodeData'>{this.props.data}</div>
                <div className='nodeCount'>count: {this.props.count}</div>
            </div> 
            </div>
        )
    }
}

Node.propTypes = {
    id: PropTypes.string,
    level: PropTypes.number,
    index: PropTypes.number,
    treeDepth: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    prevX: PropTypes.number,
    prevY: PropTypes.number,
    look: PropTypes.bool,
    error: PropTypes.bool,
    compare: PropTypes.bool,
};

export default Node;
